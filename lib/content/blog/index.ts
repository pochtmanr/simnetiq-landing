import type { BlogPost } from "./types";
import { telegramWithoutPhoneNumber } from "./telegram-without-phone-number";
import { whatIsAVirtualPhoneNumber } from "./what-is-a-virtual-phone-number";
import { secondWhatsappAccount } from "./second-whatsapp-account";
import { howToReceiveSmsOnline } from "./how-to-receive-sms-online";
import { googleAccountWithoutPhoneNumber } from "./google-account-without-phone-number";
import { virtualNumberForDatingApps } from "./virtual-number-for-dating-apps";
import { esimVsVirtualNumber } from "./esim-vs-virtual-number";

/* The registry IS the publish switch — same policy as ../services/index.ts.
   Keep sorted by publishedAt descending (newest first). */

export const BLOG_POSTS: BlogPost[] = [
  howToReceiveSmsOnline,
  esimVsVirtualNumber,
  googleAccountWithoutPhoneNumber,
  virtualNumberForDatingApps,
  telegramWithoutPhoneNumber,
  secondWhatsappAccount,
  whatIsAVirtualPhoneNumber,
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
