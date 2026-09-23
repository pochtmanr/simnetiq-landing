"use client";

import { track } from "@vercel/analytics";
import { APP_STORE_URL } from "../lib/site";
import { AppleGlyph } from "./AppleGlyph";
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
          <AppleGlyph className="h-5 w-5" />
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
