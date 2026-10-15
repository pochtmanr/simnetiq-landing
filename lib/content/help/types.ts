/* Support knowledge-base articles ("/support/activation-issues"). Product
 * rules (timers, refunds, balances) must stay factually identical across
 * locales — translate the wording, never the policy. */

export interface HelpSection {
  title: string;
  /** Prose. Supports RichText markup: **bold**, *em*, [label](/path or https://…). */
  paragraphs?: string[];
  /** Rendered as a numbered list after the paragraphs. */
  steps?: string[];
  /** A screenshot after the steps. `src` is structural (never translated). */
  image?: { src: string; alt: string; width: number; height: number };
  /** One outbound button, e.g. Apple's refund site. `href` is structural. */
  cta?: { label: string; href: string };
  /** Anchor so other pages can deep-link to this section. */
  id?: string;
}

export interface HelpArticleCopy {
  title: string;
  /** 120–160 characters; the article's own summary, not its first paragraph. */
  metaDescription: string;
  sections: HelpSection[];
}

/** Locale-neutral facts, in meta.ts. Never translated. */
export interface HelpArticleMeta {
  slug: string;
  /** ISO date of the last policy check — shown on the page and in the sitemap. */
  updatedAt: string;
  /** Support-form topic this article answers. Adds the "still need help?
   *  submit a request anyway" card, which returns to /support?topic=<id>. */
  topic?: SupportTopicId;
  /** Show the official Apple refund/support links block. */
  appleLinks?: boolean;
  /** Embed the live delivery-tier lookup (sms-not-received). */
  deliveryTiers?: boolean;
}

/** An article as published in one locale. */
export interface HelpArticle extends HelpArticleMeta {
  copy: HelpArticleCopy;
}

/** Stable support topic ids — the form, the API and the app all speak these.
 *  Labels are localized in support.json `topics`. */
export const SUPPORT_TOPICS = [
  "refund",
  "sms",
  "code",
  "coins",
  "account",
  "bug",
  "feature",
  "other",
] as const;
export type SupportTopicId = (typeof SUPPORT_TOPICS)[number];
export const isSupportTopic = (v: unknown): v is SupportTopicId =>
  typeof v === "string" && (SUPPORT_TOPICS as readonly string[]).includes(v);
