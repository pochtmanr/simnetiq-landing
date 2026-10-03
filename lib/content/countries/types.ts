/* Per-country landing pages ("/virtual-numbers/country/united-states").
 *
 * Same editorial policy as services (see ../services/types.ts): an entry is
 * only added to meta.ts when its English copy is written for that specific
 * country — what its numbers look like, which services people actually verify
 * with them, and country-specific FAQs. */

export interface CountryCopy {
  /** Country name in this locale, e.g. "Germany" / "Германия". */
  name: string;
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

/** Locale-neutral facts, in meta.ts. Never translated. */
export interface CountryMeta {
  /** Locale-independent URL slug, e.g. "united-states". */
  slug: string;
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
}

/** A country as published in one locale. */
export interface CountryEntry extends CountryMeta {
  copy: CountryCopy;
}
