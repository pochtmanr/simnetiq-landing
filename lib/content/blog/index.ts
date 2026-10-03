import { collection } from "../load";
import { BLOG_META } from "./meta";
import type { BlogPostCopy, BlogPostMeta } from "./types";

/* meta.ts IS the publish switch — same policy as ../services/index.ts.
   Keep sorted by publishedAt descending (newest first). */

const posts = collection<BlogPostMeta, BlogPostCopy>(BLOG_META, "blog");

export const BLOG_SLUGS = posts.slugs;
export const getPosts = posts.all;
export const getPost = posts.get;
export const postLocales = posts.locales;
