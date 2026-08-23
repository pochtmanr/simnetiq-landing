"use client";

import { getAdminClient } from "./client";

/* ---------------------------------------------------------------------------
 * Typed wrappers over the twelve `admin_*` RPCs.
 *
 * These add nothing. Every one of them is a `security definer` function in the
 * sms-expo repo (`supabase/migrations/20260834000000_admin.sql`), gated by
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
 * could be refused. Callers must render the site's ordinary 404 body on it —
 * never "forbidden", never "you are not an admin". A message that explains
 * confirms the route exists, and concealment of the route is the one thing
 * that message would destroy.
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
};

/* ---------------------------------------------------------------------------
 * Plumbing
 * ------------------------------------------------------------------------ */

type PostgrestFailure = { code: string; message: string; hint?: string | null };

/** Turn a PostgREST failure into something a screen can act on.
 *  42501 and only 42501 becomes AdminDenied; everything else stays an ordinary
 *  Error so that a network hiccup or a genuine bug is not silently disguised
 *  as "not an admin". The original is kept as `cause` for the console. */
function toError(fn: string, error: PostgrestFailure): Error {
  if (error.code === "42501") return new AdminDenied();
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
};
