"use client";

import { getAdminClient } from "./client";

/* ---------------------------------------------------------------------------
 * Typed wrappers over the `admin_*` RPCs.
 *
 * These add nothing. Every one of them is a `security definer` function in the
 * sms-expo repo (`supabase/migrations/20260834000000_admin.sql`,
 * `20260839000000_ops_monitoring.sql`, `20260843000000_admin_p1.sql`,
 * `20260845000000_admin_money.sql`, `20260846000000_admin_team.sql`), gated by
 * `is_admin()`, granted to `authenticated` and revoked from `anon`. The panel
 * is a client for them, not an authority of its own — see lib/admin/client.ts
 * for why that distinction is the entire security model.
 *
 * The parameter names below (`p_user`, `p_limit`, …) are the Postgres argument
 * names. PostgREST matches named arguments, so a typo here is a runtime 404
 * from the database, not a compile error. They are transcribed from the
 * migration and must not be "tidied".
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * Denial
 * ------------------------------------------------------------------------ */

/**
 * Thrown when Postgres answers 42501 (`insufficient_privilege`).
 *
 * This is the *only* signal the panel gets that the caller is not an admin,
 * and it is deliberately indistinguishable from every other reason a call
 * could be refused. Callers render AuthGate's <DeniedBody> on it.
 *
 * It is a distinct class rather than a flag on Error so that `catch` blocks
 * can tell it apart from a network blip, which gets an inline retry instead.
 */
export class AdminDenied extends Error {
  constructor(message = "Admin RPC denied (42501).") {
    super(message);
    this.name = "AdminDenied";
  }
}

/** `instanceof` for a value typed `unknown`, which is what `catch` gives you. */
export function isAdminDenied(err: unknown): err is AdminDenied {
  return err instanceof AdminDenied;
}

/**
 * Thrown when the RPC does not exist in the database yet: PostgREST answers
 * PGRST202 ("could not find the function") and Postgres answers 42883
 * (`undefined_function`).
 *
 * The panel ships ahead of its migrations — the owner applies them to
 * production by hand — so a page built on a new RPC must be able to say
 * "migration not applied" instead of showing a raw error. `fn` is the RPC
 * name, for the notice.
 */
export class MigrationMissing extends Error {
  fn: string;
  constructor(fn: string, message = `${fn}: not in the database yet (migration not applied).`) {
    super(message);
    this.name = "MigrationMissing";
    this.fn = fn;
  }
}

export function isMigrationMissing(err: unknown): err is MigrationMissing {
  return err instanceof MigrationMissing;
}

/* ---------------------------------------------------------------------------
 * Row shapes
 *
 * Hand-written mirrors of the RPC return types. They are a convenience, not a
 * guarantee: nothing checks them against the database at build time, and the
 * SQL lives in a different repository. Render defensively — the helpers in
 * ./format all accept null and undefined for exactly this reason.
 *
 * jsonb columns are typed `Record<string, unknown>` rather than a concrete
 * shape because their contents are free-form on the Postgres side too.
 * ------------------------------------------------------------------------ */

/** One row from `public.money_health` (redefined in 20260835000000).
 *  `numeric` columns arrive as JSON numbers and are null when the underlying
 *  scalar subquery finds no row — a missing heartbeat, an absent pricing row. */
export type MoneyHealthRow = {
  /* alarms */
  stale_active_activations: number;
  sweep_last_ok_minutes: number | null;
  sweep_failures: number | null;
  numbers_awaiting_release: number;
  unbalanced_wallets: number;
  refunds_missing: number;
  /* money */
  coins_outstanding: number;
  coins_outstanding_usd: number | null;
  coins_purchased_7d: number;
  revenue_usd_7d: number | null;
  provider_cost_usd_7d: number | null;
  margin_usd_7d: number | null;
  realised_multiple_7d: number | null;
  /* watch */
  clawback_shortfall_coins_30d: number;
  users_investigate: number;
  users_watch: number;
  deleted_with_shortfall: number;
  activations_24h: number;
  activations_received_24h: number;
  margin_alerts_7d: number;
  generated_at: string;
  pii_purge_last_ok_hours: number | null;
  pii_overdue_rows: number;
};

/** One row from `public.admin_audit`. `actor` is null for a direct database
 *  session — there is no uid to record — but `actor_label` always says who. */
export type AdminAuditRow = {
  id: number;
  actor: string | null;
  actor_label: string;
  action: string;
  /** Free-form on purpose: a uid, an activation id, a transaction id. */
  subject: string | null;
  reason: string | null;
  detail: Record<string, unknown> | null;
  created_at: string;
};

export type UserSearchRow = {
  user_id: string;
  /** Already masked in SQL. There is no unmasked address on this path. */
  email_masked: string;
  has_no_email: boolean;
  created_at: string;
  balance_coins: number;
  purchased_coins: number;
  activations: number;
  risk_score: number;
  risk_band: string;
};

export type UserOverviewRow = {
  user_id: string;
  email: string;
  created_at: string;
  balance_coins: number;
  risk_score: number;
  risk_band: string;
  facts: Record<string, unknown> | null;
  risk: Record<string, unknown> | null;
  /** Opening a user record is a recorded read. Show this back to the operator. */
  audit_id: number;
};

export type UserLedgerRow = {
  id: number;
  created_at: string;
  kind: string;
  delta_coins: number;
  balance_after: number;
  shortfall_coins: number;
  activation_id: string | null;
  rc_transaction_id: string | null;
  product_id: string | null;
  usd_value: number | null;
  idempotency_key: string | null;
  note: string | null;
};

export type UserActivationsRow = {
  id: string;
  created_at: string;
  status: string;
  close_reason: string | null;
  service: string;
  country_dial: number;
  /** Masked in SQL. This page must never render a full number. */
  phone_masked: string | null;
  has_sms: boolean;
  sms_received_at: string | null;
  first_sms_seconds: number | null;
  coins_spent: number;
  retry_of: string | null;
  retry_index: number | null;
  is_migrated: boolean;
  provider_cost_cents: number | null;
  released_at: string | null;
};

/** The one shape in this file that carries real PII. It exists only as the
 *  return of `admin_reveal_sms`, which records the reveal before it answers. */
export type RevealSmsRow = {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  service: string;
  country_dial: number;
  phone: string | null;
  sms_code: string | null;
  sms_text: string | null;
  sms_received_at: string | null;
  audit_id: number;
};

export type GrantCoinsRow = {
  user_id: string;
  delta_coins: number;
  balance: number;
  /** `admin_grant_coins` derives its idempotency key from this row, so a grant
   *  that is not recorded cannot happen. Display it. */
  audit_id: number;
};

/** Mirrors the CHECK constraint on `public.support_requests.status` and the
 *  duplicate check inside `admin_support_set_status`. */
export type SupportStatus = "new" | "open" | "resolved";

export type SupportRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  locale: string;
  status: string;
  reply_count: number;
  last_reply_at: string | null;
  /** Still `new` after 24 hours. */
  stale: boolean;
  /** The one account with this email, if exactly one exists. */
  user_id: string | null;
};

export type SupportReplyRow = {
  id: string;
  created_at: string;
  admin_email: string | null;
  body: string;
  sent_at: string | null;
  send_error: string | null;
};

/* ---------------------------------------------------------------------------
 * Purchases, sign-ups, jobs, orphans (20260843000000_admin_p1.sql)
 * ------------------------------------------------------------------------ */

export type PurchaseEvent = "purchase" | "refund" | "refund_reversed";

export type PurchaseRow = {
  id: number;
  created_at: string;
  event: PurchaseEvent;
  user_id: string;
  email_masked: string | null;
  product_id: string | null;
  /** Signed: a refund is negative (coins clawed back). */
  coins: number;
  usd: number | null;
  /** Refunded coins that were already spent and could not be clawed back. */
  shortfall: number;
  sandbox: boolean;
  is_first: boolean;
  /** Added by 20260845000000_admin_money.sql; absent before it is applied.
   *  Links the row to /admin/purchases/<txn>. */
  rc_transaction_id?: string | null;
};

export type PurchaseSummary = {
  hours: number;
  purchases: number;
  first_purchases: number;
  refunds: number;
  refunds_reversed: number;
  refund_shortfall_coins: number;
  net_usd: number;
  gross_coins: number;
  sandbox: number;
  top_products: { product_id: string; purchases: number; coins: number; usd: number }[];
};

export type SignupRow = {
  user_id: string;
  email_masked: string | null;
  provider: string;
  registered_at: string;
  created_at: string;
  purchased: boolean;
  balance_coins: number;
};

export type UsersSummary = {
  hours: number;
  anon_installs: number;
  signups: number;
  first_purchases: number;
};

export type JobRow = {
  job_name: string;
  last_run_at: string | null;
  last_ok_at: string | null;
  last_error: string | null;
  runs: number;
  failures: number;
  expected_every_s: number | null;
  stale_alerted_at: string | null;
};

export type OrphanRow = {
  tzid: string;
  first_seen_at: string;
  attempts: number;
  last_error: string | null;
  service: string | null;
  country: string | null;
};

/* ---------------------------------------------------------------------------
 * Delivery monitoring
 * ------------------------------------------------------------------------ */

export type OpsDigest = {
  from: string;
  to: string;
  purchases: number;
  /** Activations that got a number — excludes provider_failed/claim_failed. */
  issued: number;
  delivered: number;
  expired: number;
  provider_failed: number;
  claim_failed: number;
  cancelled: number;
  in_flight: number;
  /** delivered / issued, 0–100. Null when nothing was issued. */
  success_pct: number | null;
  median_sms_seconds: number | null;
  coins_spent: number;
  revenue_usd: number | null;
  iap_count: number;
  store_refunds: number;
  top_failing: {
    service: string;
    country_dial: number | null;
    failures: number;
    reason: string | null;
  }[];
  balance_usd: number | null;
  balance_at: string | null;
  balance_burn_24h: number | null;
  /* Added in 20260844000000_ops_bot_p1.sql; absent before it is applied. */
  anon_installs?: number;
  signups?: number;
  first_purchases?: number;
  sandbox_purchases?: number;
};

export type DeliveryStatsRow = {
  bucket: string;
  purchases: number;
  issued: number;
  delivered: number;
  expired: number;
  provider_failed: number;
  other_failed: number;
  success_pct: number | null;
};

export type DeliveryComboRow = {
  service: string;
  country_dial: number | null;
  attempts: number;
  issued: number;
  delivered: number;
  success_pct: number | null;
  median_sms_seconds: number | null;
  top_fail_reason: string | null;
};

export type ProviderBalanceRow = {
  checked_at: string;
  balance_usd: number;
  frozen_usd: number | null;
};

export type OpsEventRow = {
  id: number;
  created_at: string;
  kind: string;
  severity: "info" | "warn" | "crit";
  close_reason: string | null;
  service: string | null;
  country_dial: number | null;
  /** Already masked in SQL. */
  phone_masked: string | null;
  seconds: number | null;
  sent_at: string | null;
  send_error: string | null;
  detail: Record<string, unknown> | null;
  /** Added by 20260845000000_admin_money.sql; absent before it is applied.
   *  Null when the event names no activation (or the row no longer exists). */
  activation_id?: string | null;
};

/* ---------------------------------------------------------------------------
 * Money, spend, activity feed and detail pages (20260845000000_admin_money.sql)
 *
 * Money is USD throughout. numeric columns arrive as JSON numbers.
 * ------------------------------------------------------------------------ */

/** One `admin_money_pnl` bucket: hourly for windows up to 48h, daily (UTC)
 *  beyond. Every bucket is present. */
export type PnlRow = {
  bucket: string;
  /** What customers paid (store price), live purchases. */
  gross: number;
  apple_fee: number;
  /** Net refunded by the store, less refunds Apple reversed. */
  refunds: number;
  /** gross - apple_fee - refunds. */
  cash_net: number;
  /** Revenue recognised on delivered activations (coins x buyer's $/coin). */
  earned: number;
  /** OnlineSim list price on delivered activations. */
  recorded_cost: number;
  /** From balance drops. Null when the bucket has no balance snapshots. */
  real_spend: number | null;
  activations: number;
  charged: number;
  /** earned - recorded_cost. */
  gross_profit: number;
  /** gross_profit / earned, 0–100. Null when nothing was earned. */
  margin_pct: number | null;
  /** earned - real_spend. Null when real_spend is. */
  real_profit: number | null;
};

/** `admin_money_summary` — window totals (exactly now()-hours .. now()). */
export type MoneySummary = {
  hours: number;
  from: string;
  to: string;
  gross: number;
  apple_fee: number;
  refunds: number;
  cash_net: number;
  purchases: number;
  store_refunds: number;
  earned: number;
  recorded_cost: number;
  real_spend: number | null;
  gross_profit: number;
  margin_pct: number | null;
  real_profit: number | null;
  real_margin_pct: number | null;
  activations: number;
  charged: number;
  coins_charged: number;
  /** Delivered activations with no recorded provider price (counted as $0). */
  cost_unknown: number;
  /** real_spend - recorded_cost. Null without balance data. */
  reconciliation_gap: number | null;
  /** Live top-ups with occurred_at in the window. */
  topups_logged: number;
  topups_count: number;
  /** Top-ups that fell inside a balance interval and were added back. */
  topups_applied: number;
  unexplained_increase: number;
  probable_topups: number;
  intervals: number;
  snapshot_gaps: number;
  /** Balance + frozen at the first/last snapshot. Reconciles exactly:
   *  total_start + topups_applied + unexplained_increase - total_end = real_spend */
  total_start: number | null;
  total_end: number | null;
  balance_now: number | null;
  frozen_now: number | null;
  balance_as_of: string | null;
  /** pricing_config.net_usd_per_coin. */
  default_rate: number;
  /** Share of `earned` valued at default_rate (buyer had no purchase), 0–100. */
  share_default_rate_pct: number | null;
  /** Plain-language explanation per figure, keyed by the field name. */
  sources: Record<string, string>;
};

export type BreakdownGroup = "service" | "country" | "combo";

/** One `admin_money_breakdown` row. Key columns the group does not use are
 *  null (service for "country", country_* for "service"). Worst profit first. */
export type BreakdownRow = {
  service: string | null;
  country_dial: number | null;
  country_name: string | null;
  iso2: string | null;
  activations: number;
  issued: number;
  charged: number;
  /** charged / issued, 0–100. */
  delivered_pct: number | null;
  coins: number;
  earned: number;
  recorded_cost: number;
  profit: number;
  margin_pct: number | null;
};

/** One interval between consecutive OnlineSim balance snapshots
 *  (`admin_provider_spend`), oldest first. Totals are balance + frozen. */
export type SpendIntervalRow = {
  from_at: string;
  to_at: string;
  total_before: number;
  total_after: number;
  balance_after: number;
  frozen_after: number | null;
  topups_usd: number;
  spend_usd: number;
  unexplained_increase: number;
  /** Snapshots more than an hour apart. */
  gap: boolean;
  /** Increase >= $1 with no live top-up logged within 30 min either side.
   *  Offer "Log as top-up" pre-filled with to_at and unexplained_increase. */
  probable_topup: boolean;
};

export type TopupRow = {
  id: number;
  provider: string;
  amount_usd: number;
  occurred_at: string;
  note: string | null;
  created_by: string | null;
  /** The admin who logged it — not customer PII. */
  created_by_email: string | null;
  audit_id: number | null;
  created_at: string;
  voided_at: string | null;
  voided_by: string | null;
  void_reason: string | null;
};

export type TopupAddResult = { id: number; audit_id: number };

export type ActivityKind =
  | "purchase"
  | "refund"
  | "refund_reversed"
  | "signup"
  | "support"
  | "failure"
  | "alert"
  | "admin";

export type ActivityEntity =
  | "user"
  | "activation"
  | "purchase"
  | "support"
  | "topup"
  | "system";

/** One `admin_activity_feed` row, newest first. Page with `at` of the last row
 *  as `before`. entity_id is a uuid (user/activation/support), a store
 *  transaction id (purchase), a top-up id (topup), or an event kind (system). */
export type ActivityRow = {
  at: string;
  kind: ActivityKind;
  entity_type: ActivityEntity;
  entity_id: string | null;
  user_id: string | null;
  title: string;
  detail: string | null;
  amount_usd: number | null;
  severity: "info" | "warn" | "crit";
};

export type ActivationLedgerEntry = {
  id: number;
  created_at: string;
  kind: string;
  delta_coins: number;
  balance_after: number;
  idempotency_key: string;
  note: string | null;
};

export type ActivationChainEntry = {
  id: string;
  created_at: string;
  status: string;
  close_reason: string | null;
  retry_index: number | null;
  coins_spent: number | null;
};

export type ActivationEventEntry = {
  id: number;
  created_at: string;
  kind: string;
  severity: "info" | "warn" | "crit";
  payload: Record<string, unknown>;
};

export type ActivationAuditEntry = {
  id: number;
  created_at: string;
  action: string;
  actor_label: string;
  reason: string | null;
};

/** `admin_activation_detail`. No SMS body and no full number — reveal still
 *  goes through `admin_reveal_sms`. Money fields are the P&L's own numbers
 *  for this row (null only if the row is migrated history). */
export type ActivationDetail = {
  id: string;
  user_id: string;
  email_masked: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  status: string;
  close_reason: string | null;
  service: string;
  country_dial: number | null;
  country_code: string;
  country_name: string | null;
  iso2: string | null;
  phone_masked: string | null;
  has_sms: boolean;
  sms_received_at: string | null;
  first_sms_seconds: number | null;
  coins_spent: number | null;
  retry_of: string | null;
  retry_index: number | null;
  is_migrated: boolean;
  hidden_by_user: boolean;
  provider: string | null;
  tzid: string | null;
  provider_cost_cents: number | null;
  released_at: string | null;
  release_due_at: string | null;
  release_attempts: number | null;
  release_last_error: string | null;
  quote_id: string | null;
  quote_coins: number | null;
  quote_cost_cents: number | null;
  charged: boolean;
  coins_net: number | null;
  rate: number | null;
  rate_source: "user" | "default" | null;
  revenue_usd: number | null;
  cost_usd: number | null;
  cost_known: boolean | null;
  profit_usd: number | null;
  /** The whole retry chain, oldest first (includes this activation). */
  retry_chain: ActivationChainEntry[];
  ledger: ActivationLedgerEntry[];
  events: ActivationEventEntry[];
  audit: ActivationAuditEntry[];
};

export type PurchaseLedgerEntry = {
  id: number;
  created_at: string;
  kind: string;
  delta_coins: number;
  balance_after: number;
  shortfall_coins: number;
  usd_value: number | null;
  idempotency_key: string;
  note: string | null;
};

/** `admin_purchase_detail(txn)`. rc_credit_grants is the base, so a purchase
 *  that never reached a wallet still resolves (user_id null, no ledger). */
export type PurchaseDetail = {
  transaction_id: string;
  app_user_id: string | null;
  user_id: string | null;
  email_masked: string | null;
  product_id: string | null;
  credits: number | null;
  event_type: string | null;
  store: string | null;
  environment: string | null;
  sandbox: boolean;
  purchased_at: string | null;
  granted_at: string | null;
  /** RevenueCat price_usd. */
  gross_usd: number | null;
  /** After Apple (ledger usd_value). */
  net_usd: number | null;
  apple_fee_usd: number | null;
  /** net / gross, 0–100. */
  takehome_pct: number | null;
  coins: number | null;
  ledger_at: string | null;
  reversal_state: "refunded" | "reversed" | null;
  reversal_at: string | null;
  clawed_coins: number | null;
  shortfall_coins: number | null;
  abuse_flags: Record<string, unknown> | null;
  /** Coins the user spent (net of refunds) since this purchase. */
  coins_spent_after: number | null;
  /** When refunded: coins spent between the purchase and the refund. */
  coins_spent_before_refund: number | null;
  /** Every ledger row for this txn: purchase, clawback, regrant. */
  ledger: PurchaseLedgerEntry[];
};

export type ComboDailyRow = {
  /** UTC day start. */
  day: string;
  attempts: number;
  delivered: number;
  earned: number;
  recorded_cost: number;
  profit: number;
};

export type ComboRecentRow = {
  id: string;
  created_at: string;
  status: string;
  close_reason: string | null;
  user_id: string;
  phone_masked: string | null;
  coins_spent: number | null;
  retry_index: number | null;
  first_sms_seconds: number | null;
  provider_cost_cents: number | null;
};

/** `admin_combo(service, country, hours) -> jsonb`. price/offer/quality/
 *  cooldown are null when there is no such row (cooldown: none active). */
export type ComboStats = {
  service: string;
  service_name: string | null;
  country_dial: number;
  country_name: string | null;
  iso2: string | null;
  hours: number;
  summary: {
    attempts: number;
    issued: number;
    delivered: number;
    failed: number;
    cancelled: number;
    in_flight: number;
    success_pct: number | null;
    coins: number;
    earned: number;
    recorded_cost: number;
    profit: number;
    margin_pct: number | null;
    /** True median over the window's raw rows. */
    median_sms_seconds: number | null;
    top_fail_reason: string | null;
  };
  price: {
    /** What the app charges now (pinned if pinned). */
    coins: number;
    formula_coins: number;
    pinned_coins: number | null;
    is_listed: boolean;
    basis_cost_cents: number;
    effective_from: string;
    /** coins x default rate. */
    net_usd_default: number | null;
  } | null;
  offer: {
    cost_cents: number;
    available_count: number;
    stock_band: string;
    updated_at: string;
  } | null;
  quality: {
    attempts_30d: number;
    received_30d: number;
    success_rate: number;
    sms_seconds: number | null;
    has_signal: boolean;
  } | null;
  cooldown: { until: string; failures: number; since: string } | null;
  /** One entry per UTC day in the window, oldest first. */
  daily: ComboDailyRow[];
  /** Last 50 activations regardless of window, newest first. */
  recent: ComboRecentRow[];
};

/* -- Team (sms-expo 20260846000000_admin_team.sql) -- */

/** `owner` is the main admin: team management and customer deletion, at most
 *  two live at once (a database trigger enforces it). Everyone else is a
 *  `worker`. */
export type TeamRole = "owner" | "worker";

/** `admin_me()` — the caller, and only the caller. */
export type AdminMe = {
  user_id: string;
  email: string | null;
  role: TeamRole;
  added_at: string;
  invited_by: string | null;
  invited_by_email: string | null;
  invited_at: string | null;
  last_seen_at: string | null;
  /** Verified authenticator factors on the account. */
  factor_count: number;
};

/** `revoked` = access removed; `invited` = no verified authenticator yet, so
 *  they cannot have used the panel; `active` = everything else. */
export type TeamStatus = "active" | "invited" | "revoked";

/** One row of `admin_team_list()` (owners only). */
export type TeamMember = {
  user_id: string;
  email: string | null;
  role: TeamRole;
  status: TeamStatus;
  note: string | null;
  added_at: string;
  invited_by: string | null;
  invited_by_email: string | null;
  invited_at: string | null;
  revoked_at: string | null;
  last_seen_at: string | null;
  last_sign_in_at: string | null;
  factor_count: number;
};

/* ---------------------------------------------------------------------------
 * Plumbing
 * ------------------------------------------------------------------------ */

type PostgrestFailure = { code: string; message: string; hint?: string | null };

/** Turn a PostgREST failure into something a screen can act on.
 *  42501 and only 42501 becomes AdminDenied; a missing function (PGRST202 /
 *  42883) becomes MigrationMissing; everything else stays an ordinary Error so
 *  that a network hiccup or a genuine bug is not silently disguised as "not an
 *  admin". The original is kept as `cause` for the console. */
function toError(fn: string, error: PostgrestFailure): Error {
  if (error.code === "42501") return new AdminDenied();
  if (error.code === "PGRST202" || error.code === "42883") {
    const missing = new MigrationMissing(fn);
    missing.cause = error;
    return missing;
  }
  return new Error(`${fn}: ${error.message}`, { cause: error });
}

/** Drop keys whose value is undefined so that Postgres applies its own default
 *  for the argument. Restating the SQL defaults in TypeScript would give two
 *  places to change them and one that gets forgotten. */
function args(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
}

async function callRaw(
  fn: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  const { data, error } = await getAdminClient().rpc(fn, args(input));
  if (error) throw toError(fn, error);
  return data as unknown;
}

/** For `returns table (...)` / `returns setof ...` — PostgREST answers an array. */
async function callRows<Row>(
  fn: string,
  input: Record<string, unknown> = {},
): Promise<Row[]> {
  const data = await callRaw(fn, input);
  return (data ?? []) as Row[];
}

/** For a set-returning RPC that yields exactly one row. An empty result means
 *  the subject does not exist, which is a real error rather than an empty page. */
async function callRow<Row>(
  fn: string,
  input: Record<string, unknown>,
): Promise<Row> {
  const rows = await callRows<Row>(fn, input);
  const row = rows[0];
  if (!row) throw new Error(`${fn}: returned no row.`);
  return row;
}

/** For `returns bigint` — PostgREST answers the bare scalar, not an array. */
async function callScalar<T>(
  fn: string,
  input: Record<string, unknown>,
): Promise<T> {
  return (await callRaw(fn, input)) as T;
}

/* ---------------------------------------------------------------------------
 * The RPCs
 * ------------------------------------------------------------------------ */

export const rpc = {
  /** `admin_money_health()` — one row of alarms, money and watch figures. */
  moneyHealth(): Promise<MoneyHealthRow[]> {
    return callRows<MoneyHealthRow>("admin_money_health");
  },

  /** `admin_audit_recent(p_limit int = 100)` — newest first. */
  auditRecent(limit?: number): Promise<AdminAuditRow[]> {
    return callRows<AdminAuditRow>("admin_audit_recent", { p_limit: limit });
  },

  /** `admin_user_search(p_query text, p_limit int = 25)`. Accepts a uid or an
   *  email fragment; the result is masked in SQL. */
  userSearch(query: string, limit?: number): Promise<UserSearchRow[]> {
    return callRows<UserSearchRow>("admin_user_search", {
      p_query: query,
      p_limit: limit,
    });
  },

  /** `admin_user_overview(p_user uuid)`. This one is a *recorded* read — it
   *  writes an audit row and hands back its id. */
  userOverview(userId: string): Promise<UserOverviewRow> {
    return callRow<UserOverviewRow>("admin_user_overview", { p_user: userId });
  },

  /** `admin_user_ledger(p_user uuid, p_limit int = 100)`. */
  userLedger(userId: string, limit?: number): Promise<UserLedgerRow[]> {
    return callRows<UserLedgerRow>("admin_user_ledger", {
      p_user: userId,
      p_limit: limit,
    });
  },

  /** `admin_user_activations(p_user uuid, p_limit int = 100)`. Numbers masked,
   *  SMS bodies absent — `has_sms` says one exists, nothing more. */
  userActivations(userId: string, limit?: number): Promise<UserActivationsRow[]> {
    return callRows<UserActivationsRow>("admin_user_activations", {
      p_user: userId,
      p_limit: limit,
    });
  },

  /** `admin_reveal_sms(p_activation uuid, p_reason text)`.
   *  The only path to a full phone number or an SMS body anywhere in this app.
   *  The reason is mandatory and is written to the audit trail before the row
   *  is returned. Show the result once and do not retain it. */
  revealSms(activationId: string, reason: string): Promise<RevealSmsRow> {
    return callRow<RevealSmsRow>("admin_reveal_sms", {
      p_activation: activationId,
      p_reason: reason,
    });
  },

  /** `admin_grant_coins(p_user uuid, p_coins int, p_reason text)`.
   *  The 1–2000 cap and the eight-character minimum reason are enforced in
   *  SQL. Mirror them in the UI as guidance; never present them as negotiable. */
  grantCoins(
    userId: string,
    coins: number,
    reason: string,
  ): Promise<GrantCoinsRow> {
    return callRow<GrantCoinsRow>("admin_grant_coins", {
      p_user: userId,
      p_coins: coins,
      p_reason: reason,
    });
  },

  /** `admin_support_list(p_status text = null, p_limit int = 50)`.
   *  A null status means every status. */
  supportList(
    status?: SupportStatus | null,
    limit?: number,
  ): Promise<SupportRow[]> {
    return callRows<SupportRow>("admin_support_list", {
      p_status: status ?? null,
      p_limit: limit,
    });
  },

  /** `admin_support_set_status(p_id uuid, p_status text) -> bigint`.
   *  Returns the audit row id, not the updated request. */
  supportSetStatus(id: string, status: SupportStatus): Promise<number> {
    return callScalar<number>("admin_support_set_status", {
      p_id: id,
      p_status: status,
    });
  },

  /** `admin_support_thread(p_id uuid)` — replies sent on a ticket, oldest first. */
  supportThread(id: string): Promise<SupportReplyRow[]> {
    return callRows<SupportReplyRow>("admin_support_thread", { p_id: id });
  },

  /* -- Purchases, sign-ups, jobs, orphans (20260843000000_admin_p1.sql) -- */

  /** `admin_purchases(p_hours int = 168, p_limit int = 200)` — purchases,
   *  store refunds and reversed refunds, newest first. Emails masked in SQL. */
  purchases(hours?: number, limit?: number): Promise<PurchaseRow[]> {
    return callRows<PurchaseRow>("admin_purchases", { p_hours: hours, p_limit: limit });
  },

  /** `admin_purchase_summary(p_hours int = 168) -> jsonb`. The same figures
   *  the bot's /revenue posts. Sandbox purchases are counted, never summed. */
  purchaseSummary(hours?: number): Promise<PurchaseSummary> {
    return callScalar<PurchaseSummary>("admin_purchase_summary", { p_hours: hours });
  },

  /** `admin_recent_signups(p_hours int = 168, p_limit int = 100)`. */
  recentSignups(hours?: number, limit?: number): Promise<SignupRow[]> {
    return callRows<SignupRow>("admin_recent_signups", { p_hours: hours, p_limit: limit });
  },

  /** `admin_users_summary(p_hours int = 168) -> jsonb`. */
  usersSummary(hours?: number): Promise<UsersSummary> {
    return callScalar<UsersSummary>("admin_users_summary", { p_hours: hours });
  },

  /** `admin_jobs()` — every cron/edge job heartbeat with its expected cadence. */
  jobs(): Promise<JobRow[]> {
    return callRows<JobRow>("admin_jobs");
  },

  /** `admin_open_orphans()` — OnlineSim operations nobody has closed yet. */
  openOrphans(): Promise<OrphanRow[]> {
    return callRows<OrphanRow>("admin_open_orphans");
  },

  /* -- Delivery monitoring (sms-expo 20260839000000_ops_monitoring.sql) -- */

  /** `admin_ops_digest(p_hours int = 24) -> jsonb`. The same numbers the
   *  Telegram digests post, so the two never disagree about one window. */
  opsDigest(hours?: number): Promise<OpsDigest> {
    return callScalar<OpsDigest>("admin_ops_digest", { p_hours: hours });
  },

  /** `admin_delivery_stats(p_hours int = 168)` — one row per hour, oldest
   *  first, empty hours included. */
  deliveryStats(hours?: number): Promise<DeliveryStatsRow[]> {
    return callRows<DeliveryStatsRow>("admin_delivery_stats", { p_hours: hours });
  },

  /** `admin_delivery_by_combo(p_hours int = 168)` — worst first. */
  deliveryByCombo(hours?: number): Promise<DeliveryComboRow[]> {
    return callRows<DeliveryComboRow>("admin_delivery_by_combo", { p_hours: hours });
  },

  /** `admin_provider_balance(p_hours int = 168)` — OnlineSim balance checks,
   *  oldest first, roughly every 15 minutes. */
  providerBalance(hours?: number): Promise<ProviderBalanceRow[]> {
    return callRows<ProviderBalanceRow>("admin_provider_balance", { p_hours: hours });
  },

  /** `admin_recent_failures(p_limit int = 50)` — the ops event feed, newest
   *  first. Phones masked in SQL. */
  recentFailures(limit?: number): Promise<OpsEventRow[]> {
    return callRows<OpsEventRow>("admin_recent_failures", { p_limit: limit });
  },

  /* -- Money, spend, feed, details (sms-expo 20260845000000_admin_money.sql).
   *    Until that migration is applied these throw MigrationMissing. -- */

  /** `admin_money_pnl(p_hours int = 168)` — buckets oldest first. */
  moneyPnl(hours?: number): Promise<PnlRow[]> {
    return callRows<PnlRow>("admin_money_pnl", { p_hours: hours });
  },

  /** `admin_money_summary(p_hours int = 168) -> jsonb`. */
  moneySummary(hours?: number): Promise<MoneySummary> {
    return callScalar<MoneySummary>("admin_money_summary", { p_hours: hours });
  },

  /** `admin_money_breakdown(p_hours int = 168, p_group text = 'service')` —
   *  worst profit first, at most 200 rows. */
  moneyBreakdown(hours?: number, group?: BreakdownGroup): Promise<BreakdownRow[]> {
    return callRows<BreakdownRow>("admin_money_breakdown", {
      p_hours: hours,
      p_group: group,
    });
  },

  /** `admin_provider_spend(p_hours int = 168)` — balance intervals, oldest first. */
  providerSpend(hours?: number): Promise<SpendIntervalRow[]> {
    return callRows<SpendIntervalRow>("admin_provider_spend", { p_hours: hours });
  },

  /** `admin_provider_topups(p_hours int = 2160)` — by occurred_at, newest
   *  first, voided rows included. */
  topups(hours?: number): Promise<TopupRow[]> {
    return callRows<TopupRow>("admin_provider_topups", { p_hours: hours });
  },

  /** `admin_provider_topup_add(p_amount numeric, p_occurred_at timestamptz =
   *  now(), p_note text = null)`. Audited. SQL enforces 0 < amount <= 10000
   *  and occurred_at within the last 90 days (not >10 min in the future). */
  topupAdd(amountUsd: number, occurredAt?: string | null, note?: string | null): Promise<TopupAddResult> {
    return callRow<TopupAddResult>("admin_provider_topup_add", {
      p_amount: amountUsd,
      p_occurred_at: occurredAt ?? undefined,
      p_note: note ?? undefined,
    });
  },

  /** `admin_provider_topup_void(p_id bigint, p_reason text) -> bigint` (audit
   *  id). Reason must be at least 8 characters. */
  topupVoid(id: number, reason: string): Promise<number> {
    return callScalar<number>("admin_provider_topup_void", { p_id: id, p_reason: reason });
  },

  /** `admin_activity_feed(p_limit int = 50, p_before timestamptz = null,
   *  p_kinds text[] = null)`. Pass the last row's `at` as `before` to page. */
  activityFeed(opts: { limit?: number; before?: string | null; kinds?: ActivityKind[] | null } = {}): Promise<ActivityRow[]> {
    return callRows<ActivityRow>("admin_activity_feed", {
      p_limit: opts.limit,
      p_before: opts.before ?? undefined,
      p_kinds: opts.kinds && opts.kinds.length > 0 ? opts.kinds : undefined,
    });
  },

  /** `admin_activation_detail(p_id uuid)`. Throws when there is no such row. */
  activationDetail(id: string): Promise<ActivationDetail> {
    return callRow<ActivationDetail>("admin_activation_detail", { p_id: id });
  },

  /** `admin_purchase_detail(p_txn text)`. Throws when the txn is unknown. */
  purchaseDetail(txn: string): Promise<PurchaseDetail> {
    return callRow<PurchaseDetail>("admin_purchase_detail", { p_txn: txn });
  },

  /** `admin_combo(p_service text, p_country int, p_hours int = 720) -> jsonb`. */
  combo(service: string, countryDial: number, hours?: number): Promise<ComboStats> {
    return callScalar<ComboStats>("admin_combo", {
      p_service: service,
      p_country: countryDial,
      p_hours: hours,
    });
  },

  /** `admin_support_get(p_id uuid)` — one ticket, same shape as a list row.
   *  Throws when there is no such ticket. */
  supportGet(id: string): Promise<SupportRow> {
    return callRow<SupportRow>("admin_support_get", { p_id: id });
  },

  /* -- Team (sms-expo 20260846000000_admin_team.sql). Owner-only calls raise
   *    42501 for a worker, which arrives here as AdminDenied. Inviting and
   *    deleting a customer go through the admin-team edge function instead —
   *    see ./teamFunction.ts. -- */

  /** `admin_me()` — the caller's own role and membership. Any admin. */
  me(): Promise<AdminMe> {
    return callRow<AdminMe>("admin_me", {});
  },

  /** `admin_team_list()` — owners only. */
  teamList(): Promise<TeamMember[]> {
    return callRows<TeamMember>("admin_team_list");
  },

  /** `admin_team_set_role(p_user uuid, p_role text, p_reason text) -> bigint`.
   *  The two-owner ceiling and the last-owner floor are a trigger's; a breach
   *  comes back as an Error with the trigger's own sentence. */
  teamSetRole(userId: string, role: TeamRole, reason: string): Promise<number> {
    return callScalar<number>("admin_team_set_role", { p_user: userId, p_role: role, p_reason: reason });
  },

  /** `admin_team_revoke(p_user uuid, p_reason text) -> bigint`. */
  teamRevoke(userId: string, reason: string): Promise<number> {
    return callScalar<number>("admin_team_revoke", { p_user: userId, p_reason: reason });
  },

  /** `admin_team_restore(p_user uuid, p_reason text) -> bigint`. */
  teamRestore(userId: string, reason: string): Promise<number> {
    return callScalar<number>("admin_team_restore", { p_user: userId, p_reason: reason });
  },
};
