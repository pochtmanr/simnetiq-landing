import { collection } from "../load";
import { ALTERNATIVES_META } from "./meta";
import type { AlternativeCopy, AlternativeMeta } from "./types";

/* meta.ts IS the publish switch — same policy as ../services/index.ts. */

const alternatives = collection<AlternativeMeta, AlternativeCopy>(ALTERNATIVES_META, "alternatives");

export const ALTERNATIVE_SLUGS = alternatives.slugs;
export const getAlternatives = alternatives.all;
export const getAlternative = alternatives.get;
export const alternativeLocales = alternatives.locales;
