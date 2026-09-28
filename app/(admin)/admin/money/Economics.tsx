"use client";

import { useState, type FormEvent } from "react";
import {
  isAdminDenied,
  isMigrationMissing,
  rpc,
  type EconomicsMetric,
  type EconomicsReport,
} from "../../../../lib/admin/rpc";
import { formatUsd, formatWhen } from "../../../../lib/admin/format";
import { Card, Loaded, Section, useAdminData } from "../ui";

const INPUT =
  "w-full rounded-[8px] border border-border bg-card px-[10px] py-[8px] text-[16px] md:text-body focus:border-accent-deep focus:outline-none";

const METRICS: { key: string; label: string }[] = [
  { key: "gross_customer_sales", label: "Gross sales" },
  { key: "direct_costs", label: "Direct costs" },
  { key: "operating_expenses", label: "Project expenses" },
  { key: "net_proceeds", label: "Net proceeds" },
  { key: "net_profit", label: "Net profit" },
];

function metricText(metric: EconomicsMetric | undefined): string {
  if (!metric || metric.amount === null) return "Unavailable";
  if (metric.currency === "USD") return formatUsd(metric.amount);
  return `${metric.amount} ${metric.currency}`;
}

function BasisCard({ title, basis }: { title: string; basis: EconomicsReport["purchase"] }) {
  return (
    <Card title={title} note={basis.formula_version}>
      {METRICS.map((item) => {
        const metric = basis.native[item.key];
        return (
          <p key={item.key} className="flex items-baseline justify-between gap-[12px] py-[4px] text-body">
            <span>{item.label}</span>
            <span className="text-right tabular-nums">
              {metricText(metric)}
              {metric?.reason ? <span className="mt-[1px] block text-caption text-muted">{metric.reason}</span> : null}
            </span>
          </p>
        );
      })}
      <p className="mt-[8px] text-caption text-muted">
        GBP {metricText(basis.gbp.net_profit)} · {basis.gbp.net_profit?.reason ?? basis.fx_policy_version}
      </p>
    </Card>
  );
}

async function cutoffOf(cutoff: Promise<string>): Promise<string | undefined> {
  try {
    return await cutoff;
  } catch (err) {
    if (!isMigrationMissing(err)) throw err;
    return undefined;
  }
}

export function Economics({
  hours,
  tick,
  cutoff,
  onChanged,
  onDenied,
}: {
  hours: number;
  tick: number;
  cutoff: Promise<string>;
  onChanged: () => void;
  onDenied: () => void;
}) {
  const report = useAdminData<EconomicsReport>(async () => {
    const asOf = await cutoffOf(cutoff);
    return rpc.economics(hours, asOf);
  }, `${hours}:${tick}`);

  return (
    <Section
      title="Comparable reporting"
      note="Legacy profit above is unchanged. Missing fees, FX, overhead and tax stay blank."
    >
      <Loaded status={report.status} retry={report.retry} title="Could not load the comparable report">
        {(data) => <EconomicsBody data={data} onChanged={onChanged} onDenied={onDenied} />}
      </Loaded>
    </Section>
  );
}

function EconomicsBody({
  data,
  onChanged,
  onDenied,
}: {
  data: EconomicsReport;
  onChanged: () => void;
  onDenied: () => void;
}) {
  const residuals = data.reconciliation.runs[0]?.residuals ?? [];
  const bankMissing = data.balances.warnings.includes("bank_cash_unavailable");

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-3">
        <BasisCard title="Purchase" basis={data.purchase} />
        <BasisCard title="Earned" basis={data.earned_management} />
        <BasisCard title="Settled cash" basis={data.settled_cash} />
      </div>

      <Card title="Supplier residuals" note="Not posted as a second cost or a sale">
        {residuals.map((row) => (
          <p key={row.code} className="flex items-baseline justify-between gap-[12px] py-[3px] text-body">
            <span>{row.code}</span>
            <span className="text-right tabular-nums">
              {row.amount.amount === null ? "Unavailable" : formatUsd(row.amount.amount)}
              {row.amount.reason ? <span className="block text-caption text-muted">{row.amount.reason}</span> : null}
            </span>
          </p>
        ))}
        <p className="mt-[8px] text-caption text-muted">
          Subscriptions {data.subscriptions.supported ? "supported" : "unavailable"}
          {data.subscriptions.reason ? ` · ${data.subscriptions.reason}` : ""}. Manual income this window{" "}
          {data.manual_income_usd.amount === null ? "unavailable" : formatUsd(data.manual_income_usd.amount)}, not exported.
        </p>
      </Card>

      <Card title="Operations" note="Counts only. Outstanding coins are a stock.">
        {data.operations.buckets.length === 0 ? (
          <p className="text-body text-muted">No days in this window.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-label">
              <thead className="text-caption uppercase tracking-[0.07em] text-muted">
                <tr>
                  <th className="py-[6px] pr-[12px]">Day</th>
                  <th className="py-[6px] pr-[12px]">Bought</th>
                  <th className="py-[6px] pr-[12px]">Spent</th>
                  <th className="py-[6px] pr-[12px]">Refunded</th>
                  <th className="py-[6px] pr-[12px]">Delivered</th>
                  <th className="py-[6px] pr-[12px]">Attempted</th>
                  <th className="py-[6px]">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {data.operations.buckets.map((bucket) => {
                  const flow = (name: string) => bucket.flows.find((item) => item.name === name)?.count ?? 0;
                  const stock = bucket.stocks.find((item) => item.name === "coins_outstanding")?.count ?? 0;
                  return (
                    <tr key={bucket.date} className="border-t border-border">
                      <td className="py-[6px] pr-[12px]">
                        {bucket.date}
                        {bucket.partial ? " · partial" : ""}
                      </td>
                      <td className="py-[6px] pr-[12px] tabular-nums">{flow("coins_bought")}</td>
                      <td className="py-[6px] pr-[12px] tabular-nums">{flow("coins_spent")}</td>
                      <td className="py-[6px] pr-[12px] tabular-nums">{flow("coins_refunded")}</td>
                      <td className="py-[6px] pr-[12px] tabular-nums">{flow("sms_delivered")}</td>
                      <td className="py-[6px] pr-[12px] tabular-nums">{flow("sms_attempted")}</td>
                      <td className="py-[6px] tabular-nums">{stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Balances" note={bankMissing ? "Bank cash is unavailable until an opening balance is imported." : "Stocks are not additive."}>
        {data.balances.snapshots.length === 0 ? (
          <p className="text-body text-muted">No balance snapshots.</p>
        ) : (
          data.balances.snapshots.map((snap) => (
            <p key={`${snap.account_kind}-${snap.financial_account_id}`} className="flex justify-between gap-[12px] py-[3px] text-body">
              <span>
                {snap.account_kind} · {snap.financial_account_id}
              </span>
              <span className="tabular-nums">
                {snap.amount.amount === null ? "Unavailable" : formatUsd(snap.amount.amount)}
                <span className="block text-caption text-muted">{formatWhen(snap.as_of)}</span>
              </span>
            </p>
          ))
        )}
      </Card>

      <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-2">
        <EntryForm entries={data.entries} onChanged={onChanged} onDenied={onDenied} />
        <StatementForm sales={data.sales} statements={data.statements} onChanged={onChanged} onDenied={onDenied} />
      </div>
    </div>
  );
}

function EntryForm({
  entries,
  onChanged,
  onDenied,
}: {
  entries: EconomicsReport["entries"];
  onChanged: () => void;
  onDenied: () => void;
}) {
  const [kind, setKind] = useState<"expense" | "manual_income">("expense");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState("");
  const [account, setAccount] = useState("acct-smscode-card");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await rpc.projectEntryDraft({
        kind,
        vendor,
        category,
        amount: Number(amount),
        currency: "USD",
        paidOn: paidOn || null,
        paymentAccountId: account || null,
        taxInclusion: "unknown",
      });
      onChanged();
    } catch (err) {
      if (isAdminDenied(err)) return onDenied();
      setError(err instanceof Error ? err.message : "Could not save the draft.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card title="Project expenses" note="Shared company expenses are entered in Simnetiq, not here.">
      <form onSubmit={onSubmit} className="grid gap-[8px]">
        <select className={INPUT} value={kind} onChange={(event) => setKind(event.target.value as "expense" | "manual_income")}>
          <option value="expense">Expense</option>
          <option value="manual_income">Manual income (not exported)</option>
        </select>
        <input className={INPUT} placeholder="Vendor" value={vendor} onChange={(event) => setVendor(event.target.value)} />
        <input className={INPUT} placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} required={kind === "expense"} />
        <input className={INPUT} placeholder="Amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required />
        <input className={INPUT} type="date" value={paidOn} onChange={(event) => setPaidOn(event.target.value)} />
        <input className={INPUT} placeholder="Payment account id" value={account} onChange={(event) => setAccount(event.target.value)} />
        <button type="submit" disabled={busy} className="cta cta--sm justify-self-start">
          {busy ? "Saving…" : "Save draft"}
        </button>
        {error ? <p className="text-caption text-bad">{error}</p> : null}
      </form>
      <ul className="mt-[14px] flex flex-col gap-[8px]">
        {entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} onChanged={onChanged} onDenied={onDenied} />
        ))}
      </ul>
    </Card>
  );
}

function EntryRow({
  entry,
  onChanged,
  onDenied,
}: {
  entry: EconomicsReport["entries"][number];
  onChanged: () => void;
  onDenied: () => void;
}) {
  const [reason, setReason] = useState("");
  const [nextAmount, setNextAmount] = useState(entry.amount);
  const [error, setError] = useState<string | null>(null);

  async function act(work: () => Promise<unknown>) {
    setError(null);
    try {
      await work();
      onChanged();
    } catch (err) {
      if (isAdminDenied(err)) return onDenied();
      setError(err instanceof Error ? err.message : "Could not update the entry.");
    }
  }

  return (
    <li className="border-t border-border pt-[8px] text-label">
      <p>
        {entry.entry_kind} · {entry.status} · {entry.amount} {entry.currency}
        {entry.category ? ` · ${entry.category}` : ""}
        {entry.exported ? "" : " · not exported"}
      </p>
      {entry.status === "draft" ? (
        <button type="button" className="mt-[4px] text-accent-deep underline" onClick={() => act(() => rpc.projectEntryPost(entry.id))}>
          Post
        </button>
      ) : null}
      {entry.status === "posted" && entry.entry_kind === "expense" ? (
        <div className="mt-[6px] flex flex-wrap gap-[6px]">
          <input className={INPUT} value={nextAmount} onChange={(event) => setNextAmount(event.target.value)} />
          <input className={INPUT} placeholder="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          <button
            type="button"
            className="text-accent-deep underline"
            onClick={() => act(() => rpc.projectEntryCorrect(entry.id, Number(nextAmount), reason))}
          >
            Correct
          </button>
          <button type="button" className="text-bad underline" onClick={() => act(() => rpc.projectEntryVoid(entry.id, reason))}>
            Void
          </button>
          <label className="text-muted">
            Receipt
            <input
              className="block text-caption"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void act(async () => {
                  const bytes = new Uint8Array(await file.arrayBuffer());
                  const digest = await crypto.subtle.digest("SHA-256", bytes);
                  const sha = [...new Uint8Array(digest)].map((part) => part.toString(16).padStart(2, "0")).join("");
                  const hex = [...bytes].map((part) => part.toString(16).padStart(2, "0")).join("");
                  await rpc.projectReceiptPut(entry.id, sha, `\\x${hex}`, file.type || "application/octet-stream");
                });
              }}
            />
          </label>
        </div>
      ) : null}
      {error ? <p className="text-caption text-bad">{error}</p> : null}
    </li>
  );
}

function StatementForm({
  sales,
  statements,
  onChanged,
  onDenied,
}: {
  sales: EconomicsReport["sales"];
  statements: EconomicsReport["statements"];
  onChanged: () => void;
  onDenied: () => void;
}) {
  const [kind, setKind] = useState<EconomicsReport["statements"][number]["line_kind"]>("settlement");
  const [amount, setAmount] = useState("");
  const [ref, setRef] = useState("");
  const [account, setAccount] = useState("acct-smscode-bank");
  const [destination, setDestination] = useState("acct-smscode-onlinesim");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const direction = kind === "payout" || kind === "transfer" ? "outflow" : "inflow";
      const lineId = await rpc.statementImport({
        account,
        occurredAt: new Date().toISOString(),
        amount: Number(amount),
        direction,
        lineKind: kind as "settlement" | "payout" | "opening_balance" | "transfer",
        externalRef: ref,
        destination: kind === "transfer" ? destination : null,
        currency: "USD",
      });
      if ((kind === "settlement" || kind === "payout") && selected.length > 0) {
        const total = Number(amount);
        const share = Math.floor((total / selected.length) * 10000) / 10000;
        let used = 0;
        for (let index = 0; index < selected.length; index += 1) {
          const part = index === selected.length - 1 ? Math.round((total - used) * 10000) / 10000 : share;
          used += part;
          await rpc.statementMatch(lineId, selected[index], part);
        }
      }
      onChanged();
    } catch (err) {
      if (isAdminDenied(err)) return onDenied();
      setError(err instanceof Error ? err.message : "Could not import the line.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card title="Statement lines" note="No bank feed. Cash stays unavailable until you import an opening balance.">
      <form onSubmit={onSubmit} className="grid gap-[8px]">
        <select className={INPUT} value={kind} onChange={(event) => setKind(event.target.value)}>
          <option value="settlement">Settlement</option>
          <option value="payout">Payout</option>
          <option value="opening_balance">Opening balance</option>
          <option value="transfer">Transfer</option>
        </select>
        <input className={INPUT} placeholder="Account id" value={account} onChange={(event) => setAccount(event.target.value)} />
        {kind === "transfer" ? (
          <input className={INPUT} placeholder="Destination account id" value={destination} onChange={(event) => setDestination(event.target.value)} />
        ) : null}
        <input className={INPUT} placeholder="Amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required />
        <input className={INPUT} placeholder="External reference" value={ref} onChange={(event) => setRef(event.target.value)} required />
        {sales.length > 0 && (kind === "settlement" || kind === "payout") ? (
          <fieldset className="text-label">
            <legend className="mb-[4px] text-muted">Match existing sales</legend>
            {sales.map((sale) => (
              <label key={sale.record_id} className="flex gap-[6px] py-[2px]">
                <input
                  type="checkbox"
                  checked={selected.includes(sale.record_id)}
                  onChange={(event) => {
                    setSelected((current) =>
                      event.target.checked ? [...current, sale.record_id] : current.filter((id) => id !== sale.record_id),
                    );
                  }}
                />
                <span>
                  {sale.record_id} · {sale.amount ?? "unavailable"}
                </span>
              </label>
            ))}
          </fieldset>
        ) : null}
        <button type="submit" disabled={busy} className="cta cta--sm justify-self-start">
          {busy ? "Importing…" : "Import line"}
        </button>
        {error ? <p className="text-caption text-bad">{error}</p> : null}
      </form>
      <ul className="mt-[14px] text-label">
        {statements.map((line) => (
          <li key={line.id} className="border-t border-border py-[6px]">
            {line.line_kind} · {line.amount} {line.currency} · {line.external_ref}
            {line.matches.length > 0 ? ` · ${line.matches.length} sales` : ""}
          </li>
        ))}
      </ul>
    </Card>
  );
}
