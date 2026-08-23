"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { NotFoundBody } from "../../AuthGate";
import { formatCoins, formatWhen } from "../../../../../lib/admin/format";
import {
  isAdminDenied,
  rpc,
  type GrantCoinsRow,
  type RevealSmsRow,
  type UserActivationsRow,
} from "../../../../../lib/admin/rpc";

/* ---------------------------------------------------------------------------
 * The two things an operator can *do* to a user record: move coins, and read
 * one SMS. Everything else in this route is a read that changes nothing.
 *
 * Both calls write an audit row *before* they do the thing — `admin_grant_coins`
 * derives the wallet's idempotency key from the audit id, and `admin_reveal_sms`
 * logs the reveal and then selects the row. Neither can happen unrecorded, and
 * both hand the audit id back. Every success below therefore ends by showing
 * that id: an operator who can see the record number knows the record exists,
 * and a screen that quietly swallowed it would be asking to be trusted instead.
 *
 * Where the limits actually live
 * ------------------------------
 * The 1–2000 coin cap and the eight-character reason are **Postgres checks**
 * (`20260834000000_admin.sql`, `check_violation` on breach). The validation in
 * this file is a courtesy that saves a round trip and puts the rule in front of
 * the operator while they type. It is not the control, the copy on screen says
 * so, and disabling the button in devtools buys nothing.
 *
 * Where the revealed row lives
 * ----------------------------
 * Nowhere but this component. `UserDetail` above survives navigation between
 * users inside the panel, so a full phone number and an SMS body held up there
 * — or in a context, in localStorage, in the URL — would outlive the reveal
 * that was logged for it, and could end up on screen under a different user's
 * name with no second audit row to explain it. It lives in `RevealSms`'s own
 * state, which React discards when this subtree unmounts; the `key={userId}`
 * below forces that unmount if the route ever swaps users in place rather than
 * remounting; and picking a different activation clears it in the handler. The
 * only copy that outlives the page is the audit row, which is the point.
 * ------------------------------------------------------------------------ */

/** Mirrors `abs(p_coins) > 2000` in SQL. The RPC also accepts negatives, for
 *  undoing a mis-grant; this form deliberately offers only the positive half,
 *  because a minus sign that fails to register turns a correction into a second
 *  grant. A clawback is rare enough to be worth doing in the SQL editor. */
const MAX_COINS = 2000;

/** Mirrors `length(trim(p_reason)) < 8` in SQL, on both RPCs. */
const MIN_REASON = 8;

/* ---------------------------------------------------------------------------
 * Shared pieces
 * ------------------------------------------------------------------------ */

const INPUT =
  "w-full rounded-[8px] border border-border bg-card px-[10px] py-[7px] text-label text-ink outline-none focus-visible:border-accent disabled:opacity-50";

/** What to put in front of the operator when a call failed for a reason that
 *  is not denial. The message is shown in full because only an `aal2` session
 *  ever reaches this screen — there is nobody here to keep it from, and a
 *  swallowed `check_violation` would read as "the button does nothing". */
function describeFailure(reason: unknown): string {
  if (reason instanceof Error && reason.message) return reason.message;
  return "The request did not complete.";
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-border bg-card p-[16px]">
      <h3 className="font-sans text-subheading">{title}</h3>
      <p className="mt-[4px] text-caption text-muted">{note}</p>
      <div className="mt-[14px]">{children}</div>
    </section>
  );
}

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-caption uppercase tracking-[0.06em] text-muted">
        {text}
      </span>
      <span className="mt-[4px] block">{children}</span>
    </label>
  );
}

/** A rule the operator has broken while typing. Advisory, never load-bearing. */
function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-[4px] text-caption text-muted">{children}</p>;
}

function Failure({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-[12px] break-words rounded-[10px] border border-border bg-panel px-[12px] py-[10px] text-label text-ink"
    >
      {message}
    </p>
  );
}

/** The step between filling a form in and it happening. Deliberately a block
 *  of prose with two buttons rather than `window.confirm`: the sentence has to
 *  name the exact thing about to be done, and a native dialog cannot show the
 *  amount, the subject and the consequence together. */
function Confirm({
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
    <div className="mt-[12px] rounded-[10px] border border-border bg-panel px-[12px] py-[10px]">
      <p className="text-label text-ink">{children}</p>
      <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="cta cta--sm disabled:opacity-60"
        >
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

/** The receipt line both actions end on. */
function AuditId({ id }: { id: number }) {
  return (
    <span className="tabular-nums">
      audit id <span className="font-mono">{id}</span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Grant coins
 * ------------------------------------------------------------------------ */

/** Whole coins only, and only the digits — no sign, no decimal point. A string
 *  that is not exactly a positive integer returns null rather than whatever
 *  `parseInt` would salvage from it, because `parseInt("20 000")` is 20 and
 *  that is the class of mistake this form exists to prevent. */
function parseCoins(input: string): number | null {
  const text = input.trim();
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return Number.isSafeInteger(n) ? n : null;
}

function GrantCoins({
  userId,
  onChanged,
  onDenied,
}: {
  userId: string;
  onChanged: () => void;
  onDenied: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  /* Non-null while the confirm step is up. Holding the values rather than
     re-reading the inputs means what the operator confirmed is exactly what
     gets sent, even if a stray keystroke lands on the field behind it. */
  const [pending, setPending] = useState<{
    coins: number;
    reason: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<GrantCoinsRow | null>(null);

  const coins = parseCoins(amount);
  const trimmedReason = reason.trim();
  const withinCap = coins !== null && coins >= 1 && coins <= MAX_COINS;
  const reasonLongEnough = trimmedReason.length >= MIN_REASON;
  const ready = withinCap && reasonLongEnough && !busy;

  function review() {
    if (!ready || coins === null) return;
    setError(null);
    setReceipt(null);
    setPending({ coins, reason: trimmedReason });
  }

  async function commit() {
    if (pending === null || busy) return;
    setBusy(true);
    setError(null);
    try {
      const row = await rpc.grantCoins(userId, pending.coins, pending.reason);
      setReceipt(row);
      setPending(null);
      setAmount("");
      setReason("");
      /* The balance in the header and the new ledger line both live in the
         parent. Without this the operator is looking at a page that disagrees
         with the wallet they just changed. */
      onChanged();
    } catch (err) {
      /* 42501 is the only thing the database will say about not being an
         admin, and the only correct answer is the 404 — see AuthGate. */
      if (isAdminDenied(err)) {
        onDenied();
        return;
      }
      setError(describeFailure(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Grant coins"
      note={`Postgres enforces the limits: 1–${formatCoins(MAX_COINS)} coins per grant, and a reason of at least ${MIN_REASON} characters. The checks below only save a round trip. The reason is written to the audit trail and to the ledger note.`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          review();
        }}
        noValidate
      >
        <div className="grid gap-[10px] [grid-template-columns:minmax(0,110px)_minmax(0,1fr)]">
          <Label text="Coins">
            <input
              className={INPUT}
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setPending(null);
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="50"
              disabled={busy}
            />
          </Label>
          <Label text="Reason">
            <input
              className={INPUT}
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setPending(null);
              }}
              autoComplete="off"
              placeholder="Why this grant is being made"
              disabled={busy}
            />
          </Label>
        </div>

        {amount !== "" && !withinCap ? (
          <Hint>
            Whole coins only, from 1 to {formatCoins(MAX_COINS)}. Anything
            outside that is refused by the database.
          </Hint>
        ) : null}
        {reason !== "" && !reasonLongEnough ? (
          <Hint>
            {MIN_REASON} characters minimum — {trimmedReason.length} so far. A
            sentence someone can read back in six months, not a checkbox.
          </Hint>
        ) : null}

        <button
          type="submit"
          className="cta cta--sm mt-[12px] disabled:opacity-60"
          disabled={!ready}
        >
          Review grant
        </button>
      </form>

      {pending ? (
        <Confirm
          action={`Grant ${formatCoins(pending.coins)} coins`}
          busy={busy}
          onConfirm={() => void commit()}
          onCancel={() => setPending(null)}
        >
          Grant{" "}
          <strong className="font-medium">
            {formatCoins(pending.coins)} coins
          </strong>{" "}
          to <span className="font-mono text-caption">{userId}</span>? The
          wallet changes immediately and an audit row naming you, the amount and
          the reason is written first.
        </Confirm>
      ) : null}

      {error ? <Failure message={error} /> : null}

      {receipt ? (
        <p className="mt-[12px] rounded-[10px] border border-border bg-panel px-[12px] py-[10px] text-label text-ink">
          Granted {formatCoins(receipt.delta_coins)} coins. New balance{" "}
          <strong className="font-medium tabular-nums">
            {formatCoins(receipt.balance)} coins
          </strong>
          . <AuditId id={receipt.audit_id} />.
        </p>
      ) : null}
    </Panel>
  );
}

/* ---------------------------------------------------------------------------
 * Reveal SMS
 * ------------------------------------------------------------------------ */

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
      <div className="text-caption uppercase tracking-[0.06em] text-muted">
        {label}
      </div>
      <div className="mt-[2px] break-words font-mono text-label text-ink">
        {value === null || value === "" ? "—" : value}
      </div>
    </div>
  );
}

function RevealSms({
  activations,
  onDenied,
}: {
  activations: UserActivationsRow[];
  onDenied: () => void;
}) {
  /* `has_sms` is the whole reason `admin_user_activations` returns a boolean
     instead of the body: it says a message exists without being a read. An
     activation without one has nothing to reveal, so offering it would spend a
     logged, irreversible reveal on an empty row. They are counted below rather
     than silently dropped, so the list not matching the table above is
     explained on screen. */
  const revealable = useMemo(
    () => activations.filter((row) => row.has_sms),
    [activations],
  );
  const withoutSms = activations.length - revealable.length;

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
  const chosen = revealable.find((row) => row.id === selectedId) ?? null;
  const trimmedReason = reason.trim();
  const reasonLongEnough = trimmedReason.length >= MIN_REASON;
  const ready = chosen !== null && reasonLongEnough && !busy;

  async function commit() {
    if (chosen === null || !reasonLongEnough || busy) return;
    setBusy(true);
    setError(null);
    try {
      const row = await rpc.revealSms(chosen.id, trimmedReason);
      setRevealed(row);
      setConfirming(false);
      setReason("");
    } catch (err) {
      if (isAdminDenied(err)) {
        onDenied();
        return;
      }
      setError(describeFailure(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Reveal SMS"
      note={`The only path to a full number or a message body anywhere in this app. admin_reveal_sms writes the audit row before it selects anything, so the reveal is recorded whether or not you read the result. Postgres requires at least ${MIN_REASON} characters of reason.`}
    >
      {revealable.length === 0 ? (
        <p className="text-label text-muted">
          {activations.length === 0
            ? "No activations."
            : `None of the ${activations.length} activations listed has an SMS to reveal.`}
        </p>
      ) : (
        <>
          <div className="grid gap-[10px]">
            <Label text="Activation">
              <select
                className={INPUT}
                value={chosen ? chosen.id : ""}
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

          <p className="mt-[6px] text-caption text-muted">
            {revealable.length} of {activations.length} listed activations
            received an SMS
            {withoutSms > 0
              ? `; the other ${withoutSms} have nothing to reveal.`
              : "."}
          </p>

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

          {confirming && chosen ? (
            <Confirm
              action="Reveal this message"
              busy={busy}
              onConfirm={() => void commit()}
              onCancel={() => setConfirming(false)}
            >
              Reveal the full number and message body for activation{" "}
              <span className="font-mono text-caption">{chosen.id}</span>? This
              read is recorded and attributable: your account, the time and the
              reason you typed are written to the audit trail before the
              database answers, and the record cannot be withdrawn.
            </Confirm>
          ) : null}
        </>
      )}

      {error ? <Failure message={error} /> : null}

      {revealed ? (
        <div className="mt-[12px] rounded-[10px] border border-border bg-panel px-[12px] py-[10px]">
          <p className="text-caption text-muted">
            Shown once. Nothing here is stored by the panel — leaving this
            record or picking another activation discards it, and reading it
            again means another logged reveal.
          </p>
          <Revealed label="Phone" value={revealed.phone} />
          <Revealed label="Code" value={revealed.sms_code} />
          <Revealed label="Message" value={revealed.sms_text} />
          <p className="mt-[10px] text-caption text-muted">
            received {formatWhen(revealed.sms_received_at)} ·{" "}
            <AuditId id={revealed.audit_id} />
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

/* ---------------------------------------------------------------------------
 * The block
 * ------------------------------------------------------------------------ */

export function Actions({
  userId,
  activations,
  onChanged,
}: {
  /** Already validated as a uuid by the page that mounts this. */
  userId: string;
  /** Loaded by the page, so the picker below needs no second call — and no
   *  second chance to disagree with the table the operator is reading. */
  activations: UserActivationsRow[];
  /** The page's own reloader. A grant that does not move the balance on screen
   *  invites a second grant. */
  onChanged: () => void;
}) {
  const [denied, setDenied] = useState(false);
  const onDenied = useCallback(() => setDenied(true), []);

  /* The 404 body, alone, with nothing beside it and no explanation. A session
     that was `aal2` when the page loaded and is refused now has stopped being
     an admin mid-visit; saying so out loud would confirm the route exists to
     whoever is holding it. AuthGate's DeniedBoundary does the same thing at
     shell level for a denial thrown during render. */
  if (denied) return <NotFoundBody />;

  return (
    <section className="mt-[26px]">
      <h2 className="font-sans text-subheading">Actions</h2>
      <p className="mt-[2px] text-caption text-muted">
        Both of these are recorded before they take effect, and both show the
        audit id back.
      </p>
      <div className="mt-[10px] grid gap-[12px] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {/* Keyed by user: if the router ever reuses this subtree for a
            different user instead of remounting it, the key forces the
            unmount that throws away a revealed message body and a stale
            receipt. Without it, one user's SMS could be on screen under
            another user's record. */}
        <GrantCoins
          key={`grant:${userId}`}
          userId={userId}
          onChanged={onChanged}
          onDenied={onDenied}
        />
        <RevealSms
          key={`reveal:${userId}`}
          activations={activations}
          onDenied={onDenied}
        />
      </div>
    </section>
  );
}

export default Actions;
