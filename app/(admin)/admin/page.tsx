"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGate, { DeniedBody } from "./AuthGate";
import {
  isAdminDenied,
  isMigrationMissing,
  rpc,
  type ActivityKind,
  type ActivityRow,
  type AdminAuditRow,
  type MoneyHealthRow,
} from "../../../lib/admin/rpc";
import { formatCoins, formatPct, formatRelative, formatUsd, formatUsdSigned, formatWhen } from "../../../lib/admin/format";
import {
  Badge,
  EmptyState,
  PageHeader,
  RefreshButton,
  Section,
  SeverityDot,
  SkeletonRows,
  Stat,
  StatGrid,
  entityHref,
  isUuid,
  useAdminData,
  type BadgeTone,
  type Loadable,
} from "./ui";

/* ---------------------------------------------------------------------------
 * The overview: the business at a glance, then everything that happened.
 *
 * Top: the handful of numbers worth checking every morning — profit, revenue,
 * OnlineSim spend and balance, open tickets, delivery rate. Each card opens
 * the page that explains it. Then any alarm that is not zero. Then one feed of
 * everything: purchases, refunds, sign-ups, tickets, failures, admin actions —
 * every row opens the thing it is about.
 *
 * Every source loads on its own. A failed or not-yet-migrated RPC blanks its
 * own card, never the page: an operator who can't see profit should still see
 * the open tickets.
 * ------------------------------------------------------------------------ */

/** The value of a card whose load failed or whose RPC isn't deployed. */
function unavailable(s: Loadable<unknown>): string | null {
  if (s.phase === "missing") return "needs update";
  if (s.phase === "error") return "failed";
  return null;
}

/* -- Alarms -------------------------------------------------------------- */

type Alarm = { label: string; value: string; href: string; tone: "bad" | "warn"; why: string };

/** Only counters whose healthy value is zero (or a job that is overdue).
 *  Thresholds come from the view's own comments; nothing is invented here. */
function alarmsFrom(h: MoneyHealthRow): Alarm[] {
  const out: Alarm[] = [];
  const add = (cond: boolean, a: Alarm) => cond && out.push(a);
  add(h.stale_active_activations > 0, {
    label: "Stuck activations",
    value: formatCoins(h.stale_active_activations),
    href: "/admin/system",
    tone: "bad",
    why: "Still waiting past their expiry — the sweeper should have closed and refunded them.",
  });
  add(h.sweep_last_ok_minutes === null, {
    label: "Sweeper never succeeded",
    value: "—",
    href: "/admin/system",
    tone: "bad",
    why: "No successful sweep on record: expired numbers aren't being refunded.",
  });
  add((h.sweep_failures ?? 0) > 0, {
    label: "Sweep failures",
    value: formatCoins(h.sweep_failures),
    href: "/admin/system",
    tone: "bad",
    why: "Recent sweeper runs failed.",
  });
  add(h.numbers_awaiting_release > 0, {
    label: "Numbers to release",
    value: formatCoins(h.numbers_awaiting_release),
    href: "/admin/system",
    tone: "warn",
    why: "OnlineSim numbers not yet released back — they may keep costing money.",
  });
  add(h.unbalanced_wallets > 0, {
    label: "Unbalanced wallets",
    value: formatCoins(h.unbalanced_wallets),
    href: "/admin/users",
    tone: "bad",
    why: "Wallet balance doesn't match its ledger.",
  });
  add(h.refunds_missing > 0, {
    label: "Refunds missing",
    value: formatCoins(h.refunds_missing),
    href: "/admin/system",
    tone: "bad",
    why: "Failed activations whose coins were not returned.",
  });
  add(h.margin_alerts_7d > 0, {
    label: "Margin alerts 7d",
    value: formatCoins(h.margin_alerts_7d),
    href: "/admin/money",
    tone: "warn",
    why: "A service/country went below target margin; check the Money breakdown.",
  });
  add(h.users_investigate > 0, {
    label: "Users to investigate",
    value: formatCoins(h.users_investigate),
    href: "/admin/users",
    tone: "warn",
    why: "Risk scoring flagged these accounts (refund abuse, shortfalls).",
  });
  add(h.pii_overdue_rows > 0 || h.pii_purge_last_ok_hours === null, {
    label: "PII purge overdue",
    value: formatCoins(h.pii_overdue_rows),
    href: "/admin/system",
    tone: "bad",
    why: "Phone numbers/SMS kept past the retention window.",
  });
  return out;
}

function AlarmStrip({ status }: { status: Loadable<MoneyHealthRow[]> }) {
  if (status.phase !== "ready") return null;
  const row = status.data[0];
  if (!row) return null;
  const alarms = alarmsFrom(row);
  if (alarms.length === 0) {
    return (
      <p className="mt-[12px] flex items-center gap-[8px] rounded-card border border-border bg-card px-[14px] py-[10px] text-label text-ink-muted">
        <SeverityDot severity="good" /> No alarms. Sweeper, refunds, wallets and PII purge all look healthy
        <span className="text-caption text-muted">· checked {formatRelative(row.generated_at)}</span>
      </p>
    );
  }
  return (
    <div className="mt-[12px] grid gap-[8px] sm:grid-cols-2 lg:grid-cols-3">
      {alarms.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          className={`flex items-start gap-[10px] rounded-card border px-[12px] py-[10px] ${
            a.tone === "bad" ? "border-bad/30 bg-bad-soft" : "border-warn/30 bg-warn-soft"
          }`}
        >
          <span className={`text-subheading font-semibold tabular-nums ${a.tone === "bad" ? "text-bad" : "text-warn"}`}>{a.value}</span>
          <span className="min-w-0">
            <span className="block text-label font-semibold">{a.label}</span>
            <span className="block text-caption text-ink-muted">{a.why}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

/* -- Activity feed ------------------------------------------------------- */

const FILTERS: { key: string; label: string; kinds: ActivityKind[] | null }[] = [
  { key: "all", label: "Everything", kinds: null },
  { key: "money", label: "Money", kinds: ["purchase", "refund", "refund_reversed"] },
  { key: "signup", label: "Sign-ups", kinds: ["signup"] },
  { key: "support", label: "Support", kinds: ["support"] },
  { key: "problems", label: "Problems", kinds: ["failure", "alert"] },
  { key: "admin", label: "Admin actions", kinds: ["admin"] },
];

const KIND: Record<ActivityKind, { label: string; tone: BadgeTone }> = {
  purchase: { label: "Purchase", tone: "good" },
  refund: { label: "Refund", tone: "bad" },
  refund_reversed: { label: "Refund reversed", tone: "info" },
  signup: { label: "Sign-up", tone: "info" },
  support: { label: "Ticket", tone: "warn" },
  failure: { label: "Failure", tone: "bad" },
  alert: { label: "Alert", tone: "warn" },
  admin: { label: "Admin", tone: "neutral" },
};

function feedHref(r: ActivityRow): string | null {
  if (r.entity_type === "system") return "/admin/system";
  return entityHref(r.entity_type, r.entity_id) ?? entityHref("user", r.user_id);
}

function FeedItem({ r }: { r: ActivityRow }) {
  const href = feedHref(r);
  const k = KIND[r.kind] ?? { label: r.kind, tone: "neutral" as const };
  const body = (
    <>
      <span className="mt-[6px]">
        <SeverityDot severity={r.severity === "crit" ? "bad" : r.severity === "warn" ? "warn" : r.kind === "purchase" ? "good" : "info"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-[8px] gap-y-[2px]">
          <Badge tone={k.tone}>{k.label}</Badge>
          <span className="text-body font-medium">{r.title}</span>
        </span>
        {r.detail ? <span className="mt-[2px] block break-words text-label text-ink-muted [overflow-wrap:anywhere]">{r.detail}</span> : null}
        <span className="mt-[2px] block text-caption text-muted" title={formatWhen(r.at)}>
          {formatRelative(r.at)}
        </span>
      </span>
      {r.amount_usd !== null ? (
        <span className={`shrink-0 text-body font-semibold tabular-nums ${r.amount_usd < 0 ? "text-bad" : "text-good"}`}>
          {formatUsdSigned(r.amount_usd)}
        </span>
      ) : null}
      {href ? (
        <span className="shrink-0 self-center text-muted" aria-hidden>
          ›
        </span>
      ) : null}
    </>
  );
  const cls = "flex items-start gap-[10px] px-[14px] py-[11px]";
  return (
    <li className="border-b border-border last:border-b-0">
      {href ? (
        <Link href={href} className={`${cls} hover:bg-canvas active:bg-panel`}>
          {body}
        </Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  );
}

/* Before the migration there is no feed RPC; the audit log is the next best
   thing, with subjects linked where the action says what they are. */
function auditToActivity(a: AdminAuditRow): ActivityRow {
  const entity =
    a.action === "user_open" || a.action === "grant_coins"
      ? "user"
      : a.action === "sms_reveal"
        ? "activation"
        : a.action.startsWith("support")
          ? "support"
          : a.action.startsWith("provider_topup")
            ? "topup"
            : null;
  return {
    at: a.created_at,
    kind: "admin",
    entity_type: (entity ?? "system") as ActivityRow["entity_type"],
    entity_id: entity && (entity === "topup" || isUuid(a.subject)) ? a.subject : null,
    user_id: null,
    title: `${a.actor_label}: ${a.action.replaceAll("_", " ")}`,
    detail: a.reason,
    amount_usd: null,
    severity: "info",
  };
}

const PAGE = 40;

function ActivityFeed({ tick }: { tick: number }) {
  const [filter, setFilter] = useState("all");
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [phase, setPhase] = useState<"loading" | "ready" | "error" | "denied">("loading");
  const [fallback, setFallback] = useState(false);
  const [more, setMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kinds = FILTERS.find((f) => f.key === filter)?.kinds ?? null;

  function choose(key: string) {
    if (key === filter) return;
    setPhase("loading");
    setRows([]);
    setFilter(key);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const page = await rpc.activityFeed({ limit: PAGE, kinds });
        if (cancelled) return;
        setFallback(false);
        setRows(page);
        setMore(page.length === PAGE);
        setPhase("ready");
      } catch (err) {
        if (cancelled) return;
        if (isAdminDenied(err)) return setPhase("denied");
        if (isMigrationMissing(err)) {
          try {
            const audit = await rpc.auditRecent(100);
            if (cancelled) return;
            setFallback(true);
            setRows(audit.map(auditToActivity));
            setMore(false);
            setPhase("ready");
            return;
          } catch (e2) {
            err = e2;
          }
        }
        setError(err instanceof Error ? err.message : "The request did not complete.");
        setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // kinds derives from filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, tick]);

  async function loadOlder() {
    const last = rows[rows.length - 1];
    if (!last) return;
    setLoadingMore(true);
    try {
      const page = await rpc.activityFeed({ limit: PAGE, before: last.at, kinds });
      setRows((r) => [...r, ...page]);
      setMore(page.length === PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load older items.");
    } finally {
      setLoadingMore(false);
    }
  }

  if (phase === "denied") return <DeniedBody />;

  return (
    <Section
      title="Activity"
      note={fallback ? "Admin audit only — apply the money migration for the full feed" : "Everything, newest first · tap a row to open it"}
    >
      {!fallback ? (
        <div className="-mx-[16px] mb-[10px] flex gap-[6px] overflow-x-auto px-[16px] pb-[2px] md:mx-0 md:flex-wrap md:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => choose(f.key)}
              className={`shrink-0 rounded-pill border px-[12px] py-[5px] text-label ${
                filter === f.key ? "border-transparent bg-ink text-white" : "border-border bg-card text-ink-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      ) : null}
      {phase === "loading" ? (
        <SkeletonRows n={8} />
      ) : phase === "error" ? (
        <p role="alert" className="text-body text-bad">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <EmptyState title="Nothing happened here in the last 30 days" />
      ) : (
        <>
          <ul className="overflow-hidden rounded-card border border-border bg-card">
            {rows.map((r, i) => (
              <FeedItem key={`${r.at}-${r.kind}-${r.entity_id}-${i}`} r={r} />
            ))}
          </ul>
          {more ? (
            <div className="mt-[10px] text-center">
              <button type="button" onClick={loadOlder} disabled={loadingMore} className="rounded-[8px] border border-border bg-card px-[14px] py-[7px] text-label text-ink-muted">
                {loadingMore ? "Loading…" : "Load older"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </Section>
  );
}

/* -- Screen -------------------------------------------------------------- */

function OverviewScreen() {
  const [tick, setTick] = useState(0);
  const key = String(tick);
  const today = useAdminData(() => rpc.moneySummary(24), key);
  const week = useAdminData(() => rpc.moneySummary(168), key);
  const health = useAdminData(() => rpc.moneyHealth(), key);
  const digest = useAdminData(() => rpc.opsDigest(24), key);
  const tickets = useAdminData(() => rpc.supportList(null, 200), key);

  if ([today, week, health, digest, tickets].some((s) => s.status.phase === "denied")) return <DeniedBody />;

  const t = today.status.phase === "ready" ? today.status.data : null;
  const w = week.status.phase === "ready" ? week.status.data : null;
  const d = digest.status.phase === "ready" ? digest.status.data : null;
  const openTickets = tickets.status.phase === "ready" ? tickets.status.data.filter((r) => r.status !== "resolved") : null;
  const staleTickets = openTickets?.filter((r) => r.stale).length ?? 0;
  const lowBalance = w?.balance_now !== null && w?.balance_now !== undefined && w.balance_now < 20;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="How the business is doing today, and everything that just happened."
        actions={<RefreshButton onClick={() => setTick((n) => n + 1)} busy={today.status.phase === "loading"} />}
      />

      <StatGrid>
        <Stat
          label="Profit today"
          loading={today.status.phase === "loading"}
          value={unavailable(today.status) ?? formatUsdSigned(t?.gross_profit)}
          tone={t ? (t.gross_profit < 0 ? "bad" : "good") : "neutral"}
          sub={t ? `${formatUsd(t.earned)} earned · ${formatUsd(t.recorded_cost)} cost` : undefined}
          href="/admin/money"
          help="Last 24 hours: revenue on numbers that got an SMS, minus what OnlineSim charged for them."
        />
        <Stat
          label="Profit 7 days"
          loading={week.status.phase === "loading"}
          value={unavailable(week.status) ?? formatUsdSigned(w?.gross_profit)}
          tone={w ? (w.gross_profit < 0 ? "bad" : "good") : "neutral"}
          sub={w?.margin_pct !== null && w ? `${formatPct(w.margin_pct)} margin` : undefined}
          href="/admin/money"
          help="Same as today, over the last 7 days. Margin = profit ÷ revenue earned."
        />
        <Stat
          label="Cash in 7 days"
          loading={week.status.phase === "loading"}
          value={unavailable(week.status) ?? formatUsd(w?.cash_net)}
          sub={w ? `${formatCoins(w.purchases)} purchases · ${formatUsd(w.gross)} gross` : undefined}
          href="/admin/purchases"
          help="What customers paid after Apple's commission and refunds. Includes coins they haven't used yet."
        />
        <Stat
          label="OnlineSim spend 7 days"
          loading={week.status.phase === "loading"}
          value={unavailable(week.status) ?? formatUsd(w?.real_spend ?? w?.recorded_cost)}
          sub={w ? (w.real_spend === null ? "recorded prices (no balance data)" : `recorded ${formatUsd(w.recorded_cost)}`) : undefined}
          href="/admin/money"
          help="The real drop in your OnlineSim balance (top-ups added back). Below it: the sum of list prices recorded per number."
        />
        <Stat
          label="OnlineSim balance"
          loading={week.status.phase === "loading"}
          value={unavailable(week.status) ?? formatUsd(w?.balance_now)}
          tone={lowBalance ? "bad" : "neutral"}
          sub={w?.balance_as_of ? `${w.frozen_now ? `${formatUsd(w.frozen_now)} frozen · ` : ""}${formatRelative(w.balance_as_of)}` : undefined}
          href="/admin/money#topups"
          help="Money left on the OnlineSim account. Frozen = held for numbers still waiting for an SMS. Top up before it runs out, then log the top-up."
        />
        <Stat
          label="Open tickets"
          loading={tickets.status.phase === "loading"}
          value={unavailable(tickets.status) ?? formatCoins(openTickets?.length)}
          tone={staleTickets > 0 ? "warn" : "neutral"}
          sub={staleTickets > 0 ? `${staleTickets} waiting over 24h` : openTickets ? "none overdue" : undefined}
          href="/admin/support"
          help="Support requests not yet resolved (latest 200)."
        />
        <Stat
          label="Delivery 24h"
          loading={digest.status.phase === "loading"}
          value={unavailable(digest.status) ?? formatPct(d?.success_pct, 0)}
          tone={d?.success_pct !== null && d?.success_pct !== undefined && d.success_pct < 60 ? "bad" : "neutral"}
          sub={d ? `${formatCoins(d.delivered)} of ${formatCoins(d.issued)} numbers got an SMS` : undefined}
          href="/admin/delivery"
          help="Share of numbers issued in the last 24h that received a code."
        />
        <Stat
          label="New users 24h"
          loading={digest.status.phase === "loading"}
          value={unavailable(digest.status) ?? formatCoins(d?.signups)}
          sub={d ? `${formatCoins(d.first_purchases)} first purchases` : undefined}
          href="/admin/users"
          help="Accounts created in the last 24 hours, and how many bought coins for the first time."
        />
      </StatGrid>

      <AlarmStrip status={health.status} />

      <ActivityFeed tick={tick} />
    </>
  );
}

export default function OverviewPage() {
  return (
    <AuthGate>
      <OverviewScreen />
    </AuthGate>
  );
}
