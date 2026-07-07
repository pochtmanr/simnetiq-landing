import type { ServiceEntry } from "./types";
import { telegram } from "./telegram";
import { whatsapp } from "./whatsapp";
import { google } from "./google";
import { instagram } from "./instagram";
import { tiktok } from "./tiktok";
import { discord } from "./discord";
import { facebook } from "./facebook";
import { snapchat } from "./snapchat";
import { tinder } from "./tinder";
import { viber } from "./viber";
import { signal } from "./signal";
import { twitter } from "./twitter";
import { line } from "./line";
import { airbnb } from "./airbnb";
import { grab } from "./grab";
import { vkcom } from "./vkcom";
import { adidas } from "./adidas";
import { cursor } from "./cursor";
import { apple } from "./apple";
import { netflix } from "./netflix";
import { paypal } from "./paypal";
import { uber } from "./uber";
import { steam } from "./steam";
import { aliexpress } from "./aliexpress";
import { wechat } from "./wechat";
import { twitch } from "./twitch";
import { binance } from "./binance";
import { ebay } from "./ebay";
import { reddit } from "./reddit";
import { fiverr } from "./fiverr";
import { shopee } from "./shopee";
import { kakaotalk } from "./kakaotalk";
import { zalo } from "./zalo";

/* The registry IS the publish switch: a service file that isn't imported here
   doesn't exist for the sitemap, hub, footer or routes. Only register entries
   whose copy is complete in BOTH locales (see types.ts editorial policy). */

export const ALL_SERVICES: ServiceEntry[] = [
  telegram,
  whatsapp,
  google,
  instagram,
  tiktok,
  discord,
  facebook,
  snapchat,
  tinder,
  viber,
  signal,
  twitter,
  line,
  airbnb,
  grab,
  vkcom,
  adidas,
  cursor,
  apple,
  netflix,
  paypal,
  uber,
  steam,
  aliexpress,
  wechat,
  twitch,
  binance,
  ebay,
  reddit,
  fiverr,
  shopee,
  kakaotalk,
  zalo,
];

export const SERVICES_REGISTRY: Record<string, ServiceEntry> =
  Object.fromEntries(ALL_SERVICES.map((s) => [s.slug, s]));

export const SERVICE_SLUGS = ALL_SERVICES.map((s) => s.slug);

export function getService(slug: string): ServiceEntry | undefined {
  return SERVICES_REGISTRY[slug];
}

// "/virtual-numbers/country/*" must never collide with a service slug.
if (SERVICE_SLUGS.includes("country")) {
  throw new Error('Service slug "country" collides with the country routes.');
}
