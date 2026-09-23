"use client";

import Link from "next/link";
import { useState } from "react";
import AuthGate, { DeniedBody } from "../AuthGate";
import { formatCoins, formatUsd, formatWhen } from "../../../../lib/admin/format";
import { rpc, type PurchaseRow, type PurchaseSummary } from "../../../../lib/admin/rpc";
import { ALERT, Figure, LoadError, Section, TD, TH, THEAD_ROW, useAdminData, WindowPicker } from "../ui";

/* ---------------------------------------------------------------------------
 * Purchases: in-app purchases, store refunds and reversed refunds.
 *
 * The summary is admin_purchase_summary — the same SQL (ops_revenue) the ops
 * bot's /revenue posts. Net USD is after the store's cut; a refund is a
 * negative row, so the sum is true net revenue. Sandbox (TestFlight)
 * purchases are counted separately and never summed into revenue.
 * ------------------------------------------------------------------------ */

const FEED_LIMIT = 300;

const EVENT_LABEL: Record<string, string> = {
  purchase: "Purchase",
  refund: "Store refund",
  refund_reversed: "Refund reversed",
};

function Feed({ rows }: { rows: PurchaseRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-label">
        <thead>
          <tr className={THEAD_ROW}>
            <th scope="col" className={TH}>When</th>
            <th scope="col" className={TH}>Event</th>
            <th scope="col" className={TH}>Product</th>
            <th scope="col" className={`${TH} text-right`}>Coins</th>
            <th scope="col" className={`${TH} text-right`}>Net</th>
            <th scope="col" className={TH}>Customer</th>
            <th scope="col" className="py-[7px] text-left font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-[14px] text-body text-ink-muted">No purchases in this window.</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className={`border-b border-border align-top ${r.sandbox ? "opacity-60" : ""}`}>
                <td className={`${TD} whitespace-nowrap tabular-nums text-ink-muted`}>{formatWhen(r.created_at)}</td>
                <td className={`${TD} ${r.event === "refund" ? ALERT : "font-medium"}`}>{EVENT_LABEL[r.event] ?? r.event}</td>
                <td className={`${TD} text-ink-muted`}>{r.product_id ?? "—"}</td>
                <td className={`${TD} text-right tabular-nums`}>{formatCoins(r.coins)}</td>
                <td className={`${TD} text-right tabular-nums`}>{formatUsd(r.usd)}</td>
                <td className={TD}>
                  <Link href={`/admin/users/${r.user_id}`} className="underline underline-offset-2">
                    {r.email_masked ?? r.user_id.slice(0, 8)}
                  </Link>
                </td>
                <td className="py-[7px] text-caption text-ink-muted">
                  {[
                    r.first ? "first purchase" : null,
                    r.sandbox ? "sandbox" : null,
                    r.shortfall > 0 ? `${formatCoins(r.shortfall)} coins already spent` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function TopProducts({ rows }: { rows: PurchaseSummary["top_products"] }) {
  if (!rows?.length) return <p className="text-body text-ink-muted">Nothing sold in this window.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-label">
        <thead>
          <tr className={THEAD_ROW}>
            <th scope="col" className={TH}>Product</th>
            <th scope="col" className={`${TH} text-right`}>Sold</th>
            <th scope="col" className={`${TH} text-right`}>Coins</th>
            <th scope="col" className="py-[7px] text-right font-medium">Net</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.product_id} className="border-b border-border">
              <td className={`${TD} font-medium`}>{p.product_id}</td>
              <td className={`${TD} text-right tabular-nums`}>{formatCoins(p.purchases)}</td>
              <td className={`${TD} text-right tabular-nums`}>{formatCoins(p.coins)}</td>
              <td className="py-[7px] text-right tabular-nums">{formatUsd(p.usd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Purchases() {
  const [hours, setHours] = useState(168);
  const { status, retry } = useAdminData(
    async () => {
      const [summary, rows] = await Promise.all([rpc.purchaseSummary(hours), rpc.purchases(hours, FEED_LIMIT)]);
      return { summary, rows };
    },
    String(hours),
  );

  if (status.phase === "denied") return <DeniedBody />;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div>
          <h1 className="font-sans text-heading-sm">Purchases</h1>
          <p className="mt-[2px] text-caption text-muted">
            In-app purchases and store refunds · net of the store&apos;s cut · sandbox shown faded, never counted
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <WindowPicker hours={hours} onChange={setHours} />
          <button type="button" onClick={retry} className="cta cta--sm">
            Refresh
          </button>
        </div>
      </div>

      {status.phase === "loading" ? (
        <p className="mt-[20px] text-body text-ink-muted" role="status">Loading…</p>
      ) : status.phase === "error" ? (
        <div className="mt-[20px]">
          <LoadError title="Could not load purchases" message={status.message} retry={retry} />
        </div>
      ) : (
        <>
          <dl className="mt-[20px] grid grid-cols-2 gap-x-[20px] gap-y-[14px] sm:grid-cols-4 lg:grid-cols-8">
            <Figure label="Purchases" value={formatCoins(status.data.summary.purchases)} />
            <Figure label="First purchases" value={formatCoins(status.data.summary.first_purchases)} />
            <Figure label="Net revenue" value={formatUsd(status.data.summary.net_usd)} />
            <Figure label="Coins sold" value={formatCoins(status.data.summary.gross_coins)} />
            <Figure label="Store refunds" value={formatCoins(status.data.summary.refunds)} alert={status.data.summary.refunds > 0} />
            <Figure label="Refunds reversed" value={formatCoins(status.data.summary.refunds_reversed)} />
            <Figure
              label="Refund shortfall"
              value={formatCoins(status.data.summary.refund_shortfall_coins)}
              alert={status.data.summary.refund_shortfall_coins > 0}
              note="coins spent before the refund"
            />
            <Figure label="Sandbox" value={formatCoins(status.data.summary.sandbox)} note="TestFlight, not revenue" />
          </dl>

          <Section title="Top products">
            <TopProducts rows={status.data.summary.top_products} />
          </Section>

          <Section title="Feed" note={`newest first · up to ${FEED_LIMIT}`}>
            <Feed rows={status.data.rows} />
          </Section>
        </>
      )}
    </>
  );
}

export default function AdminPurchasesPage() {
  return (
    <AuthGate>
      <Purchases />
    </AuthGate>
  );
}
