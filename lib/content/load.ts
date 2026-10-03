import { LOCALE_FILES } from "../../content/locales/index.generated";
import { LOCALES, type Locale } from "../locales";

/** A locale's JSON file by key ("ui", "services/telegram"), or undefined when
 *  that locale hasn't translated it. Shapes are enforced by `npm run i18n:check`. */
export function localeFile<T>(locale: Locale, key: string): T | undefined {
  return LOCALE_FILES[locale]?.[key] as T | undefined;
}

export function requireLocaleFile<T>(locale: Locale, key: string): T {
  const file = localeFile<T>(locale, key);
  if (!file) throw new Error(`Missing content/locales/${locale}/${key}.json`);
  return file;
}

/** Registered locales that publish the given file. */
export function localesWith(key: string): Locale[] {
  return LOCALES.filter((locale) => localeFile(locale, key) !== undefined);
}

/** Joins a collection's locale-neutral meta (the publish switch, in order)
 *  with each locale's copy in content/locales/<locale>/<folder>/<slug>.json.
 *  An entry is published in a locale only when that file exists. */
export function collection<M extends { slug: string }, C>(meta: readonly M[], folder: string) {
  type Entry = M & { copy: C };
  const join = (locale: Locale, m: M): Entry | undefined => {
    const copy = localeFile<C>(locale, `${folder}/${m.slug}`);
    return copy ? { ...m, copy } : undefined;
  };
  return {
    slugs: meta.map((m) => m.slug),
    all: (locale: Locale): Entry[] =>
      meta.flatMap((m) => {
        const entry = join(locale, m);
        return entry ? [entry] : [];
      }),
    get: (locale: Locale, slug: string): Entry | undefined => {
      const m = meta.find((x) => x.slug === slug);
      return m && join(locale, m);
    },
    locales: (slug: string): Locale[] => localesWith(`${folder}/${slug}`),
  };
}
