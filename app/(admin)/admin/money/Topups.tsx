"use client";

import { useState, type FormEvent } from "react";
import { isAdminDenied, rpc, type SpendIntervalRow, type TopupRow } from "../../../../lib/admin/rpc";
import { formatShortDate, formatUsd, formatWhen } from "../../../../lib/admin/format";
import { Badge, Card, DataTable, EmptyState, type Column } from "../ui";

/* ---------------------------------------------------------------------------
 * OnlineSim top-ups.
 *
 * Real spend is read off the OnlineSim balance, and a top-up makes the balance
 * jump *up* — which, unlogged, would hide that much spending. So every top-up
 * is written down here, and the balance math adds it back. The database flags
 * jumps nobody has logged ("probable top-ups") so they can be logged with one
 * tap, amount and time pre-filled.
 * ------------------------------------------------------------------------ */

const INPUT =
  "w-full rounded-[8px] border border-border bg-card px-[10px] py-[8px] text-[16px] md:text-body focus:border-accent-deep focus:outline-none";

/** `datetime-local` wants local wall time without a zone. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type Prefill = { amount: number; at: string } | null;

export function ProbableTopups({ rows, onLog }: { rows: SpendIntervalRow[]; onLog: (p: Prefill) => void }) {
  const flagged = rows.filter((r) => r.probable_topup).reverse();
  if (flagged.length === 0) return null;
  return (
    <div role="status" className="rounded-card border border-warn/30 bg-warn-soft p-[14px]">
      <p className="text-body font-semibold text-warn">
        {flagged.length === 1 ? "1 balance jump" : `${flagged.length} balance jumps`} with no top-up logged
      </p>
      <p className="mt-[2px] text-label text-ink-muted">
        The OnlineSim balance went up and nothing explains it. If you topped up, log it — until then real spend
        for that period is understated by the amount shown.
      </p>
      <ul className="mt-[10px] flex flex-col gap-[6px]">
        {flagged.map((r) => (
          <li key={r.to_at} className="flex flex-wrap items-center justify-between gap-[8px] rounded-[10px] bg-card px-[12px] py-[8px]">
            <span className="text-label">
              <span className="font-semibold tabular-nums">+{formatUsd(r.unexplained_increase)}</span>{" "}
              <span className="text-ink-muted">around {formatWhen(r.to_at)}</span>
            </span>
            <button
              type="button"
              onClick={() => onLog({ amount: Math.round(r.unexplained_increase * 100) / 100, at: r.to_at })}
              className="cta cta--sm"
            >
              Log as top-up
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopupForm({
  prefill,
  onSaved,
  onDenied,
}: {
  prefill: Prefill;
  onSaved: () => void;
  onDenied: () => void;
}) {
  const [amount, setAmount] = useState(prefill ? String(prefill.amount) : "");
  const [at, setAt] = useState(prefill ? toLocalInput(prefill.at) : toLocalInput(new Date().toISOString()));
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const value = Number(amount);
  const valid = Number.isFinite(value) && value > 0 && value <= 10000 && !!at;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await rpc.topupAdd(value, new Date(at).toISOString(), note.trim() || null);
      setDone(`Logged ${formatUsd(value)} (audit #${res.audit_id}).`);
      setAmount("");
      setNote("");
      setConfirming(false);
      onSaved();
    } catch (err) {
      if (isAdminDenied(err)) return onDenied();
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-[10px] sm:grid-cols-[140px_1fr] lg:grid-cols-[140px_220px_1fr_auto] lg:items-end">
      <label className="block">
        <span className="text-caption uppercase tracking-[0.07em] text-muted">Amount (USD)</span>
        <input
          className={INPUT}
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setConfirming(false);
          }}
          placeholder="50.00"
          required
        />
      </label>
      <label className="block">
        <span className="text-caption uppercase tracking-[0.07em] text-muted">When (your local time)</span>
        <input
          className={INPUT}
          type="datetime-local"
          value={at}
          onChange={(e) => {
            setAt(e.target.value);
            setConfirming(false);
          }}
          required
        />
      </label>
      <label className="block sm:col-span-2 lg:col-span-1">
        <span className="text-caption uppercase tracking-[0.07em] text-muted">Note (optional)</span>
        <input className={INPUT} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Card, invoice #…" />
      </label>
      <div className="flex flex-wrap items-center gap-[8px] sm:col-span-2 lg:col-span-1">
        <button type="submit" disabled={!valid || busy} className="cta cta--sm disabled:opacity-50">
          {busy ? "Saving…" : confirming ? `Confirm ${formatUsd(value)}` : "Log top-up"}
        </button>
        {confirming && !busy ? (
          <button type="button" onClick={() => setConfirming(false)} className="text-label text-muted underline">
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-label text-bad sm:col-span-2 lg:col-span-4">{error}</p> : null}
      {done ? <p className="text-label text-good sm:col-span-2 lg:col-span-4">{done}</p> : null}
    </form>
  );
}

function VoidButton({ row, onDone, onDenied }: { row: TopupRow; onDone: () => void; onDenied: () => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-label text-muted underline hover:text-bad">
        Void
      </button>
    );
  }
  return (
    <div className="flex flex-col gap-[6px]">
      <input
        className={INPUT}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why? (8+ characters)"
        autoFocus
      />
      <div className="flex gap-[8px]">
        <button
          type="button"
          disabled={reason.trim().length < 8 || busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await rpc.topupVoid(row.id, reason.trim());
              onDone();
            } catch (err) {
              if (isAdminDenied(err)) return onDenied();
              setError(err instanceof Error ? err.message : "Could not void.");
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-[8px] bg-bad px-[10px] py-[5px] text-label text-white disabled:opacity-50"
        >
          {busy ? "Voiding…" : "Void top-up"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-label text-muted underline">
          Cancel
        </button>
      </div>
      {error ? <p className="text-caption text-bad">{error}</p> : null}
    </div>
  );
}

export function TopupTable({ rows, onChanged, onDenied }: { rows: TopupRow[]; onChanged: () => void; onDenied: () => void }) {
  const columns: Column<TopupRow>[] = [
    {
      key: "amount",
      header: "Amount",
      mobile: "title",
      cell: (r) => (
        <span className={`tabular-nums font-semibold ${r.voided_at ? "text-muted line-through" : ""}`}>{formatUsd(r.amount_usd)}</span>
      ),
    },
    { key: "when", header: "When", mobile: "title", cell: (r) => formatShortDate(r.occurred_at, true) },
    {
      key: "state",
      header: "State",
      mobile: "aside",
      cell: (r) => (r.voided_at ? <Badge tone="neutral">voided</Badge> : <Badge tone="good">counted</Badge>),
    },
    {
      key: "note",
      header: "Note",
      cell: (r) => (
        <span className="text-ink-muted">
          {r.note || "—"}
          {r.void_reason ? <span className="block text-caption text-muted">Void: {r.void_reason}</span> : null}
        </span>
      ),
    },
    { key: "by", header: "Logged by", cell: (r) => <span className="text-ink-muted">{r.created_by_email ?? "—"}</span> },
    {
      key: "act",
      header: "",
      cell: (r) => (r.voided_at ? null : <VoidButton row={r} onDone={onChanged} onDenied={onDenied} />),
    },
  ];
  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey={(r) => String(r.id)}
      empty={<EmptyState title="No top-ups logged" hint="Log each OnlineSim top-up so balance drops can be read as spend." />}
    />
  );
}

export function TopupCard({
  rows,
  prefill,
  onChanged,
  onDenied,
}: {
  rows: TopupRow[];
  prefill: Prefill;
  onChanged: () => void;
  onDenied: () => void;
}) {
  return (
    <Card title="Log a top-up" note="Every time you add money to OnlineSim. Needed so a balance jump isn't read as negative spending.">
      {/* Keyed on the prefill so a "Log as top-up" tap re-seeds the form. */}
      <TopupForm key={prefill ? `${prefill.at}-${prefill.amount}` : "blank"} prefill={prefill} onSaved={onChanged} onDenied={onDenied} />
      <div className="mt-[16px]">
        <TopupTable rows={rows} onChanged={onChanged} onDenied={onDenied} />
      </div>
    </Card>
  );
}
