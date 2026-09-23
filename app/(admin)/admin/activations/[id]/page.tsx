"use client";

import Link from "next/link";
import { use, type ReactNode } from "react";
import { AuthGate } from "../../AuthGate";
import { RevealSms } from "../../components/RevealSms";
import {
  Badge,
  Card,
  comboHref,
  EmptyState,
  EntityLink,
  entityHref,
  Facts,
  isUuid,
  Loaded,
  PageHeader,
  RefreshButton,
  ShortId,
  shortId,
  SkeletonRows,
  SkeletonStats,
  SourceLine,
  StatusBadge,
  useAdminData,
} from "../../ui";
import {
  formatCoins,
  formatDial,
  formatRelative,
  formatUsd,
  formatUsdSigned,
  formatWhen,
} from "../../../../../lib/admin/format";
import { rpc, type ActivationDetail } from "../../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * One activation: what it cost, what it earned, and what happened to it.
 *
 * Like the user page, this renders `phone_masked` and `has_sms` only. The full
 * number and the message body stay behind `admin_reveal_sms`, which logs the
 * read first; the bound <RevealSms> at the bottom is the only way to them.
 *
 * The money fields come from `money_activation_rows` — the same function the
 * P&L sums — so the number on this page is exactly the one the Money page
 * counted for this row. The Money card spells the arithmetic out rather than
 * printing a lone "profit", because the first question about any odd profit
 * figure is "which rate, and whose cost?".
 * ------------------------------------------------------------------------ */

const NOTHING = "—";

/** $/coin needs four decimals: $0.06 hides the difference between the
 *  default rate and a buyer who paid $0.0569 through a discount pack. */
function formatRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || !Number.isFinite(Number(rate))) return NOTHING;
  return `$${Number(rate).toFixed(4)}`;
}

/** callRow throws a plain Error on an empty result. An unknown id is a "not
 *  found" page, not a red error box, so that one case is turned into null. */
async function loadDetail(id: string): Promise<ActivationDetail | null> {
  if (!isUuid(id)) return null;
  try {
    return await rpc.activationDetail(id);
  } catch (err) {
    if (err instanceof Error && /returned no row/.test(err.message)) return null;
    throw err;
  }
}

/* ---------------------------------------------------------------------------
 * Money
 * ------------------------------------------------------------------------ */

function Line({ label, value, note, strong = false, tone }: { label: ReactNode; value: ReactNode; note?: ReactNode; strong?: boolean; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : "text-ink";
  return (
    <div className={`flex items-start justify-between gap-[12px] py-[7px] ${strong ? "border-t border-border" : ""}`}>
      <div className="min-w-0">
        <div className={strong ? "font-semibold" : ""}>{label}</div>
        {note ? <div className="mt-[1px] text-caption text-muted">{note}</div> : null}
      </div>
      <div className={`shrink-0 text-right tabular-nums ${strong ? "font-semibold" : ""} ${color}`}>{value}</div>
    </div>
  );
}

function MoneyCard({ d }: { d: ActivationDetail }) {
  if (d.is_migrated) {
    return (
      <Card title="Money">
        <p className="text-label text-ink-muted">
          Imported history from before this backend. It was never sold here, so the P&amp;L leaves it out and there is no
          revenue or cost to show.
        </p>
      </Card>
    );
  }

  if (!d.charged) {
    const inFlight = d.status === "pending" || d.status === "waiting";
    return (
      <Card title="Money" note="Revenue $0.00 · cost $0.00 · profit $0.00">
        {inFlight ? (
          <p className="text-label text-ink-muted">
            Still waiting for an SMS. The {formatCoins(d.coins_spent)} coins are held, not earned: if a message arrives the
            activation becomes charged and counts as revenue; if it expires or is cancelled they go back to the user.
          </p>
        ) : (
          <p className="text-label text-ink-muted">
            <span className="font-semibold text-ink">Not charged.</span> No SMS was delivered, so the{" "}
            {formatCoins(d.coins_spent)} coins were refunded to the user and OnlineSim does not bill for a number that is
            released without a message. Nothing was earned and nothing was spent.
          </p>
        )}
        <SourceLine>
          Charged means status received or completed. Refunds are in the timeline below as ledger rows.
        </SourceLine>
      </Card>
    );
  }

  const profit = d.profit_usd === null ? null : Number(d.profit_usd);
  return (
    <Card title="Money" note="How this activation's profit is worked out">
      <div className="text-label">
        <Line
          label={<>Coins charged</>}
          value={formatCoins(d.coins_net)}
          note={
            d.coins_net !== d.coins_spent
              ? `Spent ${formatCoins(d.coins_spent)} minus any refund on this activation.`
              : "Spend minus refunds for this activation."
          }
        />
        <Line
          label={
            <span className="flex flex-wrap items-center gap-[6px]">
              × value per coin
              {d.rate_source === "user" ? <Badge tone="good">user&apos;s own rate</Badge> : <Badge tone="warn">default rate</Badge>}
            </span>
          }
          value={formatRate(d.rate)}
          note={
            d.rate_source === "user"
              ? "What this user actually paid per coin, after Apple's cut, averaged over all their real (non-sandbox) purchases."
              : "This user has never bought coins for real money (only granted or sandbox coins), so the configured default net $/coin is used. Treat the revenue as an estimate."
          }
        />
        <Line label="= Revenue" value={formatUsd(d.revenue_usd)} strong />
        <Line
          label="− OnlineSim cost"
          value={formatUsd(d.cost_usd)}
          note={
            d.cost_known === false
              ? "No price was recorded for this number, so the cost counts as $0 — the profit below is overstated."
              : "OnlineSim's catalog price recorded when the number was bought — not a figure from their invoice. Real spend is reconciled from balance snapshots on the Money page."
          }
        />
        <Line
          label="= Profit"
          value={formatUsdSigned(profit)}
          strong
          tone={profit === null ? undefined : profit < 0 ? "bad" : "good"}
        />
      </div>
      <SourceLine>
        Source: money_activation_rows — the same numbers the P&amp;L adds up.{" "}
        <Link href="/admin/money" className="text-accent-deep hover:underline">
          Money page →
        </Link>
      </SourceLine>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Timeline
 *
 * One list merged from four sources — the row's own timestamps, its wallet
 * ledger, ops events naming it and admin actions on it — because the question
 * is always "what happened, in what order", and answering it from four
 * separate tables means doing the merge in your head.
 * ------------------------------------------------------------------------ */

type Tone = "info" | "good" | "warn" | "bad" | "muted";
type Moment = { at: string; key: string; title: ReactNode; detail?: ReactNode; tone: Tone; source: string };

const DOT: Record<Tone, string> = {
  info: "bg-accent",
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
  muted: "bg-muted",
};

/** A short `key: value · key: value` summary of an ops event payload. */
function payloadSummary(p: Record<string, unknown> | null | undefined): string | null {
  if (!p) return null;
  const parts = Object.entries(p)
    .filter(([k, v]) => k !== "activation_id" && v !== null && v !== undefined && typeof v !== "object")
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${String(v)}`);
  return parts.length ? parts.join(" · ") : null;
}

function buildTimeline(d: ActivationDetail): Moment[] {
  const out: Moment[] = [];
  out.push({ at: d.created_at, key: "created", title: "Number ordered", detail: `${formatCoins(d.coins_spent)} coins held`, tone: "info", source: "activation" });
  if (d.sms_received_at) {
    out.push({
      at: d.sms_received_at,
      key: "sms",
      title: "SMS received",
      detail: d.first_sms_seconds !== null ? `${d.first_sms_seconds}s after ordering` : undefined,
      tone: "good",
      source: "activation",
    });
  }
  if (d.released_at) {
    out.push({ at: d.released_at, key: "released", title: "Number released at OnlineSim", tone: "muted", source: "provider" });
  } else if (d.release_due_at) {
    out.push({
      at: d.release_due_at,
      key: "release-due",
      title: "Release due",
      detail: d.release_last_error ? `Last error: ${d.release_last_error}` : undefined,
      tone: d.release_last_error ? "warn" : "muted",
      source: "provider",
    });
  }
  if (d.expires_at && !d.sms_received_at) {
    const past = new Date(d.expires_at).getTime() <= Date.now();
    out.push({ at: d.expires_at, key: "expires", title: past ? "Expiry time" : "Expires", tone: "muted", source: "activation" });
  }
  for (const l of d.ledger ?? []) {
    const sign = l.delta_coins > 0 ? "+" : "";
    out.push({
      at: l.created_at,
      key: `ledger-${l.id}`,
      title: (
        <span className="inline-flex flex-wrap items-center gap-[6px]">
          <StatusBadge status={l.kind} />
          <span className="tabular-nums">
            {sign}
            {formatCoins(l.delta_coins)} coins
          </span>
        </span>
      ),
      detail: `Balance after: ${formatCoins(l.balance_after)}${l.note ? ` · ${l.note}` : ""}`,
      tone: l.kind === "refund" ? "warn" : "info",
      source: "ledger",
    });
  }
  for (const e of d.events ?? []) {
    out.push({
      at: e.created_at,
      key: `event-${e.id}`,
      title: <span className="font-mono text-label">{e.kind}</span>,
      detail: payloadSummary(e.payload) ?? undefined,
      tone: e.severity === "crit" ? "bad" : e.severity === "warn" ? "warn" : "info",
      source: "ops event",
    });
  }
  for (const a of d.audit ?? []) {
    out.push({
      at: a.created_at,
      key: `audit-${a.id}`,
      title: (
        <span>
          <span className="font-mono text-label">{a.action}</span> by {a.actor_label}
        </span>
      ),
      detail: a.reason ?? undefined,
      tone: "muted",
      source: "admin audit",
    });
  }
  // Stable for equal timestamps: the push order above is the causal order.
  return out
    .map((m, i) => ({ m, i, t: new Date(m.at).getTime() }))
    .sort((a, b) => a.t - b.t || a.i - b.i)
    .map((x) => x.m);
}

function Timeline({ d }: { d: ActivationDetail }) {
  const items = buildTimeline(d);
  return (
    <Card title="Timeline" note="Timestamps, wallet ledger, ops events and admin actions, oldest first">
      <ol className="relative ml-[5px] border-l border-border">
        {items.map((m) => (
          <li key={m.key} className="relative pb-[14px] pl-[16px] last:pb-0">
            <span className={`absolute left-[-5px] top-[6px] h-[9px] w-[9px] rounded-full ring-2 ring-card ${DOT[m.tone]}`} aria-hidden />
            <div className="flex flex-wrap items-baseline justify-between gap-x-[10px]">
              <div className="min-w-0 text-body">{m.title}</div>
              <time dateTime={m.at} title={formatWhen(m.at)} className="shrink-0 text-caption text-muted tabular-nums">
                {formatWhen(m.at).slice(5, 19)}
              </time>
            </div>
            {m.detail ? (
              <div className="mt-[1px] break-words text-caption text-ink-muted [overflow-wrap:anywhere]">{m.detail}</div>
            ) : null}
            <div className="text-caption text-muted">{m.source}</div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Retry chain
 * ------------------------------------------------------------------------ */

function RetryChain({ d }: { d: ActivationDetail }) {
  const chain = d.retry_chain ?? [];
  if (chain.length <= 1) return null;
  return (
    <Card title="Retry chain" note={`${chain.length} attempts for the same order, oldest first`} pad={false}>
      <ol className="divide-y divide-border">
        {chain.map((c, i) => {
          const here = c.id === d.id;
          return (
            <li key={c.id} className={`flex flex-wrap items-center justify-between gap-[8px] px-[16px] py-[10px] ${here ? "bg-panel" : ""}`}>
              <div className="flex min-w-0 items-center gap-[8px]">
                <span className="w-[22px] shrink-0 text-caption text-muted tabular-nums">#{c.retry_index ?? i}</span>
                {here ? (
                  <span className="font-mono text-label font-semibold" title={c.id}>
                    {shortId(c.id)} (this one)
                  </span>
                ) : (
                  <EntityLink type="activation" id={c.id} />
                )}
                <StatusBadge status={c.status} />
              </div>
              <div className="text-caption text-muted">
                {c.close_reason ? `${c.close_reason} · ` : ""}
                {formatRelative(c.created_at)}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------ */

function Detail({ d }: { d: ActivationDetail }) {
  const country = d.country_name ?? formatDial(d.country_dial);
  const combo = comboHref(d.service, d.country_dial);

  const release = d.released_at
    ? `Released ${formatWhen(d.released_at)}`
    : d.release_due_at
      ? `Due ${formatWhen(d.release_due_at)}${d.release_attempts ? ` · ${d.release_attempts} attempts` : ""}`
      : NOTHING;

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <MoneyCard d={d} />
        <Card title="Details">
          <Facts
            items={[
              { label: "User", value: <EntityLink type="user" id={d.user_id}>{d.email_masked ?? shortId(d.user_id)}</EntityLink>, wide: true },
              {
                label: "Service · country",
                value: combo ? (
                  <Link href={combo} className="text-accent-deep hover:underline">
                    {d.service} · {country}
                  </Link>
                ) : (
                  `${d.service} · ${country}`
                ),
                wide: true,
              },
              { label: "Created", value: formatWhen(d.created_at) },
              { label: "Close reason", value: d.close_reason ?? NOTHING },
              { label: "First SMS", value: d.first_sms_seconds !== null ? `${d.first_sms_seconds}s` : NOTHING },
              { label: "Provider", value: d.provider ?? NOTHING },
              { label: "tzid", value: <ShortId id={d.tzid} /> },
              {
                label: "Quote",
                value:
                  d.quote_id
                    ? `${formatCoins(d.quote_coins)} coins · cost ${d.quote_cost_cents !== null ? formatUsd(d.quote_cost_cents / 100) : NOTHING}`
                    : NOTHING,
              },
              { label: "Release", value: release, wide: true },
              ...(d.release_last_error ? [{ label: "Release error", value: d.release_last_error, wide: true }] : []),
              { label: "Hidden by user", value: d.hidden_by_user ? "yes" : "no" },
              { label: "Activation id", value: <ShortId id={d.id} /> },
            ]}
          />
        </Card>
      </div>
      <RetryChain d={d} />
      <Timeline d={d} />
      {/* Keyed by id so a navigation between activations unmounts any revealed
          number instead of carrying it onto the next record. */}
      <RevealSms key={d.id} activationId={d.id} hasSms={d.has_sms} />
    </div>
  );
}

function ActivationScreen({ id }: { id: string }) {
  const { status, retry } = useAdminData(() => loadDetail(id), id);
  const d = status.phase === "ready" ? status.data : null;

  return (
    <div>
      <PageHeader
        crumbs={[
          { href: "/admin/users", label: "Users" },
          ...(d ? [{ href: entityHref("user", d.user_id) ?? "/admin/users", label: d.email_masked ?? shortId(d.user_id) }] : []),
        ]}
        title={d ? `${d.service} · ${d.country_name ?? formatDial(d.country_dial)}` : "Activation"}
        subtitle={
          d ? (
            <span className="inline-flex flex-wrap items-center gap-[8px]">
              <StatusBadge status={d.status} />
              <span className="font-mono">{d.phone_masked ?? NOTHING}</span>
              {d.has_sms ? <Badge tone="good">SMS arrived</Badge> : null}
              {d.is_migrated ? <Badge>imported</Badge> : null}
              {d.charged ? <Badge tone="info">charged</Badge> : null}
              <span className="text-muted">{formatRelative(d.created_at)}</span>
            </span>
          ) : (
            <span className="font-mono">{shortId(id)}</span>
          )
        }
        actions={<RefreshButton onClick={retry} busy={status.phase === "loading"} />}
      />
      <Loaded
        status={status}
        retry={retry}
        title="Could not load this activation"
        skeleton={
          <div className="flex flex-col gap-[14px]">
            <SkeletonStats n={4} />
            <SkeletonRows n={5} />
          </div>
        }
      >
        {(data) =>
          data ? (
            <Detail d={data} />
          ) : (
            <EmptyState
              title="No such activation"
              hint="The id is not a valid activation, or the row no longer exists."
              action={
                <Link href="/admin/users" className="text-label text-accent-deep hover:underline">
                  Find the user instead →
                </Link>
              }
            />
          )
        }
      </Loaded>
    </div>
  );
}

/** Same shape as users/[id]: Next 16 hands a client page `params` as a
 *  Promise, unwrapped with use() (see node_modules/next/dist/docs, dynamic
 *  routes). */
export default function ActivationRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGate>
      <ActivationScreen id={id} />
    </AuthGate>
  );
}
