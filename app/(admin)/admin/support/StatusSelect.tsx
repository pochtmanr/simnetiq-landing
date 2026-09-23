"use client";

import { useState } from "react";
import { isAdminDenied, rpc, type SupportStatus } from "../../../../lib/admin/rpc";

/* The three values `admin_support_set_status` accepts, in workflow order.
   Mirrors `SupportStatus` in lib/admin/rpc.ts; if that union gains a member,
   this array is the other half of the change. */
export const STATUSES: readonly SupportStatus[] = ["new", "open", "resolved"];

/**
 * The status control for one ticket, shared by the inbox and the ticket page.
 *
 * A plain `<select>`, deliberately. Three buttons per row would be faster to
 * click and would also mean three more chances to click the wrong one in a
 * dense list. A select cannot be mis-hit, shows the current value without a
 * legend, and is the control an operator already knows.
 *
 * `status` is whatever the database said, which is not necessarily a
 * `SupportStatus`. An unknown value is added to the list rather than dropped,
 * because a select whose value matches no option renders as blank — the
 * operator would see an empty box and no clue that the ticket has a status.
 *
 * The write is optimistic: `onChange(next)` fires before the RPC, so the
 * caller paints the new status (badge and all) immediately, and
 * `onChange(previous)` fires if Postgres refuses. Optimism is safe because
 * the write is cheap and the revert is exact — `previous` is the prop as it
 * was rendered, not a guess. `admin_support_set_status` answers a bare bigint
 * (the audit id), not the updated row, so the optimistic value *is* the
 * result; that is also why a failure is shown right under the control:
 * nothing else would ever contradict it.
 */
export function StatusSelect({
  id,
  status,
  onChange,
  onDenied,
}: {
  /** The support request id. */
  id: string;
  /** The status as the caller currently shows it. */
  status: string;
  /** Called with the new status at once, and with the old one on failure. */
  onChange: (status: string) => void;
  /** A 42501 — the caller replaces the screen with the denied body. */
  onDenied: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const known = (STATUSES as readonly string[]).includes(status);

  async function save(next: SupportStatus) {
    const previous = status;
    if (previous === next) return;
    onChange(next);
    setError(null);
    setSaving(true);
    try {
      await rpc.supportSetStatus(id, next);
    } catch (err) {
      onChange(previous);
      if (isAdminDenied(err)) {
        onDenied();
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-[110px]">
      <select
        className="w-full rounded-[8px] border border-border bg-card px-[8px] py-[5px] text-label text-ink outline-none disabled:opacity-50"
        value={status}
        disabled={saving}
        aria-label="Status"
        onChange={(e) => {
          const next = e.target.value;
          /* Narrowing rather than casting: the extra option below is not a
             valid argument to the RPC, so it must not be sendable. */
          if ((STATUSES as readonly string[]).includes(next)) {
            void save(next as SupportStatus);
          }
        }}
      >
        {known ? null : (
          <option value={status} disabled>
            {status || "(no status)"}
          </option>
        )}
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saving ? <p className="mt-[4px] text-caption text-muted">Saving…</p> : null}
      {error ? (
        /* The one failure the operator must not scroll past is a status
           change that silently did not happen. */
        <p role="alert" className="mt-[4px] break-words [overflow-wrap:anywhere] text-caption text-bad">
          Not saved — reverted. {error}
        </p>
      ) : null}
    </div>
  );
}
