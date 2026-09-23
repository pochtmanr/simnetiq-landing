"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HelpButton, HelpText, useHelp } from "./Help";

/* ---------------------------------------------------------------------------
 * One number, in a card.
 *
 * With `href`, the whole card is the link — the number is the thing an
 * operator taps to find out more. `help` is the plain-English definition and
 * `source` says where the number comes from; both unfold under the (i).
 * ------------------------------------------------------------------------ */

export type Tone = "neutral" | "good" | "warn" | "bad";

const VALUE_TONE: Record<Tone, string> = {
  neutral: "text-ink",
  good: "text-good",
  warn: "text-warn",
  bad: "text-bad",
};

const CARD_TONE: Record<Tone, string> = {
  neutral: "border-border bg-card",
  good: "border-border bg-card",
  warn: "border-warn/30 bg-warn-soft",
  bad: "border-bad/30 bg-bad-soft",
};

export function Stat({
  label,
  value,
  sub,
  tone = "neutral",
  href,
  help,
  source,
  loading = false,
}: {
  label: string;
  value: ReactNode;
  /** A second line under the value: a comparison, a count, an age. */
  sub?: ReactNode;
  tone?: Tone;
  href?: string;
  help?: ReactNode;
  source?: ReactNode;
  loading?: boolean;
}) {
  const h = useHelp();
  const explain = help || source;

  const body = (
    <>
      <div className="flex items-start justify-between gap-[8px]">
        <span className="text-caption uppercase leading-[1.4] tracking-[0.07em] text-muted">{label}</span>
        {explain ? <HelpButton {...h} label={label} /> : null}
      </div>
      {loading ? (
        <span className="mt-[8px] block h-[24px] w-[70%] animate-pulse rounded-[6px] bg-panel" aria-hidden />
      ) : (
        <span className={`mt-[4px] block break-words text-[22px] font-semibold leading-[1.2] tabular-nums ${VALUE_TONE[tone]}`}>
          {value}
        </span>
      )}
      {sub && !loading ? <span className="mt-[3px] block text-caption text-ink-muted">{sub}</span> : null}
      <HelpText open={h.open} id={h.id}>
        {help}
        {source ? <span className="mt-[4px] block text-muted">Source: {source}</span> : null}
      </HelpText>
      {href ? (
        <span className="mt-[8px] block text-caption font-medium text-accent-deep group-hover:underline">
          Details →
        </span>
      ) : null}
    </>
  );

  const cls = `group flex min-w-0 flex-col rounded-card border p-[14px] ${CARD_TONE[tone]}`;
  if (href) {
    return (
      <Link href={href} className={`${cls} transition-colors hover:border-accent`}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}

/** The responsive grid stat cards sit in: 2 across on a phone. */
export function StatGrid({ children, wide = 4 }: { children: ReactNode; wide?: 3 | 4 | 5 }) {
  const lg = wide === 5 ? "lg:grid-cols-5" : wide === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return <div className={`grid grid-cols-2 gap-[10px] sm:grid-cols-3 ${lg}`}>{children}</div>;
}
