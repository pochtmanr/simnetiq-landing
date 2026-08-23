"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import AuthGate, { NotFoundBody } from "./AuthGate";
import {
  isAdminDenied,
  rpc,
  type AdminAuditRow,
  type MoneyHealthRow,
} from "../../../lib/admin/rpc";
import { formatCoins, formatUsd, formatWhen } from "../../../lib/admin/format";

/* ---------------------------------------------------------------------------
 * The overview screen: `admin_money_health()` as labelled figures, and
 * `admin_audit_recent()` as a reverse-chronological table.
 *
 * It is an instrument panel, not a page. No hero, no prose, no colour beyond
 * what distinguishes a figure that needs acting on from one that does not.
 * Everything here is read-only — the two RPCs it calls write nothing — so
 * there is no confirmation step and no optimistic state to keep honest.
 *
 * `"use client"` is not a preference: lib/admin/rpc.ts is a client module
 * (it reaches for the browser Supabase client, which holds the operator's
 * session in a cookie), so anything that calls it renders in the browser.
 *
 * Three failure modes, and they must stay distinct:
 *
 *   AdminDenied   -> the 404 body, alone, with nothing else on the page and
 *                    no explanation. Concealment of the route is worth more
 *                    than an operator's convenience here, and a stranger who
 *                    reached `ready` with some other Supabase account gets
 *                    exactly what an anonymous visitor gets.
 *   any other      -> an inline error with a retry. Never a blank screen and
 *   failure          never a silent swallow: resolveAdminState already turns
 *                    any auth error into `anon`, so a network blip can bounce
 *                    an operator to the sign-in screen for no visible reason.
 *                    A second silent failure on top of that would leave them
 *                    with a panel that simply shows nothing and says nothing.
 *   no rows        -> said out loud, per figure group. An empty result is a
 *                    fact about the database, not an error.
 * ------------------------------------------------------------------------ */

/** Matches the plan's `rpc.auditRecent(100)`. The RPC's own default is also
 *  100; it is stated here so the number on screen is the number in the code. */
const AUDIT_LIMIT = 100;

/* ---------------------------------------------------------------------------
 * Loading
 * ------------------------------------------------------------------------ */

type Loaded = { health: MoneyHealthRow[]; audit: AdminAuditRow[] };

type Status =
  | { phase: "loading" }
  | { phase: "ready"; data: Loaded }
  | { phase: "denied" }
  | { phase: "error"; message: string };

/** What to put in front of the operator when a call failed for a reason that
 *  is not denial. The message is shown because this screen is only ever
 *  reached by an `aal2` session — there is nobody here to keep it from. */
function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message) return reason.message;
  return "The request did not complete.";
}

/* ---------------------------------------------------------------------------
 * Figures
 * ------------------------------------------------------------------------ */

/**
 * One labelled number.
 *
 * `value` is already a string, formatted by lib/admin/format, because that is
 * the only module that gets to decide what a missing value looks like. Every
 * column below is passed through it — including the ones typed plain `number`
 * — so that a column which quietly becomes nullable in a later migration
 * renders an em dash rather than `NaN` or, worse, a confident `0`.
 */
function Figure({
  label,
  value,
  alert = false,
  note,
}: {
  label: string;
  value: string;
  alert?: boolean;
  note?: string;
}) {
  return (
    <div className="border-t border-border pt-[9px]">
      <dt className="text-caption uppercase tracking-[0.07em] text-muted">
        {label}
      </dt>
      <dd
        /* No danger token exists in the palette — this design system was drawn
           for a marketing site that never has to say "something is wrong". The
           literal is deliberate rather than a missing variable. */
        className={`mt-[2px] font-sans text-subheading tabular-nums ${
          alert ? "font-semibold text-[#a8201a]" : "text-ink"
        }`}
      >
        {value}
      </dd>
      {note ? (
        <p className="mt-[2px] text-caption text-muted">{note}</p>
      ) : null}
    </div>
  );
}

function FigureGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-[20px]">
      <h2 className="font-sans text-label font-semibold uppercase tracking-[0.07em] text-ink-muted">
        {title}
      </h2>
      <dl className="mt-[10px] grid grid-cols-2 gap-x-[20px] gap-y-[14px] sm:grid-cols-3 lg:grid-cols-6">
        {children}
      </dl>
    </section>
  );
}

/** True when a counter whose healthy value is zero is not zero.
 *  Null is *not* an alarm: it means the underlying scalar subquery found no
 *  row at all, which is a different fact and is already shown as an em dash. */
function nonZero(value: number | null): boolean {
  return value !== null && value !== 0;
}

/**
 * The money_health row.
 *
 * The three groups — alarms, money, watch — are the view's own, transcribed
 * from the column comments in lib/admin/rpc.ts rather than invented here.
 *
 * Only the alarms group and the two PII columns get the alert treatment,
 * because those are the columns whose healthy value is unambiguously zero.
 * Nothing else is highlighted: neither the plan nor the view defines a
 * threshold for "margin too low" or "too many users to investigate", and a
 * threshold this file made up would be indistinguishable on screen from one
 * the business actually agreed to.
 */
function MoneyHealth({ row }: { row: MoneyHealthRow }) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-x-[10px]">
        <h2 className="font-sans text-subheading">Money health</h2>
        <span className="text-caption text-muted">
          generated {formatWhen(row.generated_at)}
        </span>
      </div>

      <FigureGroup title="Alarms">
        <Figure
          label="Stale active activations"
          value={formatCoins(row.stale_active_activations)}
          alert={nonZero(row.stale_active_activations)}
        />
        <Figure
          label="Sweep last OK"
          value={formatCoins(row.sweep_last_ok_minutes)}
          /* Null here is not "no data" but "no successful sweep on record",
             which is the thing the column exists to catch. */
          alert={row.sweep_last_ok_minutes === null}
          note="minutes ago"
        />
        <Figure
          label="Sweep failures"
          value={formatCoins(row.sweep_failures)}
          alert={nonZero(row.sweep_failures)}
        />
        <Figure
          label="Numbers awaiting release"
          value={formatCoins(row.numbers_awaiting_release)}
          alert={nonZero(row.numbers_awaiting_release)}
        />
        <Figure
          label="Unbalanced wallets"
          value={formatCoins(row.unbalanced_wallets)}
          alert={nonZero(row.unbalanced_wallets)}
        />
        <Figure
          label="Refunds missing"
          value={formatCoins(row.refunds_missing)}
          alert={nonZero(row.refunds_missing)}
        />
      </FigureGroup>

      <FigureGroup title="Money">
        <Figure
          label="Coins outstanding"
          value={formatCoins(row.coins_outstanding)}
          note="coins"
        />
        <Figure
          label="Outstanding liability"
          value={formatUsd(row.coins_outstanding_usd)}
        />
        <Figure
          label="Coins purchased 7d"
          value={formatCoins(row.coins_purchased_7d)}
          note="coins"
        />
        <Figure label="Revenue 7d" value={formatUsd(row.revenue_usd_7d)} />
        <Figure
          label="Provider cost 7d"
          value={formatUsd(row.provider_cost_usd_7d)}
        />
        <Figure label="Margin 7d" value={formatUsd(row.margin_usd_7d)} />
        <Figure
          label="Realised multiple 7d"
          /* A bare ratio, not a coin count. formatCoins is the plain-number
             formatter in lib/admin/format; the unit lives in the note so that
             a null still renders as an unadorned em dash. */
          value={formatCoins(row.realised_multiple_7d)}
          note="× cost"
        />
      </FigureGroup>

      <FigureGroup title="Watch">
        <Figure
          label="Clawback shortfall 30d"
          value={formatCoins(row.clawback_shortfall_coins_30d)}
          note="coins"
        />
        <Figure
          label="Users to investigate"
          value={formatCoins(row.users_investigate)}
        />
        <Figure label="Users to watch" value={formatCoins(row.users_watch)} />
        <Figure
          label="Deleted with shortfall"
          value={formatCoins(row.deleted_with_shortfall)}
        />
        <Figure
          label="Activations 24h"
          value={formatCoins(row.activations_24h)}
        />
        <Figure
          label="SMS received 24h"
          value={formatCoins(row.activations_received_24h)}
        />
        <Figure
          label="Margin alerts 7d"
          value={formatCoins(row.margin_alerts_7d)}
        />
        <Figure
          label="PII purge last OK"
          value={formatCoins(row.pii_purge_last_ok_hours)}
          alert={row.pii_purge_last_ok_hours === null}
          note="hours ago"
        />
        <Figure
          label="PII rows overdue"
          value={formatCoins(row.pii_overdue_rows)}
          alert={nonZero(row.pii_overdue_rows)}
        />
      </FigureGroup>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Audit
 * ------------------------------------------------------------------------ */

/** `admin_audit_recent` already answers newest first. Sorting again is cheap
 *  and makes "reverse-chronological" a property of this component rather than
 *  a promise made by a function in another repository. `id` breaks ties
 *  because it is a bigserial: two rows written in the same millisecond still
 *  have a defined order, and the table must not shuffle between renders. */
function newestFirst(rows: AdminAuditRow[]): AdminAuditRow[] {
  return [...rows].sort((a, b) => {
    const delta = Date.parse(b.created_at) - Date.parse(a.created_at);
    if (Number.isFinite(delta) && delta !== 0) return delta;
    return b.id - a.id;
  });
}

function AuditTable({ rows }: { rows: AdminAuditRow[] }) {
  const ordered = newestFirst(rows);

  return (
    <section className="mt-[34px]">
      <div className="flex flex-wrap items-baseline gap-x-[10px]">
        <h2 className="font-sans text-subheading">Recent audit</h2>
        <span className="text-caption text-muted">
          newest first · up to {AUDIT_LIMIT} rows · showing {ordered.length}
        </span>
      </div>

      <div className="mt-[10px] overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-label">
          <thead>
            <tr className="border-b border-border text-caption uppercase tracking-[0.07em] text-muted">
              <th scope="col" className="py-[7px] pr-[14px] text-left font-medium">
                When
              </th>
              <th scope="col" className="py-[7px] pr-[14px] text-left font-medium">
                Who
              </th>
              <th scope="col" className="py-[7px] pr-[14px] text-left font-medium">
                Action
              </th>
              <th scope="col" className="py-[7px] pr-[14px] text-left font-medium">
                Subject
              </th>
              <th scope="col" className="py-[7px] text-left font-medium">
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-[14px] text-body text-ink-muted">
                  No audit rows.
                </td>
              </tr>
            ) : (
              ordered.map((entry) => (
                <tr key={entry.id} className="border-b border-border align-top">
                  <td className="whitespace-nowrap py-[7px] pr-[14px] tabular-nums text-ink-muted">
                    {formatWhen(entry.created_at)}
                  </td>
                  {/* An audit trail without "who" is a list of things that
                      happened to nobody. actor_label is never null — it names
                      the direct database session too, which is exactly the
                      case a uid cannot describe. */}
                  <td className="whitespace-nowrap py-[7px] pr-[14px] text-ink-muted">
                    {entry.actor_label}
                  </td>
                  <td className="py-[7px] pr-[14px] font-medium">
                    {entry.action}
                  </td>
                  {/* Free-form on the Postgres side — a uid, an activation id,
                      a transaction id — so it gets a monospace column wide
                      enough for a uuid and is allowed to wrap rather than
                      pushing the reason off the table. */}
                  <td className="py-[7px] pr-[14px] font-mono text-caption break-all text-ink-muted">
                    {entry.subject ?? "—"}
                  </td>
                  <td className="py-[7px] text-ink-muted">
                    {entry.reason ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

function Overview() {
  const [status, setStatus] = useState<Status>({ phase: "loading" });
  /* Bumped by the retry button. A counter rather than a boolean so that a
     second failure in a row still re-runs the effect. */
  const [attempt, setAttempt] = useState(0);

  /* The reset to `loading` belongs here rather than at the top of the effect:
     a setState in an effect body is a second render before the browser has
     painted the first, which React lints against. Doing it in the handler that
     asked for the reload gets the spinner up in the same render as the click. */
  const retry = useCallback(() => {
    setStatus({ phase: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      /* allSettled, not all: if one call is denied and the other merely fails
         on the network, the denial has to win. `all` would hand back whichever
         rejected first, and a lost connection would then render an error
         message on a route that is supposed to look like it does not exist. */
      const [health, audit] = await Promise.allSettled([
        rpc.moneyHealth(),
        rpc.auditRecent(AUDIT_LIMIT),
      ]);
      if (cancelled) return;

      if (health.status === "rejected" || audit.status === "rejected") {
        const reasons = [
          health.status === "rejected" ? health.reason : null,
          audit.status === "rejected" ? audit.reason : null,
        ];
        if (reasons.some(isAdminDenied)) {
          setStatus({ phase: "denied" });
          return;
        }
        const failure = reasons.find((reason) => reason !== null);
        /* Logged as well as shown. The inline message is one line; the console
           keeps the PostgREST `cause` that says which call broke and why. */
        console.error("Admin overview failed to load.", failure);
        setStatus({ phase: "error", message: describeFailure(failure) });
        return;
      }

      setStatus({
        phase: "ready",
        data: { health: health.value, audit: audit.value },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (status.phase === "denied") return <NotFoundBody />;

  if (status.phase === "loading") {
    return (
      <p className="text-body text-ink-muted" role="status">
        Loading…
      </p>
    );
  }

  if (status.phase === "error") {
    return (
      <div role="alert" className="max-w-[560px]">
        <h2 className="font-sans text-subheading">Could not load the overview</h2>
        <p className="mt-[6px] text-body text-ink-muted">{status.message}</p>
        <button type="button" onClick={retry} className="cta cta--sm mt-[14px]">
          Try again
        </button>
      </div>
    );
  }

  const { health, audit } = status.data;

  return (
    <>
      <div className="flex items-start justify-between gap-[16px]">
        <h1 className="font-sans text-heading-sm">Overview</h1>
        <button type="button" onClick={retry} className="cta cta--sm">
          Refresh
        </button>
      </div>

      {health.length === 0 ? (
        <p className="mt-[20px] text-body text-ink-muted">
          money_health returned no rows.
        </p>
      ) : (
        /* The view yields a single row today. Mapping costs nothing and means
           a second row appears on screen instead of being silently dropped. */
        health.map((row) => (
          <div key={row.generated_at} className="mt-[20px]">
            <MoneyHealth row={row} />
          </div>
        ))
      )}

      <AuditTable rows={audit} />
    </>
  );
}

export default function AdminOverviewPage() {
  return (
    <AuthGate>
      <Overview />
    </AuthGate>
  );
}
