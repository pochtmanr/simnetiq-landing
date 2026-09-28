export const MAX_RANGE_DAYS = 366;
export const MAX_PAGE_SIZE = 500;
export const REPORTING_TIMEZONE = "Europe/London";
const DAY_MS = 86_400_000;
const INSTANT = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/;

export const SUPPORTED_BASES = ["sms_legacy", "purchase", "earned_management", "settled_cash"] as const;
export type SupportedBasis = (typeof SUPPORTED_BASES)[number];

export interface Resync {
  drop_cursor: true;
  endpoint: "/api/business-os/v1/finance/records" | "/api/business-os/v1/analytics/report";
  reuse_original_from_to: boolean;
}

export class GuardError extends Error {
  constructor(
    readonly status: 400 | 403 | 410 | 422,
    readonly code: string,
    readonly retryable: boolean,
    message: string,
    readonly resync?: Resync,
  ) {
    super(message);
  }
}

export interface IntervalQuery {
  from: string;
  to: string;
  timezone: typeof REPORTING_TIMEZONE;
  basis: SupportedBasis;
  asOf: string;
}

export function utcStamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function readInstant(value: string | null, name: string, required: boolean): string | null {
  if (!value) {
    if (required) throw new GuardError(400, "missing_required_parameter", false, `Missing ${name}.`);
    return null;
  }
  if (!INSTANT.test(value) || Number.isNaN(Date.parse(value))) {
    throw new GuardError(400, "malformed_parameter", false, `${name} must be a UTC instant.`);
  }
  return value;
}

export function assertRange(from: string, to: string): void {
  if (from >= to) throw new GuardError(422, "invalid_interval", false, "from must be before to.");
  if (Date.parse(to) - Date.parse(from) > MAX_RANGE_DAYS * DAY_MS) {
    throw new GuardError(422, "interval_too_large", false, "The interval exceeds 366 days.");
  }
}

export function readBasis(value: string | null, required: boolean): SupportedBasis | null {
  if (!value) {
    if (required) throw new GuardError(400, "missing_required_parameter", false, "Missing basis.");
    return null;
  }
  if ((SUPPORTED_BASES as readonly string[]).includes(value)) return value as SupportedBasis;
  throw new GuardError(400, "malformed_parameter", false, "basis is not a known value.");
}

export function readTimezone(value: string | null): typeof REPORTING_TIMEZONE {
  if (!value || value === REPORTING_TIMEZONE) return REPORTING_TIMEZONE;
  throw new GuardError(422, "unknown_timezone", false, "Only Europe/London is available.");
}

export function rejectUnappliedFilters(params: URLSearchParams): void {
  if (params.get("source")) {
    throw new GuardError(400, "malformed_parameter", false, "source is not a supported filter.");
  }
  if (params.get("channel")) {
    throw new GuardError(400, "malformed_parameter", false, "channel is not a supported filter.");
  }
  const currency = params.get("currency");
  if (currency && currency !== "GBP") {
    throw new GuardError(400, "malformed_parameter", false, "reporting currency must be GBP.");
  }
}

export function readPageLimit(value: string | null): number {
  if (!value) return 100;
  if (!/^[1-9][0-9]*$/.test(value)) {
    throw new GuardError(400, "malformed_parameter", false, "limit must be a positive integer.");
  }
  const limit = Number(value);
  if (limit > MAX_PAGE_SIZE) throw new GuardError(422, "page_limit_too_large", false, "limit exceeds 500.");
  return limit;
}

export function readInterval(params: URLSearchParams, now: Date, basisRequired: boolean): IntervalQuery {
  const from = readInstant(params.get("from"), "from", true);
  const to = readInstant(params.get("to"), "to", true);
  if (!from || !to) throw new GuardError(400, "missing_required_parameter", false, "Missing from or to.");
  assertRange(from, to);
  rejectUnappliedFilters(params);
  readTimezone(params.get("timezone"));
  const basis = readBasis(params.get("basis"), basisRequired) ?? "sms_legacy";
  const nowStamp = utcStamp(now);
  return {
    from,
    to,
    timezone: REPORTING_TIMEZONE,
    basis,
    asOf: to < nowStamp ? to : nowStamp,
  };
}

export function assertEmptyGetBody(body: Uint8Array): void {
  if (body.byteLength > 0) throw new GuardError(400, "unexpected_body", false, "GET requests must have an empty body.");
}
