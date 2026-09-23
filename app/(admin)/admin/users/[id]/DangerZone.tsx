"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Confirm, describeFailure, Failure, Hint, INPUT, Label, MIN_REASON } from "../../components/RevealSms";
import { useMe } from "../../components/Me";
import { deleteCustomer, TeamActionError } from "../../../../../lib/admin/teamFunction";

/* ---------------------------------------------------------------------------
 * Danger zone: delete this customer's account. Main admins only.
 *
 * The same erasure the app's own "Delete account" button performs
 * (sms-expo _shared/accountDeletion.ts, shared with delete-account): numbers,
 * SMS, wallet and ledger go with the auth user; purchase records and the
 * pseudonymised facts stay. It runs in the admin-team edge function because
 * auth.admin.deleteUser needs the service role, which this app never holds.
 *
 * What the browser does here is ask. The function re-checks owner + aal2, and
 * Postgres (admin_user_delete_begin) checks the reason, refuses a team member,
 * compares the retyped address with the real one — the real one is never sent
 * back — and commits the audit row before anything is erased.
 *
 * Workers see the card, disabled, so the capability is not a mystery and the
 * way to get it done (ask a main admin) is on screen.
 * ------------------------------------------------------------------------ */

export function DangerZone({ userId, hasEmail }: { userId: string; hasEmail: boolean }) {
  const { state, isOwner } = useMe();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedReason = reason.trim();
  const ready = trimmedReason.length >= MIN_REASON && confirmText.trim().length > 0 && !busy;
  const what = hasEmail ? "the customer's email address" : "the full user id (this account has no email)";

  async function commit() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      const out = await deleteCustomer(userId, trimmedReason, confirmText.trim());
      /* The record this page shows no longer exists; go back to the list and
         say what happened there. */
      router.push(`/admin/users?deleted=${encodeURIComponent(String(out.audit_id))}`);
    } catch (err) {
      const suffix = err instanceof TeamActionError && err.auditId !== null ? ` (audit id ${err.auditId})` : "";
      setError(describeFailure(err) + suffix);
      setConfirming(false);
      setBusy(false);
    }
  }

  return (
    <section className="mt-[30px] min-w-0 rounded-card border border-bad/40 bg-card p-[16px]">
      <h2 className="font-sans text-subheading text-bad">Danger zone</h2>
      <p className="mt-[4px] text-label text-ink-muted">
        Deleting the account erases its phone numbers, received SMS, wallet and coin ledger, and signs the customer
        out everywhere. Purchase records and anonymous usage totals are kept, as they are when a customer deletes
        their own account. This cannot be undone.
      </p>

      {!isOwner ? (
        <>
          <button type="button" disabled className="cta cta--sm mt-[12px] opacity-50">
            Delete account
          </button>
          <p className="mt-[6px] text-caption text-muted">
            {state.phase === "loading" ? "Checking your role…" : "Only a main admin can delete accounts."}
          </p>
        </>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} className="cta cta--sm mt-[12px]">
          Delete account…
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) setConfirming(true);
          }}
          noValidate
          className="mt-[12px]"
        >
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">
            <Label text="Reason">
              <input
                className={INPUT}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setConfirming(false);
                }}
                autoComplete="off"
                placeholder="e.g. customer asked by email, ticket 4f2a…"
                disabled={busy}
              />
            </Label>
            <Label text={hasEmail ? "Retype the email" : "Retype the user id"}>
              <input
                className={INPUT}
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setConfirming(false);
                }}
                /* Typed, not pasted from the header above, is the point — but
                   blocking paste only annoys; the server comparison is what
                   counts. */
                autoComplete="off"
                spellCheck={false}
                placeholder={hasEmail ? "name@example.com" : "00000000-0000-…"}
                disabled={busy}
              />
            </Label>
          </div>
          {reason !== "" && trimmedReason.length < MIN_REASON ? (
            <Hint>
              {MIN_REASON} characters minimum — {trimmedReason.length} so far. It goes into the audit trail.
            </Hint>
          ) : null}
          <Hint>The server compares what you type with {what}; letter case does not matter.</Hint>
          <div className="mt-[12px] flex flex-wrap items-center gap-[12px]">
            <button type="submit" className="cta cta--sm disabled:opacity-60" disabled={!ready}>
              Review deletion
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirming(false);
                setError(null);
              }}
              disabled={busy}
              className="text-label text-muted underline underline-offset-2"
            >
              Cancel
            </button>
          </div>
          {confirming ? (
            <Confirm action="Delete permanently" busy={busy} onConfirm={() => void commit()} onCancel={() => setConfirming(false)}>
              Permanently delete account <span className="break-all font-mono text-caption">{userId}</span>? The audit
              row naming you and the reason is written first; the deletion follows immediately.
            </Confirm>
          ) : null}
          {error ? <Failure message={error} /> : null}
        </form>
      )}
    </section>
  );
}

export default DangerZone;
