/* Per-country landing pages ("/virtual-numbers/country/united-states").
 *
 * Same editorial policy as services (see ../services/types.ts): a country
 * file is only imported into index.ts when every field is hand-written for
 * that specific country in BOTH locales — what its numbers look like, which
 * services people actually verify with them, and country-specific FAQs.
 * Russian is hand-translated, never by API or script. */

export interface CountryCopy {
  metaTitle: string;
  metaDescription: string;
  hero: {
    /** h1 */
    title: string;
    /** 2 unique paragraphs. */
    intro: string[];
  };
  whyCountry: {
    title: string;
    /** 2 paragraphs: why pick this country's numbers, for what. */
    body: string[];
  };
  /** Country-specific gotchas and know-how, each one card. */
  tips: { title: string; body: string }[];
  /** 4–5 questions specific to THIS country's numbers — feeds FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
}

export interface CountryEntry {
  /** Locale-independent URL slug, e.g. "united-states". */
  slug: string;
  /** English display name; localized names live in the copy. */
  name: { en: string; ru: string };
  /** Emoji flag, e.g. "🇺🇸". */
  flag: string;
  /** International dialing code, e.g. "+1". */
  dialingCode: string;
  /** Human-readable local format, e.g. "+1 (XXX) XXX-XXXX". */
  numberFormat: string;
  /** Service slugs commonly verified with this country's numbers. */
  popularServiceSlugs: string[];
  /** ISO date of last substantive copy edit — feeds sitemap lastModified. */
  updatedAt: string;
  en: CountryCopy;
  ru: CountryCopy;
}
