"use client";

import { useCallback, useEffect, useState } from "react";
import AuthGate, { DeniedBody } from "../AuthGate";
import { Figure, Section, TD, TH } from "../ui";
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
import LineChart from "./LineChart";

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


/* The operator's own warn threshold lives in the edge function's env; this is
   only a colour cue and deliberately matches its default. */
const BALANCE_WARN_USD = 20;
const SUCCESS_WARN_PCT = 70;

function Kpis({ day, week }: { day: OpsDigest; week: OpsDigest }) {
  return (
    <dl className="mt-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[14px] sm:grid-cols-4 lg:grid-cols-8">
      <Figure
        label="Success 24h"
        value={pct(day.success_pct)}
        alert={day.success_pct !== null && day.success_pct < SUCCESS_WARN_PCT}
        note={`${day.delivered} of ${day.issued} issued`}
      />
      <Figure
        label="Success 7d"
        value={pct(week.success_pct)}
        alert={week.success_pct !== null && week.success_pct < SUCCESS_WARN_PCT}
        note={`${week.delivered} of ${week.issued} issued`}
      />
      <Figure label="Purchases 24h" value={formatCoins(day.purchases)} note={`7d ${formatCoins(week.purchases)}`} />
      <Figure
        label="Provider failed 24h"
        value={formatCoins(day.provider_failed)}
        alert={day.provider_failed > 0}
        note={`7d ${formatCoins(week.provider_failed)}`}
      />
      <Figure label="Expired 24h" value={formatCoins(day.expired)} note={`7d ${formatCoins(week.expired)}`} />
      <Figure
        label="Median to SMS"
        value={day.median_sms_seconds === null ? "—" : `${day.median_sms_seconds}s`}
        note={`7d ${week.median_sms_seconds === null ? "—" : `${week.median_sms_seconds}s`}`}
      />
      <Figure label="Net revenue 24h" value={formatUsd(day.revenue_usd)} note={`7d ${formatUsd(week.revenue_usd)}`} />
      <Figure
        label="OnlineSim balance"
        value={formatUsd(day.balance_usd)}
        alert={day.balance_usd !== null && day.balance_usd < BALANCE_WARN_USD}
        note={day.balance_burn_24h === null ? formatWhen(day.balance_at) : `24h burn ${formatUsd(day.balance_burn_24h)}`}
      />
    </dl>
  );
}

/** The rest of the digest: what did not deliver, and the money side. */
function MoreKpis({ day, week }: { day: OpsDigest; week: OpsDigest }) {
  return (
    <dl className="grid grid-cols-2 gap-x-[20px] gap-y-[14px] sm:grid-cols-4 lg:grid-cols-8">
      <Figure label="Claim failed 24h" value={formatCoins(day.claim_failed)} alert={day.claim_failed > 0} note={`7d ${formatCoins(week.claim_failed)}`} />
      <Figure label="Cancelled 24h" value={formatCoins(day.cancelled)} note={`7d ${formatCoins(week.cancelled)}`} />
      <Figure label="In flight" value={formatCoins(day.in_flight)} note="waiting for an SMS now" />
      <Figure label="IAP 24h" value={formatCoins(day.iap_count)} note={`7d ${formatCoins(week.iap_count)}`} />
      <Figure label="Store refunds 24h" value={formatCoins(day.store_refunds)} alert={day.store_refunds > 0} note={`7d ${formatCoins(week.store_refunds)}`} />
      <Figure label="Coins earned 24h" value={formatCoins(day.coins_spent)} note={`7d ${formatCoins(week.coins_spent)}`} />
      <Figure label="Sign-ups 24h" value={formatCoins(day.signups)} note={`7d ${formatCoins(week.signups)}`} />
      <Figure label="Anon installs 24h" value={formatCoins(day.anon_installs)} note={`7d ${formatCoins(week.anon_installs)}`} />
    </dl>
  );
}

function TopFailing({ rows }: { rows: OpsDigest["top_failing"] }) {
  if (!rows?.length) return <p className="text-body text-ink-muted">No failed activations in the last 24h.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-label">
        <thead>
          <tr className="border-b border-border text-caption uppercase tracking-[0.07em] text-muted">
            <th scope="col" className={TH}>Service</th>
            <th scope="col" className={TH}>Country</th>
            <th scope="col" className={`${TH} text-right`}>Failures</th>
            <th scope="col" className="py-[7px] text-left font-medium">Usual reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.service}:${r.country_dial}`} className="border-b border-border">
              <td className={`${TD} font-medium`}>{r.service}</td>
              <td className={`${TD} tabular-nums text-ink-muted`}>{dial(r.country_dial)}</td>
              <td className={`${TD} text-right tabular-nums`}>{formatCoins(r.failures)}</td>
              <td className="py-[7px] text-ink-muted">{r.reason ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CombosTable({ rows }: { rows: DeliveryComboRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-label">
        <thead>
          <tr className="border-b border-border text-caption uppercase tracking-[0.07em] text-muted">
            <th scope="col" className={TH}>Service</th>
            <th scope="col" className={TH}>Country</th>
            <th scope="col" className={`${TH} text-right`}>Attempts</th>
            <th scope="col" className={`${TH} text-right`}>Delivered</th>
            <th scope="col" className={`${TH} text-right`}>Success</th>
            <th scope="col" className={`${TH} text-right`}>Median SMS</th>
            <th scope="col" className="py-[7px] text-left font-medium">Top failure</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-[14px] text-body text-ink-muted">No purchases in this window.</td>
            </tr>
          ) : (
            rows.slice(0, 25).map((r) => (
              <tr key={`${r.service}:${r.country_dial}`} className="border-b border-border">
                <td className={`${TD} font-medium`}>{r.service}</td>
                <td className={`${TD} tabular-nums text-ink-muted`}>{dial(r.country_dial)}</td>
                <td className={`${TD} text-right tabular-nums`}>{formatCoins(r.attempts)}</td>
                <td className={`${TD} text-right tabular-nums`}>{formatCoins(r.delivered)}</td>
                <td
                  className={`${TD} text-right tabular-nums ${
                    r.success_pct !== null && r.success_pct < SUCCESS_WARN_PCT ? "font-semibold text-[#a8201a]" : ""
                  }`}
                >
                  {pct(r.success_pct)}
                </td>
                <td className={`${TD} text-right tabular-nums text-ink-muted`}>
                  {r.median_sms_seconds === null ? "—" : `${r.median_sms_seconds}s`}
                </td>
                <td className="py-[7px] text-ink-muted">{r.top_fail_reason ?? "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function FailuresFeed({ rows }: { rows: OpsEventRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-label">
        <thead>
          <tr className="border-b border-border text-caption uppercase tracking-[0.07em] text-muted">
            <th scope="col" className={TH}>When</th>
            <th scope="col" className={TH}>Event</th>
            <th scope="col" className={TH}>Service</th>
            <th scope="col" className={TH}>Number</th>
            <th scope="col" className={`${TH} text-right`}>After</th>
            <th scope="col" className="py-[7px] text-left font-medium">Telegram</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-[14px] text-body text-ink-muted">No events recorded.</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-b border-border align-top">
                <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(r.created_at)}</td>
                <td className={`${TD} ${r.severity === "crit" ? "font-semibold text-[#a8201a]" : "font-medium"}`}>
                  {r.close_reason ?? r.kind.replace(/_/g, " ")}
                </td>
                <td className={`${TD} text-ink-muted`}>
                  {r.service ?? "—"} {r.country_dial !== null ? dial(r.country_dial) : ""}
                </td>
                <td className={`${TD} font-mono text-caption text-ink-muted`}>{r.phone_masked ?? "—"}</td>
                <td className={`${TD} text-right tabular-nums text-ink-muted`}>
                  {r.seconds === null ? "—" : `${r.seconds}s`}
                </td>
                <td className="py-[7px] text-caption text-ink-muted">
                  {r.sent_at ? (r.send_error ? `gave up: ${r.send_error}` : "sent") : r.send_error ? `retrying: ${r.send_error}` : "queued"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

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
      <p className="text-body text-ink-muted" role="status">
        Loading…
      </p>
    );
  }

  if (status.phase === "error") {
    return (
      <div role="alert" className="max-w-[560px]">
        <h2 className="font-sans text-subheading">Could not load delivery</h2>
        <p className="mt-[6px] text-body text-ink-muted">{status.message}</p>
        <button type="button" onClick={retry} className="cta cta--sm mt-[14px]">
          Try again
        </button>
      </div>
    );
  }

  const { day, week, stats, combos, balance, failures, loadedAt } = status.data;
  const successPoints = stats.map((r) => ({ t: Date.parse(r.bucket), v: r.success_pct }));
  const balancePoints = balance.map((r) => ({ t: Date.parse(r.checked_at), v: Number(r.balance_usd) }));

  return (
    <>
      <div className="flex items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-sans text-heading-sm">Delivery</h1>
          <p className="mt-[2px] text-caption text-muted">
            updated {formatWhen(new Date(loadedAt).toISOString())} · refreshes every minute
            {status.stale ? (
              <span className="text-[#a8201a]"> · last refresh failed: {status.stale}</span>
            ) : null}
          </p>
        </div>
        <button type="button" onClick={retry} className="cta cta--sm">
          Refresh
        </button>
      </div>

      <Kpis day={day} week={week} />

      <Section title="Not delivered · money · users" note="24h, with the 7-day figure underneath">
        <MoreKpis day={day} week={week} />
      </Section>

      <Section title="Top failing combos" note="last 24h · the same list the digest posts">
        <TopFailing rows={day.top_failing} />
      </Section>

      <Section title="Success rate" note="per hour, delivered ÷ issued · last 7 days · gaps are hours with nothing issued">
        <LineChart points={successPoints} yMin={0} yMax={100} format={(v) => `${Math.round(v)}%`} label="Hourly SMS success rate over the last 7 days" />
      </Section>

      <Section title="OnlineSim balance" note="checked every 15 minutes · last 7 days">
        <LineChart points={balancePoints} format={(v) => formatUsd(v)} label="OnlineSim balance over the last 7 days" />
      </Section>

      <Section title="Worst combos" note="last 7 days · most undelivered first">
        <CombosTable rows={combos} />
      </Section>

      <Section title="Recent failures" note={`newest first · up to ${FAILURE_LIMIT}`}>
        <FailuresFeed rows={failures} />
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
