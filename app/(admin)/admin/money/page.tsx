"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import AuthGate, { DeniedBody } from "../AuthGate";
import { BarChart } from "../components/Charts";
import {
  rpc,
  type BreakdownGroup,
  type BreakdownRow,
  type MoneySummary,
  type PnlRow,
  type SpendIntervalRow,
  type TopupRow,
} from "../../../../lib/admin/rpc";
import { formatCoins, formatDial, formatPct, formatRelative, formatUsd, formatUsdSigned, formatWhen } from "../../../../lib/admin/format";
import {
  Card,
  DataTable,
  EmptyState,
  Loaded,
  PageHeader,
  RefreshButton,
  Section,
  SkeletonStats,
  Stat,
  StatGrid,
  WindowPicker,
  comboHref,
  useAdminData,
  type Column,
} from "../ui";
import { ProbableTopups, TopupCard, type Prefill } from "./Topups";

/* ---------------------------------------------------------------------------
 * Money: the business's profit and loss.
 *
 * Two different questions get two different numbers, and the page keeps them
 * apart on purpose:
 *
 *   Cash    — what customers paid, minus Apple's cut and refunds. Money that
 *             arrived. Coins bought but not yet used are still in here.
 *   Earned  — revenue on numbers that actually delivered an SMS, valued at
 *             what that buyer really paid per coin. Matched against what
 *             OnlineSim charged for those same numbers, this is the margin.
 *
 * OnlineSim cost is shown twice as well: the list price recorded on each
 * activation (splittable by service/country) and the real drop in the
 * OnlineSim balance (the actual bill, but one number). The gap between them is
 * shown, not hidden.
 * ------------------------------------------------------------------------ */

type Main = { summary: MoneySummary; pnl: PnlRow[] };
type Spend = { intervals: SpendIntervalRow[]; topups: TopupRow[] };

function profitTone(v: number | null | undefined) {
  if (v === null || v === undefined) return "neutral" as const;
  return v < 0 ? ("bad" as const) : ("good" as const);
}

/* -- The statement ------------------------------------------------------- */

function Line({
  label,
  value,
  op,
  strong = false,
  note,
  tone,
}: {
  label: string;
  value: string;
  op?: "−" | "+" | "=";
  strong?: boolean;
  note?: ReactNode;
  tone?: "good" | "bad" | "neutral";
}) {
  return (
    <div className={`flex items-baseline justify-between gap-[12px] py-[7px] ${strong ? "border-t border-border" : ""}`}>
      <div className="min-w-0">
        <span className={`text-body ${strong ? "font-semibold" : "text-ink-muted"}`}>
          {op ? <span className="mr-[6px] inline-block w-[10px] text-muted">{op}</span> : null}
          {label}
        </span>
        {note ? <span className="block pl-[16px] text-caption text-muted">{note}</span> : null}
      </div>
      <span
        className={`shrink-0 tabular-nums ${strong ? "text-subheading font-semibold" : "text-body"} ${
          tone === "bad" ? "text-bad" : tone === "good" ? "text-good" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Statement({ s }: { s: MoneySummary }) {
  return (
    <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
      <Card title="Cash in" note="Money customers paid in this window">
        <Line label="Customers paid (store price)" value={formatUsd(s.gross)} note={`${formatCoins(s.purchases)} purchases`} />
        <Line op="−" label="Apple's commission" value={formatUsd(s.apple_fee)} />
        <Line op="−" label="Refunds" value={formatUsd(s.refunds)} note={s.store_refunds ? `${formatCoins(s.store_refunds)} store refunds` : undefined} />
        <Line op="=" label="Net cash received" value={formatUsd(s.cash_net)} strong />
        <p className="mt-[6px] text-caption text-muted">
          Includes coins bought but not used yet. <Link href="/admin/purchases" className="text-accent-deep hover:underline">See purchases →</Link>
        </p>
      </Card>
      <Card title="Profit on SMS delivered" note="Only numbers that received an SMS — the rest are refunded and not billed">
        <Line
          label="Revenue earned"
          value={formatUsd(s.earned)}
          note={`${formatCoins(s.charged)} delivered numbers · ${formatCoins(s.coins_charged)} coins`}
        />
        <Line op="−" label="OnlineSim cost (recorded)" value={formatUsd(s.recorded_cost)} note={s.cost_unknown ? `${s.cost_unknown} with no recorded price, counted as $0` : "List price when each number was bought"} />
        <Line
          op="="
          label={`Gross profit${s.margin_pct !== null ? ` · ${formatPct(s.margin_pct)} margin` : ""}`}
          value={formatUsdSigned(s.gross_profit)}
          strong
          tone={profitTone(s.gross_profit)}
        />
        <div className="mt-[6px] rounded-[10px] bg-panel px-[10px] py-[6px]">
          <Line label="Against real OnlineSim spend" value={s.real_spend === null ? "no data" : formatUsd(s.real_spend)} />
          <Line
            label={`Real profit${s.real_margin_pct !== null ? ` · ${formatPct(s.real_margin_pct)}` : ""}`}
            value={s.real_profit === null ? "—" : formatUsdSigned(s.real_profit)}
            tone={s.real_profit === null ? undefined : profitTone(s.real_profit)}
          />
        </div>
      </Card>
    </div>
  );
}

/* -- Reconciliation ------------------------------------------------------ */

function Reconciliation({ s, onLogTopup }: { s: MoneySummary; onLogTopup: () => void }) {
  const gap = s.reconciliation_gap;
  const big = gap !== null && s.recorded_cost > 0 && Math.abs(gap) > Math.max(1, s.recorded_cost * 0.1);
  return (
    <Card
      title="OnlineSim spend check"
      note="Balance-based spend vs. the prices recorded on each number"
      actions={
        <button type="button" onClick={onLogTopup} className="text-label text-accent-deep hover:underline">
          Log a top-up
        </button>
      }
    >
      {s.total_start === null ? (
        <p className="text-body text-ink-muted">No OnlineSim balance snapshots in this window, so real spend can’t be measured.</p>
      ) : (
        <div className="grid gap-[16px] md:grid-cols-2">
          <div>
            <Line label="Balance + frozen at start" value={formatUsd(s.total_start)} />
            <Line op="+" label="Top-ups logged" value={formatUsd(s.topups_applied)} note={`${formatCoins(s.topups_count)} in window`} />
            {s.unexplained_increase > 0 ? (
              <Line op="+" label="Unexplained increases" value={formatUsd(s.unexplained_increase)} note="Probably unlogged top-ups" tone="bad" />
            ) : null}
            <Line op="−" label="Balance + frozen at end" value={formatUsd(s.total_end)} />
            <Line op="=" label="Real spend" value={formatUsd(s.real_spend)} strong />
          </div>
          <div>
            <Line label="Real spend (balance)" value={formatUsd(s.real_spend)} />
            <Line label="Recorded cost (per number)" value={formatUsd(s.recorded_cost)} />
            <Line op="=" label="Gap" value={gap === null ? "—" : formatUsdSigned(gap)} strong tone={big ? "bad" : undefined} />
            <p className="mt-[6px] text-caption text-muted">
              {big
                ? "The gap is more than 10% of recorded cost. Common causes: an unlogged top-up, prices moving after the catalog cache, cancelled numbers OnlineSim still billed, or numbers bought outside the app."
                : "A small gap is normal: recorded cost uses OnlineSim’s cached list price, not the exact charge."}
              {s.snapshot_gaps > 0 ? ` ${s.snapshot_gaps} snapshot gap(s) over 1h — spend in those spans is lumped together.` : ""}
            </p>
            <p className="mt-[8px] text-label">
              Balance now <span className="font-semibold tabular-nums">{formatUsd(s.balance_now)}</span>
              {s.frozen_now ? <span className="text-ink-muted"> + {formatUsd(s.frozen_now)} frozen</span> : null}
              <span className="text-caption text-muted"> · {formatRelative(s.balance_as_of)}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

/* -- Breakdown ----------------------------------------------------------- */

const GROUPS: { key: BreakdownGroup; label: string }[] = [
  { key: "combo", label: "Service + country" },
  { key: "service", label: "By service" },
  { key: "country", label: "By country" },
];

function country(r: BreakdownRow) {
  if (r.country_dial === null) return null;
  return `${r.country_name ?? "Unknown"} ${formatDial(r.country_dial)}`;
}

function Breakdown({ hours }: { hours: number }) {
  const [group, setGroup] = useState<BreakdownGroup>("combo");
  const { status, retry } = useAdminData(() => rpc.moneyBreakdown(hours, group), `${hours}:${group}`);

  const columns: Column<BreakdownRow>[] = [
    ...(group !== "country"
      ? [{ key: "service", header: "Service", mobile: "title" as const, cell: (r: BreakdownRow) => <span className="font-medium">{r.service ?? "—"}</span> }]
      : []),
    ...(group !== "service"
      ? [{ key: "country", header: "Country", mobile: "title" as const, cell: (r: BreakdownRow) => country(r) ?? "—" }]
      : []),
    {
      key: "profit",
      header: "Profit",
      align: "right",
      mobile: "aside",
      cell: (r) => <span className={`font-semibold ${r.profit < 0 ? "text-bad" : "text-good"}`}>{formatUsdSigned(r.profit)}</span>,
    },
    { key: "margin", header: "Margin", align: "right", cell: (r) => formatPct(r.margin_pct) },
    { key: "earned", header: "Revenue", align: "right", cell: (r) => formatUsd(r.earned) },
    { key: "cost", header: "Cost", align: "right", cell: (r) => formatUsd(r.recorded_cost) },
    { key: "delivered", header: "Delivered", align: "right", cell: (r) => `${formatCoins(r.charged)} / ${formatCoins(r.issued)}` },
    {
      key: "rate",
      header: "Success",
      align: "right",
      cell: (r) => (
        <span className={r.delivered_pct !== null && r.delivered_pct < 50 ? "text-bad" : ""}>{formatPct(r.delivered_pct, 0)}</span>
      ),
    },
  ];

  return (
    <Section
      title="Where the money is made and lost"
      note="Worst first. Profit here is against recorded cost — the balance can't be split per service."
      actions={
        <div className="flex flex-wrap gap-[6px]" role="tablist">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={group === g.key}
              onClick={() => setGroup(g.key)}
              className={`rounded-[8px] border px-[10px] py-[5px] text-label ${
                group === g.key ? "border-transparent bg-panel-strong text-accent-deep" : "border-border bg-card text-ink-muted"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      }
    >
      <Loaded status={status} retry={retry} title="Could not load the breakdown">
        {(rows) => (
          <DataTable
            rows={rows}
            columns={columns}
            rowKey={(r, i) => `${r.service}-${r.country_dial}-${i}`}
            rowHref={(r) => (group === "combo" ? comboHref(r.service, r.country_dial) : null)}
            rowTone={(r) => (r.profit < 0 ? "bad" : null)}
            empty={<EmptyState title="No activations in this window" />}
            footer={group === "combo" ? <p className="text-caption text-muted">Tap a row for that service + country: price, stock, success rate, recent numbers.</p> : null}
          />
        )}
      </Loaded>
    </Section>
  );
}

/* -- How it works -------------------------------------------------------- */

const SOURCE_LABELS: Record<string, string> = {
  gross: "Customers paid",
  apple_fee: "Apple's commission",
  refunds: "Refunds",
  cash_net: "Net cash received",
  earned: "Revenue earned",
  recorded_cost: "OnlineSim cost (recorded)",
  real_spend: "Real OnlineSim spend",
  reconciliation_gap: "Gap",
  unexplained_increase: "Unexplained increases",
  default_rate: "Default $/coin",
};

function HowItWorks({ s }: { s: MoneySummary }) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      title="How these numbers are calculated"
      actions={
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="text-label text-accent-deep hover:underline">
          {open ? "Hide" : "Show"}
        </button>
      }
    >
      <p className="text-label text-ink-muted">
        Each delivered number is valued at what <em>that buyer</em> actually paid per coin, after Apple
        {s.share_default_rate_pct !== null
          ? ` (${formatPct(s.share_default_rate_pct)} of revenue came from users with no purchase, valued at the default ${formatUsd(s.default_rate)}/coin)`
          : ""}
        . Cancelled and expired numbers are refunded to the user and not billed by OnlineSim, so they count as neither
        revenue nor cost.
      </p>
      {open ? (
        <dl className="mt-[12px] flex flex-col gap-[10px]">
          {Object.entries(s.sources).map(([k, v]) => (
            <div key={k}>
              <dt className="text-label font-medium">{SOURCE_LABELS[k] ?? k}</dt>
              <dd className="text-caption leading-[1.55] text-ink-muted">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Card>
  );
}

/* -- Screen -------------------------------------------------------------- */

function MoneyScreen() {
  const [hours, setHours] = useState(168);
  const [prefill, setPrefill] = useState<Prefill>(null);
  const [denied, setDenied] = useState(false);
  const [tick, setTick] = useState(0);

  const main = useAdminData<Main>(async () => {
    const [summary, pnl] = await Promise.all([rpc.moneySummary(hours), rpc.moneyPnl(hours)]);
    return { summary, pnl };
  }, `${hours}:${tick}`);
  const spend = useAdminData<Spend>(async () => {
    const [intervals, topups] = await Promise.all([rpc.providerSpend(hours), rpc.topups(2160)]);
    return { intervals, topups };
  }, `${hours}:${tick}`);

  if (denied || main.status.phase === "denied") return <DeniedBody />;

  const refresh = () => setTick((t) => t + 1);
  const scrollToTopups = () => document.getElementById("topups")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const label = hours === 24 ? "24h" : hours === 168 ? "7 days" : "30 days";

  return (
    <>
      <PageHeader
        title="Money"
        subtitle="What customers paid, what OnlineSim cost, and what's left."
        actions={
          <>
            <WindowPicker hours={hours} onChange={setHours} />
            <RefreshButton onClick={refresh} busy={main.status.phase === "loading"} />
          </>
        }
      />

      <Loaded status={main.status} retry={main.retry} title="Could not load money figures" skeleton={<SkeletonStats n={8} />}>
        {({ summary: s, pnl }) => (
          <>
            <StatGrid>
              <Stat
                label={`Gross profit · ${label}`}
                value={formatUsdSigned(s.gross_profit)}
                tone={profitTone(s.gross_profit)}
                sub={s.margin_pct !== null ? `${formatPct(s.margin_pct)} margin` : undefined}
                help="Revenue earned on numbers that got an SMS, minus OnlineSim's recorded price for those numbers."
                source={s.sources.earned}
              />
              <Stat
                label="Revenue earned"
                value={formatUsd(s.earned)}
                sub={`${formatCoins(s.charged)} delivered numbers`}
                help="Coins spent on delivered numbers × what each buyer actually paid per coin, after Apple's cut."
                source={s.sources.earned}
              />
              <Stat
                label="OnlineSim spend"
                value={s.real_spend === null ? formatUsd(s.recorded_cost) : formatUsd(s.real_spend)}
                sub={s.real_spend === null ? "recorded (no balance data)" : `recorded ${formatUsd(s.recorded_cost)}`}
                help="Big number: the real drop in the OnlineSim balance, with logged top-ups added back. Below: the sum of list prices recorded on each delivered number."
                source={s.sources.real_spend}
              />
              <Stat
                label="Net cash received"
                value={formatUsd(s.cash_net)}
                sub={`${formatUsd(s.gross)} gross · ${formatCoins(s.purchases)} purchases`}
                href="/admin/purchases"
                help="What customers paid, minus Apple's commission and refunds. Includes coins not used yet."
                source={s.sources.cash_net}
              />
            </StatGrid>

            <div className="mt-[12px]">
              <Card title="Profit over time" note={hours <= 48 ? "Per hour (UTC)" : "Per day (UTC)"}>
                <BarChart
                  bars={pnl.map((r) => ({ t: Date.parse(r.bucket), v: r.gross_profit, line: r.earned }))}
                  format={(v) => formatUsd(v)}
                  label="Gross profit and revenue earned over time"
                  barLabel="Gross profit"
                  lineLabel="Revenue earned"
                />
              </Card>
            </div>

            <Section title="Profit & loss" note={`${formatWhen(s.from)} → ${formatWhen(s.to)}`}>
              <Statement s={s} />
            </Section>

            <Section title="OnlineSim spend">
              <div className="flex flex-col gap-[12px]">
                {spend.status.phase === "ready" ? (
                  <ProbableTopups
                    rows={spend.status.data.intervals}
                    onLog={(p) => {
                      setPrefill(p);
                      scrollToTopups();
                    }}
                  />
                ) : null}
                <Reconciliation s={s} onLogTopup={scrollToTopups} />
              </div>
            </Section>

            <Breakdown hours={hours} />

            <Section title="Top-ups">
              <div id="topups" className="scroll-mt-[80px]">
                <Loaded status={spend.status} retry={spend.retry} title="Could not load top-ups">
                  {({ topups }) => <TopupCard rows={topups} prefill={prefill} onChanged={refresh} onDenied={() => setDenied(true)} />}
                </Loaded>
              </div>
            </Section>

            <div className="mt-[30px]">
              <HowItWorks s={s} />
            </div>
          </>
        )}
      </Loaded>
    </>
  );
}

export default function MoneyPage() {
  return (
    <AuthGate>
      <MoneyScreen />
    </AuthGate>
  );
}
