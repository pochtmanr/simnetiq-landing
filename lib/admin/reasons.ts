/**
 * Short meanings for activations.close_reason.
 * Keep in step with REASONS in sms-expo/supabase/functions/_shared/opsCards.ts
 * and public.ops_reason_label() in 20260851000000_ops_sms_outcomes.sql.
 */
export const REASON_LABELS: Record<string, string> = {
  expired: "no SMS in 15 min, app open",
  expired_swept: "no SMS in 15 min, app closed",
  provider_failed: "OnlineSim gave no number",
  provider_timeout: "OnlineSim did not answer; may hold an orphan",
  claim_failed: "internal error mid-purchase, a bug",
  replay_blocked: "same purchase replayed, not charged twice",
  user_cancelled: "user pressed Cancel (not posted)",
  user_retried: "user pressed Try another number (not posted)",
  failed: "no reason recorded (old row)",
};

/** `expired · no SMS in 15 min, app open`, or the code alone when it is unknown. */
export function reasonLine(code: string | null | undefined, fallback = "—"): string {
  const c = (code ?? "").trim();
  if (!c) return fallback;
  const label = REASON_LABELS[c];
  return label ? `${c} · ${label}` : c;
}

/** Label for one row of the Delivery "Recent SMS" table. */
export function smsEventLabel(kind: string, closeReason: string | null): string {
  if (kind === "activation_received") return "SMS received";
  const code = closeReason ?? (kind === "provider_timeout" ? "provider_timeout" : null);
  return reasonLine(code, kind.replace(/_/g, " "));
}
