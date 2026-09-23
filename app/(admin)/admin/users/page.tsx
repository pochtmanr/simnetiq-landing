"use client";

import { useCallback, useState, type FormEvent } from "react";
import { AuthGate, DeniedBody } from "../AuthGate";
import { RecentSignups } from "./RecentSignups";
import { formatCoins, formatWhen } from "../../../../lib/admin/format";
import { isAdminDenied, rpc, type UserSearchRow } from "../../../../lib/admin/rpc";
import {
  Badge,
  DataTable,
  EmptyState,
  EntityLink,
  PageHeader,
  RiskBadge,
  SkeletonRows,
  type Column,
} from "../ui";

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
      <span className="inline-flex flex-wrap items-center gap-[6px] text-ink-muted">
        <Badge tone="info">anonymous</Badge>
        <span className="font-normal">no email on the account</span>
      </span>
    );
  }
  return <span className="break-all text-ink">{row.email_masked}</span>;
}

/** Risk is the reason this table exists, so it gets the colour. The bands
 *  come from the SQL; RiskBadge leaves anything unrecognised neutral rather
 *  than coercing it into a band it may not be. */
function Risk({ band, score }: { band: string; score: number }) {
  return (
    <span className="inline-flex items-center gap-[6px] whitespace-nowrap">
      <RiskBadge band={band} />
      <span className="text-caption tabular-nums text-muted" title="Risk score">
        {score}
      </span>
    </span>
  );
}

/* Account and user id are the only text columns; balance and risk ride on
   the right of each phone card because they are what the operator scans. The
   account cell is plain text — the row (and the card title) is the link, and
   the user id column is a real anchor for keyboard and middle-click. */
const COLUMNS: Column<UserSearchRow>[] = [
  { key: "account", header: "Account", mobile: "title", cell: (row) => <Account row={row} /> },
  {
    key: "balance",
    header: "Balance",
    align: "right",
    mobile: "aside",
    cell: (row) => <span className="font-medium">{formatCoins(row.balance_coins)}</span>,
  },
  {
    key: "purchased",
    header: "Purchased",
    align: "right",
    cell: (row) => <span className="tabular-nums text-ink-muted">{formatCoins(row.purchased_coins)}</span>,
  },
  {
    key: "activations",
    header: "Activations",
    align: "right",
    cell: (row) => <span className="tabular-nums text-ink-muted">{formatCoins(row.activations)}</span>,
  },
  { key: "risk", header: "Risk", mobile: "aside", cell: (row) => <Risk band={row.risk_band} score={row.risk_score} /> },
  {
    key: "created",
    header: "Created",
    className: "whitespace-nowrap text-ink-muted",
    cell: (row) => formatWhen(row.created_at),
  },
  {
    key: "id",
    header: "User id",
    cell: (row) => <EntityLink type="user" id={row.user_id} />,
  },
];

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
  const onDenied = useCallback(() => setDenied(true), []);

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
         admin — render the denied screen, see AuthGate. */
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

  if (denied) return <DeniedBody />;

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Search by email fragment or by user id. Addresses are masked by the database before they reach this page."
      />

      <form onSubmit={submit} className="flex flex-wrap gap-[8px]">
        <input
          className="field min-w-0 max-w-[420px] flex-1 py-[9px] text-[14px]"
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
          busy ? (
            <SkeletonRows n={4} />
          ) : (
            <RecentSignups onDenied={onDenied} />
          )
        ) : busy ? (
          <SkeletonRows n={4} />
        ) : (
          <>
            <DataTable
              rows={rows}
              columns={COLUMNS}
              rowKey={(row) => row.user_id}
              rowHref={(row) => `/admin/users/${row.user_id}`}
              rowTone={(row) => (row.risk_band === "investigate" ? "bad" : null)}
              empty={
                <EmptyState
                  title={`Nothing matched “${ran}”.`}
                  hint="Try a shorter email fragment, or paste the full user id."
                />
              }
            />
            {rows.length ? (
              <p className="mt-[8px] text-caption text-muted">
                {rows.length} {rows.length === 1 ? "account" : "accounts"}
                {rows.length === LIMIT
                  ? ` — the limit. Narrow the query; there may be more.`
                  : ""}
              </p>
            ) : null}
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
