import pg from "pg";

const globalStore = globalThis as typeof globalThis & { __smsAnalyticsPool?: pg.Pool };

export interface SourceUpdate {
  provider: "ga4" | "gsc" | "vercel";
  configured: boolean;
  syncStatus: "unconfigured" | "ok" | "failed";
  reason: string | null;
  timezone: string | null;
  syncedAt: string | null;
  coveredThrough: string | null;
}

export interface AnalyticsJob {
  jobId: string;
  provider: string;
  report: string;
  windowFrom: string;
  windowTo: string;
  attempts: number;
  overlapDays: number;
}

export interface CommitRowInput {
  provider: string;
  report: string;
  sourceDate: string | null;
  periodFrom: string | null;
  periodTo: string | null;
  dimensionKey: string;
  payload: Record<string, unknown>;
  retrievedAt: string;
  dataState: "final" | "partial" | "sampled";
  searchType: string | null;
  aggregationType: string | null;
  complete: boolean;
  sourceTimezone: string;
  dayStart: string | null;
  dayEnd: string | null;
  limitations: string[];
}

export interface DrainWrite {
  receivedAt: string;
  path: string | null;
  eventTimestamp: string | null;
  eventType: string | null;
  sampled: boolean;
  retryAttempt: number | null;
  deliveryId: string | null;
  visitorId: string | null;
  payloadHash: string;
  metadata: Record<string, unknown>;
}

export interface AnalyticsWriter {
  setSource(input: SourceUpdate): Promise<void>;
  enqueue(provider: string, report: string, windowFrom: string, windowTo: string, overlapDays: number): Promise<string>;
  lease(provider: string, now: string, seconds: number, owner: string): Promise<AnalyticsJob | null>;
  complete(jobId: string, now: string): Promise<void>;
  fail(jobId: string, error: string, now: string): Promise<void>;
  commitRow(input: CommitRowInput): Promise<number>;
  recordDrain(input: DrainWrite): Promise<number>;
  rollupVercel(day: string, timezone: string, retrievedAt: string): Promise<number>;
}

function pool(): pg.Pool {
  const url = process.env.BOS_ANALYTICS_DATABASE_URL;
  if (!url) throw new Error("analytics writer database is not configured");
  if (!globalStore.__smsAnalyticsPool) {
    globalStore.__smsAnalyticsPool = new pg.Pool({ connectionString: url, max: 2, statement_timeout: 20_000 });
  }
  return globalStore.__smsAnalyticsPool;
}

async function call(sql: string, params: unknown[]): Promise<unknown> {
  const result = await pool().query(sql, params);
  return result.rows[0]?.bos ?? null;
}

export class PgAnalyticsWriter implements AnalyticsWriter {
  async setSource(input: SourceUpdate): Promise<void> {
    await call(
      "select public.bos_analytics_set_source($1, $2, $3, $4, $5, $6::timestamptz, $7::timestamptz) as bos",
      [input.provider, input.configured, input.syncStatus, input.reason, input.timezone, input.syncedAt, input.coveredThrough],
    );
  }

  async enqueue(provider: string, report: string, windowFrom: string, windowTo: string, overlapDays: number): Promise<string> {
    const value = await call(
      "select public.bos_analytics_enqueue($1, $2, $3::date, $4::date, $5) as bos",
      [provider, report, windowFrom, windowTo, overlapDays],
    );
    return String(value);
  }

  async lease(provider: string, now: string, seconds: number, owner: string): Promise<AnalyticsJob | null> {
    const value = await call(
      "select public.bos_analytics_lease($1, $2::timestamptz, $3, $4) as bos",
      [provider, now, seconds, owner],
    );
    if (!value || typeof value !== "object") return null;
    const row = value as Record<string, unknown>;
    return {
      jobId: String(row.job_id),
      provider: String(row.provider),
      report: String(row.report),
      windowFrom: String(row.window_from).slice(0, 10),
      windowTo: String(row.window_to).slice(0, 10),
      attempts: Number(row.attempts),
      overlapDays: Number(row.overlap_days),
    };
  }

  async complete(jobId: string, now: string): Promise<void> {
    await call("select public.bos_analytics_complete_job($1::uuid, $2::timestamptz) as bos", [jobId, now]);
  }

  async fail(jobId: string, error: string, now: string): Promise<void> {
    await call("select public.bos_analytics_fail_job($1::uuid, $2, $3::timestamptz) as bos", [jobId, error, now]);
  }

  async commitRow(input: CommitRowInput): Promise<number> {
    const value = await call(
      `select public.bos_analytics_commit_row(
         $1, $2, $3::date, $4::timestamptz, $5::timestamptz, $6, $7::jsonb, $8::timestamptz,
         $9, $10, $11, $12, $13, $14::timestamptz, $15::timestamptz, $16::jsonb) as bos`,
      [
        input.provider, input.report, input.sourceDate, input.periodFrom, input.periodTo, input.dimensionKey,
        JSON.stringify(input.payload), input.retrievedAt, input.dataState, input.searchType, input.aggregationType,
        input.complete, input.sourceTimezone, input.dayStart, input.dayEnd, JSON.stringify(input.limitations),
      ],
    );
    return Number(value);
  }

  async recordDrain(input: DrainWrite): Promise<number> {
    const value = await call(
      `select public.bos_analytics_record_drain(
         $1::timestamptz, $2, $3::timestamptz, $4, $5, $6, $7, $8, $9, $10::jsonb) as bos`,
      [
        input.receivedAt, input.path, input.eventTimestamp, input.eventType, input.sampled,
        input.retryAttempt, input.deliveryId, input.visitorId, input.payloadHash, JSON.stringify(input.metadata),
      ],
    );
    return Number(value);
  }

  async rollupVercel(day: string, timezone: string, retrievedAt: string): Promise<number> {
    const value = await call(
      "select public.bos_analytics_rollup_vercel($1::date, $2, $3::timestamptz) as bos",
      [day, timezone, retrievedAt],
    );
    return Number(value);
  }
}

export function analyticsWriterFromEnv(): AnalyticsWriter | null {
  if (!process.env.BOS_ANALYTICS_DATABASE_URL) return null;
  return new PgAnalyticsWriter();
}
