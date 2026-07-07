import type { AlternativeEntry } from "./types";

/* The registry IS the publish switch — same policy as ../services/index.ts. */

export const ALL_ALTERNATIVES: AlternativeEntry[] = [];

export const ALTERNATIVES_REGISTRY: Record<string, AlternativeEntry> =
  Object.fromEntries(ALL_ALTERNATIVES.map((a) => [a.slug, a]));

export const ALTERNATIVE_SLUGS = ALL_ALTERNATIVES.map((a) => a.slug);

export function getAlternative(slug: string): AlternativeEntry | undefined {
  return ALTERNATIVES_REGISTRY[slug];
}
