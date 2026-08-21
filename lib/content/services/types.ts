import type { Locale } from "../../i18n";

/* Per-service landing pages ("/virtual-numbers/telegram").
 *
 * EDITORIAL POLICY — these are NOT doorway pages. A service file may only be
 * imported into index.ts when every copy field below is genuinely hand-written
 * for that specific service, in BOTH locales: the real sign-up flow, the
 * service's own quirks (where the code arrives, what can go wrong), and FAQs
 * a user of that service would actually ask. Russian copy is translated by
 * hand — never by an API or script. An unfinished file simply stays out of
 * the registry and therefore out of the sitemap, hub and footer. */

export type ServiceCategory =
  | "messaging"
  | "social"
  | "finance"
  | "shopping"
  | "travel"
  | "entertainment"
  | "dev"
  | "other";

export interface ServiceCopy {
  metaTitle: string;
  metaDescription: string;
  hero: {
    /** h1 */
    title: string;
    /** 2–3 unique paragraphs; first doubles as the SERP-visible intro. */
    intro: string[];
  };
  whyVirtual: {
    title: string;
    body: string[];
  };
  howTo: {
    title: string;
    steps: { title: string; body: string }[];
  };
  /** Service-specific gotchas, each one card. */
  tips: { title: string; body: string }[];
  /** 4–6 questions specific to verifying THIS service — feeds FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
}

export interface ServiceEntry {
  /** Locale-independent URL slug, e.g. "telegram". Must never be "country". */
  slug: string;
  /** Display name, e.g. "Telegram". */
  name: string;
  /** Public path to the existing logo, e.g. "/services/telegram.svg". */
  logo: string;
  category: ServiceCategory;
  /** 4–6 hand-picked slugs for the RelatedServices block. */
  relatedSlugs: string[];
  /** Country slugs (future /virtual-numbers/country/* pages). */
  popularCountries: string[];
  /** ISO date of last substantive copy edit — feeds sitemap lastModified. */
  updatedAt: string;
  /** A realistic OTP text in this service’s actual format. Not rendered today. */
  smsExample: { sender: string; message: string; code: string };
  en: ServiceCopy;
  ru: ServiceCopy;
}

export type ServiceDict = Record<Locale, ServiceCopy>;
