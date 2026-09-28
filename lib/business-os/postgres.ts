import pg from "pg";
import { GuardError } from "./guards";
import type { NonceClaim, NonceClaimInput, NonceStore } from "./nonce";
import type { AnalyticsCatalog } from "./shape";
import {
  ExportConflict,
  SubscriptionRefused,
  type AnalyticsPage,
  type AnalyticsQuery,
  type ExportStore,
  type IntervalInput,
  type RevisionPage,
  type SnapshotRow,
} from "./store";

const globalStore = globalThis as typeof globalThis & { __smsBosPool?: pg.Pool };

function pool(): pg.Pool {
  const url = process.env.BOS_READER_DATABASE_URL;
  if (!url) throw new Error("reader database is not configured");
  if (!globalStore.__smsBosPool) {
    globalStore.__smsBosPool = new pg.Pool({ connectionString: url, max: 2, statement_timeout: 20_000 });
  }
  return globalStore.__smsBosPool;
}

async function call(sql: string, params: unknown[]): Promise<unknown> {
  try {
    const result = await pool().query(sql, params);
    return result.rows[0]?.bos ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("hash_conflict")) throw new ExportConflict();
    if (message.includes("subscription_mrr_refused")) throw new SubscriptionRefused();
    if (message.includes("invalid_interval")) throw new GuardError(422, "invalid_interval", false, "from must be before to.");
    if (message.includes("interval_too_large")) {
      throw new GuardError(422, "interval_too_large", false, "The interval exceeds 366 days.");
    }
    throw error;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("export payload was empty");
  return value as Record<string, unknown>;
}

export class PgNonceStore implements NonceStore {
  async claim(input: NonceClaimInput): Promise<NonceClaim> {
    const value = await call(
      "select public.bos_claim_export_nonce($1, $2, $3::timestamptz, $4, $5) as bos",
      [input.keyId, input.nonce, new Date(input.expiresAtMs).toISOString(), Math.ceil(input.windowMs / 1000), input.rateLimit],
    );
    if (value === "claimed" || value === "replayed" || value === "rate_limited") return value;
    throw new Error("nonce store returned an unknown result");
  }
}

export class PgExportStore implements ExportStore {
  async readResponse(route: string, snapshotId: string): Promise<Record<string, unknown> | null> {
    const value = await call("select public.bos_export_read_snapshot($1, $2) as bos", [snapshotId, route]);
    if (!value) return null;
    return asRecord(value);
  }

  async financeSummary(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_finance_summary($1::timestamptz, $2::timestamptz, $3, $4::timestamptz) as bos",
      [input.from, input.to, input.basis, input.asOf],
    ));
  }

  async overview(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_overview($1::timestamptz, $2::timestamptz, $3, $4::timestamptz) as bos",
      [input.from, input.to, input.basis, input.asOf],
    ));
  }

  async financeDaily(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_finance_daily($1::timestamptz, $2::timestamptz, $3, $4::timestamptz) as bos",
      [input.from, input.to, input.basis, input.asOf],
    ));
  }

  async balances(asOf: string): Promise<Record<string, unknown>> {
    return asRecord(await call("select public.bos_export_balances($1::timestamptz) as bos", [asOf]));
  }

  async reconciliation(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_reconciliation($1::timestamptz, $2::timestamptz, $3::timestamptz) as bos",
      [input.from, input.to, input.asOf],
    ));
  }

  async operations(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_operations($1::timestamptz, $2::timestamptz, $3::timestamptz) as bos",
      [input.from, input.to, input.asOf],
    ));
  }

  async subscriptions(input: IntervalInput): Promise<Record<string, unknown>> {
    return asRecord(await call(
      "select public.bos_export_subscriptions($1::timestamptz, $2::timestamptz, $3::timestamptz) as bos",
      [input.from, input.to, input.asOf],
    ));
  }

  async health(asOf: string): Promise<Record<string, unknown>> {
    return asRecord(await call("select public.bos_export_health($1::timestamptz) as bos", [asOf]));
  }

  async analyticsCatalog(): Promise<AnalyticsCatalog> {
    const value = asRecord(await call("select public.bos_analytics_catalog() as bos", []));
    const datasets = asRecord(value.datasets);
    return {
      datasets: {
        ga4_overview_daily: datasets.ga4_overview_daily === true,
        ga4_breakdown: datasets.ga4_breakdown === true,
        ga4_period_unique_users: datasets.ga4_period_unique_users === true,
        gsc_daily_totals: datasets.gsc_daily_totals === true,
        gsc_dimension_rows: datasets.gsc_dimension_rows === true,
        vercel_daily: datasets.vercel_daily === true,
      },
      configuredSources: Array.isArray(value.configured_sources)
        ? value.configured_sources.filter((item): item is string => typeof item === "string")
        : [],
    };
  }

  async analytics(input: AnalyticsQuery): Promise<AnalyticsPage> {
    const value = asRecord(await call(
      "select public.bos_export_analytics($1, $2, $3::timestamptz, $4::timestamptz, $5::int, $6::bigint, $7::timestamptz, $8) as bos",
      [input.provider, input.report, input.from, input.to, input.limit, input.after, input.asOf, input.snapshotId],
    ));
    if (value.ok === false && value.error === "snapshot_expired") {
      throw new GuardError(410, "snapshot_expired", false, "Snapshot expired. Drop the cursor and bootstrap a new snapshot.", {
        drop_cursor: true,
        endpoint: "/api/business-os/v1/analytics/report",
        reuse_original_from_to: true,
      });
    }
    if (value.ok !== true) throw new Error("analytics export was empty");
    const sequences = Array.isArray(value.sequences) ? value.sequences.map((item) => String(item)) : [];
    return {
      body: asRecord(value.body),
      sequences,
      highWatermark: String(value.high_watermark ?? "1"),
    };
  }

  async openSnapshot(asOf: string): Promise<SnapshotRow> {
    const row = asRecord(await call("select public.bos_export_open($1::timestamptz) as bos", [asOf]));
    return {
      snapshotId: String(row.snapshot_id),
      highWatermark: String(row.high_watermark),
      dataAsOf: String(row.data_as_of),
    };
  }

  async getSnapshot(snapshotId: string): Promise<SnapshotRow | null> {
    const value = await call("select public.bos_export_get_snapshot($1) as bos", [snapshotId]);
    if (!value) return null;
    const row = asRecord(value);
    return {
      snapshotId: String(row.snapshot_id),
      highWatermark: String(row.high_watermark),
      dataAsOf: String(row.data_as_of),
    };
  }

  async revisions(input: {
    snapshot: SnapshotRow;
    after: string;
    limit: number;
    from: string | null;
    to: string | null;
  }): Promise<RevisionPage> {
    const value = asRecord(await call(
      "select public.bos_export_records($1, $2::bigint, $3::int, $4::timestamptz, $5::timestamptz) as bos",
      [input.snapshot.snapshotId, input.after, input.limit, input.from, input.to],
    ));
    if (value.ok === false && value.error === "hash_conflict") return { conflict: true, rows: [] };
    if (value.ok === false) return { conflict: false, rows: [] };
    const records = Array.isArray(value.records) ? value.records as Array<Record<string, unknown>> : [];
    return { conflict: false, rows: records };
  }
}
