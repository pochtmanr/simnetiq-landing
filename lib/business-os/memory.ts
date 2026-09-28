import { createHash, randomBytes } from "node:crypto";
import type { AnalyticsCatalog } from "./shape";
import type { AnalyticsPage, AnalyticsQuery, ExportStore, IntervalInput, RevisionPage, SnapshotRow } from "./store";
import {
  drill,
  EMPTY_ANALYTICS_CATALOG,
  financialMetric,
  nullMetrics,
  period,
  primaryVisitorHighlight,
  SCHEMA,
  CONTRACT,
  unsupportedAnalytics,
} from "./shape";

export interface MemRecord {
  document: Record<string, unknown>;
  changeSequence: string;
}

function id(prefix: string): string {
  return `${prefix}-${randomBytes(8).toString("hex")}`;
}

function hashOf(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function sampleRecord(input: {
  sequence: string;
  revision?: number;
  recordId?: string;
  recordType?: string;
  amount?: string | null;
  occurredAt?: string;
  contentHash?: string;
}): MemRecord {
  const revision = input.revision ?? 1;
  const recordId = input.recordId ?? "sms-sale-1";
  const occurredAt = input.occurredAt ?? "2026-09-27T10:00:00Z";
  const amount = input.amount === undefined ? "12.50" : input.amount;
  const contentHash = input.contentHash ?? hashOf(`${recordId}:${revision}:${input.sequence}:${amount}`);
  return {
    changeSequence: input.sequence,
    document: {
      record_id: recordId,
      revision,
      change_sequence: input.sequence,
      record_type: input.recordType ?? "sale",
      project_id: "smscode",
      source_system: "sms_ledger",
      source_account_id: "acct-smscode-1",
      environment: "production",
      external_object_id: "evt-sms-1",
      economic_transaction_id: "eco-sms-1",
      occurred_at: occurredAt,
      updated_at: "2026-09-27T10:05:00Z",
      status: "posted",
      original_amount:
        amount === null
          ? { amount: null, currency: "USD", quality: "unavailable", reason: "raw_gross_unknown" }
          : { amount, currency: "USD", quality: "actual" },
      quality: amount === null ? "unavailable" : "actual",
      formula_version: "sms-legacy-usd-v1",
      content_hash: contentHash,
      economic_direction: "inflow",
      counts_as_new_revenue: input.recordType === "sale" || input.recordType === undefined,
      source_as_of: "2026-09-27T10:05:00Z",
      retrieved_at: "2026-09-27T11:00:00Z",
      source_gbp_valuation: {
        amount: null,
        currency: "GBP",
        quality: "unavailable",
        reason: "fx_policy_not_configured",
        rate: null,
        rate_source: null,
        effective_at: null,
        policy_version: "gbp-unconfigured",
        source_amount: amount,
        source_currency: "USD",
      },
      tax_inclusion: "unknown",
    },
  };
}

function seqCmp(left: string, right: string): number {
  const a = BigInt(left);
  const b = BigInt(right);
  return a < b ? -1 : a > b ? 1 : 0;
}

interface FrozenSnapshot extends SnapshotRow {
  frozen: MemRecord[];
}

export interface MemAnalyticsReport {
  rows: Array<Record<string, unknown>>;
  dataState: "final" | "partial" | "sampled" | "unsupported" | "unavailable";
  availability: "available" | "unsupported" | "unavailable";
  reason?: string;
  sourceTimezone: string;
  completePropertyTotal: boolean;
  limitations: string[];
}

export class MemoryExportStore implements ExportStore {
  records: MemRecord[] = [sampleRecord({ sequence: "1" })];
  conflict = false;
  catalog: AnalyticsCatalog = {
    datasets: { ...EMPTY_ANALYTICS_CATALOG.datasets },
    configuredSources: [],
  };
  reports = new Map<string, MemAnalyticsReport>();
  private readonly snapshots = new Map<string, FrozenSnapshot>();
  private readonly responses = new Map<string, Record<string, unknown>>();

  async analyticsCatalog(): Promise<AnalyticsCatalog> {
    return this.catalog;
  }

  async analytics(input: AnalyticsQuery): Promise<AnalyticsPage> {
    const seeded = this.reports.get(`${input.provider}\0${input.report}`);
    const snapshotId = input.snapshotId ?? id("snap-analytics");
    if (!seeded || seeded.availability !== "available") {
      const body = unsupportedAnalytics({
        environment: "production",
        snapshotId,
        generatedAt: input.asOf,
        provider: input.provider,
        report: input.report,
        from: input.from,
        to: input.to,
        limit: input.limit,
        timezone: seeded?.sourceTimezone ?? (input.provider === "gsc" ? "America/Los_Angeles" : "Europe/London"),
      });
      if (seeded?.availability === "unavailable" && seeded.reason) {
        body.availability = "unavailable";
        body.data_state = "unavailable";
        body.reason = seeded.reason;
        body.limitations = seeded.limitations;
      }
      return { body, sequences: [], highWatermark: "1" };
    }
    const after = BigInt(input.after || "0");
    const indexed = seeded.rows.map((row, index) => ({ row, seq: BigInt(index + 1) }));
    const visible = indexed.filter((item) => item.seq > after);
    const page = visible.slice(0, input.limit);
    const hasMore = visible.length > input.limit;
    const body: Record<string, unknown> = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      provider: input.provider,
      report: input.report,
      availability: "available",
      data_state: seeded.dataState,
      source_timezone: seeded.sourceTimezone,
      property_ref: "redacted",
      coverage: { status: seeded.dataState === "final" ? "complete" : "partial", missing: [] },
      posting: false,
      rows: page.map((item) => item.row),
      page: {
        limit: input.limit,
        has_more: hasMore,
        next_cursor: null,
        complete_property_total: seeded.completePropertyTotal,
      },
      limitations: seeded.limitations,
      period: { from: input.from, to: input.to, timezone: seeded.sourceTimezone },
    };
    if (input.report === "ga4_period_unique_users") body.must_not_sum_daily_uniques = true;
    return {
      body,
      sequences: page.map((item) => item.seq.toString()),
      highWatermark: indexed.length > 0 ? indexed[indexed.length - 1].seq.toString() : "1",
    };
  }

  async readResponse(route: string, snapshotId: string): Promise<Record<string, unknown> | null> {
    return this.responses.get(`${route}\0${snapshotId}`) ?? null;
  }

  async financeSummary(input: IntervalInput): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-sum");
    const through = drill({
      snapshotId,
      from: input.from,
      to: input.asOf < input.to ? input.asOf : input.to,
      basis: "sms_legacy",
      recordTypes: ["sale"],
    });
    const native = nullMetrics("USD", "missing_amount", through);
    native.gross_customer_sales = financialMetric({
      amount: "12.50",
      currency: "USD",
      quality: "legacy_derived",
      coverage: "partial",
      reason: "legacy_gross",
      drill: through,
    });
    native.refunded_principal = financialMetric({
      amount: "0",
      currency: "USD",
      quality: "actual",
      coverage: "complete",
      drill: { ...through, filter: { ...(through.filter as object), record_types: ["refund"] } },
    });
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      period: period(input.from, input.asOf < input.to ? input.asOf : input.to),
      reporting_currency: "GBP",
      basis: input.basis,
      formula_version: input.basis === "sms_legacy" ? "sms-legacy-usd-v1" : "sms-comparable-usd-v1",
      fx_policy_version: "gbp-unconfigured",
      coverage: { status: "partial", missing: ["sales_tax", "net_sales", "fx"] },
      posting: false,
      metrics: nullMetrics("GBP", "fx_policy_not_configured", through),
      native_currency_subtotals: [{ currency: "USD", metrics: native }],
      warnings: ["Synthetic memory summary. cash_net is not net proceeds."],
    };
    this.responses.set(`finance.summary\0${snapshotId}`, body);
    return body;
  }

  async overview(input: IntervalInput): Promise<Record<string, unknown>> {
    const summary = await this.financeSummary(input);
    const body = {
      schema_version: summary.schema_version,
      contract_version: summary.contract_version,
      project_id: "smscode",
      environment: "production",
      snapshot_id: summary.snapshot_id,
      generated_at: summary.generated_at,
      data_as_of: summary.data_as_of,
      period: summary.period,
      reporting_currency: "GBP",
      basis: summary.basis,
      formula_version: summary.formula_version,
      fx_policy_version: summary.fx_policy_version,
      coverage: summary.coverage,
      posting: false,
      metrics: summary.metrics,
      subscriber_counts: {
        active_contracts: { value: null, reason: "coin_packs_are_not_subscriptions" },
        active_customers: { value: null, reason: "coin_packs_are_not_subscriptions" },
        paid_access_accounts: { value: null, reason: "coin_packs_are_not_subscriptions" },
      },
      traffic_highlights: [primaryVisitorHighlight()],
      warnings: [
        ...(Array.isArray(summary.warnings) ? summary.warnings : []),
        "Acquisition history without a recorded link is unknown. Website visitors are not a coin-sale denominator.",
      ],
    };
    this.responses.set(`overview\0${String(summary.snapshot_id)}`, body);
    return body;
  }

  async financeDaily(input: IntervalInput): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-day");
    const through = drill({
      snapshotId,
      from: input.from,
      to: input.to,
      basis: input.basis as "sms_legacy",
      recordTypes: ["sale"],
    });
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      period: period(input.from, input.to),
      reporting_currency: "GBP",
      basis: input.basis,
      formula_version: "sms-legacy-usd-v1",
      coverage: { status: "partial", missing: ["fx"] },
      posting: false,
      balances_included: false,
      buckets: [
        {
          date: "2026-09-27",
          timezone: "Europe/London",
          partial: true,
          bounds: { from: input.from, to: input.to },
          covered_from: input.from,
          covered_to: input.to,
          metrics: {
            gross_customer_sales: financialMetric({
              amount: "12.50",
              currency: "USD",
              quality: "legacy_derived",
              coverage: "partial",
              reason: "legacy_gross",
              drill: through,
            }),
            net_proceeds: financialMetric({
              amount: null,
              currency: "USD",
              quality: "unavailable",
              coverage: "missing",
              reason: "legacy_proceeds_not_bank_cash",
              drill: through,
            }),
          },
        },
      ],
      warnings: ["Daily metrics are native USD. GBP is unconfigured."],
    };
    this.responses.set(`finance.daily\0${snapshotId}`, body);
    return body;
  }

  async balances(asOf: string): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-bal");
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: asOf,
      data_as_of: asOf,
      as_of_requested: asOf,
      posting: false,
      balances_are_not_additive: true,
      snapshots: [
        {
          financial_account_id: "acct-smscode-onlinesim",
          account_kind: "prepaid",
          as_of: asOf,
          amount: { amount: "10", currency: "USD", quality: "actual" },
          additive: false,
        },
      ],
      warnings: ["bank_cash_unavailable"],
    };
    this.responses.set(`finance.balances\0${snapshotId}`, body);
    return body;
  }

  async reconciliation(input: IntervalInput): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-rec");
    const money = { amount: "12.50", currency: "USD", quality: "legacy_derived", reason: "legacy_gross" };
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      period: period(input.from, input.to),
      posting: false,
      runs: [
        {
          run_id: "run-smscode-legacy-admin",
          compared: ["source_admin", "legacy_sql"],
          status: "match",
          residuals: [
            {
              code: "missing_fx",
              amount: { amount: null, currency: "USD", quality: "unavailable", reason: "fx_policy_not_configured" },
              quality: "unavailable",
            },
          ],
          legacy_comparison: {
            formula_version: "sms-legacy-usd-v1",
            currency: "USD",
            cutoff: input.asOf,
            cash_net_is_bank_cash: false,
            fields: {
              gross: money,
              apple_fee: { amount: "0", currency: "USD", quality: "actual" },
              refunds: { amount: "0", currency: "USD", quality: "actual" },
              cash_net: { amount: "12.50", currency: "USD", quality: "legacy_derived", reason: "legacy_proceeds_not_bank_cash" },
            },
          },
        },
      ],
      warnings: ["cash_net is legacy proceeds, not verified bank cash."],
    };
    this.responses.set(`finance.reconciliation\0${snapshotId}`, body);
    return body;
  }

  async operations(input: IntervalInput): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-ops");
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      period: period(input.from, input.to),
      posting: false,
      buckets: [
        {
          date: "2026-09-27",
          timezone: "Europe/London",
          partial: true,
          flows: [
            { name: "coins_bought", count: 1, additive: true },
            { name: "coins_spent", count: 0, additive: true },
            { name: "coins_refunded", count: 0, additive: true },
            { name: "sms_delivered", count: 0, additive: true },
            { name: "sms_attempted", count: 0, additive: true },
          ],
          stocks: [{ name: "coins_outstanding", count: 1, additive: false, as_of: input.asOf }],
        },
      ],
      warnings: ["Outstanding coins are a stock. Do not sum them across days."],
    };
    this.responses.set(`operations.daily\0${snapshotId}`, body);
    return body;
  }

  async subscriptions(input: IntervalInput): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-sub");
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: input.asOf,
      data_as_of: input.asOf,
      period: period(input.from, input.to),
      as_of: input.asOf,
      supported: false,
      reason: "coin_packs_are_not_subscriptions",
      posting: false,
      metrics: null,
      warnings: ["SMS Code coin packs are not subscriptions. MRR is unsupported, not zero."],
    };
    this.responses.set(`subscriptions.summary\0${snapshotId}`, body);
    return body;
  }

  async health(asOf: string): Promise<Record<string, unknown>> {
    const snapshotId = id("snap-health");
    const unknown = {
      last_successful_sync_at: null,
      covered_through: null,
      lag_seconds: null,
    };
    const body = {
      schema_version: SCHEMA,
      contract_version: CONTRACT,
      project_id: "smscode",
      environment: "production",
      snapshot_id: snapshotId,
      generated_at: asOf,
      data_as_of: asOf,
      status: "degraded",
      sources: [
        { source: "revenuecat", status: "unknown", ...unknown, reason: "no_observed_events" },
        { source: "onlinesim", status: "unknown", ...unknown, reason: "snapshot_gap" },
        { source: "ga4", status: "unknown", ...unknown, reason: "provider_not_configured" },
        { source: "gsc", status: "unknown", ...unknown, reason: "provider_not_configured" },
        { source: "vercel", status: "unknown", ...unknown, reason: "provider_not_configured" },
        { source: "bank", status: "unknown", ...unknown, reason: "missing_statement_evidence" },
      ],
    };
    this.responses.set(`health\0${snapshotId}`, body);
    return body;
  }

  async openSnapshot(asOf: string): Promise<SnapshotRow> {
    const highest = this.records.reduce((max, row) => (seqCmp(row.changeSequence, max) > 0 ? row.changeSequence : max), "0");
    const highWatermark = highest === "0" ? "1" : highest;
    const frozen = this.records.filter((row) => seqCmp(row.changeSequence, highWatermark) <= 0);
    const snapshot: FrozenSnapshot = { snapshotId: id("snap-recpage"), highWatermark, dataAsOf: asOf, frozen };
    this.snapshots.set(snapshot.snapshotId, snapshot);
    return snapshot;
  }

  async getSnapshot(snapshotId: string): Promise<SnapshotRow | null> {
    return this.snapshots.get(snapshotId) ?? null;
  }

  async revisions(input: {
    snapshot: SnapshotRow;
    after: string;
    limit: number;
    from: string | null;
    to: string | null;
  }): Promise<RevisionPage> {
    const frozen = this.snapshots.get(input.snapshot.snapshotId);
    if (!frozen) return { conflict: false, rows: [] };
    if (this.conflict || hasConflict(frozen.frozen)) return { conflict: true, rows: [] };
    const rows = frozen.frozen
      .filter((row) => seqCmp(row.changeSequence, input.after) > 0)
      .filter((row) => seqCmp(row.changeSequence, frozen.highWatermark) <= 0)
      .filter((row) => {
        const occurred = String(row.document.occurred_at);
        if (input.from && occurred < input.from) return false;
        if (input.to && occurred >= input.to) return false;
        return true;
      })
      .sort((left, right) => seqCmp(left.changeSequence, right.changeSequence))
      .slice(0, input.limit + 1)
      .map((row) => row.document);
    return { conflict: false, rows };
  }
}

function hasConflict(rows: MemRecord[]): boolean {
  const seen = new Map<string, string>();
  for (const row of rows) {
    const key = `${row.document.record_id}:${row.document.revision}`;
    const hash = String(row.document.content_hash);
    const previous = seen.get(key);
    if (previous && previous !== hash) return true;
    seen.set(key, hash);
  }
  return false;
}
