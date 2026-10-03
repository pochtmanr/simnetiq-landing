import type { Metadata } from "next";
import { ui } from "./content/ui";
import {
  LOCALES,
  fill,
  languageAlternates,
  localeConfig,
  localePath,
  type Locale,
} from "./i18n";
import {
  APP_NAME,
  APP_STORE_URL,
  COMPANY,
  COMPANY_URL,
  SITE_URL,
  SOCIALS,
} from "./site";

/** Google shows roughly this many characters of a title before truncating. */
export const TITLE_BUDGET = 60;

/* ---------------------------------------------------------------------------
 * Metadata
 * ------------------------------------------------------------------------ */

/** Build a page's Metadata from its bare (default-locale, un-prefixed) path.
 *  Canonical and og:url are locale-prefixed; hreflang lists every locale in
 *  `available` (default: all registered) plus x-default.
 *
 *  The layout's "%s — SMS Code by SIMNETIQ" template is applied only when the
 *  result fits TITLE_BUDGET; longer page titles go out bare rather than
 *  truncated mid-brand in the results page. */
export function makeMetadata(opts: {
  locale: Locale;
  /** Bare site-relative path, e.g. "/virtual-numbers/telegram". */
  path: string;
  title: string;
  description: string;
  /** Locales that publish this page; defaults to every registered locale. */
  available?: readonly Locale[];
  /** Use the title as-is, never templated (the home page). */
  absoluteTitle?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  twitterDescription?: string;
  ogType?: "website" | "article";
  ogImage?: string;
}): Metadata {
  const t = ui(opts.locale).site;
  const available = opts.available ?? LOCALES;
  const canonical = localePath(opts.locale, opts.path);
  const templated = fill(t.titleTemplate.replace("%s", "{title}"), { title: opts.title });
  const title =
    opts.absoluteTitle || templated.length > TITLE_BUDGET
      ? { absolute: opts.title }
      : opts.title;
  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDescription = opts.ogDescription ?? opts.description;
  const image = opts.ogImage ?? "/og";
  return {
    title,
    description: opts.description,
    alternates: {
      canonical,
      languages: languageAlternates(opts.path, available),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: absolute(opts.locale, opts.path),
      siteName: t.name,
      type: opts.ogType ?? "website",
      locale: localeConfig(opts.locale).ogLocale,
      alternateLocale: available
        .filter((l) => l !== opts.locale)
        .map((l) => localeConfig(l).ogLocale),
      images: [{ url: image, width: 1200, height: 630, alt: t.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.twitterDescription ?? ogDescription,
      images: [image],
    },
  };
}

/* ---------------------------------------------------------------------------
 * JSON-LD builders — pure objects for <JsonLd data={...} />
 * ------------------------------------------------------------------------ */

/** Absolute, locale-prefixed URL for a bare path. Matches the canonical exactly
 *  (bare origin for the default-locale home), so JSON-LD and the sitemap agree
 *  with it. */
export function absolute(locale: Locale, path: string): string {
  const p = localePath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

const inLanguage = (locale: Locale) => localeConfig(locale).hreflang;

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    sameAs: [COMPANY_URL, ...SOCIALS.map((s) => s.url)],
  };
}

export function webSite(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ui(locale).site.name,
    url: absolute(locale, "/"),
    inLanguage: inLanguage(locale),
  };
}

/** The app itself. No aggregateRating: never emit ratings we can't back with
 *  real store data. */
export function softwareApplication(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: APP_NAME,
    operatingSystem: "iOS",
    applicationCategory: "UtilitiesApplication",
    url: absolute(locale, "/"),
    installUrl: [APP_STORE_URL],
    author: { "@type": "Organization", name: COMPANY, url: SITE_URL },
    inLanguage: inLanguage(locale),
    description: ui(locale).site.appDescription,
  };
}

export function faqPage(
  locale: Locale,
  items: ReadonlyArray<{ q: string; a: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: inLanguage(locale),
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbList(
  locale: Locale,
  crumbs: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absolute(locale, path),
    })),
  };
}

export function article(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: inLanguage(opts.locale),
    mainEntityOfPage: absolute(opts.locale, opts.path),
    image: `${SITE_URL}${opts.image ?? "/og"}`,
    author: { "@type": "Organization", name: COMPANY, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: COMPANY,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo.png` },
    },
  };
}
