"use client";

import { track } from "@vercel/analytics";
import { APP_STORE_URL } from "../lib/site";
import { AppleGlyph } from "./AppleGlyph";
import { BADGES } from "../lib/content/common";
import type { Locale } from "../lib/i18n";

/*
 * Store CTAs rendered as Floating CTA Pills: charcoal wash background,
 * radius 26px, 13px weight-400 label, glyph in Signal Blue. No color fills.
 *
 * iOS only for now — there is no Play Store listing for SMS Code yet, so the
 * Android badge is removed entirely rather than pointed at a placeholder or
 * the old app. Re-add it (and PLAY_STORE_URL in lib/site.ts) once a Play
 * listing exists.
 */


export function StoreBadges({
  dark = false,
  locale = "en",
  placement = "hero",
}: {
  dark?: boolean;
  locale?: Locale;
  placement?: "hero" | "final_cta" | "service_cta" | "hub_cta" | "browse";
}) {
  const cta = dark ? "cta cta--dark" : "cta";
  const t = BADGES[locale];
  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      <a
        href={APP_STORE_URL}
        className={cta}
        onClick={() => track("CTA Click iOS", { placement })}
      >
        <AppleGlyph />
        {t.appStore}
      </a>
    </div>
  );
}
