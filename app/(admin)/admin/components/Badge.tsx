import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Pills for states. Tone carries meaning; the word always says it too, so
 * nothing depends on telling red from green.
 * ------------------------------------------------------------------------ */

export type BadgeTone = "neutral" | "good" | "warn" | "bad" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-panel text-ink-muted",
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  info: "bg-panel-strong text-accent-deep",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-[8px] py-[1px] text-caption font-medium leading-[1.6] ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, BadgeTone> = {
  // activations
  pending: "info",
  waiting: "info",
  received: "good",
  completed: "good",
  cancelled: "neutral",
  failed: "bad",
  expired: "neutral",
  // support
  new: "warn",
  open: "warn",
  resolved: "good",
  // purchases / ledger
  purchase: "good",
  spend: "neutral",
  refund: "warn",
  refund_reversed: "info",
  grant: "info",
  adjustment: "info",
  clawback: "bad",
  regrant: "info",
  // jobs
  ok: "good",
  stale: "warn",
  error: "bad",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  if (!status) return <Badge>—</Badge>;
  return <Badge tone={STATUS_TONE[status] ?? "neutral"}>{status.replaceAll("_", " ")}</Badge>;
}

export function RiskBadge({ band }: { band: string | null | undefined }) {
  if (!band) return <Badge>—</Badge>;
  const b = band.toLowerCase();
  const tone: BadgeTone = b === "investigate" ? "bad" : b === "watch" ? "warn" : b === "clear" ? "good" : "neutral";
  return <Badge tone={tone}>{band}</Badge>;
}

export function SeverityDot({ severity }: { severity: string | null | undefined }) {
  const cls = severity === "bad" || severity === "error" ? "bg-bad" : severity === "warn" ? "bg-warn" : severity === "good" ? "bg-good" : "bg-accent";
  return <span className={`inline-block h-[8px] w-[8px] shrink-0 rounded-full ${cls}`} aria-hidden />;
}
