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

/** A shortened id with a copy button — for ids that have no page of their own. */
export function ShortId({ id }: { id: string | null | undefined }) {
  const [copied, setCopied] = useState(false);
  if (!id) return <span>—</span>;
  return (
    <span className="inline-flex items-center gap-[4px]">
      <span className="font-mono text-caption" title={id}>
        {shortId(id)}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void navigator.clipboard?.writeText(id).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          });
        }}
        className="rounded-[4px] px-[3px] text-caption text-muted hover:bg-panel hover:text-ink"
        aria-label="Copy id"
      >
        {copied ? "✓" : "⧉"}
      </button>
    </span>
  );
}
