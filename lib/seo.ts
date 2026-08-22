import type { Metadata } from "next";
import { languageAlternates, localePath, type Locale } from "./i18n";
import {
  APP_NAME,
  APP_STORE_URL,
  COMPANY,
  COMPANY_URL,
  SITE_URL,
  SOCIALS,
} from "./site";

const SITE_NAME = "SMS Code by SIMNETIQ";

/* ---------------------------------------------------------------------------
 * Metadata
 * ------------------------------------------------------------------------ */

/** Build a page's Metadata from its bare (EN, un-prefixed) path.
 *  Canonical and OG url are locale-prefixed; hreflang covers en/ru/x-default. */
export function makeMetadata(opts: {
  locale: Locale;
  /** Bare site-relative path, e.g. "/virtual-numbers/telegram". */
  path: string;
  title: string;
  description: string;
  ogType?: "website" | "article";
  ogImage?: string;
}): Metadata {
  const canonical = localePath(opts.locale, opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical,
      languages: languageAlternates(opts.path),
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `${SITE_URL}${canonical === "/" ? "" : canonical}`,
      siteName: SITE_NAME,
      type: opts.ogType ?? "website",
      locale: opts.locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: opts.locale === "ru" ? "en_US" : "ru_RU",
      images: [
        {
          url: opts.ogImage ?? "/og",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [opts.ogImage ?? "/og"],
    },
  };
}

/* ---------------------------------------------------------------------------
 * JSON-LD builders — pure objects for <JsonLd data={...} />
 * ------------------------------------------------------------------------ */

/** Absolute, locale-prefixed URL for a bare path. Matches the canonical exactly
 *  (bare origin for the EN home), so JSON-LD and the sitemap agree with it. */
export function absolute(locale: Locale, path: string): string {
  const p = localePath(locale, path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

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
    name: SITE_NAME,
    url: absolute(locale, "/"),
    inLanguage: locale,
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
    description:
      locale === "ru"
        ? "Виртуальные номера в 100+ странах для приёма SMS-кодов подтверждения. Регистрируйтесь в Telegram, WhatsApp, Google и 100+ сервисах, не раскрывая личный номер."
        : "Virtual numbers in 100+ countries for receiving SMS verification codes. Sign up for Telegram, WhatsApp, Google and 100+ services without giving out your personal number.",
  };
}

export function faqPage(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
    inLanguage: opts.locale,
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
