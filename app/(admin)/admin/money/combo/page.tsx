"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthGate from "../../AuthGate";
import { BarChart } from "../../components/Charts";
import { rpc, type ComboRecentRow, type ComboStats } from "../../../../../lib/admin/rpc";
import {
  formatCoins,
  formatDial,
  formatPct,
  formatRelative,
  formatShortDate,
  formatUsd,
  formatUsdSigned,
} from "../../../../../lib/admin/format";
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  EntityLink,
  Facts,
  Loaded,
  PageHeader,
  RefreshButton,
  Section,
  SkeletonStats,
  Stat,
  StatGrid,
  StatusBadge,
  WindowPicker,
  useAdminData,
  type Column,
} from "../../ui";

/* ---------------------------------------------------------------------------
 * One service in one country: is it worth selling?
 *
 * Reached from the Money breakdown and the Delivery combo tables. Answers, in
 * order: does it make money, does it deliver, what do we charge vs. what
 * OnlineSim charges right now, and which numbers were sold recently.
 * ------------------------------------------------------------------------ */

function cents(v: number | null | undefined) {
  return v === null || v === undefined ? "—" : formatUsd(v / 100);
}

function ComboBody({ c }: { c: ComboStats }) {
  const s = c.summary;
  const recentCols: Column<ComboRecentRow>[] = [
    { key: "when", header: "When", mobile: "title", cell: (r) => formatShortDate(r.created_at, true) },
    { key: "phone", header: "Number", mobile: "title", cell: (r) => <span className="font-mono text-label">{r.phone_masked ?? "—"}</span> },
    { key: "status", header: "Status", mobile: "aside", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "coins", header: "Coins", align: "right", cell: (r) => formatCoins(r.coins_spent) },
    { key: "cost", header: "Cost", align: "right", cell: (r) => cents(r.provider_cost_cents) },
    { key: "sms", header: "First SMS", align: "right", cell: (r) => (r.first_sms_seconds === null ? "—" : `${r.first_sms_seconds}s`) },
    { key: "user", header: "User", cell: (r) => <EntityLink type="user" id={r.user_id} /> },
    { key: "reason", header: "Closed because", cell: (r) => <span className="text-ink-muted">{r.close_reason ?? "—"}</span> },
  ];

  return (
    <>
      <StatGrid>
        <Stat
          label="Profit"
          value={formatUsdSigned(s.profit)}
          tone={s.profit < 0 ? "bad" : "good"}
          sub={s.margin_pct !== null ? `${formatPct(s.margin_pct)} margin` : undefined}
          help="Revenue earned on delivered numbers minus OnlineSim's recorded price for them."
        />
        <Stat
          label="Success rate"
          value={formatPct(s.success_pct, 0)}
          tone={s.success_pct !== null && s.success_pct < 50 ? "bad" : "neutral"}
          sub={`${formatCoins(s.delivered)} of ${formatCoins(s.issued)} got an SMS`}
          help="Share of issued numbers that received a code. Failed and expired numbers are refunded — they cost support time, not money."
        />
        <Stat label="Revenue earned" value={formatUsd(s.earned)} sub={`${formatCoins(s.coins)} coins`} />
        <Stat
          label="Median time to SMS"
          value={s.median_sms_seconds === null ? "—" : `${Math.round(s.median_sms_seconds)}s`}
          sub={s.top_fail_reason ? `Top failure: ${s.top_fail_reason}` : undefined}
        />
      </StatGrid>

      <div className="mt-[12px] grid grid-cols-1 gap-[12px] lg:grid-cols-2">
        <Card title="Price right now" note="What we charge vs. what OnlineSim charges">
          <Facts
            items={[
              {
                label: "We charge",
                value: c.price ? (
                  <>
                    {formatCoins(c.price.coins)} coins{" "}
                    {c.price.pinned_coins !== null ? <Badge tone="info">pinned</Badge> : null}
                    {!c.price.is_listed ? <Badge tone="bad">not listed</Badge> : null}
                  </>
                ) : (
                  "—"
                ),
              },
              { label: "≈ Net to us", value: c.price?.net_usd_default === null || !c.price ? "—" : formatUsd(c.price.net_usd_default) },
              { label: "OnlineSim cost", value: c.offer ? cents(c.offer.cost_cents) : "—" },
              { label: "Stock", value: c.offer ? `${formatCoins(c.offer.available_count)} (${c.offer.stock_band})` : "—" },
              { label: "Formula price", value: c.price ? `${formatCoins(c.price.formula_coins)} coins` : "—" },
              { label: "Offer updated", value: c.offer ? formatRelative(c.offer.updated_at) : "—" },
            ]}
          />
          <p className="mt-[10px] text-caption text-muted">
            Net to us uses the worst-case pack rate (after Apple). A pinned price overrides the formula.
          </p>
        </Card>
        <Card title="Quality" note="Last 30 days, used to rank and delist combos">
          <Facts
            items={[
              /* A 0–1 fraction, smoothed toward the country prior so a combo
                 with three attempts doesn't read as 0% or 100%. */
              { label: "Success (smoothed)", value: c.quality ? formatPct(c.quality.success_rate * 100, 0) : "—" },
              { label: "Attempts", value: c.quality ? formatCoins(c.quality.attempts_30d) : "—" },
              { label: "Received", value: c.quality ? formatCoins(c.quality.received_30d) : "—" },
              {
                label: "Cooldown",
                value: c.cooldown ? (
                  <Badge tone="bad">until {formatShortDate(c.cooldown.until, true)}</Badge>
                ) : (
                  <Badge tone="good">none</Badge>
                ),
              },
            ]}
          />
          {c.cooldown ? (
            <p className="mt-[10px] text-caption text-muted">
              Paused after {c.cooldown.failures} failures since {formatShortDate(c.cooldown.since, true)}.
            </p>
          ) : null}
        </Card>
      </div>

      <Section title="Day by day">
        <Card>
          <BarChart
            bars={c.daily.map((d) => ({ t: Date.parse(d.day), v: d.profit, line: d.earned }))}
            format={(v) => formatUsd(v)}
            label="Daily profit and revenue for this combo"
            barLabel="Profit"
            lineLabel="Revenue"
          />
        </Card>
      </Section>

      <Section title="Recent numbers" note="Last 50, any date · tap one for its full story">
        <DataTable
          rows={c.recent}
          columns={recentCols}
          rowKey={(r) => r.id}
          rowHref={(r) => `/admin/activations/${r.id}`}
          rowTone={(r) => (r.status === "failed" ? "bad" : null)}
          empty={<EmptyState title="No numbers sold for this combo yet" />}
        />
      </Section>
    </>
  );
}

function ComboScreen() {
  const params = useSearchParams();
  const service = params.get("service") ?? "";
  const dial = Number(params.get("country"));
  const [hours, setHours] = useState(720);
  const [tick, setTick] = useState(0);
  const valid = !!service && Number.isFinite(dial) && dial > 0;

  const { status, retry } = useAdminData(
    () => (valid ? rpc.combo(service, dial, hours) : Promise.reject(new Error("Missing service or country in the link."))),
    `${service}:${dial}:${hours}:${tick}`,
  );

  const name = status.phase === "ready" ? status.data : null;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/money", label: "Money" }]}
        title={
          name
            ? `${name.service_name ?? name.service} · ${name.country_name ?? "Unknown"} ${formatDial(name.country_dial)}`
            : `${service || "?"} · ${formatDial(dial)}`
        }
        subtitle="One service in one country: margin, delivery and price."
        actions={
          <>
            <WindowPicker hours={hours} onChange={setHours} />
            <RefreshButton onClick={() => setTick((t) => t + 1)} busy={status.phase === "loading"} />
          </>
        }
      />
      <Loaded status={status} retry={retry} title="Could not load this combo" skeleton={<SkeletonStats />}>
        {(c) => <ComboBody c={c} />}
      </Loaded>
    </>
  );
}

export default function ComboPage() {
  return (
    <AuthGate>
      <Suspense fallback={<SkeletonStats />}>
        <ComboScreen />
      </Suspense>
    </AuthGate>
  );
}
