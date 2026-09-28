import type { BosEnvironment } from "./keys";
import type { SupportedBasis } from "./guards";

export const CONTRACT = "business-os.contract.v1";
export const SCHEMA = "1.0.0";
export const ANALYTICS_FORMULA = "sms-analytics-v1";
export const PRIMARY_VISITOR_DEFINITION =
  "No configured primary visitor series. Public pages load Vercel Web Analytics, which is not this export. GA4 is absent from the site source. Coin sales are not a visitor denominator.";

export interface AnalyticsCatalog {
  datasets: {
    ga4_overview_daily: boolean;
    ga4_breakdown: boolean;
    ga4_period_unique_users: boolean;
    gsc_daily_totals: boolean;
    gsc_dimension_rows: boolean;
    vercel_daily: boolean;
  };
  configuredSources: string[];
}

export const EMPTY_ANALYTICS_CATALOG: AnalyticsCatalog = {
  datasets: {
    ga4_overview_daily: false,
    ga4_breakdown: false,
    ga4_period_unique_users: false,
    gsc_daily_totals: false,
    gsc_dimension_rows: false,
    vercel_daily: false,
  },
  configuredSources: [],
};

const METRICS = [
  "gross_customer_sales",
  "refunded_principal",
  "sales_tax",
  "store_and_processor_fees",
  "net_sales",
  "net_proceeds",
  "direct_costs",
  "contribution_profit",
  "operating_expenses",
  "operating_profit",
  "net_profit",
] as const;

export interface DrillInput {
  snapshotId: string;
  from: string;
  to: string;
  basis: SupportedBasis;
  recordTypes: string[];
}

export function drill(input: DrillInput): Record<string, unknown> {
  return {
    dataset: "finance.records",
    snapshot_id: input.snapshotId,
    filter: {
      project_id: "smscode",
      from: input.from,
      to: input.to,
      basis: input.basis,
      record_types: input.recordTypes,
    },
  };
}

export function financialMetric(input: {
  amount: string | null;
  currency: "USD" | "GBP";
  quality: "actual" | "estimated" | "legacy_derived" | "unavailable";
  coverage: "complete" | "partial" | "missing";
  reason?: string;
  drill: Record<string, unknown>;
}): Record<string, unknown> {
  const row: Record<string, unknown> = {
    amount: input.amount,
    currency: input.currency,
    quality: input.amount === "0" || input.amount === "0.00" ? "actual" : input.quality,
    coverage: input.coverage,
    drill_through: input.drill,
  };
  if (input.amount === null) {
    row.quality = "unavailable";
    row.reason = input.reason ?? "missing_amount";
    row.coverage = "missing";
  } else if (row.quality !== "actual" && input.reason) {
    row.reason = input.reason;
  }
  return row;
}

export function nullMetrics(
  currency: "USD" | "GBP",
  reason: string,
  drillThrough: Record<string, unknown>,
): Record<string, unknown> {
  const metrics: Record<string, unknown> = {};
  for (const name of METRICS) {
    metrics[name] = financialMetric({
      amount: null,
      currency,
      quality: "unavailable",
      coverage: "missing",
      reason,
      drill: drillThrough,
    });
  }
  return metrics;
}

export function period(from: string, to: string): Record<string, unknown> {
  return { from, to, timezone: "Europe/London" };
}

export function capabilities(input: {
  environment: BosEnvironment;
  snapshotId: string;
  generatedAt: string;
  catalog?: AnalyticsCatalog;
}): Record<string, unknown> {
  const catalog = input.catalog ?? EMPTY_ANALYTICS_CATALOG;
  const sources = ["revenuecat", "onlinesim", ...catalog.configuredSources];
  return {
    schema_version: SCHEMA,
    contract_version: CONTRACT,
    project_id: "smscode",
    product_name: "SMS Code",
    environment: input.environment,
    snapshot_id: input.snapshotId,
    generated_at: input.generatedAt,
    data_as_of: input.generatedAt,
    api_version: SCHEMA,
    formula_versions: ["sms-legacy-usd-v1", "sms-comparable-usd-v1", "sms-operations-v1", ANALYTICS_FORMULA],
    fx_policy_version: "gbp-unconfigured",
    timezone: "Europe/London",
    reporting_currency: "GBP",
    supported_bases: ["sms_legacy", "purchase", "earned_management", "settled_cash"],
    datasets: {
      finance: true,
      subscriptions: false,
      operations: true,
      analytics: catalog.datasets,
    },
    earliest_data_at: null,
    earliest_data_reason: "history_start_unconfigured",
    limits: { max_range_days: 366, max_page_size: 500 },
    configured_sources: sources,
    warnings: [
      "Earliest reliable history is unconfigured. Observed rows are not a certified start date.",
      "GBP is unconfigured. Headline amounts stay null.",
      "Subscriptions are unsupported. SMS coin packs are not MRR.",
      "Analytics datasets stay false until a stored report exists. An unconfigured provider is not a zero.",
    ],
  };
}

const REPORTS: Record<string, { provider: string; timezone: string }> = {
  ga4_overview_daily: { provider: "ga4", timezone: "Europe/London" },
  ga4_breakdown: { provider: "ga4", timezone: "Europe/London" },
  ga4_period_unique_users: { provider: "ga4", timezone: "Europe/London" },
  gsc_daily_totals: { provider: "gsc", timezone: "America/Los_Angeles" },
  gsc_dimension_rows: { provider: "gsc", timezone: "America/Los_Angeles" },
  vercel_daily: { provider: "vercel", timezone: "Europe/London" },
};

export function knownReport(report: string): { provider: string; timezone: string } | null {
  return REPORTS[report] ?? null;
}

export function unsupportedAnalytics(input: {
  environment: BosEnvironment;
  snapshotId: string;
  generatedAt: string;
  provider: string;
  report: string;
  from: string;
  to: string;
  limit: number;
  timezone: string;
}): Record<string, unknown> {
  return {
    schema_version: SCHEMA,
    contract_version: CONTRACT,
    project_id: "smscode",
    environment: input.environment,
    snapshot_id: input.snapshotId,
    generated_at: input.generatedAt,
    data_as_of: input.generatedAt,
    provider: input.provider,
    report: input.report,
    availability: "unsupported",
    reason: "provider_not_configured",
    data_state: "unsupported",
    source_timezone: input.timezone,
    coverage: { status: "missing", missing: [input.provider] },
    posting: false,
    must_not_sum_daily_uniques: input.report === "ga4_period_unique_users",
    rows: [],
    page: { limit: input.limit, has_more: false, next_cursor: null, complete_property_total: false },
    limitations: ["The dataset is unsupported for this project. This is not a zero report."],
    period: { from: input.from, to: input.to, timezone: input.timezone },
  };
}

export function primaryVisitorHighlight(): Record<string, unknown> {
  return {
    provider: "vercel",
    metric: "primary_visitors",
    value: null,
    quality: "unavailable",
    reason: "primary_visitor_unconfigured",
    definition: PRIMARY_VISITOR_DEFINITION,
  };
}
