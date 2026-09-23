"use client";

import { useCallback, useEffect, useState } from "react";
import AuthGate, { DeniedBody } from "../AuthGate";
import { StatusSelect } from "./StatusSelect";
import { formatWhen } from "../../../../lib/admin/format";
import {
  isAdminDenied,
  rpc,
  type SupportRow,
  type SupportStatus,
} from "../../../../lib/admin/rpc";
import {
  Badge,
  DataTable,
  EmptyState,
  EntityLink,
  PageHeader,
  RefreshButton,
  SkeletonRows,
  StatusBadge,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * The support inbox.
 *
 * Every row on this page is text a stranger typed into a public form. That one
 * fact drives most of the decisions below:
 *
 *   - Nothing is ever rendered as markup. React escapes `{value}`, and there
 *     is no dangerouslySetInnerHTML anywhere in this file. There must never
 *     be: a support message is the single most obvious injection surface the
 *     panel has, and the operator reading it is the one account that matters.
 *   - Nothing submitted is allowed to decide the layout. Long messages, a
 *     4,000-character word with no spaces, a pasted stack trace — each is
 *     contained by the message cell rather than being allowed to widen the
 *     list or push the status control off-screen. See the message column.
 *   - Nothing submitted is trusted to be a known value. `SupportRow.status` is
 *     typed `string`, not `SupportStatus`, because the type is a mirror of a
 *     CHECK constraint in another repository rather than a guarantee. The
 *     status control copes with a value it has never heard of instead of
 *     silently showing the wrong one.
 *
 * The whole screen is one client component because lib/admin/rpc.ts is a
 * `"use client"` module — the browser calls Postgres directly with the anon
 * key and the operator's own aal2 session, and there is no server route to
 * render this from.
 * ------------------------------------------------------------------------ */

/** `null` is "every status" — `admin_support_list(p_status => null)`. */
type Filter = SupportStatus | null;

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: null, label: "All" },
  { value: "new", label: "New" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

/* ---------------------------------------------------------------------------
 * Columns
 * ------------------------------------------------------------------------ */

function columns(
  setRowStatus: (id: string, status: string) => void,
  onDenied: () => void,
): Column<SupportRow>[] {
  return [
    {
      key: "from",
      header: "From",
      mobile: "title",
      className: "min-w-[150px] max-w-[220px] break-words [overflow-wrap:anywhere]",
      /* Plain text, not links: on a phone this cell sits inside the card's
         own link to the ticket, and an anchor inside an anchor is invalid. */
      cell: (row) => (
        <div>
          <div className="text-ink">{row.name || "(no name)"}</div>
          <div className="text-caption font-normal text-muted">{row.email}</div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      mobile: "title",
      className: "min-w-[240px]",
      /* Two lines and no more: the full text lives on the ticket page. The
         clamp is what keeps one 20,000-character message from burying the
         rest of the inbox, and `overflow-wrap: anywhere` is load-bearing —
         `break-words` alone will not break one unbroken pasted token wider
         than its column, and that token would widen the whole table. */
      cell: (row) => (
        <p className="line-clamp-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-label text-ink">
          {row.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      mobile: "aside",
      cell: (row) => (
        <div className="flex flex-col items-start gap-[4px] max-md:items-end">
          <StatusBadge status={row.status} />
          {row.stale ? <Badge tone="bad">waiting over 24h</Badge> : null}
        </div>
      ),
    },
    {
      key: "topic",
      header: "Topic / locale",
      className: "max-w-[180px] break-words [overflow-wrap:anywhere]",
      cell: (row) => (
        <div>
          <div className="text-ink">{row.topic || "—"}</div>
          <div className="mt-[2px] text-caption text-muted">{row.locale}</div>
        </div>
      ),
    },
    {
      key: "when",
      header: "When",
      className: "whitespace-nowrap tabular-nums text-ink-muted",
      cell: (row) => formatWhen(row.created_at),
    },
    {
      key: "replies",
      header: "Replies",
      cell: (row) =>
        row.reply_count ? (
          <span>
            {row.reply_count}
            {row.last_reply_at ? (
              <span className="block text-caption text-muted">last {formatWhen(row.last_reply_at)}</span>
            ) : null}
          </span>
        ) : (
          <span className="text-muted">none yet</span>
        ),
    },
    {
      key: "contact",
      header: "Contact",
      className: "whitespace-nowrap",
      cell: (row) => (
        <div className="flex flex-col gap-[2px]">
          <a
            href={`mailto:${encodeURIComponent(row.email)}`}
            className="text-accent-deep hover:underline"
          >
            Email
          </a>
          {row.user_id ? (
            <EntityLink type="user" id={row.user_id}>
              Open account
            </EntityLink>
          ) : (
            <span className="text-caption text-muted">no account</span>
          )}
        </div>
      ),
    },
    {
      key: "set",
      header: "Set status",
      cell: (row) => (
        <StatusSelect
          id={row.id}
          status={row.status}
          onChange={(status) => setRowStatus(row.id, status)}
          onDenied={onDenied}
        />
      ),
    },
  ];
}

/* ---------------------------------------------------------------------------
 * The inbox
 * ------------------------------------------------------------------------ */

/* What the screen is currently asking the database for. `nonce` rises on every
   filter change *and* on every Refresh, so it doubles as the identity of the
   in-flight request: a response is only interesting if its nonce still matches
   the one being asked for. Without that, switching filter twice quickly can
   leave the slower first response painting rows that do not match the selected
   filter, which looks exactly like a broken filter. */
type Query = { filter: Filter; nonce: number };

function Inbox() {
  const [request, setRequest] = useState<Query>({ filter: null, nonce: 0 });
  const [rows, setRows] = useState<SupportRow[]>([]);
  /* The nonce whose rows are the ones in `rows`. */
  const [loadedNonce, setLoadedNonce] = useState<number | null>(null);
  const [failure, setFailure] = useState<{
    nonce: number;
    message: string;
  } | null>(null);
  const [denied, setDenied] = useState(false);

  const filter = request.filter;
  /* Derived rather than stored. "Loading" is precisely "what is on screen is
     not what was asked for", and computing it says so instead of relying on
     every code path remembering to set a flag — the failure mode of a stored
     phase is a spinner that never clears, or worse, an empty table shown as
     if it were a result. It also keeps the effect below free of any
     synchronous setState, which React 19 flags as a cascading render. */
  const failed = failure !== null && failure.nonce === request.nonce;
  const loading = !failed && loadedNonce !== request.nonce;

  const reload = () => setRequest((r) => ({ ...r, nonce: r.nonce + 1 }));
  const onDenied = useCallback(() => setDenied(true), []);

  /* StatusSelect owns the write and its revert; the inbox only mirrors
     whatever it reports so the badge follows the select. */
  const setRowStatus = useCallback(
    (id: string, status: string) =>
      setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row))),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await rpc.supportList(request.filter);
        if (cancelled) return;
        setRows(data);
        setLoadedNonce(request.nonce);
      } catch (err) {
        if (cancelled) return;
        if (isAdminDenied(err)) {
          setDenied(true);
          return;
        }
        setFailure({
          nonce: request.nonce,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [request]);

  /* Denial replaces the whole screen — see AuthGate's DeniedBody. */
  if (denied) return <DeniedBody />;

  return (
    <section>
      <PageHeader
        title="Support"
        subtitle={
          loading || failed
            ? "Requests sent through the contact form. Open one to read it in full and reply."
            : `${rows.length} ${rows.length === 1 ? "request" : "requests"} · open one to read it in full and reply.`
        }
        actions={<RefreshButton onClick={reload} busy={loading} />}
      />

      <div className="flex flex-wrap gap-[6px]">
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() =>
                setRequest((r) => ({ filter: f.value, nonce: r.nonce + 1 }))
              }
              aria-pressed={active}
              className={`rounded-[8px] border px-[12px] py-[6px] text-label ${
                active
                  ? "border-transparent bg-panel-strong text-accent-deep"
                  : "border-border bg-card text-ink-muted"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-[18px]">
        {loading ? (
          <SkeletonRows n={5} />
        ) : failed ? (
          /* An ordinary failure — offline, a network blip, a genuine bug. It
             gets the message and a retry, unlike a denial, because there is
             nothing to conceal from someone who has already reached this
             screen with an aal2 session. */
          <div className="rounded-card border border-border bg-card p-[16px]">
            <p role="alert" className="text-body text-ink">
              Could not load support requests.
            </p>
            <p className="mt-[4px] break-words [overflow-wrap:anywhere] text-caption text-muted">
              {failure?.message}
            </p>
            <button
              type="button"
              onClick={reload}
              className="cta cta--sm mt-[12px]"
            >
              Try again
            </button>
          </div>
        ) : (
          <DataTable
            rows={rows}
            columns={columns(setRowStatus, onDenied)}
            rowKey={(row) => row.id}
            rowHref={(row) => `/admin/support/${row.id}`}
            rowTone={(row) => (row.stale ? "warn" : null)}
            /* The empty state says which query was empty, and says the query
               succeeded. An operator who cannot tell "nothing matched" from
               "this page is broken" will go looking for a bug that is not
               there. */
            empty={
              <EmptyState
                title={
                  filter === null
                    ? "No support requests have been submitted."
                    : `No support requests with status “${filter}”.`
                }
                hint={
                  <>
                    The inbox loaded successfully — this is an empty result, not
                    an error.
                    {filter === null
                      ? ""
                      : " Choose All to see requests in other statuses."}
                  </>
                }
              />
            }
          />
        )}
      </div>
    </section>
  );
}

export default function SupportPage() {
  return (
    <AuthGate>
      <Inbox />
    </AuthGate>
  );
}
