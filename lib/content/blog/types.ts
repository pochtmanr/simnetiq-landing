/* Blog posts as typed content blocks — no MDX. The block model renders
 * through the site's own components and type scale, and keeps both locales
 * in one file so they can't drift structurally.
 *
 * Editorial policy: posts are genuinely useful guides, hand-written in BOTH
 * locales (Russian hand-translated, never by API/script). A post only enters
 * ../blog/index.ts when complete in both languages. */

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

export interface BlogPost {
  /** URL slug, identical in both locales. */
  slug: string;
  /** ISO dates — feed Article JSON-LD and the sitemap. */
  publishedAt: string;
  updatedAt: string;
  /** Non-linked chips on cards; keep to 1–3. */
  tags: string[];
  cover?: string;
  relatedServiceSlugs?: string[];
  en: BlogPostCopy;
  ru: BlogPostCopy;
}
