"use client";

import { useCallback, useState } from "react";
import { DeniedBody } from "../../AuthGate";
import {
  AuditId,
  Confirm,
  describeFailure,
  Failure,
  Hint,
  INPUT,
  Label,
  MIN_REASON,
  Panel,
  RevealSms,
} from "../../components/RevealSms";
import { formatCoins } from "../../../../../lib/admin/format";
import { isAdminDenied, rpc, type GrantCoinsRow, type UserActivationsRow } from "../../../../../lib/admin/rpc";

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
 * The reveal lives in ../../components/RevealSms.tsx so the activation page can
 * mount it for a single activation; the form pieces grant-coins uses come from
 * there too, so both actions share one review → confirm → receipt flow.
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
 * Only in `RevealSms`'s own state (see that file). The `key={userId}` below
 * forces it to unmount if the route ever swaps users in place rather than
 * remounting, so one user's SMS can never sit under another user's record.
 * ------------------------------------------------------------------------ */

/** Mirrors `abs(p_coins) > 2000` in SQL. The RPC also accepts negatives, for
 *  undoing a mis-grant; this form deliberately offers only the positive half,
 *  because a minus sign that fails to register turns a correction into a second
 *  grant. A clawback is rare enough to be worth doing in the SQL editor. */
const MAX_COINS = 2000;

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
         admin — render the denied screen, see AuthGate. */
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
          to <span className="break-all font-mono text-caption">{userId}</span>? The
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

  /* The denied screen, alone. A session that was `aal2` when the page loaded
     and is refused now has stopped being an admin mid-visit. AuthGate's
     DeniedBoundary does the same thing at shell level for a denial thrown
     during render. */
  if (denied) return <DeniedBody />;

  return (
    <section className="mt-[30px]">
      <h2 className="font-sans text-subheading">Actions</h2>
      <p className="mt-[2px] text-caption text-muted">
        Both of these are recorded before they take effect, and both show the
        audit id back.
      </p>
      <div className="mt-[10px] grid grid-cols-1 gap-[12px] lg:grid-cols-2">
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
