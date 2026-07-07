import type { ServiceEntry } from "./types";
import { telegram } from "./telegram";
import { whatsapp } from "./whatsapp";
import { google } from "./google";
import { instagram } from "./instagram";
import { tiktok } from "./tiktok";
import { discord } from "./discord";

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
