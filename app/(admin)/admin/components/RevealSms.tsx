"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { DeniedBody } from "../AuthGate";
import { formatWhen } from "../../../../lib/admin/format";
import { isAdminDenied, rpc, type RevealSmsRow, type UserActivationsRow } from "../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * Reveal SMS — the only path to a full number or a message body in this app.
 *
 * `admin_reveal_sms` writes the audit row *before* it selects anything, so a
 * reveal is recorded whether or not anyone reads the result, and it hands the
 * audit id back for the receipt. The eight-character reason is a Postgres
 * check; the one here only saves a round trip.
 *
 * Two shapes: on a user page it picks from that user's activations; on an
 * activation page it is bound to that one id and has no picker.
 *
 * Where the revealed row lives
 * ----------------------------
 * Nowhere but this component's state. A full number held in a parent, a
 * context, localStorage or the URL would outlive the reveal that was logged
 * for it and could reach the screen under another record with no second audit
 * row to explain it. React discards this state on unmount; callers key the
 * component by the record it belongs to so a reused subtree unmounts too; and
 * switching activation in the picker clears it in the handler.
 *
 * The small form pieces below are exported because the grant-coins form on
 * the user page follows the same review → confirm → receipt flow.
 * ------------------------------------------------------------------------ */

/** Mirrors `length(trim(p_reason)) < 8` in SQL, on both admin write RPCs. */
export const MIN_REASON = 8;

/* 16px on a phone: iOS zooms the page into any focused input smaller than that. */
export const INPUT =
  "w-full rounded-[8px] border border-border bg-card px-[10px] py-[8px] text-[16px] text-ink outline-none focus-visible:border-accent disabled:opacity-50 md:py-[7px] md:text-label";

/** The message is shown in full because only an `aal2` session ever reaches
 *  this screen — there is nobody here to keep it from, and a swallowed
 *  `check_violation` would read as "the button does nothing". */
export function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message) return reason.message;
  return "The request did not complete.";
}

export function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-card border border-border bg-card p-[16px]">
      <h3 className="font-sans text-subheading">{title}</h3>
      <p className="mt-[4px] text-caption text-muted">{note}</p>
      <div className="mt-[14px]">{children}</div>
    </section>
  );
}

export function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="text-caption uppercase tracking-[0.06em] text-muted">{text}</span>
      <span className="mt-[4px] block">{children}</span>
    </label>
  );
}

/** A rule the operator has broken while typing. Advisory, never load-bearing. */
export function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-[4px] text-caption text-muted">{children}</p>;
}

export function Failure({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-[12px] break-words rounded-[10px] border border-bad/30 bg-bad-soft px-[12px] py-[10px] text-label text-ink"
    >
      {message}
    </p>
  );
}

/** The step between filling a form in and it happening. Prose with two
 *  buttons rather than `window.confirm`: the sentence has to name the exact
 *  thing about to be done, which a native dialog cannot lay out. */
export function Confirm({
  children,
  action,
  busy,
  onConfirm,
  onCancel,
}: {
  children: ReactNode;
  action: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-[12px] rounded-[10px] border border-warn/30 bg-warn-soft px-[12px] py-[10px]">
      <p className="break-words text-label text-ink">{children}</p>
      <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
        <button type="button" onClick={onConfirm} disabled={busy} className="cta cta--sm disabled:opacity-60">
          {busy ? "Working…" : action}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="text-label text-muted underline underline-offset-2 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** The receipt line every audited action ends on. */
export function AuditId({ id }: { id: number }) {
  return (
    <span className="tabular-nums">
      audit id <span className="font-mono">{id}</span>
    </span>
  );
}

/** One line in the picker. Enough to tell two activations apart on the same
 *  day without a second lookup — and masked, because this list is drawn before
 *  any reveal has been authorised. */
function describeActivation(row: UserActivationsRow): string {
  const number = row.phone_masked ?? "no number";
  return `${formatWhen(row.created_at)} · ${row.service} · +${row.country_dial} ${number} · ${row.id.slice(0, 8)}`;
}

/** One revealed field. Rendered exactly once each — there is no second copy of
 *  a phone number or a message body anywhere in this tree. */
function Revealed({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="mt-[8px]">
      <div className="text-caption uppercase tracking-[0.06em] text-muted">{label}</div>
      <div className="mt-[2px] break-words font-mono text-label text-ink [overflow-wrap:anywhere]">
        {value === null || value === "" ? "—" : value}
      </div>
    </div>
  );
}

export type RevealSmsProps =
  | {
      /** Bound to one activation (the activation page). No picker. */
      activationId: string;
      /** When known false, there is nothing to reveal and no reveal is offered. */
      hasSms?: boolean;
      activations?: never;
      /** Without it, a denial renders the denied screen in place. */
      onDenied?: () => void;
    }
  | {
      /** Pick from a list the caller already loaded (the user page). */
      activations: UserActivationsRow[];
      activationId?: never;
      hasSms?: never;
      onDenied?: () => void;
    };

export function RevealSms(props: RevealSmsProps) {
  const { onDenied } = props;
  const [denied, setDenied] = useState(false);
  const deny = useCallback(() => (onDenied ? onDenied() : setDenied(true)), [onDenied]);

  const list = props.activations;
  const fixedId = props.activationId ?? null;

  /* `has_sms` is why `admin_user_activations` returns a boolean instead of the
     body: it says a message exists without being a read. An activation without
     one has nothing to reveal, so offering it would spend a logged, irreversible
     reveal on an empty row. They are counted below rather than silently
     dropped, so the list not matching the table above is explained on screen. */
  const revealable = useMemo(() => (list ?? []).filter((row) => row.has_sms), [list]);
  const withoutSms = (list?.length ?? 0) - revealable.length;

  const [selectedId, setSelectedId] = useState("");
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* The only place in this app a full number or a message body is held. Local
     state, deliberately — see the file header. */
  const [revealed, setRevealed] = useState<RevealSmsRow | null>(null);

  /* Derived, not stored: a reload can drop the selected row from the list (it
     was released, or the limit pushed it off the end), and a `<select>` whose
     value matches no option renders blank with no hint why. Falling back to the
     placeholder is at least honest about having lost the selection. */
  const chosenId = fixedId ?? revealable.find((row) => row.id === selectedId)?.id ?? null;
  const trimmedReason = reason.trim();
  const reasonLongEnough = trimmedReason.length >= MIN_REASON;
  const ready = chosenId !== null && reasonLongEnough && !busy;

  async function commit() {
    if (chosenId === null || !reasonLongEnough || busy) return;
    setBusy(true);
    setError(null);
    try {
      const row = await rpc.revealSms(chosenId, trimmedReason);
      setRevealed(row);
      setConfirming(false);
      setReason("");
    } catch (err) {
      if (isAdminDenied(err)) {
        deny();
        return;
      }
      setError(describeFailure(err));
    } finally {
      setBusy(false);
    }
  }

  if (denied) return <DeniedBody />;

  const nothingToReveal =
    fixedId !== null
      ? props.hasSms === false
        ? "No SMS arrived for this activation, so there is nothing to reveal."
        : null
      : revealable.length === 0
        ? (list?.length ?? 0) === 0
          ? "No activations."
          : `None of the ${list?.length} activations listed has an SMS to reveal.`
        : null;

  return (
    <Panel
      title="Reveal SMS"
      note={`The only path to a full number or a message body anywhere in this app. admin_reveal_sms writes the audit row before it selects anything, so the reveal is recorded whether or not you read the result. Postgres requires at least ${MIN_REASON} characters of reason.`}
    >
      {nothingToReveal ? (
        <p className="text-label text-muted">{nothingToReveal}</p>
      ) : (
        <>
          <div className="grid gap-[10px]">
            {fixedId === null ? (
              <Label text="Activation">
                <select
                  className={INPUT}
                  value={chosenId ?? ""}
                  disabled={busy}
                  onChange={(event) => {
                    setSelectedId(event.target.value);
                    /* A revealed row belongs to the activation it was logged
                       against. Changing the picker without clearing it would
                       leave one activation's message body sitting under another
                       activation's name. */
                    setRevealed(null);
                    setConfirming(false);
                    setError(null);
                  }}
                >
                  <option value="">Choose an activation…</option>
                  {revealable.map((row) => (
                    <option key={row.id} value={row.id}>
                      {describeActivation(row)}
                    </option>
                  ))}
                </select>
              </Label>
            ) : null}

            <Label text="Reason">
              <input
                className={INPUT}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setConfirming(false);
                }}
                autoComplete="off"
                placeholder="Why this message has to be read"
                disabled={busy}
              />
            </Label>
          </div>

          {fixedId === null ? (
            <p className="mt-[6px] text-caption text-muted">
              {revealable.length} of {list?.length ?? 0} listed activations received an SMS
              {withoutSms > 0 ? `; the other ${withoutSms} have nothing to reveal.` : "."}
            </p>
          ) : null}

          {reason !== "" && !reasonLongEnough ? (
            <Hint>
              {MIN_REASON} characters minimum — {trimmedReason.length} so far.
            </Hint>
          ) : null}

          <button
            type="button"
            className="cta cta--sm mt-[12px] disabled:opacity-60"
            disabled={!ready}
            onClick={() => {
              setError(null);
              setRevealed(null);
              setConfirming(true);
            }}
          >
            Review reveal
          </button>

          {confirming && chosenId ? (
            <Confirm
              action="Reveal this message"
              busy={busy}
              onConfirm={() => void commit()}
              onCancel={() => setConfirming(false)}
            >
              Reveal the full number and message body for activation{" "}
              <span className="break-all font-mono text-caption">{chosenId}</span>? This read is recorded and
              attributable: your account, the time and the reason you typed are written to the audit trail before
              the database answers, and the record cannot be withdrawn.
            </Confirm>
          ) : null}
        </>
      )}

      {error ? <Failure message={error} /> : null}

      {revealed ? (
        <div className="mt-[12px] rounded-[10px] border border-border bg-panel px-[12px] py-[10px]">
          <p className="text-caption text-muted">
            Shown once. Nothing here is stored by the panel — leaving this record or picking another activation
            discards it, and reading it again means another logged reveal.
          </p>
          <Revealed label="Phone" value={revealed.phone} />
          <Revealed label="Code" value={revealed.sms_code} />
          <Revealed label="Message" value={revealed.sms_text} />
          <p className="mt-[10px] text-caption text-muted">
            received {formatWhen(revealed.sms_received_at)} · <AuditId id={revealed.audit_id} />
          </p>
          <button
            type="button"
            onClick={() => setRevealed(null)}
            className="mt-[10px] text-label text-muted underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </Panel>
  );
}

export default RevealSms;
