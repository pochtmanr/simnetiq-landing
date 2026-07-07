import type { CountryEntry } from "./types";
import { unitedStates } from "./united-states";
import { unitedKingdom } from "./united-kingdom";
import { germany } from "./germany";
import { france } from "./france";
import { poland } from "./poland";
import { ukraine } from "./ukraine";
import { kazakhstan } from "./kazakhstan";
import { netherlands } from "./netherlands";
import { indonesia } from "./indonesia";
import { philippines } from "./philippines";
import { india } from "./india";
import { brazil } from "./brazil";
import { canada } from "./canada";
import { spain } from "./spain";
import { italy } from "./italy";

/* The registry IS the publish switch — same policy as ../services/index.ts:
   only import entries whose copy is complete in BOTH locales. */

export const ALL_COUNTRIES: CountryEntry[] = [
  unitedStates,
  unitedKingdom,
  germany,
  france,
  poland,
  ukraine,
  kazakhstan,
  netherlands,
  indonesia,
  philippines,
  india,
  brazil,
  canada,
  spain,
  italy,
];

export const COUNTRIES_REGISTRY: Record<string, CountryEntry> =
  Object.fromEntries(ALL_COUNTRIES.map((c) => [c.slug, c]));

export const COUNTRY_SLUGS = ALL_COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): CountryEntry | undefined {
  return COUNTRIES_REGISTRY[slug];
}
