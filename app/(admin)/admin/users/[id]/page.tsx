"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthGate, NotFoundBody } from "../../AuthGate";
import {
  formatCoins,
  formatUsd,
  formatWhen,
} from "../../../../../lib/admin/format";
import {
  isAdminDenied,
  rpc,
  type UserActivationsRow,
  type UserLedgerRow,
  type UserOverviewRow,
} from "../../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * One user, everything the database will say about them without a reveal.
 *
 * **This page renders `phone_masked` and nothing more.** There is no full
 * phone number and no SMS body anywhere below, and there must never be one:
 * the only path to either is `admin_reveal_sms`, which demands a written
 * reason and writes an audit row *before* it answers. That call belongs to
 * Actions.tsx, which mounts into the slot marked further down. Adding
 * the reveal wrapper to this file would produce exactly the thing the audit
 * trail is meant to make impossible — an unrecorded read.
 *
 * `admin_user_activations` cooperates with that rule: it returns `has_sms`, a
 * boolean, in place of the message. Knowing a code arrived is operations.
 * Reading it is an investigation, and investigations get logged.
 *
 * Opening this page is itself a recorded read — `admin_user_overview` returns
 * the `audit_id` it just wrote, and the header shows it back to the operator
 * so there is no pretending the lookup was invisible.
 * ------------------------------------------------------------------------ */

/* Enough to catch a truncated or mistyped id before it becomes a Postgres
   22P02 that reads like a fault in the panel. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LEDGER_LIMIT = 100;
const ACTIVATIONS_LIMIT = 100;

const NOTHING = "—";

/* ---------------------------------------------------------------------------
 * Shared cells
 * ------------------------------------------------------------------------ */

const TH =
  "px-[10px] py-[8px] text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted whitespace-nowrap";
const TD = "px-[10px] py-[8px] align-top whitespace-nowrap";
const TD_NUM = `${TD} tabular-nums`;

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-[26px]">
      <h2 className="font-sans text-subheading">{title}</h2>
      {note ? <p className="mt-[2px] text-caption text-muted">{note}</p> : null}
      <div className="mt-[10px]">{children}</div>
    </section>
  );
}

function Figure({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-caption uppercase tracking-[0.06em] text-muted">
        {label}
      </div>
      <div className="mt-[2px] text-body text-ink">{value}</div>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-label text-muted">{children}</p>;
}

function TableFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-card">
      <table className="w-full border-collapse text-label">{children}</table>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-panel">
      {children}
    </tr>
  );
}

/** A count that has to be readable at a glance but must never be invented:
 *  a null delta is a hole in the ledger, not a zero. */
function Delta({ coins }: { coins: number }) {
  const sign = coins > 0 ? "+" : "";
  return (
    <span className={coins < 0 ? "text-ink" : "text-accent-deep"}>
      {sign}
      {formatCoins(coins)}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * jsonb
 *
 * `facts` and `risk` are the interesting half of the overview — they are what
 * the risk score was computed from — and they are free-form on the Postgres
 * side, so nothing here may assume a shape. Flattening to dotted paths keeps
 * a new key the SQL starts emitting visible instead of silently dropped, which
 * a hand-written field list would do.
 * ------------------------------------------------------------------------ */

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function scalar(value: unknown): string {
  if (value === null || value === undefined) return NOTHING;
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (value === "") return NOTHING;
    /* Timestamps arrive as strings; showing them in the same UTC form as every
       other date on the page is what makes the two correlate by eye. */
    return ISO.test(value) ? formatWhen(value) : value;
  }
  return JSON.stringify(value);
}

function flatten(input: Record<string, unknown> | null): [string, string][] {
  if (!input) return [];
  const out: [string, string][] = [];
  const walk = (prefix: string, value: unknown): void => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        out.push([prefix, "{}"]);
        return;
      }
      for (const [key, next] of entries) {
        walk(prefix ? `${prefix}.${key}` : key, next);
      }
      return;
    }
    out.push([prefix, scalar(value)]);
  };
  walk("", input);
  return out;
}

function JsonBlock({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown> | null;
}) {
  const entries = flatten(value);
  return (
    <div className="rounded-card border border-border bg-card p-[14px]">
      <div className="text-caption uppercase tracking-[0.06em] text-muted">
        {title}
      </div>
      {entries.length === 0 ? (
        <p className="mt-[6px] text-label text-muted">Nothing recorded.</p>
      ) : (
        <dl className="mt-[8px] grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-[14px] gap-y-[4px] text-label">
          {entries.map(([path, text]) => (
            <div key={path} className="contents">
              <dt className="font-mono text-caption text-muted">{path}</dt>
              <dd className="break-words text-ink">{text}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Failure
 * ------------------------------------------------------------------------ */

function ErrorNote({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-card border border-border bg-card px-[16px] py-[14px]"
    >
      <p className="text-label text-ink">This record did not load.</p>
      <p className="mt-[4px] break-words text-caption text-muted">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="cta cta--sm mt-[12px]">
          Try again
        </button>
      ) : null}
      <p className="mt-[10px] text-caption text-muted">
        <Link href="/admin/users" className="blue-link">
          Back to search
        </Link>
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Overview
 * ------------------------------------------------------------------------ */

function Overview({ overview }: { overview: UserOverviewRow }) {
  return (
    <div className="rounded-card border border-border bg-card p-[16px]">
      <div className="flex flex-wrap items-baseline gap-x-[12px] gap-y-[4px]">
        <h1 className="font-sans text-heading-sm">
          {overview.email ? overview.email : "Anonymous account"}
        </h1>
        <span className="font-mono text-caption text-muted">
          {overview.user_id}
        </span>
      </div>
      <div className="mt-[14px] grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        <Figure
          label="Balance"
          value={
            <span className="tabular-nums">
              {formatCoins(overview.balance_coins)} coins
            </span>
          }
        />
        <Figure
          label="Risk"
          value={
            <span>
              {overview.risk_band}{" "}
              <span className="tabular-nums text-ink-muted">
                ({overview.risk_score})
              </span>
            </span>
          }
        />
        <Figure label="Created" value={formatWhen(overview.created_at)} />
        {/* Shown, not hidden: this page wrote that row by being opened. */}
        <Figure
          label="Audit id for this lookup"
          value={<span className="tabular-nums">{overview.audit_id}</span>}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Ledger
 * ------------------------------------------------------------------------ */

function Ledger({ rows }: { rows: UserLedgerRow[] }) {
  if (rows.length === 0) return <Empty>No wallet entries.</Empty>;
  return (
    <TableFrame>
      <thead>
        <tr className="border-b border-border">
          <th className={TH}>When</th>
          <th className={TH}>Kind</th>
          <th className={TH}>Δ coins</th>
          <th className={TH}>Balance after</th>
          <th className={TH}>Shortfall</th>
          <th className={TH}>USD</th>
          <th className={TH}>Product</th>
          <th className={TH}>RC transaction</th>
          <th className={TH}>Activation</th>
          <th className={TH}>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row key={row.id}>
            <td className={`${TD} text-ink-muted`}>{formatWhen(row.created_at)}</td>
            <td className={TD}>{row.kind}</td>
            <td className={TD_NUM}>
              <Delta coins={row.delta_coins} />
            </td>
            <td className={`${TD_NUM} text-ink-muted`}>
              {formatCoins(row.balance_after)}
            </td>
            <td className={TD_NUM}>
              {row.shortfall_coins ? formatCoins(row.shortfall_coins) : NOTHING}
            </td>
            <td className={`${TD_NUM} text-ink-muted`}>
              {row.usd_value === null ? NOTHING : formatUsd(row.usd_value)}
            </td>
            <td className={`${TD} text-ink-muted`}>{row.product_id ?? NOTHING}</td>
            <td className={`${TD} font-mono text-caption text-muted`}>
              {row.rc_transaction_id ?? NOTHING}
            </td>
            <td className={`${TD} font-mono text-caption text-muted`}>
              {row.activation_id ?? NOTHING}
            </td>
            <td
              className={`${TD} max-w-[280px] whitespace-normal break-words text-ink-muted`}
              /* The idempotency key is only ever needed when reconciling a
                 duplicate, so it rides along as a tooltip rather than a
                 tenth column nobody reads. */
              title={row.idempotency_key ?? undefined}
            >
              {row.note ?? NOTHING}
            </td>
          </Row>
        ))}
      </tbody>
    </TableFrame>
  );
}

/* ---------------------------------------------------------------------------
 * Activations
 * ------------------------------------------------------------------------ */

function Activations({ rows }: { rows: UserActivationsRow[] }) {
  if (rows.length === 0) return <Empty>No activations.</Empty>;
  return (
    <TableFrame>
      <thead>
        <tr className="border-b border-border">
          <th className={TH}>When</th>
          <th className={TH}>Status</th>
          <th className={TH}>Close reason</th>
          <th className={TH}>Service</th>
          <th className={TH}>Dial</th>
          <th className={TH}>Number (masked)</th>
          <th className={TH}>SMS</th>
          <th className={TH}>To first SMS</th>
          <th className={TH}>Coins</th>
          <th className={TH}>Provider cost</th>
          <th className={TH}>Retry</th>
          <th className={TH}>Released</th>
          <th className={TH}>Activation id</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Row key={row.id}>
            <td className={`${TD} text-ink-muted`}>{formatWhen(row.created_at)}</td>
            <td className={TD}>
              {row.status}
              {row.is_migrated ? (
                <span className="ml-[6px] text-caption text-muted">migrated</span>
              ) : null}
            </td>
            <td className={`${TD} text-ink-muted`}>{row.close_reason ?? NOTHING}</td>
            <td className={TD}>{row.service}</td>
            <td className={`${TD_NUM} text-ink-muted`}>+{row.country_dial}</td>
            {/* Masked by Postgres. Never the full number — see the file header. */}
            <td className={`${TD} font-mono text-caption`}>
              {row.phone_masked ?? NOTHING}
            </td>
            <td className={TD}>
              {row.has_sms ? (
                <span>received {formatWhen(row.sms_received_at)}</span>
              ) : (
                <span className="text-muted">none</span>
              )}
            </td>
            <td className={`${TD_NUM} text-ink-muted`}>
              {row.first_sms_seconds === null
                ? NOTHING
                : `${row.first_sms_seconds}s`}
            </td>
            <td className={TD_NUM}>{formatCoins(row.coins_spent)}</td>
            <td className={`${TD_NUM} text-ink-muted`}>
              {row.provider_cost_cents === null
                ? NOTHING
                : formatUsd(row.provider_cost_cents / 100)}
            </td>
            <td className={`${TD} text-ink-muted`}>
              {row.retry_of === null
                ? NOTHING
                : `#${row.retry_index ?? "?"} of ${row.retry_of.slice(0, 8)}`}
            </td>
            <td className={`${TD} text-ink-muted`}>{formatWhen(row.released_at)}</td>
            <td className={`${TD} font-mono text-caption text-muted`}>{row.id}</td>
          </Row>
        ))}
      </tbody>
    </TableFrame>
  );
}

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

function UserDetail({ userId }: { userId: string }) {
  const [overview, setOverview] = useState<UserOverviewRow | null>(null);
  const [ledger, setLedger] = useState<UserLedgerRow[]>([]);
  const [activations, setActivations] = useState<UserActivationsRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const valid = UUID.test(userId);
  const [busy, setBusy] = useState(valid);
  /* Bumping this re-runs the effect below. A counter rather than a callback
     because the three calls have to be fired from inside the effect: setting
     state synchronously in an effect body cascades renders, and the lint rule
     that says so is right. */
  const [nonce, setNonce] = useState(0);

  /** Re-read everything. The retry button and Task 8's `onChanged` share it,
   *  so the three tables can never disagree about which moment they describe. */
  const reload = useCallback(() => {
    setBusy(true);
    setError(null);
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    void (async () => {
      try {
        const [nextOverview, nextLedger, nextActivations] = await Promise.all([
          rpc.userOverview(userId),
          rpc.userLedger(userId, LEDGER_LIMIT),
          rpc.userActivations(userId, ACTIVATIONS_LIMIT),
        ]);
        if (cancelled) return;
        setOverview(nextOverview);
        setLedger(nextLedger);
        setActivations(nextActivations);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        /* 42501 is the only thing the database will ever say about not being
           an admin, and the only correct answer is the 404 — see AuthGate. */
        if (isAdminDenied(err)) {
          setDenied(true);
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, valid, nonce]);

  if (denied) return <NotFoundBody />;

  if (!valid) {
    return (
      <ErrorNote message={`“${userId}” is not a user id.`} />
    );
  }

  return (
    <div>
      <p className="text-caption text-muted">
        <Link href="/admin/users" className="blue-link">
          Users
        </Link>
      </p>

      <div className="mt-[10px]">
        {error ? (
          <ErrorNote message={error} onRetry={reload} />
        ) : overview === null ? (
          <Empty>{busy ? "Loading…" : "Nothing to show."}</Empty>
        ) : (
          <Overview overview={overview} />
        )}
      </div>

      {/* -------------------------------------------------------------------
        * Task 8's mount point. Drop the component in here, between the
        * overview and the ledger, and change nothing else:
        *
        *   import { Actions } from "./Actions";
        *
        *   {overview ? (
        *     <Actions
        *       userId={userId}
        *       activations={activations}
        *       onChanged={reload}
        *     />
        *   ) : null}
        *
        * `activations` is already loaded and already in scope, so the reveal
        * picker needs no second fetch of its own. `onChanged` is this page's
        * reloader, which is how a grant shows up in the balance and in the
        * ledger without a page reload.
        *
        * The revealed row must not be held here. Keep it inside Actions,
        * render it once, and let unmounting discard it — this component
        * survives navigation between tabs and would keep it alive.
        * ---------------------------------------------------------------- */}

      {overview === null ? null : (
        <>
          <Section
            title="Signals"
            note="Straight from admin_user_overview. Free-form on the Postgres side; every key it emits is shown."
          >
            <div className="grid gap-[12px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              <JsonBlock title="facts" value={overview.facts} />
              <JsonBlock title="risk" value={overview.risk} />
            </div>
          </Section>

          <Section
            title="Wallet ledger"
            note={`Newest first, up to ${LEDGER_LIMIT} entries.`}
          >
            <Ledger rows={ledger} />
          </Section>

          <Section
            title="Activations"
            note={`Numbers are masked and message bodies are not returned at all — “SMS” only says one arrived. Up to ${ACTIVATIONS_LIMIT} entries.`}
          >
            <Activations rows={activations} />
          </Section>
        </>
      )}
    </div>
  );
}

/**
 * Next 16 hands `params` to a page as a Promise, exactly as the repo's other
 * dynamic route (`app/(en)/virtual-numbers/[service]/page.tsx`) treats it. That
 * one awaits it, because it is a server component. This one cannot be: every
 * admin module is `"use client"`, so the promise is unwrapped with `use()`
 * instead.
 *
 * The prop type is written out rather than taken from `PageProps<...>` because
 * that helper is generated from the routes Next has already seen, and this
 * route is new — the generated union would have to be rebuilt before the alias
 * would typecheck. The shape is identical.
 */
export default function UserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AuthGate>
      <UserDetail userId={id} />
    </AuthGate>
  );
}
