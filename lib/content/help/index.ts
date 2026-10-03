import { collection } from "../load";
import { HELP_META } from "./meta";
import type { HelpArticleCopy, HelpArticleMeta } from "./types";

/* meta.ts IS the publish switch — same policy as ../services/index.ts. */

const articles = collection<HelpArticleMeta, HelpArticleCopy>(HELP_META, "help");

export const HELP_SLUGS = articles.slugs;
export const getHelpArticles = articles.all;
export const getHelpArticle = articles.get;
export const helpLocales = articles.locales;
