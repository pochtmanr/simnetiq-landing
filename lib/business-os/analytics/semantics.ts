/** Source-day and metric rules for SMS analytics. Money formulas are not involved. */

export function clicksImpressionsCtr(clicks: number, impressions: number): string | null {
  if (!Number.isInteger(clicks) || !Number.isInteger(impressions) || clicks < 0 || impressions < 0) return null;
  if (impressions === 0) return clicks === 0 ? "0" : null;
  const scale = BigInt(6);
  const factor = BigInt(10) ** scale;
  const numerator = BigInt(clicks) * factor;
  const denominator = BigInt(impressions);
  let scaled = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder * BigInt(2) >= denominator) scaled += BigInt(1);
  const text = scaled.toString().padStart(Number(scale) + 1, "0");
  const whole = text.slice(0, -Number(scale)).replace(/^0+(?=\d)/, "");
  const fraction = text.slice(-Number(scale)).replace(/0+$/, "");
  return fraction.length === 0 ? whole : `${whole}.${fraction}`;
}

export function providerDecimal(value: number): string | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const text = value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  return /^(0|[1-9][0-9]*)(\.[0-9]{1,18})?$/.test(text) ? text : null;
}

export function periodUniqueActiveUsers(periodQuery: number | null): number | null {
  if (periodQuery === null || !Number.isInteger(periodQuery) || periodQuery < 0) return null;
  return periodQuery;
}

export function gscDataState(input: {
  sourceDate: string;
  firstIncompleteDate: string | null;
  overlapStart: string;
}): "partial" | "final" {
  if (input.firstIncompleteDate) {
    return input.sourceDate >= input.firstIncompleteDate ? "partial" : "final";
  }
  return input.sourceDate >= input.overlapStart ? "partial" : "final";
}

export function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function sourceToday(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts;
}

function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const value: Record<string, string> = {};
  for (const part of parts) value[part.type] = part.value;
  const asUtc = Date.UTC(
    Number(value.year),
    Number(value.month) - 1,
    Number(value.day),
    Number(value.hour) % 24,
    Number(value.minute),
    Number(value.second),
  );
  return asUtc - instant.getTime();
}

export function sourceDayBounds(date: string, timeZone: string): { start: string; end: string } {
  const start = zonedMidnightUtc(date, timeZone);
  const end = zonedMidnightUtc(addCalendarDays(date, 1), timeZone);
  return { start: stamp(start), end: stamp(end) };
}

function zonedMidnightUtc(date: string, timeZone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day, 0, 0, 0);
  let instant = utcMidnight - zoneOffsetMs(new Date(utcMidnight), timeZone);
  instant = utcMidnight - zoneOffsetMs(new Date(instant), timeZone);
  return new Date(instant);
}

function stamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export interface GscMetricRow {
  date?: string;
  query?: string;
  page?: string;
  clicks: number;
  impressions: number;
  position: number;
  searchType?: string;
  aggregationType?: string;
}

export function mapGscRow(input: GscMetricRow): Record<string, unknown> | null {
  const ctr = clicksImpressionsCtr(input.clicks, input.impressions);
  const position = providerDecimal(input.position);
  if (ctr === null || position === null) return null;
  const row: Record<string, unknown> = {
    clicks: input.clicks,
    impressions: input.impressions,
    ctr,
    position,
  };
  if (input.date) row.date = input.date;
  if (input.query) row.query = input.query;
  if (input.page) row.page = input.page;
  if (input.searchType) row.search_type = input.searchType;
  if (input.aggregationType) row.aggregation_type = input.aggregationType;
  return row;
}

export interface DrainEvent {
  schema?: string;
  eventType?: string;
  timestamp?: number;
  path?: string;
  country?: string;
  deviceType?: string;
  deviceId?: number;
  visitorId?: string;
  sampled?: boolean;
  samplingRate?: number;
}

export interface StoredDrainEvent {
  path: string | null;
  eventTimestamp: string | null;
  eventType: string | null;
  sampled: boolean;
  visitorId: string | null;
  metadata: Record<string, unknown>;
}

export function storeDrainEvents(events: DrainEvent[]): StoredDrainEvent[] {
  return events.map((event) => {
    const sampled = event.sampled === true || (typeof event.samplingRate === "number" && event.samplingRate < 1);
    const visitorId =
      !sampled && typeof event.visitorId === "string" && event.visitorId.length > 0 ? event.visitorId : null;
    return {
      path: typeof event.path === "string" ? event.path : null,
      eventTimestamp: typeof event.timestamp === "number" ? stamp(new Date(event.timestamp)) : null,
      eventType: typeof event.eventType === "string" ? event.eventType : null,
      sampled,
      visitorId,
      metadata: {
        schema: event.schema ?? null,
        country: event.country ?? null,
        deviceType: event.deviceType ?? null,
      },
    };
  });
}

export function distinctVisitors(events: StoredDrainEvent[]): number | null {
  if (events.length === 0 || events.some((event) => event.sampled || !event.visitorId)) return null;
  return new Set(events.map((event) => event.visitorId)).size;
}

export function gaReadiness(env: {
  propertyId?: string;
  timezone?: string;
  clientEmail?: string;
  privateKey?: string;
}): "unconfigured" | "missing_timezone" | "ready" {
  if (!env.propertyId || !env.clientEmail || !env.privateKey) return "unconfigured";
  if (!env.timezone) return "missing_timezone";
  return "ready";
}

export function gscReadiness(env: { property?: string; clientEmail?: string; privateKey?: string }): "unconfigured" | "ready" {
  if (!env.property || !env.clientEmail || !env.privateKey) return "unconfigured";
  return "ready";
}
