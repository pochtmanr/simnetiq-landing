"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { AuthGate, DeniedBody } from "../../AuthGate";
import { Actions } from "./Actions";
import { DangerZone } from "./DangerZone";
import {
  Card,
  comboHref,
  DataTable,
  EmptyState,
  EntityLink,
  entityHref,
  Facts,
  isUuid,
  PageHeader,
  RefreshButton,
  RiskBadge,
  Section,
  ShortId,
  SkeletonRows,
  SkeletonStats,
  StatusBadge,
  type Column,
} from "../../ui";
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

const LEDGER_LIMIT = 100;
const ACTIVATIONS_LIMIT = 100;

const NOTHING = "—";

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
    <Card title={<span className="font-mono">{title}</span>}>
      {entries.length === 0 ? (
        <p className="text-label text-muted">Nothing recorded.</p>
      ) : (
        <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-[14px] gap-y-[4px] text-label">
          {entries.map(([path, text]) => (
            <div key={path} className="contents">
              <dt className="break-all font-mono text-caption text-muted">{path}</dt>
              <dd className="break-words text-ink [overflow-wrap:anywhere]">{text}</dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
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
    <Card>
      <Facts
        items={[
          {
            label: "Balance",
            value: <span className="text-subheading font-semibold tabular-nums">{formatCoins(overview.balance_coins)} coins</span>,
          },
          {
            label: "Risk",
            value: (
              <span className="inline-flex items-center gap-[6px]">
                <RiskBadge band={overview.risk_band} />
                <span className="tabular-nums text-ink-muted">score {overview.risk_score}</span>
              </span>
            ),
          },
          { label: "Created", value: formatWhen(overview.created_at) },
          /* Shown, not hidden: this page wrote that row by being opened. */
          { label: "Audit id for this lookup", value: <span className="font-mono tabular-nums">{overview.audit_id}</span> },
          { label: "User id", value: <ShortId id={overview.user_id} />, wide: true },
        ]}
      />
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Ledger
 *
 * Ten columns on a desktop; on a phone the kind and delta head a card and the
 * rest fold into label/value pairs. The idempotency key is only ever needed
 * when reconciling a duplicate, so it rides along as a tooltip on the note.
 * ------------------------------------------------------------------------ */

const LEDGER_COLUMNS: Column<UserLedgerRow>[] = [
  { key: "kind", header: "Kind", mobile: "title", cell: (r) => <StatusBadge status={r.kind} /> },
  {
    key: "when",
    header: "When",
    mobile: "title",
    cell: (r) => <span className="whitespace-nowrap text-ink-muted">{formatWhen(r.created_at)}</span>,
  },
  {
    key: "delta",
    header: "Δ coins",
    align: "right",
    mobile: "aside",
    cell: (r) => <Delta coins={r.delta_coins} />,
  },
  {
    key: "after",
    header: "Balance after",
    align: "right",
    cell: (r) => <span className="text-ink-muted">{formatCoins(r.balance_after)}</span>,
  },
  {
    key: "shortfall",
    header: "Shortfall",
    align: "right",
    cell: (r) => (r.shortfall_coins ? <span className="text-bad">{formatCoins(r.shortfall_coins)}</span> : NOTHING),
  },
  {
    key: "usd",
    header: "USD",
    align: "right",
    cell: (r) => <span className="text-ink-muted">{r.usd_value === null ? NOTHING : formatUsd(r.usd_value)}</span>,
  },
  { key: "product", header: "Product", cell: (r) => <span className="text-ink-muted">{r.product_id ?? NOTHING}</span> },
  {
    key: "txn",
    header: "RC transaction",
    cell: (r) => (r.rc_transaction_id ? <EntityLink type="purchase" id={r.rc_transaction_id} /> : NOTHING),
  },
  {
    key: "activation",
    header: "Activation",
    cell: (r) => (r.activation_id ? <EntityLink type="activation" id={r.activation_id} /> : NOTHING),
  },
  {
    key: "note",
    header: "Note",
    className: "max-w-[280px]",
    cell: (r) => (
      <span className="break-words text-ink-muted" title={r.idempotency_key ?? undefined}>
        {r.note ?? NOTHING}
      </span>
    ),
  },
];

/** A ledger row opens the thing it moved coins for, when there is one. */
function ledgerHref(r: UserLedgerRow): string | null {
  return entityHref("activation", r.activation_id) ?? entityHref("purchase", r.rc_transaction_id);
}

/* ---------------------------------------------------------------------------
 * Activations
 *
 * Numbers are masked by Postgres. Never the full number — see the file header.
 * ------------------------------------------------------------------------ */

const ACTIVATION_COLUMNS: Column<UserActivationsRow>[] = [
  {
    key: "combo",
    header: "Service",
    mobile: "title",
    linksItself: true,
    cell: (r) => {
      const href = comboHref(r.service, r.country_dial);
      const text = `${r.service} +${r.country_dial}`;
      return href ? (
        <Link href={href} className="font-medium text-accent-deep hover:underline">
          {text}
        </Link>
      ) : (
        text
      );
    },
  },
  {
    key: "when",
    header: "When",
    mobile: "title",
    cell: (r) => <span className="whitespace-nowrap text-ink-muted">{formatWhen(r.created_at)}</span>,
  },
  {
    key: "status",
    header: "Status",
    mobile: "aside",
    cell: (r) => (
      <span className="inline-flex flex-wrap items-center justify-end gap-[4px]">
        <StatusBadge status={r.status} />
        {r.is_migrated ? <span className="text-caption text-muted">migrated</span> : null}
      </span>
    ),
  },
  {
    key: "coins",
    header: "Coins",
    align: "right",
    mobile: "aside",
    cell: (r) => <span className="tabular-nums">{formatCoins(r.coins_spent)}</span>,
  },
  { key: "reason", header: "Close reason", cell: (r) => <span className="text-ink-muted">{r.close_reason ?? NOTHING}</span> },
  {
    key: "number",
    header: "Number",
    cell: (r) => <span className="font-mono text-caption">{r.phone_masked ?? NOTHING}</span>,
  },
  {
    key: "sms",
    header: "SMS",
    cell: (r) =>
      r.has_sms ? (
        <span className="whitespace-nowrap">
          received{r.first_sms_seconds === null ? "" : ` in ${r.first_sms_seconds}s`}
        </span>
      ) : (
        <span className="text-muted">none</span>
      ),
  },
  {
    key: "cost",
    header: "Provider cost",
    align: "right",
    cell: (r) => (
      <span className="text-ink-muted">
        {r.provider_cost_cents === null ? NOTHING : formatUsd(r.provider_cost_cents / 100)}
      </span>
    ),
  },
  {
    key: "retry",
    header: "Retry",
    cell: (r) =>
      r.retry_of === null ? (
        NOTHING
      ) : (
        <span className="whitespace-nowrap">
          #{r.retry_index ?? "?"} of <EntityLink type="activation" id={r.retry_of} />
        </span>
      ),
  },
  { key: "released", header: "Released", cell: (r) => <span className="text-ink-muted">{formatWhen(r.released_at)}</span> },
  { key: "id", header: "Activation", cell: (r) => <EntityLink type="activation" id={r.id} /> },
];

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

function UserDetail({ userId }: { userId: string }) {
  const [overview, setOverview] = useState<UserOverviewRow | null>(null);
  const [ledger, setLedger] = useState<UserLedgerRow[]>([]);
  const [activations, setActivations] = useState<UserActivationsRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const valid = isUuid(userId);
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
           an admin — render the denied screen, see AuthGate. */
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

  if (denied) return <DeniedBody />;

  if (!valid) {
    return (
      <ErrorNote message={`“${userId}” is not a user id.`} />
    );
  }

  return (
    <div>
      <PageHeader
        crumbs={[{ href: "/admin/users", label: "Users" }]}
        title={overview ? overview.email || "Anonymous account" : "User"}
        subtitle={overview ? <span className="break-all font-mono text-caption">{overview.user_id}</span> : undefined}
        actions={<RefreshButton onClick={reload} busy={busy} />}
      />

      {error ? (
        <ErrorNote message={error} onRetry={reload} />
      ) : overview === null ? (
        busy ? (
          <>
            <SkeletonStats n={4} />
            <div className="mt-[30px]">
              <SkeletonRows />
            </div>
          </>
        ) : (
          <EmptyState title="Nothing to show" />
        )
      ) : (
        <Overview overview={overview} />
      )}

      {/* -------------------------------------------------------------------
        * Grant coins and reveal SMS, between the overview and the ledger.
        *
        * `activations` is already loaded and already in scope, so the reveal
        * picker needs no fetch of its own. `onChanged` is this page's own
        * reloader, which is how a grant shows up in the balance above and in
        * the ledger below without a page reload.
        *
        * The revealed row is NOT held here, and must never be: this component
        * survives navigation between users inside the panel and would keep a
        * full phone number and a message body alive past the reveal that was
        * logged for them. Actions.tsx keeps it in its own state and lets
        * unmounting discard it.
        * ---------------------------------------------------------------- */}
      {overview ? (
        <Actions userId={userId} activations={activations} onChanged={reload} />
      ) : null}

      {overview === null ? null : (
        <>
          <Section
            title="Signals"
            note="Straight from admin_user_overview. Free-form on the Postgres side; every key it emits is shown."
          >
            <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
              <JsonBlock title="facts" value={overview.facts} />
              <JsonBlock title="risk" value={overview.risk} />
            </div>
          </Section>

          <Section
            title="Wallet ledger"
            note={`Newest first, up to ${LEDGER_LIMIT} entries.`}
          >
            <DataTable
              rows={ledger}
              columns={LEDGER_COLUMNS}
              rowKey={(r) => String(r.id)}
              rowHref={ledgerHref}
              rowTone={(r) => (r.shortfall_coins > 0 || r.kind === "clawback" ? "warn" : null)}
              empty={<EmptyState title="No wallet entries" />}
            />
          </Section>

          <Section
            title="Activations"
            note={`Numbers are masked and message bodies are not returned at all — “SMS” only says one arrived. Up to ${ACTIVATIONS_LIMIT} entries.`}
          >
            <DataTable
              rows={activations}
              columns={ACTIVATION_COLUMNS}
              rowKey={(r) => r.id}
              rowHref={(r) => entityHref("activation", r.id)}
              empty={<EmptyState title="No activations" />}
            />
          </Section>

          {/* Last on the page, and keyed by user for the same reason as
              Actions: a half-typed confirmation must never carry over to a
              different account. */}
          <DangerZone key={`danger:${userId}`} userId={userId} hasEmail={Boolean(overview.email)} />
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
