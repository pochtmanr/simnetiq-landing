"use client";

import Link from "next/link";
import { useState } from "react";
import AuthGate from "../AuthGate";
import { formatCoins, formatUsd, formatWhen } from "../../../../lib/admin/format";
import { rpc, type PurchaseRow, type PurchaseSummary } from "../../../../lib/admin/rpc";
import {
  DataTable,
  EmptyState,
  EntityLink,
  Loaded,
  PageHeader,
  RefreshButton,
  Section,
  SkeletonRows,
  SkeletonStats,
  SourceLine,
  Stat,
  StatGrid,
  StatusBadge,
  entityHref,
  useAdminData,
  WindowPicker,
  type Column,
} from "../ui";

/* ---------------------------------------------------------------------------
 * Purchases: in-app purchases, store refunds and reversed refunds.
 *
 * The summary is admin_purchase_summary — the same SQL (ops_revenue) the ops
 * bot's /revenue posts. Net USD is after the store's cut; a refund is a
 * negative row, so the sum is true net revenue. Sandbox (TestFlight)
 * purchases are counted separately and never summed into revenue.
 * ------------------------------------------------------------------------ */

const FEED_LIMIT = 300;

/* rc_transaction_id arrives with the admin_money migration; until then the
   row has no purchase page to open and falls back to the customer. */
function txnOf(r: PurchaseRow): string | null {
  return (r as { rc_transaction_id?: string | null }).rc_transaction_id ?? null;
}

function notes(r: PurchaseRow): string {
  return (
    [
      r.is_first ? "first purchase" : null,
      r.sandbox ? "sandbox" : null,
      r.shortfall > 0 ? `${formatCoins(r.shortfall)} coins already spent` : null,
    ]
      .filter(Boolean)
      .join(" · ") || "—"
  );
}

const FEED_COLUMNS: Column<PurchaseRow>[] = [
  {
    key: "product",
    header: "Product",
    mobile: "title",
    cell: (r) => <span className={r.sandbox ? "opacity-60" : ""}>{r.product_id ?? "—"}</span>,
  },
  {
    key: "event",
    header: "Event",
    mobile: "aside",
    cell: (r) => <StatusBadge status={r.event} />,
  },
  {
    key: "usd",
    header: "Net",
    align: "right",
    mobile: "aside",
    cell: (r) => <span className={r.usd !== null && r.usd < 0 ? "text-bad" : "font-medium"}>{formatUsd(r.usd)}</span>,
  },
  {
    key: "when",
    header: "When",
    cell: (r) => <span className="whitespace-nowrap tabular-nums text-ink-muted">{formatWhen(r.created_at)}</span>,
  },
  { key: "coins", header: "Coins", align: "right", cell: (r) => formatCoins(r.coins) },
  {
    key: "customer",
    header: "Customer",
    className: "max-w-[220px] truncate",
    cell: (r) => (
      <EntityLink type="user" id={r.user_id}>
        {r.email_masked ?? r.user_id.slice(0, 8)}
      </EntityLink>
    ),
  },
  {
    key: "notes",
    header: "Notes",
    cell: (r) => <span className="text-caption text-ink-muted">{notes(r)}</span>,
  },
];

type Product = PurchaseSummary["top_products"][number];

const PRODUCT_COLUMNS: Column<Product>[] = [
  { key: "product", header: "Product", mobile: "title", cell: (p) => <span className="font-medium">{p.product_id}</span> },
  { key: "usd", header: "Net", align: "right", mobile: "aside", cell: (p) => formatUsd(p.usd) },
  { key: "sold", header: "Sold", align: "right", cell: (p) => formatCoins(p.purchases) },
  { key: "coins", header: "Coins", align: "right", cell: (p) => formatCoins(p.coins) },
];

function Summary({ s }: { s: PurchaseSummary }) {
  return (
    <StatGrid>
      <Stat
        label="Net revenue"
        value={formatUsd(s.net_usd)}
        help="What reaches us after Apple's cut, minus store refunds. Sandbox (TestFlight) purchases are excluded."
        source="admin_purchase_summary — the same numbers the ops bot's /revenue posts."
      />
      <Stat label="Purchases" value={formatCoins(s.purchases)} help="Completed in-app purchases in the window, sandbox excluded." />
      <Stat
        label="First purchases"
        value={formatCoins(s.first_purchases)}
        help="Purchases that were the customer's first ever — new paying customers."
      />
      <Stat label="Coins sold" value={formatCoins(s.gross_coins)} help="Coins credited by purchases, before any refund clawback." />
      <Stat
        label="Store refunds"
        value={formatCoins(s.refunds)}
        tone={s.refunds > 0 ? "bad" : "neutral"}
        help="Refunds Apple granted. The coins are clawed back from the customer's wallet where possible."
      />
      <Stat
        label="Refunds reversed"
        value={formatCoins(s.refunds_reversed)}
        help="Refunds Apple later cancelled; the coins were given back."
      />
      <Stat
        label="Refund shortfall"
        value={formatCoins(s.refund_shortfall_coins)}
        tone={s.refund_shortfall_coins > 0 ? "warn" : "neutral"}
        sub="coins spent before the refund"
        help="Refunded coins the customer had already spent, so they could not be clawed back — a real loss."
      />
      <Stat
        label="Sandbox"
        value={formatCoins(s.sandbox)}
        sub="TestFlight, not revenue"
        help="Test purchases from TestFlight builds. Shown faded in the feed and never counted in revenue."
      />
    </StatGrid>
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

  return (
    <>
      <PageHeader
        title="Purchases"
        subtitle="In-app purchases and store refunds · net of the store's cut · sandbox shown faded, never counted"
        actions={
          <>
            <WindowPicker hours={hours} onChange={setHours} />
            <RefreshButton onClick={retry} busy={status.phase === "loading"} />
          </>
        }
      />

      <Loaded
        status={status}
        retry={retry}
        title="Could not load purchases"
        skeleton={
          <>
            <SkeletonStats n={8} />
            <div className="mt-[30px]">
              <SkeletonRows />
            </div>
          </>
        }
      >
        {(data) => (
          <>
            <Summary s={data.summary} />
            <SourceLine>
              Cash only — what the API costs us is on the money page.{" "}
              <Link href="/admin/money" className="font-medium text-accent-deep hover:underline">
                Full P&amp;L →
              </Link>
            </SourceLine>

            <Section title="Top products">
              <DataTable
                rows={data.summary.top_products ?? []}
                columns={PRODUCT_COLUMNS}
                rowKey={(p) => p.product_id}
                empty={<EmptyState title="Nothing sold in this window" hint="Try a longer window." />}
              />
            </Section>

            <Section title="Feed" note={`newest first · up to ${FEED_LIMIT}`}>
              <DataTable
                rows={data.rows}
                columns={FEED_COLUMNS}
                rowKey={(r) => String(r.id)}
                rowHref={(r) => {
                  const txn = txnOf(r);
                  return txn ? entityHref("purchase", txn) : entityHref("user", r.user_id);
                }}
                rowTone={(r) => (r.event === "refund" ? "bad" : null)}
                empty={<EmptyState title="No purchases in this window" hint="Try a longer window." />}
              />
            </Section>
          </>
        )}
      </Loaded>
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
