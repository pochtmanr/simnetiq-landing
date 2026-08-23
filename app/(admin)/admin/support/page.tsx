"use client";

import { useEffect, useState } from "react";
import AuthGate, { NotFoundBody } from "../AuthGate";
import { formatWhen } from "../../../../lib/admin/format";
import {
  isAdminDenied,
  rpc,
  type SupportRow,
  type SupportStatus,
} from "../../../../lib/admin/rpc";

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
 *     table or push the status control off-screen. See `Message` below.
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

/* The three values `admin_support_set_status` accepts, in workflow order.
   Mirrors `SupportStatus` in lib/admin/rpc.ts; if that union gains a member,
   this array is the other half of the change. */
const STATUSES: readonly SupportStatus[] = ["new", "open", "resolved"];

/** `null` is "every status" — `admin_support_list(p_status => null)`. */
type Filter = SupportStatus | null;

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: null, label: "All" },
  { value: "new", label: "New" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
];

/* ---------------------------------------------------------------------------
 * Message body
 * ------------------------------------------------------------------------ */

/* Long enough that a collapsed message is worth collapsing, short enough that
   an ordinary two-paragraph enquiry is never truncated. Compared against the
   raw string rather than measured, so the first paint is already correct and
   the control does not appear and disappear on resize. */
const LONG_MESSAGE = 420;

/**
 * A support message, as plain text and nothing else.
 *
 * `whitespace-pre-wrap` keeps the sender's own line breaks, which is most of
 * what makes a pasted error report readable. `overflow-wrap: anywhere` is the
 * load-bearing one: `break-words` alone will not break a single unbroken token
 * that is wider than its column, so without it one pasted base64 blob widens
 * the table and the whole page scrolls sideways for every other row too.
 *
 * Height is capped when collapsed so that one 20,000-character message cannot
 * bury the rest of the inbox below it.
 */
function Message({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > LONG_MESSAGE;

  return (
    <div>
      <div
        className={`whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-body text-ink ${
          long && !open ? "max-h-[7.5rem] overflow-hidden" : ""
        }`}
      >
        {text}
      </div>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-[6px] text-caption text-muted underline underline-offset-2"
        >
          {open ? "Show less" : `Show all (${text.length} characters)`}
        </button>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Status control
 * ------------------------------------------------------------------------ */

/**
 * A plain `<select>`, deliberately.
 *
 * Three buttons per row would be faster to click and would also mean three
 * more chances to click the wrong one in a dense table. A select cannot be
 * mis-hit, shows the current value without a legend, and is the control an
 * operator already knows.
 *
 * `current` is whatever the database said, which is not necessarily a
 * `SupportStatus`. An unknown value is added to the list rather than dropped,
 * because a select whose value matches no option renders as blank — the
 * operator would see an empty box and no clue that the row has a status at all.
 */
function StatusSelect({
  current,
  disabled,
  onChange,
}: {
  current: string;
  disabled: boolean;
  onChange: (next: SupportStatus) => void;
}) {
  const known = (STATUSES as readonly string[]).includes(current);

  return (
    <select
      className="w-full rounded-[8px] border border-border bg-card px-[8px] py-[5px] text-label text-ink outline-none disabled:opacity-50"
      value={current}
      disabled={disabled}
      aria-label="Status"
      onChange={(e) => {
        const next = e.target.value;
        /* Narrowing rather than casting: the extra option below is not a
           valid argument to the RPC, so it must not be sendable. */
        if ((STATUSES as readonly string[]).includes(next)) {
          onChange(next as SupportStatus);
        }
      }}
    >
      {known ? null : (
        <option value={current} disabled>
          {current || "(no status)"}
        </option>
      )}
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
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
  /* Per-row, keyed by request id: which rows have a status write in flight,
     and which one failed. Two rows can be changed at once, so neither can be
     a single scalar. */
  const [saving, setSaving] = useState<Record<string, true>>({});
  const [saveError, setSaveError] = useState<{ id: string; message: string } | null>(
    null,
  );

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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await rpc.supportList(request.filter);
        if (cancelled) return;
        setRows(data);
        setSaveError(null);
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

  /**
   * Optimistic status change.
   *
   * The new status is painted immediately and put back if Postgres refuses.
   * Optimism is safe here precisely because the write is cheap and the revert
   * is exact: `previous` is read before the paint, so the row returns to the
   * value it actually had rather than to a guess.
   *
   * `admin_support_set_status` answers a bare bigint — the audit id — not the
   * updated row, so there is nothing to reconcile against on success. The
   * optimistic value *is* the result, which is also why a failure has to be
   * visible: nothing else would ever contradict it.
   *
   * `previous` is read from the render closure rather than from inside a
   * setRows updater. An updater that also captured a value would be an impure
   * one, and React calls those twice in development — the second call would
   * read the already-optimistic value, and the revert would then restore the
   * status the row was being changed *to*.
   */
  async function setStatus(id: string, next: SupportStatus) {
    const previous = rows.find((row) => row.id === id)?.status;
    if (previous === undefined || previous === next) return;

    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status: next } : row)),
    );
    setSaveError(null);
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      await rpc.supportSetStatus(id, next);
    } catch (err) {
      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, status: previous } : row,
        ),
      );
      if (isAdminDenied(err)) {
        setDenied(true);
        return;
      }
      setSaveError({
        id,
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving((s) => {
        const rest = { ...s };
        delete rest[id];
        return rest;
      });
    }
  }

  /* Denial is the 404 and nothing else — no heading, no filter bar, no
     explanation. Anything else on the page would confirm the route exists,
     which is the one fact concealment is protecting. */
  if (denied) return <NotFoundBody />;

  return (
    <section>
      <header className="flex flex-wrap items-baseline gap-x-[16px] gap-y-[6px]">
        <h1 className="text-heading-sm font-semibold">Support</h1>
        <span className="text-caption text-muted">
          {loading || failed
            ? ""
            : `${rows.length} ${rows.length === 1 ? "request" : "requests"}`}
        </span>
        <button
          type="button"
          onClick={reload}
          className="ml-auto text-label text-muted underline underline-offset-2"
        >
          Refresh
        </button>
      </header>

      <div className="mt-[14px] flex flex-wrap gap-[6px]">
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
          <p className="py-[28px] text-body text-ink-muted">Loading…</p>
        ) : failed ? (
          /* An ordinary failure — offline, a network blip, a genuine bug. It
             gets the message and a retry, unlike a denial, because there is
             nothing to conceal from someone who has already reached this
             screen with an aal2 session. */
          <div className="rounded-[10px] border border-border bg-card p-[16px]">
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
        ) : rows.length === 0 ? (
          /* The empty state says which query was empty, and says the query
             succeeded. An operator who cannot tell "nothing matched" from
             "this page is broken" will go looking for a bug that is not
             there — and this inbox has genuinely never had a submission, so
             this is the branch that actually renders in production today. */
          <div className="rounded-[10px] border border-border bg-card p-[20px]">
            <p className="text-body text-ink">
              {filter === null
                ? "No support requests have been submitted."
                : `No support requests with status “${filter}”.`}
            </p>
            <p className="mt-[6px] text-caption text-muted">
              The inbox loaded successfully — this is an empty result, not an
              error.
              {filter === null
                ? ""
                : " Choose All to see requests in other statuses."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] border border-border bg-card">
            <table className="w-full table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[190px]" />
                <col className="w-[230px]" />
                <col className="w-[170px]" />
                <col />
                <col className="w-[140px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-caption uppercase tracking-[0.06em] text-muted">
                  <th className="px-[12px] py-[9px] font-medium">When</th>
                  <th className="px-[12px] py-[9px] font-medium">From</th>
                  <th className="px-[12px] py-[9px] font-medium">Topic / locale</th>
                  <th className="px-[12px] py-[9px] font-medium">Message</th>
                  <th className="px-[12px] py-[9px] font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border align-top last:border-b-0"
                  >
                    <td className="px-[12px] py-[10px] text-label tabular-nums text-ink-muted">
                      {formatWhen(row.created_at)}
                    </td>
                    <td className="px-[12px] py-[10px] break-words [overflow-wrap:anywhere]">
                      <div className="text-label text-ink">{row.name}</div>
                      <div className="text-caption text-muted">{row.email}</div>
                    </td>
                    <td className="px-[12px] py-[10px] break-words [overflow-wrap:anywhere] text-label text-ink">
                      <div>{row.topic}</div>
                      <div className="mt-[2px] text-caption text-muted">
                        {row.locale}
                      </div>
                    </td>
                    <td className="px-[12px] py-[10px]">
                      <Message text={row.message} />
                    </td>
                    <td className="px-[12px] py-[10px]">
                      <StatusSelect
                        current={row.status}
                        disabled={saving[row.id] === true}
                        onChange={(next) => void setStatus(row.id, next)}
                      />
                      {saving[row.id] ? (
                        <p className="mt-[4px] text-caption text-muted">
                          Saving…
                        </p>
                      ) : null}
                      {saveError && saveError.id === row.id ? (
                        <p
                          role="alert"
                          /* An explicit red rather than a design token: the
                             marketing palette has no danger colour, and the
                             one failure on this page that the operator must
                             not scroll past is a status change that silently
                             did not happen. */
                          className="mt-[4px] break-words [overflow-wrap:anywhere] text-caption text-[#a32b20]"
                        >
                          Not saved — reverted. {saveError.message}
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
