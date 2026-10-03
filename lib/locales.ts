/* The locale registry: the one list every route, sitemap entry, hreflang tag
 * and language-switcher row is derived from. Adding a language is one entry
 * here plus its content/locales/<code>/ folder (see docs/i18n/).
 *
 * Pure data with no imports — proxy.ts reads it, and proxy must not pull in
 * render code. */

export type Script = "latin" | "cyrillic" | "han" | "devanagari" | "arabic";

export interface LocaleConfig {
  /** URL prefix and content folder name, e.g. "ru" -> /ru/..., content/locales/ru/. */
  code: string;
  /** hreflang value (BCP 47). */
  hreflang: string;
  /** og:locale value. */
  ogLocale: string;
  dir: "ltr" | "rtl";
  /** Endonym shown in the language switcher, identical in every locale. */
  nativeName: string;
  /** Picks the supplementary web font in lib/fonts.ts. */
  script: Script;
  /** Intl locale for dates. */
  dateLocale: string;
}

export const LOCALE_REGISTRY = [
  {
    code: "en",
    hreflang: "en",
    ogLocale: "en_US",
    dir: "ltr",
    nativeName: "English",
    script: "latin",
    dateLocale: "en-GB",
  },
  {
    code: "ru",
    hreflang: "ru",
    ogLocale: "ru_RU",
    dir: "ltr",
    nativeName: "Русский",
    script: "cyrillic",
    dateLocale: "ru-RU",
  },
  {
    code: "zh",
    hreflang: "zh-Hans",
    ogLocale: "zh_CN",
    dir: "ltr",
    nativeName: "中文",
    script: "han",
    dateLocale: "zh-CN",
  },
  {
    code: "hi",
    hreflang: "hi",
    ogLocale: "hi_IN",
    dir: "ltr",
    nativeName: "हिन्दी",
    script: "devanagari",
    dateLocale: "hi-IN",
  },
  {
    code: "es",
    hreflang: "es",
    ogLocale: "es_ES",
    dir: "ltr",
    nativeName: "Español",
    script: "latin",
    dateLocale: "es",
  },
  {
    code: "pt",
    hreflang: "pt",
    ogLocale: "pt_BR",
    dir: "ltr",
    nativeName: "Português",
    script: "latin",
    dateLocale: "pt-BR",
  },
  {
    code: "id",
    hreflang: "id",
    ogLocale: "id_ID",
    dir: "ltr",
    nativeName: "Bahasa Indonesia",
    script: "latin",
    dateLocale: "id-ID",
  },
  {
    code: "ar",
    hreflang: "ar",
    ogLocale: "ar_AR",
    dir: "rtl",
    nativeName: "العربية",
    script: "arabic",
    dateLocale: "ar",
  },
  {
    code: "fr",
    hreflang: "fr",
    ogLocale: "fr_FR",
    dir: "ltr",
    nativeName: "Français",
    script: "latin",
    dateLocale: "fr-FR",
  },
  {
    code: "tr",
    hreflang: "tr",
    ogLocale: "tr_TR",
    dir: "ltr",
    nativeName: "Türkçe",
    script: "latin",
    dateLocale: "tr-TR",
  },
] as const satisfies readonly LocaleConfig[];

export type Locale = (typeof LOCALE_REGISTRY)[number]["code"];

/** Served without a URL prefix; also the x-default and the fallback. */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Locale[] = LOCALE_REGISTRY.map((l) => l.code);

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function localeConfig(locale: Locale): LocaleConfig {
  return LOCALE_REGISTRY.find((l) => l.code === locale)!;
}
