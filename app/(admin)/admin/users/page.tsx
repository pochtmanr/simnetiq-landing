"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";
import { AuthGate, NotFoundBody } from "../AuthGate";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { isAdminDenied, rpc, type UserSearchRow } from "../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * User search.
 *
 * A client component, and it has to be: lib/admin/rpc.ts is a "use client"
 * module because the only credential this app holds is the anon key in the
 * operator's own browser. There is no server route to render this from.
 *
 * Everything on this screen is already masked by Postgres. `admin_user_search`
 * returns `email_masked`, never the address, so nothing here needs a
 * client-side mask — and a client-side mask would prove the real value had
 * already been sent, which is the failure this design exists to prevent.
 * ------------------------------------------------------------------------ */

/** More than the SQL default of 25. The operator is searching a small user
 *  base by hand; a truncated result they cannot see the edge of is worse than
 *  a long table, and the footer below says when the limit was reached. */
const LIMIT = 50;

/* ---------------------------------------------------------------------------
 * Cells
 * ------------------------------------------------------------------------ */

const TH =
  "px-[10px] py-[8px] text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted whitespace-nowrap";
const TD = "px-[10px] py-[8px] align-middle whitespace-nowrap";

/**
 * The account column.
 *
 * `has_no_email` is not "we masked it to nothing" — it is an anonymous
 * Supabase account, which has no address at all. Those users exist in real
 * numbers (the app signs in anonymously before anyone offers an email), and
 * rendering them as a blank cell makes them look like a data fault. Say what
 * they are instead.
 */
function Account({ row }: { row: UserSearchRow }) {
  if (row.has_no_email) {
    return (
      <span className="text-ink-muted">
        <span className="mr-[8px] inline-flex items-center rounded-pill bg-panel-strong px-[8px] py-[2px] text-caption font-medium text-accent-deep">
          anonymous
        </span>
        no email on the account
      </span>
    );
  }
  return <span className="text-ink">{row.email_masked}</span>;
}

/** Risk is the reason this table exists, so it gets the only colour on it.
 *  The bands come from the SQL; anything unrecognised falls through neutral
 *  rather than being coerced into a band it may not be. */
function Risk({ band, score }: { band: string; score: number }) {
  const tone =
    band === "investigate"
      ? "bg-panel-deep text-ink"
      : band === "watch"
        ? "bg-panel-mid text-ink"
        : "bg-panel text-ink-muted";
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-pill px-[8px] py-[2px] text-caption ${tone}`}
    >
      <span className="font-medium">{band}</span>
      <span className="tabular-nums">{score}</span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Failure
 * ------------------------------------------------------------------------ */

/** Anything that is not a denial. Shown inline with a retry, never as a blank
 *  screen: an operator who sees nothing cannot tell a broken query from a user
 *  with no history, and will act on the wrong one. */
function ErrorNote({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-card border border-border bg-card px-[16px] py-[14px]"
    >
      <p className="text-label text-ink">That search did not complete.</p>
      <p className="mt-[4px] break-words text-caption text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="cta cta--sm mt-[12px]"
      >
        Try again
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

function UserSearch() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<UserSearchRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  /* The query the current result set belongs to, so the retry button repeats
     what actually failed rather than whatever is in the box by then — and the
     empty state names the query that found nothing, not the one being typed. */
  const [ran, setRan] = useState<string | null>(null);

  const run = useCallback(async (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setRan(q);
    setBusy(true);
    setError(null);
    try {
      setRows(await rpc.userSearch(q, LIMIT));
    } catch (err) {
      /* 42501 is the only thing the database will ever say about not being an
         admin, and the only correct response is the 404 — see AuthGate. */
      if (isAdminDenied(err)) {
        setDenied(true);
        return;
      }
      setRows(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    void run(query);
  }

  if (denied) return <NotFoundBody />;

  return (
    <div>
      <h1 className="font-sans text-heading-sm">Users</h1>
      <p className="mt-[4px] text-label text-ink-muted">
        Search by email fragment or by user id. Addresses are masked by the
        database before they reach this page.
      </p>

      <form onSubmit={submit} className="mt-[16px] flex flex-wrap gap-[8px]">
        <input
          className="field max-w-[420px] flex-1 py-[9px] text-[14px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="email fragment or uuid"
          aria-label="Search users"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="cta cta--sm disabled:opacity-60"
          disabled={busy || query.trim().length === 0}
        >
          {busy ? "Searching…" : "Search"}
        </button>
      </form>

      <div className="mt-[18px]">
        {error ? (
          <ErrorNote
            message={error}
            onRetry={() => {
              void run(ran ?? query);
            }}
          />
        ) : rows === null ? (
          <p className="text-label text-muted">
            {busy ? "Searching…" : "No search run yet."}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-label text-muted">
            Nothing matched “{ran}”.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-card border border-border bg-card">
              <table className="w-full border-collapse text-label">
                <thead>
                  <tr className="border-b border-border">
                    <th className={TH}>Account</th>
                    <th className={TH}>Balance</th>
                    <th className={TH}>Purchased</th>
                    <th className={TH}>Activations</th>
                    <th className={TH}>Risk</th>
                    <th className={TH}>Created</th>
                    <th className={TH}>User id</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.user_id}
                      className="border-b border-border last:border-b-0 hover:bg-panel"
                    >
                      <td className={TD}>
                        <Link
                          href={`/admin/users/${row.user_id}`}
                          className="ghost-link"
                        >
                          <Account row={row} />
                        </Link>
                      </td>
                      <td className={`${TD} tabular-nums`}>
                        {formatCoins(row.balance_coins)}
                      </td>
                      <td className={`${TD} tabular-nums text-ink-muted`}>
                        {formatCoins(row.purchased_coins)}
                      </td>
                      <td className={`${TD} tabular-nums text-ink-muted`}>
                        {formatCoins(row.activations)}
                      </td>
                      <td className={TD}>
                        <Risk band={row.risk_band} score={row.risk_score} />
                      </td>
                      <td className={`${TD} text-ink-muted`}>
                        {formatWhen(row.created_at)}
                      </td>
                      <td className={`${TD} font-mono text-caption text-muted`}>
                        <Link
                          href={`/admin/users/${row.user_id}`}
                          className="ghost-link"
                        >
                          {row.user_id}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-[8px] text-caption text-muted">
              {rows.length} {rows.length === 1 ? "account" : "accounts"}
              {rows.length === LIMIT
                ? ` — the limit. Narrow the query; there may be more.`
                : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function UsersRoute() {
  return (
    <AuthGate>
      <UserSearch />
    </AuthGate>
  );
}
