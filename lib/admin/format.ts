/* ---------------------------------------------------------------------------
 * Display helpers for the admin panel.
 *
 * Two rules govern everything here.
 *
 * 1. **Never invent a value.** Null, undefined and unparseable input all
 *    render as an em dash. A dashboard figure that shows `0` or `NaN` when the
 *    database actually returned nothing is worse than one that shows nothing,
 *    because the operator acts on it.
 *
 * 2. **No masking helper lives in this file, on purpose.** `email_masked` and
 *    `phone_masked` are masked by Postgres before they leave it. A client-side
 *    mask would mean the unmasked value had already reached the browser, which
 *    is precisely the thing the RPCs are built to prevent. The single
 *    exception is `admin_reveal_sms`, which returns real values and records
 *    that it did.
 *
 * These are pure functions with no browser dependency, so this module is safe
 * to import from anywhere — unlike client.ts, guard.ts and rpc.ts.
 * ------------------------------------------------------------------------ */

/** What every helper renders when there is nothing to render. */
const NOTHING = "—";

/* PostgREST sends `numeric` as a JSON number, but the same column read through
   a different path can arrive as a string. Accepting both costs one line and
   removes a whole class of "why does this say NaN" investigations. */
type Numeric = number | string | null | undefined;

function toNumber(value: Numeric): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

/* A fixed locale, not the visitor's. The operator's browser locale must not
   change what a reconciliation figure looks like, and a fixed locale is also
   the only way a server-rendered shell and the client agree on the string. */
const NUMBER = new Intl.NumberFormat("en-US");
const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** A coin count: `12,480`. Coins are whole; a fractional one is a bug, so it
 *  is shown rather than rounded away. */
export function formatCoins(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return NOTHING;
  return NUMBER.format(n);
}

/** A dollar amount: `$1,204.35`. */
export function formatUsd(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return NOTHING;
  return USD.format(n);
}

/** A timestamp, always in UTC: `2026-08-23 14:05:07 UTC`.
 *
 *  UTC rather than local time because every other view an operator correlates
 *  this against — the Supabase SQL editor, the audit trail, provider logs —
 *  is in UTC, and because a locale- and timezone-free string cannot drift
 *  between the server render and the client one. */
export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return NOTHING;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return NOTHING;
  return `${t.toISOString().slice(0, 10)} ${t.toISOString().slice(11, 19)} UTC`;
}
