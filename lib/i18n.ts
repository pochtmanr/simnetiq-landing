import { DEFAULT_LOCALE, LOCALES, isLocale, localeConfig, type Locale } from "./locales";

export { DEFAULT_LOCALE, LOCALES, isLocale, localeConfig, type Locale };

/** Prefix a bare site-relative path for the given locale: ("/support", "ru") -> "/ru/support". */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`; // "/#faq" -> "/ru#faq"
  return `/${locale}${path}`;
}

/** Strip any locale prefix (including an explicit default-locale one, which
 *  is what a rewritten request can report) and return the bare path. */
export function barePath(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  if (!isLocale(first)) return pathname || "/";
  return pathname.slice(first.length + 1) || "/";
}

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Map a pathname to its equivalent in another locale (for the nav switcher). */
export function switchLocalePath(pathname: string, to: Locale): string {
  return localePath(to, barePath(pathname));
}

/** hreflang alternates for a bare path, for Metadata.alternates.languages.
 *  `available` limits the set to locales that actually publish the page. */
export function languageAlternates(
  path: string,
  available: readonly Locale[] = LOCALES,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    if (available.includes(locale)) {
      languages[localeConfig(locale).hreflang] = localePath(locale, path);
    }
  }
  if (available.includes(DEFAULT_LOCALE)) languages["x-default"] = path;
  return languages;
}

export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(localeConfig(locale).dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Fill "{name}" placeholders in a translated string. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => vars[key] ?? m);
}
