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
  // team members
  active: "good",
  invited: "warn",
  revoked: "bad",
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

/** A team role. "main admin" rather than "owner" on screen: it is what the
 *  owner calls the role, and "owner" reads like the owner of a customer
 *  account on a page that is full of them. */
export function RoleBadge({ role }: { role: string | null | undefined }) {
  if (role === "owner") return <Badge tone="info">main admin</Badge>;
  if (role === "worker") return <Badge>worker</Badge>;
  return <Badge>—</Badge>;
}

/** How an account signs in. Apple black and Google blue, like their own
 *  buttons, so the mix is readable at a glance down a column. */
export function ProviderChip({ provider }: { provider: string | null | undefined }) {
  const p = (provider ?? "").toLowerCase();
  if (p === "apple") {
    return (
      <span className="inline-flex items-center gap-[4px] whitespace-nowrap rounded-pill bg-[#000] px-[9px] py-[2px] text-caption font-medium leading-[1.6] text-white">
        <svg viewBox="0 0 24 24" className="h-[11px] w-[11px] fill-current" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        Apple
      </span>
    );
  }
  if (p === "google") {
    return (
      <span className="inline-flex items-center gap-[4px] whitespace-nowrap rounded-pill bg-[#1a73e8] px-[9px] py-[2px] text-caption font-medium leading-[1.6] text-white">
        <span className="font-bold" aria-hidden>
          G
        </span>
        Google
      </span>
    );
  }
  return <Badge>{p ? p.replaceAll("_", " ") : "—"}</Badge>;
}
