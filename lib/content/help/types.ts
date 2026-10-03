/* Support knowledge-base articles ("/support/activation-issues"). Product
 * rules (timers, refunds, balances) must stay factually identical across
 * locales — translate the wording, never the policy. */

export interface HelpArticleCopy {
  title: string;
  /** 120–160 characters; the article's own summary, not its first paragraph. */
  metaDescription: string;
  sections: { title: string; paragraphs: string[] }[];
}

/** Locale-neutral facts, in meta.ts. Never translated. */
export interface HelpArticleMeta {
  slug: string;
  /** ISO date of the last policy check — shown on the page and in the sitemap. */
  updatedAt: string;
}

/** An article as published in one locale. */
export interface HelpArticle extends HelpArticleMeta {
  copy: HelpArticleCopy;
}
