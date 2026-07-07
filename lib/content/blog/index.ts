import type { BlogPost } from "./types";
import { telegramWithoutPhoneNumber } from "./telegram-without-phone-number";
import { whatIsAVirtualPhoneNumber } from "./what-is-a-virtual-phone-number";
import { secondWhatsappAccount } from "./second-whatsapp-account";

/* The registry IS the publish switch — same policy as ../services/index.ts.
   Keep sorted by publishedAt descending (newest first). */

export const BLOG_POSTS: BlogPost[] = [
  telegramWithoutPhoneNumber,
  secondWhatsappAccount,
  whatIsAVirtualPhoneNumber,
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
