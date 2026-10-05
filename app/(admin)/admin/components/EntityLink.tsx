"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Where each kind of thing lives. Every id the panel prints should go through
 * here, so that "this id is dead text" stops being possible.
 * ------------------------------------------------------------------------ */

export type EntityType = "user" | "activation" | "purchase" | "support" | "topup";

export function entityHref(type: EntityType | string | null | undefined, id: string | null | undefined): string | null {
  if (!type || !id) return null;
  switch (type) {
    case "user":
      return `/admin/users/${id}`;
    case "activation":
      return `/admin/activations/${id}`;
    case "purchase":
      return `/admin/purchases/${encodeURIComponent(id)}`;
    case "support":
      return `/admin/support/${id}`;
    case "topup":
      return `/admin/money#topups`;
    default:
      return null;
  }
}

export function comboHref(service: string | null | undefined, country: number | string | null | undefined): string | null {
  if (!service || country === null || country === undefined || country === "") return null;
  return `/admin/money/combo?service=${encodeURIComponent(service)}&country=${encodeURIComponent(String(country))}`;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(s: string | null | undefined): s is string {
  return !!s && UUID.test(s);
}

/** An id shortened for display: the first 8 characters, the rest on hover. */
export function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id;
}

export function EntityLink({
  type,
  id,
  children,
  className = "",
}: {
  type: EntityType;
  id: string | null | undefined;
  children?: ReactNode;
  className?: string;
}) {
  const href = entityHref(type, id);
  const label = children ?? (id ? <span className="font-mono">{shortId(id)}</span> : "—");
  if (!href) return <span className={className}>{label}</span>;
  return (
    <Link href={href} title={id ?? undefined} className={`text-accent-deep hover:underline ${className}`}>
      {label}
    </Link>
  );
}

/* Copy that works inside Telegram too: the iOS Telegram webview often has no
   navigator.clipboard (or rejects it outside a "trusted" gesture), so fall
   back to a hidden textarea and execCommand. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the textarea */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** A real, thumb-sized copy button: 36px square, an icon, a check once done,
 *  and a haptic tick inside Telegram. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        void copyToClipboard(text).then((ok) => {
          setState(ok ? "done" : "failed");
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(ok ? "success" : "error");
          setTimeout(() => setState("idle"), 1200);
        });
      }}
      className={`inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-button border border-border bg-card transition-colors hover:bg-panel active:bg-panel ${
        state === "done" ? "text-good" : state === "failed" ? "text-bad" : "text-ink-muted hover:text-ink"
      }`}
      aria-label={state === "done" ? "Copied" : label}
      title={label}
    >
      {state === "done" ? (
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
        </svg>
      )}
    </button>
  );
}

/** Kept for the call sites that put a copy button next to something. */
export function CopyText({ text, label = "Copy" }: { text: string; label?: string }) {
  return <CopyButton text={text} label={label} />;
}

/** A value on the left, its copy button pinned to the right edge — so copy
 *  buttons line up down a card instead of trailing each value. */
export function CopyRow({ text, label, children }: { text: string; label?: string; children?: ReactNode }) {
  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-[10px]">
      <span className="min-w-0 break-all">{children ?? text}</span>
      <CopyButton text={text} label={label} />
    </span>
  );
}

/** A shortened id with a copy button — for ids that have no page of their own. */
export function ShortId({ id }: { id: string | null | undefined }) {
  if (!id) return <span>—</span>;
  return (
    <CopyRow text={id} label="Copy id">
      <span className="font-mono text-caption" title={id}>
        {shortId(id)}
      </span>
    </CopyRow>
  );
}
