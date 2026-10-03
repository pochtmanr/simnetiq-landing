import {
  Golos_Text,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_SC,
  Unbounded,
} from "next/font/google";
import type { Script } from "./locales";

/* Text face: Paratype's Golos, built for interface copy in Latin and
   Cyrillic alike, so /ru reads as native rather than as a fallback. `subsets`
   only picks what is preloaded; latin-ext and cyrillic-ext glyphs (Turkish,
   Vietnamese, Ukrainian…) still load on demand through unicode-range. */
export const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/* Display face for h1/h2, stat figures and the wordmark. Wide and round,
   so it sits apart from the compact text face instead of competing with
   it. Variable, used at 500–600 only. */
export const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/* Scripts Golos and Unbounded don't cover. Each sits behind them in the
   --font-script slot of both stacks (globals.css), so Latin brand names keep
   the house faces and only the native glyphs fall through. Never preloaded:
   the browser fetches a face only when a page actually uses its glyphs. */
const notoSc = Noto_Sans_SC({
  variable: "--font-noto-sc",
  preload: false,
  display: "swap",
});
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  preload: false,
  display: "swap",
});
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  preload: false,
  display: "swap",
});

const SCRIPT_FONTS: Partial<Record<Script, { variable: string; cssVar: string }>> = {
  han: { variable: notoSc.variable, cssVar: "--font-noto-sc" },
  devanagari: { variable: notoDevanagari.variable, cssVar: "--font-noto-devanagari" },
  arabic: { variable: notoArabic.variable, cssVar: "--font-noto-arabic" },
};

/** className + style for <html>: the house faces, plus the script face when
 *  the locale needs one. */
export function fontProps(script: Script): {
  className: string;
  style?: React.CSSProperties;
} {
  const extra = SCRIPT_FONTS[script];
  return {
    className: [golos.variable, unbounded.variable, extra?.variable].filter(Boolean).join(" "),
    style: extra
      ? ({ "--font-script": `var(${extra.cssVar})` } as React.CSSProperties)
      : undefined,
  };
}
