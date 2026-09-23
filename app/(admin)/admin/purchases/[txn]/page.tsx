"use client";

import Link from "next/link";
import { use, type ReactNode } from "react";
import { AuthGate } from "../../AuthGate";
import {
  Badge,
  Card,
  DataTable,
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
  Stat,
  StatGrid,
  StatusBadge,
  useAdminData,
  type Column,
} from "../../ui";
import {
  formatCoins,
  formatPct,
  formatRelative,
  formatUsd,
  formatWhen,
} from "../../../../../lib/admin/format";
import { rpc, type PurchaseDetail, type PurchaseLedgerEntry } from "../../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * One store transaction, from the customer's price to what reached us.
 *
 * rc_credit_grants is the base (see admin_purchase_detail), so a purchase that
 * never reached a wallet — an anonymous RevenueCat customer, a sandbox buy with
 * grants off — still opens here, just with no user and no ledger.
 *
 * The page answers three questions an operator arrives with: how much did we
 * actually keep (gross → Apple → net, measured, not assumed), is this money
 * still ours (refund / reversal state), and if Apple took it back, how many of
 * those coins had already been turned into numbers we paid OnlineSim for.
 * ------------------------------------------------------------------------ */

const NOTHING = "—";

/** Next hands a dynamic segment over still percent-encoded in some cases (a
 *  txn id with a `:` or `/` in it). Decode once; a malformed escape is left
 *  as typed rather than crashing the page. */
function decodeTxn(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

async function loadPurchase(txn: string): Promise<PurchaseDetail | null> {
  if (!txn.trim()) return null;
  try {
    return await rpc.purchaseDetail(txn);
  } catch (err) {
    // callRow's empty result: an unknown transaction, shown as not-found.
    if (err instanceof Error && /returned no row/.test(err.message)) return null;
    throw err;
  }
}

function Signed({ coins }: { coins: number | null | undefined }) {
  if (coins === null || coins === undefined) return <>{NOTHING}</>;
  return (
    <span className={`tabular-nums ${coins < 0 ? "text-bad" : "text-good"}`}>
      {coins > 0 ? "+" : ""}
      {formatCoins(coins)}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Gross − Apple = Net
 * ------------------------------------------------------------------------ */

function Term({ label, value, note, tone }: { label: string; value: string; note?: ReactNode; tone?: "good" | "bad" }) {
  return (
    <div className="min-w-0 flex-1 rounded-[10px] bg-panel px-[12px] py-[10px]">
      <div className="text-caption uppercase tracking-[0.07em] text-muted">{label}</div>
      <div className={`mt-[2px] text-[20px] font-semibold tabular-nums ${tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : "text-ink"}`}>
        {value}
      </div>
      {note ? <div className="mt-[1px] text-caption text-ink-muted">{note}</div> : null}
    </div>
  );
}

function Op({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-center text-[20px] font-semibold text-muted" aria-hidden>
      {children}
    </div>
  );
}

function MoneyEquation({ p }: { p: PurchaseDetail }) {
  return (
    <Card title="What we kept" note="Customer price, minus Apple's cut, is what reaches us">
      {/* Stacks on a phone (the operators read top to bottom), a row from sm up. */}
      <div className="flex flex-col gap-[6px] sm:flex-row sm:items-stretch">
        <Term label="Gross" value={formatUsd(p.gross_usd)} note="Price the customer paid" />
        <Op>−</Op>
        <Term
          label="Apple fee"
          value={formatUsd(p.apple_fee_usd)}
          note={p.takehome_pct !== null ? `${formatPct(100 - Number(p.takehome_pct))} of gross` : undefined}
        />
        <Op>=</Op>
        <Term
          label="Net"
          value={formatUsd(p.net_usd)}
          tone={p.net_usd !== null ? "good" : undefined}
          note={p.takehome_pct !== null ? `${formatPct(p.takehome_pct)} take-home` : undefined}
        />
      </div>
      <SourceLine>
        Gross is RevenueCat&apos;s <code className="font-mono">price_usd</code> for this event. Net is the purchase
        ledger row&apos;s <code className="font-mono">usd_value</code>, which rc-webhook computed from RevenueCat&apos;s
        take-home percentage — so the fee is measured, not assumed.
        {p.gross_usd === null ? " RevenueCat sent no price here, so the fee cannot be shown." : null}
        {p.net_usd === null ? " There is no purchase ledger row, so nothing reached a wallet." : null}
        {p.sandbox ? " Sandbox: no real money moved and the P&L ignores it." : null}
      </SourceLine>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Refund exposure
 * ------------------------------------------------------------------------ */

function RefundCard({ p }: { p: PurchaseDetail }) {
  if (!p.reversal_state) {
    return (
      <Card title="Refund state" note="Not refunded">
        <StatGrid wide={3}>
          <Stat
            label="Coins spent since"
            value={formatCoins(p.coins_spent_after)}
            help="Coins this user committed to numbers after this purchase (spends minus refunds). If Apple refunds it later, this is how many of the coins may already be gone."
            source="wallet_ledger spend + refund rows after the purchase"
          />
        </StatGrid>
      </Card>
    );
  }

  const refunded = p.reversal_state === "refunded";
  const exposure = p.coins_spent_before_refund ?? 0;
  return (
    <Card
      title={
        <span className="inline-flex flex-wrap items-center gap-[8px]">
          Refund state
          <Badge tone={refunded ? "bad" : "info"}>{refunded ? "refunded by Apple" : "refund reversed"}</Badge>
        </span>
      }
      note={`${refunded ? "Refunded" : "Reversed"} ${formatWhen(p.reversal_at)}`}
    >
      <StatGrid wide={4}>
        <Stat label="Coins clawed back" value={formatCoins(p.clawed_coins)} help="Coins taken back out of the wallet when the refund arrived." />
        <Stat
          label="Shortfall"
          value={formatCoins(p.shortfall_coins)}
          tone={(p.shortfall_coins ?? 0) > 0 ? "bad" : "neutral"}
          help="Coins that should have been clawed back but were no longer in the wallet — the user had already spent them."
        />
        {refunded ? (
          <Stat
            label="Spent before refund"
            value={formatCoins(p.coins_spent_before_refund)}
            tone={exposure > 0 ? "warn" : "neutral"}
            help="Coins spent on numbers between the purchase and Apple's refund. Those numbers were bought from OnlineSim with money Apple then gave back — this is the refund's real cost to us."
            source="wallet_ledger spend + refund rows between purchase and refund"
          />
        ) : null}
        <Stat label="Coins spent since purchase" value={formatCoins(p.coins_spent_after)} />
      </StatGrid>
      {refunded ? (
        <p className="mt-[12px] text-label text-ink-muted">
          {exposure > 0
            ? `${formatCoins(exposure)} coins were already spent when Apple refunded. We keep the OnlineSim cost of those numbers and lose the revenue.`
            : "Nothing was spent before the refund, so the clawback recovered it all."}
        </p>
      ) : (
        <p className="mt-[12px] text-label text-ink-muted">
          Apple reversed its refund, so the money is ours again and the coins were re-granted (see the ledger below).
        </p>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Ledger
 * ------------------------------------------------------------------------ */

/* A purchase's ledger rows are purchase / clawback / regrant and carry no
   activation today; the column links one if the RPC ever starts returning it. */
function ledgerActivation(r: PurchaseLedgerEntry): string | null {
  const id = (r as { activation_id?: unknown }).activation_id;
  return typeof id === "string" && isUuid(id) ? id : null;
}

const LEDGER_COLUMNS: Column<PurchaseLedgerEntry>[] = [
  { key: "kind", header: "Kind", mobile: "title", cell: (r) => <StatusBadge status={r.kind} /> },
  { key: "delta", header: "Coins", align: "right", mobile: "aside", cell: (r) => <Signed coins={r.delta_coins} /> },
  { key: "when", header: "When", cell: (r) => <span title={formatWhen(r.created_at)}>{formatWhen(r.created_at)}</span> },
  { key: "balance", header: "Balance after", align: "right", cell: (r) => formatCoins(r.balance_after) },
  { key: "short", header: "Shortfall", align: "right", cell: (r) => (r.shortfall_coins ? <span className="text-bad">{formatCoins(r.shortfall_coins)}</span> : NOTHING) },
  { key: "usd", header: "Net $", align: "right", cell: (r) => formatUsd(r.usd_value) },
  {
    key: "ref",
    header: "Reference",
    cell: (r) => {
      const act = ledgerActivation(r);
      if (act) return <EntityLink type="activation" id={act} />;
      return (
        <span className="break-all font-mono text-caption text-ink-muted [overflow-wrap:anywhere]">
          {r.note ?? r.idempotency_key}
        </span>
      );
    },
  },
];

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------ */

function flags(input: Record<string, unknown> | null): [string, string][] {
  if (!input) return [];
  return Object.entries(input).map(([k, v]) => [k, v !== null && typeof v === "object" ? JSON.stringify(v) : String(v)]);
}

function Detail({ p }: { p: PurchaseDetail }) {
  const abuse = flags(p.abuse_flags);
  return (
    <div className="flex flex-col gap-[14px]">
      <MoneyEquation p={p} />
      <div className="grid grid-cols-1 gap-[14px] lg:grid-cols-2">
        <Card title="Purchase">
          <Facts
            items={[
              {
                label: "User",
                value: p.user_id ? (
                  <EntityLink type="user" id={p.user_id}>
                    {p.email_masked ?? shortId(p.user_id)}
                  </EntityLink>
                ) : (
                  <span className="text-muted">No wallet — RevenueCat id {p.app_user_id ?? NOTHING}</span>
                ),
                wide: true,
              },
              { label: "Product", value: <span className="break-all">{p.product_id ?? NOTHING}</span>, wide: true },
              { label: "Coins granted", value: formatCoins(p.coins ?? p.credits) },
              { label: "Event", value: p.event_type ?? NOTHING },
              { label: "Store", value: p.store ?? NOTHING },
              {
                label: "Environment",
                value: p.sandbox ? <Badge tone="warn">sandbox</Badge> : p.environment ? <Badge tone="good">{p.environment.toLowerCase()}</Badge> : NOTHING,
              },
              { label: "Purchased", value: formatWhen(p.purchased_at), wide: true },
              { label: "Granted", value: formatWhen(p.granted_at), wide: true },
              { label: "Ledger row", value: formatWhen(p.ledger_at), wide: true },
              { label: "Transaction", value: <ShortId id={p.transaction_id} /> },
            ]}
          />
        </Card>
        <RefundCard p={p} />
      </div>

      <Card title="Abuse flags" note="Set by rc-webhook when a purchase or refund pattern looks off">
        {abuse.length === 0 ? (
          <p className="text-label text-muted">None recorded.</p>
        ) : (
          <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-[14px] gap-y-[4px] text-label">
            {abuse.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="break-all font-mono text-caption text-muted">{k}</dt>
                <dd className="break-words text-ink [overflow-wrap:anywhere]">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      <section>
        <h2 className="mb-[10px] font-sans text-subheading">Ledger history</h2>
        <DataTable
          rows={p.ledger ?? []}
          columns={LEDGER_COLUMNS}
          rowKey={(r) => String(r.id)}
          empty={<EmptyState title="No ledger rows" hint="This transaction never reached a wallet (anonymous buyer or sandbox with grants off)." />}
        />
        <SourceLine>Every wallet_ledger row carrying this transaction id: the purchase, any clawback and any regrant.</SourceLine>
      </section>
    </div>
  );
}

function PurchaseScreen({ txn }: { txn: string }) {
  const { status, retry } = useAdminData(() => loadPurchase(txn), txn);
  const p = status.phase === "ready" ? status.data : null;
  const userHref = p?.user_id ? entityHref("user", p.user_id) : null;

  return (
    <div>
      <PageHeader
        crumbs={[
          { href: "/admin/purchases", label: "Purchases" },
          ...(p && userHref ? [{ href: userHref, label: p.email_masked ?? shortId(p.user_id ?? "") }] : []),
        ]}
        title={p ? `${formatUsd(p.gross_usd ?? p.net_usd)} · ${formatCoins(p.coins ?? p.credits)} coins` : "Purchase"}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-[8px]">
            {p?.sandbox ? <Badge tone="warn">sandbox</Badge> : null}
            {p?.reversal_state === "refunded" ? <Badge tone="bad">refunded</Badge> : null}
            {p?.reversal_state === "reversed" ? <Badge tone="info">refund reversed</Badge> : null}
            {p && !p.reversal_state && !p.sandbox ? <Badge tone="good">paid</Badge> : null}
            <span className="break-all font-mono">{shortId(txn)}</span>
            {p ? <span className="text-muted">{formatRelative(p.purchased_at ?? p.granted_at)}</span> : null}
          </span>
        }
        actions={<RefreshButton onClick={retry} busy={status.phase === "loading"} />}
      />
      <Loaded
        status={status}
        retry={retry}
        title="Could not load this purchase"
        skeleton={
          <div className="flex flex-col gap-[14px]">
            <SkeletonStats n={3} />
            <SkeletonRows n={4} />
          </div>
        }
      >
        {(data) =>
          data ? (
            <Detail p={data} />
          ) : (
            <EmptyState
              title="No such transaction"
              hint="Neither RevenueCat's grant log nor the wallet ledger has this transaction id."
              action={
                <Link href="/admin/purchases" className="text-label text-accent-deep hover:underline">
                  Back to purchases →
                </Link>
              }
            />
          )
        }
      </Loaded>
    </div>
  );
}

/** Same shape as users/[id]: a client page unwraps the params Promise with
 *  use() (Next 16, dynamic routes). The segment is named `txn` because store
 *  transaction ids are not uuids. */
export default function PurchaseRoute({ params }: { params: Promise<{ txn: string }> }) {
  const { txn } = use(params);
  const decoded = decodeTxn(txn);
  return (
    <AuthGate>
      <PurchaseScreen txn={decoded} />
    </AuthGate>
  );
}
