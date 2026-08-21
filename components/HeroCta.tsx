"use client";

import { track } from "@vercel/analytics";
import { APP_STORE_URL } from "../lib/site";
import { BADGES } from "../lib/content/common";
import { HOME } from "../lib/content/home";
import type { Locale } from "../lib/i18n";

/*
 * Hero CTA as its own card, sitting under the copy panel rather than inside
 * it — the reference system's split: the panel carries the argument, the card
 * carries the one action. The whole card is the link, so the target is the
 * full column width instead of a pill inside it. Ink fill, because a second
 * tinted panel under the first would read as one continued surface.
 */

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function HeroCta({ locale }: { locale: Locale }) {
  const t = HOME[locale].hero;
  return (
    <a
      href={APP_STORE_URL}
      onClick={() => track("CTA Click iOS", { placement: "hero" })}
      className="hero-cta-card panel panel--ink hero-rise group flex [animation-delay:0.06s] items-center justify-between gap-[24px]"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-[10px] text-subheading">
          <AppleGlyph />
          {BADGES[locale].appStore}
        </span>
        <span className="mt-[8px] block text-caption text-white/60">
          {t.note}
        </span>
      </span>
      <span className="hero-cta-arrow" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 12h15m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
