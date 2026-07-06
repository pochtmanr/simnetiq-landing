export type Locale = "en" | "ru";

export const LOCALES: Locale[] = ["en", "ru"];

/** Prefix a site-relative path for the given locale: ("/support", "ru") -> "/ru/support". */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/") return "/ru";
  if (path.startsWith("/#")) return `/ru${path.slice(1)}`; // "/#faq" -> "/ru#faq"
  return `/ru${path}`;
}

/** Map a pathname to its equivalent in the other locale (for the nav switcher). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const bare = pathname.replace(/^\/ru(?=\/|$)/, "") || "/";
  return localePath(to, bare);
}

/** hreflang alternates for a site-relative path, for Metadata.alternates. */
export function languageAlternates(path: string) {
  return {
    en: path,
    ru: localePath("ru", path),
    "x-default": path,
  };
}
