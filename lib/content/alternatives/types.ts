/* Competitor comparison pages ("/alternatives/5sim").
 *
 * Editorial policy: comparisons are hand-written editorial in BOTH locales.
 * Facts about the competitor must be verifiable on their public site at the
 * time of writing — no scraped, guessed or fabricated claims, no invented
 * prices. The tone is fair: say plainly when the competitor is the better
 * fit. Russian is hand-translated, never by API or script. */

export interface ComparisonRow {
  /** e.g. "Platforms" */
  label: string;
  competitor: string;
  us: string;
}

export interface AlternativeCopy {
  metaTitle: string;
  metaDescription: string;
  hero: {
    /** h1, e.g. "An SMS-Activate.org alternative that lives on your phone" */
    title: string;
    intro: string[];
  };
  /** Honest positioning: when THEY are the better choice, when WE are. */
  whenThem: { title: string; body: string };
  whenUs: { title: string; body: string };
  comparison: {
    title: string;
    /** Column headers: [competitor name, our name]. */
    rows: ComparisonRow[];
    note?: string;
  };
  switchSteps: {
    title: string;
    steps: { title: string; body: string }[];
  };
  faqs: { q: string; a: string }[];
}

export interface AlternativeEntry {
  /** URL slug, e.g. "5sim". */
  slug: string;
  /** Competitor display name, e.g. "5SIM". */
  competitorName: string;
  /** ISO date of last fact-check — feeds sitemap lastModified. */
  updatedAt: string;
  en: AlternativeCopy;
  ru: AlternativeCopy;
}
