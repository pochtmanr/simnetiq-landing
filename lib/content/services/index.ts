import { collection } from "../load";
import { SERVICES_META } from "./meta";
import type { ServiceCopy, ServiceMeta } from "./types";

/* meta.ts IS the publish switch: an entry that isn't listed there doesn't
   exist for the sitemap, hub, footer or routes. */

const services = collection<ServiceMeta, ServiceCopy>(SERVICES_META, "services");

export const SERVICE_SLUGS = services.slugs;
export const getServices = services.all;
export const getService = services.get;
export const serviceLocales = services.locales;

// "/virtual-numbers/country/*" must never collide with a service slug.
if (SERVICE_SLUGS.includes("country")) {
  throw new Error('Service slug "country" collides with the country routes.');
}
