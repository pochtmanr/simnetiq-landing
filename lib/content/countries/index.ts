import type { CountryEntry } from "./types";
import { unitedStates } from "./united-states";

/* The registry IS the publish switch — same policy as ../services/index.ts:
   only import entries whose copy is complete in BOTH locales. */

export const ALL_COUNTRIES: CountryEntry[] = [unitedStates];

export const COUNTRIES_REGISTRY: Record<string, CountryEntry> =
  Object.fromEntries(ALL_COUNTRIES.map((c) => [c.slug, c]));

export const COUNTRY_SLUGS = ALL_COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): CountryEntry | undefined {
  return COUNTRIES_REGISTRY[slug];
}
