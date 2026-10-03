/* Blog posts as typed content blocks — no MDX. The block model renders
 * through the site's own components and type scale. Each locale's file keeps
 * the English block order, types, ids and srcs exactly (npm run i18n:check),
 * so translations can't drift structurally.
 *
 * Editorial policy: posts are genuinely useful guides. A post only enters
 * meta.ts once its English copy is complete. */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "callout"; text: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "cta"; serviceSlug?: string };

export interface BlogPostCopy {
  title: string;
  /** Meta description AND Article JSON-LD description. */
  description: string;
  /** Card text on the blog index. */
  excerpt: string;
  blocks: Block[];
}

/** Locale-neutral facts, in meta.ts. Never translated. */
export interface BlogPostMeta {
  /** URL slug, identical in every locale. */
  slug: string;
  /** ISO dates — feed Article JSON-LD and the sitemap. */
  publishedAt: string;
  updatedAt: string;
  /** Keys into blog-ui.json "tags"; non-linked chips on cards, keep to 1–3. */
  tags: string[];
  cover?: string;
  relatedServiceSlugs?: string[];
}

/** A post as published in one locale. */
export interface BlogPost extends BlogPostMeta {
  copy: BlogPostCopy;
}
