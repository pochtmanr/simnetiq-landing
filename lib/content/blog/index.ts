import type { BlogPost } from "./types";

/* The registry IS the publish switch — same policy as ../services/index.ts.
   Keep sorted by publishedAt descending (newest first). */

export const BLOG_POSTS: BlogPost[] = [];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
