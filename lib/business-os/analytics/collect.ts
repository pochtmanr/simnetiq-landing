import type { GaReportPage, GaReportRequest, GscQueryPage, GscQueryRequest } from "./google";
import {
  addCalendarDays,
  gaReadiness,
  gscDataState,
  gscReadiness,
  mapGscRow,
  sourceDayBounds,
  sourceToday,
} from "./semantics";
import type { AnalyticsWriter } from "./writer";

export interface CollectEnv {
  gaPropertyId?: string;
  gaPropertyTimezone?: string;
  gaClientEmail?: string;
  gaPrivateKey?: string;
  gscProperty?: string;
  drainSecret?: string;
}

export interface CollectClients {
  ga?: (request: GaReportRequest) => Promise<GaReportPage>;
  gsc?: (request: GscQueryRequest) => Promise<GscQueryPage>;
}

const GA_METRICS = ["activeUsers", "newUsers", "sessions", "screenPageViews"];
const GA_BREAKDOWNS = ["pagePath", "sessionDefaultChannelGroup", "deviceCategory", "country"] as const;

function metricInt(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  return Number(value);
}

function gaDate(value: string): string | null {
  if (!/^\d{8}$/.test(value)) return null;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

async function pageGa(
  run: (request: GaReportRequest) => Promise<GaReportPage>,
  request: Omit<GaReportRequest, "limit" | "offset">,
): Promise<{ pages: GaReportPage[]; truncated: boolean }> {
  const pages: GaReportPage[] = [];
  let offset = 0;
  const limit = 10000;
  for (let page = 0; page < 20; page += 1) {
    const result = await run({ ...request, limit, offset });
    pages.push(result);
    offset += result.rows.length;
    if (result.rows.length < limit || offset >= result.rowCount) {
      return { pages, truncated: false };
    }
  }
  return { pages, truncated: true };
}

export async function collectAnalytics(input: {
  now: Date;
  env: CollectEnv;
  writer: AnalyticsWriter | null;
  clients: CollectClients;
}): Promise<Record<string, string>> {
  if (!input.writer) return { ga4: "writer_unconfigured", gsc: "writer_unconfigured", vercel: "writer_unconfigured" };
  const retrievedAt = input.now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const ga = await collectGa(input.now, input.env, input.writer, input.clients.ga, retrievedAt);
  const gsc = await collectGsc(input.now, input.env, input.writer, input.clients.gsc, retrievedAt);
  const vercel = await collectVercel(input.env, input.writer);
  return { ga4: ga, gsc, vercel };
}

async function collectGa(
  now: Date,
  env: CollectEnv,
  writer: AnalyticsWriter,
  run: CollectClients["ga"],
  retrievedAt: string,
): Promise<string> {
  const readiness = gaReadiness({
    propertyId: env.gaPropertyId,
    timezone: env.gaPropertyTimezone,
    clientEmail: env.gaClientEmail,
    privateKey: env.gaPrivateKey,
  });
  if (readiness === "unconfigured") {
    await writer.setSource({
      provider: "ga4", configured: false, syncStatus: "unconfigured",
      reason: "provider_not_configured", timezone: null, syncedAt: null, coveredThrough: null,
    });
    return "unconfigured";
  }
  if (readiness === "missing_timezone") {
    await writer.setSource({
      provider: "ga4", configured: true, syncStatus: "failed",
      reason: "property_timezone_unconfigured", timezone: null, syncedAt: null, coveredThrough: null,
    });
    return "property_timezone_unconfigured";
  }
  if (!run || !env.gaPropertyId || !env.gaPropertyTimezone) return "unconfigured";
  const timezone = env.gaPropertyTimezone;
  const today = sourceToday(now, timezone);
  const overlapStart = addCalendarDays(today, -7);
  const start = addCalendarDays(today, -8);
  const end = addCalendarDays(today, -1);
  let job = await writer.lease("ga4", retrievedAt, 600, "sms-analytics");
  if (!job) {
    await writer.enqueue("ga4", "ga4_overview_daily", overlapStart, today, 7);
    job = await writer.lease("ga4", retrievedAt, 600, "sms-analytics");
  }
  if (!job) return "lease_busy";
  try {
    const daily = await pageGa(run, {
      propertyId: env.gaPropertyId,
      dimensions: ["date"],
      metrics: GA_METRICS,
      startDate: start,
      endDate: end,
    });
    const limitations = [
      "Daily active users are not a period unique count.",
      ...(daily.pages.some((page) => page.sampled) ? ["GA4 returned sampling metadata."] : []),
      ...(daily.pages.some((page) => page.otherRow) ? ["GA4 grouped remaining rows as other."] : []),
      ...(daily.truncated ? ["GA4 pagination stopped before the report was exhausted."] : []),
    ];
    for (const page of daily.pages) {
      for (const row of page.rows) {
        const date = gaDate(row.dimensions[0] ?? "");
        const active = metricInt(row.metrics[0]);
        const fresh = metricInt(row.metrics[1]);
        const sessions = metricInt(row.metrics[2]);
        const views = metricInt(row.metrics[3]);
        if (!date || active === null || fresh === null || sessions === null || views === null) continue;
        const bounds = sourceDayBounds(date, timezone);
        await writer.commitRow({
          provider: "ga4",
          report: "ga4_overview_daily",
          sourceDate: date,
          periodFrom: null,
          periodTo: null,
          dimensionKey: "",
          payload: { date, active_users: active, new_users: fresh, sessions, screen_page_views: views },
          retrievedAt,
          dataState: page.sampled ? "sampled" : (date >= overlapStart ? "partial" : "final"),
          searchType: null,
          aggregationType: null,
          complete: !page.otherRow && !daily.truncated,
          sourceTimezone: timezone,
          dayStart: bounds.start,
          dayEnd: bounds.end,
          limitations,
        });
      }
    }
    const period = await run({
      propertyId: env.gaPropertyId,
      dimensions: [],
      metrics: ["activeUsers"],
      startDate: start,
      endDate: end,
      limit: 1,
      offset: 0,
    });
    const users = metricInt(period.rows[0]?.metrics[0]);
    if (users !== null) {
      const boundsStart = sourceDayBounds(start, timezone).start;
      const boundsEnd = sourceDayBounds(addCalendarDays(end, 1), timezone).start;
      await writer.commitRow({
        provider: "ga4",
        report: "ga4_period_unique_users",
        sourceDate: null,
        periodFrom: boundsStart,
        periodTo: boundsEnd,
        dimensionKey: "",
        payload: { active_users: users },
        retrievedAt,
        dataState: period.sampled ? "sampled" : "final",
        searchType: null,
        aggregationType: null,
        complete: true,
        sourceTimezone: timezone,
        dayStart: null,
        dayEnd: null,
        limitations: ["Period activeUsers come from one query. Do not sum daily or country rows."],
      });
    }
    for (const dimension of GA_BREAKDOWNS) {
      const report = await pageGa(run, {
        propertyId: env.gaPropertyId,
        dimensions: ["date", dimension],
        metrics: ["activeUsers", "sessions", "screenPageViews"],
        startDate: start,
        endDate: end,
      });
      for (const page of report.pages) {
        for (const row of page.rows) {
          const date = gaDate(row.dimensions[0] ?? "");
          const value = row.dimensions[1];
          const active = metricInt(row.metrics[0]);
          const sessions = metricInt(row.metrics[1]);
          const views = metricInt(row.metrics[2]);
          if (!date || !value || active === null || sessions === null || views === null) continue;
          const bounds = sourceDayBounds(date, timezone);
          await writer.commitRow({
            provider: "ga4",
            report: "ga4_breakdown",
            sourceDate: date,
            periodFrom: null,
            periodTo: null,
            dimensionKey: `${dimension}:${value}`,
            payload: { date, dimension, value, active_users: active, sessions, screen_page_views: views },
            retrievedAt,
            dataState: page.otherRow || report.truncated ? "partial" : "final",
            searchType: null,
            aggregationType: null,
            complete: false,
            sourceTimezone: timezone,
            dayStart: bounds.start,
            dayEnd: bounds.end,
            limitations: ["Breakdown rows are a compatible dimension slice, not a property total, and are not a coin-sale denominator."],
          });
        }
      }
    }
    await writer.complete(job.jobId, retrievedAt);
    await writer.setSource({
      provider: "ga4", configured: true, syncStatus: "ok", reason: null,
      timezone, syncedAt: retrievedAt, coveredThrough: sourceDayBounds(end, timezone).end,
    });
    return "ok";
  } catch (error) {
    const message = error instanceof Error ? error.message : "import_failed";
    await writer.fail(job.jobId, message, retrievedAt);
    await writer.setSource({
      provider: "ga4", configured: true, syncStatus: "failed", reason: "import_failed",
      timezone, syncedAt: null, coveredThrough: null,
    });
    return "import_failed";
  }
}

async function collectGsc(
  now: Date,
  env: CollectEnv,
  writer: AnalyticsWriter,
  query: CollectClients["gsc"],
  retrievedAt: string,
): Promise<string> {
  const readiness = gscReadiness({
    property: env.gscProperty,
    clientEmail: env.gaClientEmail,
    privateKey: env.gaPrivateKey,
  });
  if (readiness === "unconfigured") {
    await writer.setSource({
      provider: "gsc", configured: false, syncStatus: "unconfigured",
      reason: "provider_not_configured", timezone: "America/Los_Angeles", syncedAt: null, coveredThrough: null,
    });
    return "unconfigured";
  }
  if (!query || !env.gscProperty) return "unconfigured";
  const today = sourceToday(now, "America/Los_Angeles");
  const overlapStart = addCalendarDays(today, -14);
  const start = addCalendarDays(today, -15);
  const end = addCalendarDays(today, -1);
  let job = await writer.lease("gsc", retrievedAt, 600, "sms-analytics");
  if (!job) {
    await writer.enqueue("gsc", "gsc_daily_totals", overlapStart, today, 14);
    job = await writer.lease("gsc", retrievedAt, 600, "sms-analytics");
  }
  if (!job) return "lease_busy";
  try {
    await storeGsc(query, env.gscProperty, start, end, overlapStart, retrievedAt, writer, "gsc_daily_totals", ["date"], "byProperty");
    await storeGsc(query, env.gscProperty, start, end, overlapStart, retrievedAt, writer, "gsc_dimension_rows", ["query"], "auto");
    await storeGsc(query, env.gscProperty, start, end, overlapStart, retrievedAt, writer, "gsc_dimension_rows", ["page"], "auto");
    await writer.complete(job.jobId, retrievedAt);
    await writer.setSource({
      provider: "gsc", configured: true, syncStatus: "ok", reason: null,
      timezone: "America/Los_Angeles", syncedAt: retrievedAt,
      coveredThrough: sourceDayBounds(end, "America/Los_Angeles").end,
    });
    return "ok";
  } catch (error) {
    const message = error instanceof Error ? error.message : "import_failed";
    await writer.fail(job.jobId, message, retrievedAt);
    await writer.setSource({
      provider: "gsc", configured: true, syncStatus: "failed", reason: "import_failed",
      timezone: "America/Los_Angeles", syncedAt: null, coveredThrough: null,
    });
    return "import_failed";
  }
}

async function storeGsc(
  query: (request: GscQueryRequest) => Promise<GscQueryPage>,
  siteUrl: string,
  start: string,
  end: string,
  overlapStart: string,
  retrievedAt: string,
  writer: AnalyticsWriter,
  report: "gsc_daily_totals" | "gsc_dimension_rows",
  dimensions: string[],
  aggregationType: string,
): Promise<void> {
  let startRow = 0;
  const rowLimit = report === "gsc_daily_totals" ? 5000 : 1000;
  for (let page = 0; page < 10; page += 1) {
    const result = await query({
      siteUrl,
      startDate: start,
      endDate: end,
      dimensions,
      searchType: "web",
      aggregationType,
      rowLimit,
      startRow,
    });
    const truncated = result.rows.length === rowLimit;
    const rangeStart = sourceDayBounds(start, "America/Los_Angeles").start;
    const rangeEnd = sourceDayBounds(end, "America/Los_Angeles").end;
    for (const row of result.rows) {
      const key = row.keys[0] ?? "";
      const dated = dimensions[0] === "date";
      const date = dated ? key : end;
      const mapped = mapGscRow({
        date: dimensions[0] === "date" ? key : undefined,
        query: dimensions[0] === "query" ? key : undefined,
        page: dimensions[0] === "page" ? key : undefined,
        clicks: row.clicks,
        impressions: row.impressions,
        position: row.position,
        searchType: report === "gsc_daily_totals" ? "web" : undefined,
        aggregationType: report === "gsc_daily_totals" ? (result.responseAggregationType ?? "byProperty") : undefined,
      });
      if (!mapped) continue;
      const bounds = dated ? sourceDayBounds(date, "America/Los_Angeles") : { start: rangeStart, end: rangeEnd };
      const state = gscDataState({
        sourceDate: date,
        firstIncompleteDate: result.firstIncompleteDate,
        overlapStart,
      });
      await writer.commitRow({
        provider: "gsc",
        report,
        sourceDate: dated ? date : null,
        periodFrom: null,
        periodTo: null,
        dimensionKey: dated ? "" : `${dimensions[0]}:${key}`,
        payload: mapped,
        retrievedAt,
        dataState: state,
        searchType: "web",
        aggregationType: report === "gsc_daily_totals" ? (result.responseAggregationType ?? "byProperty") : (result.responseAggregationType ?? "auto"),
        complete: report === "gsc_daily_totals" && !truncated,
        sourceTimezone: "America/Los_Angeles",
        dayStart: bounds.start,
        dayEnd: bounds.end,
        limitations: report === "gsc_dimension_rows" || truncated
          ? ["Dimension rows overlap, omit data, and are not the property total. Dates stay in America/Los_Angeles."]
          : ["Search Console dates stay in America/Los_Angeles. CTR is clicks divided by impressions."],
      });
    }
    if (!truncated) return;
    startRow += result.rows.length;
  }
}

async function collectVercel(env: CollectEnv, writer: AnalyticsWriter): Promise<string> {
  if (!env.drainSecret) {
    await writer.setSource({
      provider: "vercel", configured: false, syncStatus: "unconfigured",
      reason: "provider_not_configured", timezone: "Europe/London", syncedAt: null, coveredThrough: null,
    });
    return "unconfigured";
  }
  return "armed";
}

export function collectEnvFromProcess(): CollectEnv {
  return {
    gaPropertyId: process.env.GA_PROPERTY_ID,
    gaPropertyTimezone: process.env.GA_PROPERTY_TIMEZONE,
    gaClientEmail: process.env.GA_SA_CLIENT_EMAIL,
    gaPrivateKey: process.env.GA_SA_PRIVATE_KEY,
    gscProperty: process.env.GSC_PROPERTY,
    drainSecret: process.env.VERCEL_WEB_ANALYTICS_DRAIN_SECRET,
  };
}
