"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AuthGate, { DeniedBody } from "../AuthGate";
import {
  Card,
  comboHref,
  DataTable,
  EmptyState,
  entityHref,
  isUuid,
  LoadError,
  PageHeader,
  RefreshButton,
  Section,
  SkeletonRows,
  SkeletonStats,
  Stat,
  StatGrid,
  type Column,
} from "../ui";
import { LineChart } from "../components/Charts";
import {
  isAdminDenied,
  rpc,
  type DeliveryComboRow,
  type DeliveryStatsRow,
  type OpsDigest,
  type OpsEventRow,
  type ProviderBalanceRow,
} from "../../../../lib/admin/rpc";
import { formatCoins, formatUsd, formatWhen } from "../../../../lib/admin/format";

/* ---------------------------------------------------------------------------
 * Delivery: is the product actually handing out SMS codes?
 *
 * Reads six admin RPCs from sms-expo's 20260839000000_ops_monitoring.sql. The
 * KPI figures come from admin_ops_digest — the same SQL the Telegram digests
 * post — so this page and the ops group never disagree about a window.
 *
 * Same three failure modes as the overview (see ../page.tsx): denial renders
 * the denied screen alone, any other failure is an inline error with a retry, and
 * an empty result is said out loud.
 *
 * Refreshes every 60s while the tab is visible. A background refresh that
 * fails keeps the last good data on screen and says it is stale, rather than
 * replacing a working dashboard with an error.
 * ------------------------------------------------------------------------ */

const WINDOW_HOURS = 168;
const REFRESH_MS = 60_000;
const FAILURE_LIMIT = 50;

type Loaded = {
  day: OpsDigest;
  week: OpsDigest;
  stats: DeliveryStatsRow[];
  combos: DeliveryComboRow[];
  balance: ProviderBalanceRow[];
  failures: OpsEventRow[];
  loadedAt: number;
};

type Status =
  | { phase: "loading" }
  | { phase: "ready"; data: Loaded; stale?: string }
  | { phase: "denied" }
  | { phase: "error"; message: string };

function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message) return reason.message;
  return "The request did not complete.";
}

function pct(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : `${v}%`;
}

function dial(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : `+${v}`;
}

function secs(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : `${v}s`;
}

/* The operator's own warn threshold lives in the edge function's env; this is
   only a colour cue and deliberately matches its default. */
const BALANCE_WARN_USD = 20;
const SUCCESS_WARN_PCT = 70;

const lowSuccess = (v: number | null) => v !== null && v < SUCCESS_WARN_PCT;

function Kpis({ day, week }: { day: OpsDigest; week: OpsDigest }) {
  return (
    <StatGrid>
      <Stat
        label="Success 24h"
        value={pct(day.success_pct)}
        tone={lowSuccess(day.success_pct) ? "bad" : "neutral"}
        sub={`${day.delivered} of ${day.issued} issued`}
        help={`Numbers that received an SMS ÷ numbers issued. Purchases where no number was issued (provider or claim failures) are not in the denominator. Red below ${SUCCESS_WARN_PCT}%.`}
        source="admin_ops_digest — the same SQL as the Telegram digest."
      />
      <Stat
        label="Success 7d"
        value={pct(week.success_pct)}
        tone={lowSuccess(week.success_pct) ? "bad" : "neutral"}
        sub={`${week.delivered} of ${week.issued} issued`}
        help="The same rate over the last 7 days — smooths out a bad hour."
      />
      <Stat
        label="Purchases 24h"
        value={formatCoins(day.purchases)}
        sub={`7d ${formatCoins(week.purchases)}`}
        help="Number purchases (activations started) in the app, whether or not a number was issued."
      />
      <Stat
        label="Provider failed 24h"
        value={formatCoins(day.provider_failed)}
        tone={day.provider_failed > 0 ? "bad" : "neutral"}
        sub={`7d ${formatCoins(week.provider_failed)}`}
        help="OnlineSim refused to hand out a number (no stock, error, low balance). The user was refunded."
      />
      <Stat
        label="Expired 24h"
        value={formatCoins(day.expired)}
        sub={`7d ${formatCoins(week.expired)}`}
        help="A number was issued but no SMS arrived before it timed out. The user was refunded."
      />
      <Stat
        label="Median to SMS"
        value={secs(day.median_sms_seconds)}
        sub={`7d ${secs(week.median_sms_seconds)}`}
        help="Half of delivered codes arrived faster than this, counted from when the number was issued."
      />
      <Stat
        label="Net revenue 24h"
        value={formatUsd(day.revenue_usd)}
        sub={`7d ${formatUsd(week.revenue_usd)}`}
        href="/admin/money"
        help="In-app purchase money after Apple's cut, minus store refunds. Sandbox excluded."
      />
      <Stat
        label="OnlineSim balance"
        value={formatUsd(day.balance_usd)}
        tone={day.balance_usd !== null && day.balance_usd < BALANCE_WARN_USD ? "bad" : "neutral"}
        sub={day.balance_burn_24h === null ? formatWhen(day.balance_at) : `24h burn ${formatUsd(day.balance_burn_24h)}`}
        href="/admin/money"
        help={`What is left on the OnlineSim account. Red below $${BALANCE_WARN_USD}. Burn is the drop over 24h; a top-up in that window makes it look smaller.`}
        source="provider_balance_log, snapshotted every 15 minutes."
      />
    </StatGrid>
  );
}

/** The rest of the digest: what did not deliver, and the money side. */
function MoreKpis({ day, week }: { day: OpsDigest; week: OpsDigest }) {
  return (
    <StatGrid>
      <Stat
        label="Claim failed 24h"
        value={formatCoins(day.claim_failed)}
        tone={day.claim_failed > 0 ? "bad" : "neutral"}
        sub={`7d ${formatCoins(week.claim_failed)}`}
        help="OnlineSim took the order but we could not record the number. Usually a bug on our side — look at the failures below."
      />
      <Stat
        label="Cancelled 24h"
        value={formatCoins(day.cancelled)}
        sub={`7d ${formatCoins(week.cancelled)}`}
        help="The user gave the number back before an SMS came."
      />
      <Stat label="In flight" value={formatCoins(day.in_flight)} sub="waiting for an SMS now" />
      <Stat
        label="IAP 24h"
        value={formatCoins(day.iap_count)}
        sub={`7d ${formatCoins(week.iap_count)}`}
        href="/admin/purchases"
        help="Coin packs bought in the App Store."
      />
      <Stat
        label="Store refunds 24h"
        value={formatCoins(day.store_refunds)}
        tone={day.store_refunds > 0 ? "bad" : "neutral"}
        sub={`7d ${formatCoins(week.store_refunds)}`}
        href="/admin/purchases"
        help="Refunds Apple granted on coin packs."
      />
      <Stat
        label="Coins earned 24h"
        value={formatCoins(day.coins_spent)}
        sub={`7d ${formatCoins(week.coins_spent)}`}
        help="Coins users spent on numbers that were not refunded."
      />
      <Stat label="Sign-ups 24h" value={formatCoins(day.signups)} sub={`7d ${formatCoins(week.signups)}`} />
      <Stat
        label="Anon installs 24h"
        value={formatCoins(day.anon_installs)}
        sub={`7d ${formatCoins(week.anon_installs)}`}
        help="New anonymous sessions — app opens that have not signed up yet."
      />
    </StatGrid>
  );
}

type Failing = OpsDigest["top_failing"][number];

const FAILING_COLUMNS: Column<Failing>[] = [
  {
    key: "combo",
    header: "Service",
    mobile: "title",
    cell: (r) => <span className="font-medium">{r.service}</span>,
  },
  { key: "country", header: "Country", mobile: "title", cell: (r) => <span className="tabular-nums text-ink-muted">{dial(r.country_dial)}</span> },
  { key: "failures", header: "Failures", align: "right", mobile: "aside", cell: (r) => <span className="text-bad">{formatCoins(r.failures)}</span> },
  { key: "reason", header: "Usual reason", cell: (r) => <span className="text-ink-muted">{r.reason ?? "—"}</span> },
];

const COMBO_COLUMNS: Column<DeliveryComboRow>[] = [
  { key: "service", header: "Service", mobile: "title", cell: (r) => <span className="font-medium">{r.service}</span> },
  { key: "country", header: "Country", mobile: "title", cell: (r) => <span className="tabular-nums text-ink-muted">{dial(r.country_dial)}</span> },
  {
    key: "success",
    header: "Success",
    align: "right",
    mobile: "aside",
    cell: (r) => <span className={lowSuccess(r.success_pct) ? "font-semibold text-bad" : ""}>{pct(r.success_pct)}</span>,
  },
  { key: "attempts", header: "Attempts", align: "right", cell: (r) => formatCoins(r.attempts) },
  { key: "delivered", header: "Delivered", align: "right", cell: (r) => formatCoins(r.delivered) },
  { key: "median", header: "Median SMS", align: "right", cell: (r) => <span className="text-ink-muted">{secs(r.median_sms_seconds)}</span> },
  { key: "fail", header: "Top failure", cell: (r) => <span className="text-ink-muted">{r.top_fail_reason ?? "—"}</span> },
];

/* 20260845000000_admin_money.sql adds a top-level `activation_id` column to
   admin_recent_failures (it strips the id out of `detail`). Before that
   migration is applied the column is absent, so `detail` stays the fallback. */
function failureActivationId(r: OpsEventRow): string | null {
  const direct = r.activation_id;
  const fromDetail = r.detail?.activation_id;
  const id = typeof direct === "string" ? direct : typeof fromDetail === "string" ? fromDetail : null;
  return isUuid(id) ? id : null;
}

function telegramState(r: OpsEventRow): string {
  if (r.sent_at) return r.send_error ? `gave up: ${r.send_error}` : "sent";
  return r.send_error ? `retrying: ${r.send_error}` : "queued";
}

const FAILURE_COLUMNS: Column<OpsEventRow>[] = [
  {
    key: "event",
    header: "Event",
    mobile: "title",
    cell: (r) => (
      <span className={r.severity === "crit" ? "font-semibold text-bad" : "font-medium"}>
        {r.close_reason ?? r.kind.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    key: "service",
    header: "Service",
    mobile: "title",
    cell: (r) => {
      const href = comboHref(r.service, r.country_dial);
      const text = `${r.service ?? "—"} ${r.country_dial !== null ? dial(r.country_dial) : ""}`;
      return href ? (
        <Link href={href} className="text-accent-deep hover:underline">
          {text}
        </Link>
      ) : (
        <span className="text-ink-muted">{text}</span>
      );
    },
  },
  {
    key: "when",
    header: "When",
    mobile: "aside",
    cell: (r) => <span className="whitespace-nowrap text-caption tabular-nums text-ink-muted">{formatWhen(r.created_at)}</span>,
  },
  { key: "number", header: "Number", cell: (r) => <span className="font-mono text-caption text-ink-muted">{r.phone_masked ?? "—"}</span> },
  { key: "after", header: "After", align: "right", cell: (r) => <span className="text-ink-muted">{secs(r.seconds)}</span> },
  { key: "telegram", header: "Telegram", cell: (r) => <span className="text-caption text-ink-muted">{telegramState(r)}</span> },
];

/* ---------------------------------------------------------------------------
 * The screen
 * ------------------------------------------------------------------------ */

async function load(): Promise<Loaded | { denied: true } | { error: unknown }> {
  const results = await Promise.allSettled([
    rpc.opsDigest(24),
    rpc.opsDigest(WINDOW_HOURS),
    rpc.deliveryStats(WINDOW_HOURS),
    rpc.deliveryByCombo(WINDOW_HOURS),
    rpc.providerBalance(WINDOW_HOURS),
    rpc.recentFailures(FAILURE_LIMIT),
  ] as const);
  const reasons = results.flatMap((r) => (r.status === "rejected" ? [r.reason] : []));
  if (reasons.some(isAdminDenied)) return { denied: true };
  if (reasons.length) return { error: reasons[0] };
  const [day, week, stats, combos, balance, failures] = results.map(
    (r) => (r as PromiseFulfilledResult<unknown>).value,
  );
  return {
    day: day as OpsDigest,
    week: week as OpsDigest,
    stats: stats as DeliveryStatsRow[],
    combos: combos as DeliveryComboRow[],
    balance: balance as ProviderBalanceRow[],
    failures: failures as OpsEventRow[],
    loadedAt: Date.now(),
  };
}

function Delivery() {
  const [status, setStatus] = useState<Status>({ phase: "loading" });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const r = await load();
      if (cancelled) return;
      if ("denied" in r) {
        setStatus({ phase: "denied" });
        return;
      }
      if ("error" in r) {
        console.error("Delivery dashboard failed to load.", r.error);
        const message = describeFailure(r.error);
        setStatus((prev) =>
          prev.phase === "ready" ? { ...prev, stale: message } : { phase: "error", message },
        );
        return;
      }
      setStatus({ phase: "ready", data: r });
    })();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  /* Auto-refresh while visible; catch up at once when the tab comes back. */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setAttempt((n) => n + 1);
    }, REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) setAttempt((n) => n + 1);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (status.phase === "denied") return <DeniedBody />;

  if (status.phase === "loading") {
    return (
      <>
        <PageHeader title="Delivery" subtitle="Is the product actually handing out SMS codes?" />
        <SkeletonStats n={8} />
        <div className="mt-[30px]">
          <SkeletonRows />
        </div>
      </>
    );
  }

  if (status.phase === "error") {
    return <LoadError title="Could not load delivery" message={status.message} retry={retry} />;
  }

  const { day, week, stats, combos, balance, failures, loadedAt } = status.data;
  const successPoints = stats.map((r) => ({ t: Date.parse(r.bucket), v: r.success_pct }));
  const balancePoints = balance.map((r) => ({ t: Date.parse(r.checked_at), v: Number(r.balance_usd) }));

  return (
    <>
      <PageHeader
        title="Delivery"
        subtitle={
          <>
            updated {formatWhen(new Date(loadedAt).toISOString())} · refreshes every minute
            {status.stale ? <span className="text-bad"> · last refresh failed: {status.stale}</span> : null}
          </>
        }
        actions={<RefreshButton onClick={retry} />}
      />

      <Kpis day={day} week={week} />

      <Section title="Not delivered · money · users" note="24h, with the 7-day figure underneath">
        <MoreKpis day={day} week={week} />
      </Section>

      <Section title="Top failing combos" note="last 24h · the same list the digest posts">
        <DataTable
          rows={day.top_failing ?? []}
          columns={FAILING_COLUMNS}
          rowKey={(r) => `${r.service}:${r.country_dial}`}
          rowHref={(r) => comboHref(r.service, r.country_dial)}
          empty={<EmptyState title="No failed activations in the last 24h" />}
        />
      </Section>

      <Section title="Success rate" note="per hour, delivered ÷ issued · last 7 days · gaps are hours with nothing issued">
        <Card>
          <LineChart points={successPoints} yMin={0} yMax={100} format={(v) => `${Math.round(v)}%`} label="Hourly SMS success rate over the last 7 days" />
        </Card>
      </Section>

      <Section title="OnlineSim balance" note="checked every 15 minutes · last 7 days">
        <Card
          note="A drop is spend; a jump is a top-up."
          actions={
            <Link href="/admin/money" className="text-label font-medium text-accent-deep hover:underline">
              Spend &amp; top-ups →
            </Link>
          }
        >
          <LineChart points={balancePoints} format={(v) => formatUsd(v)} label="OnlineSim balance over the last 7 days" />
        </Card>
      </Section>

      <Section title="Worst combos" note="last 7 days · most undelivered first · top 25">
        <DataTable
          rows={combos.slice(0, 25)}
          columns={COMBO_COLUMNS}
          rowKey={(r) => `${r.service}:${r.country_dial}`}
          rowHref={(r) => comboHref(r.service, r.country_dial)}
          rowTone={(r) => (lowSuccess(r.success_pct) ? "warn" : null)}
          empty={<EmptyState title="No purchases in this window" />}
        />
      </Section>

      <Section title="Recent failures" note={`newest first · up to ${FAILURE_LIMIT}`}>
        <DataTable
          rows={failures}
          columns={FAILURE_COLUMNS}
          rowKey={(r) => String(r.id)}
          rowHref={(r) => entityHref("activation", failureActivationId(r))}
          rowTone={(r) => (r.severity === "crit" ? "bad" : null)}
          empty={<EmptyState title="No events recorded" />}
        />
      </Section>
    </>
  );
}

export default function AdminDeliveryPage() {
  return (
    <AuthGate>
      <Delivery />
    </AuthGate>
  );
}
