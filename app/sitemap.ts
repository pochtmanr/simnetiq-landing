import type { MetadataRoute } from "next";
import { ALTERNATIVES_META } from "../lib/content/alternatives/meta";
import { alternativeLocales } from "../lib/content/alternatives";
import { BLOG_META } from "../lib/content/blog/meta";
import { postLocales } from "../lib/content/blog";
import { COUNTRIES_META } from "../lib/content/countries/meta";
import { countryLocales } from "../lib/content/countries";
import { HELP_META } from "../lib/content/help/meta";
import { helpLocales } from "../lib/content/help";
import { SERVICES_META } from "../lib/content/services/meta";
import { serviceLocales } from "../lib/content/services";
import { DEFAULT_LOCALE, LOCALES, localeConfig, type Locale } from "../lib/i18n";
import { absolute } from "../lib/seo";

/* Registry-driven: static chrome pages are listed here, everything else
   derives from the content registries — publishing a page is just adding it
   to its registry. Each URL is emitted once per locale that publishes it. */

type Freq = "weekly" | "monthly" | "yearly";

interface Entry {
  path: string;
  lastModified: string;
  changeFrequency: Freq;
  priority: number;
  locales: readonly Locale[];
}

/** Most recent updatedAt across a set of registry entries. Hub pages render
 *  their registry, so this is their real last-modified — Google discounts
 *  lastmod site-wide once it catches you overstating it. */
function latest(...groups: ReadonlyArray<ReadonlyArray<{ updatedAt: string }>>): string {
  return groups
    .flat()
    .reduce((max, entry) => (entry.updatedAt > max ? entry.updatedAt : max), "");
}

const STATIC_PATHS: Entry[] = [
  { path: "/", lastModified: "2026-09-30", changeFrequency: "monthly", priority: 1, locales: LOCALES },
  {
    path: "/virtual-numbers",
    lastModified: latest(SERVICES_META, COUNTRIES_META),
    changeFrequency: "weekly",
    priority: 0.9,
    locales: LOCALES,
  },
  { path: "/blog", lastModified: latest(BLOG_META), changeFrequency: "weekly", priority: 0.8, locales: LOCALES },
  {
    path: "/alternatives",
    lastModified: latest(ALTERNATIVES_META),
    changeFrequency: "monthly",
    priority: 0.6,
    locales: LOCALES,
  },
  { path: "/support", lastModified: "2026-09-30", changeFrequency: "monthly", priority: 0.8, locales: LOCALES },
  { path: "/privacy-policy", lastModified: "2026-07-06", changeFrequency: "yearly", priority: 0.3, locales: LOCALES },
  { path: "/terms-of-service", lastModified: "2026-09-30", changeFrequency: "yearly", priority: 0.3, locales: LOCALES },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...STATIC_PATHS,
    ...HELP_META.map((a) => ({
      path: `/support/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.7,
      locales: helpLocales(a.slug),
    })),
    ...SERVICES_META.map((s) => ({
      path: `/virtual-numbers/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.7,
      locales: serviceLocales(s.slug),
    })),
    ...COUNTRIES_META.map((c) => ({
      path: `/virtual-numbers/country/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.6,
      locales: countryLocales(c.slug),
    })),
    ...ALTERNATIVES_META.map((a) => ({
      path: `/alternatives/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.5,
      locales: alternativeLocales(a.slug),
    })),
    ...BLOG_META.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.6,
      locales: postLocales(p.slug),
    })),
  ];

  return entries.flatMap(({ path, lastModified, changeFrequency, priority, locales }) => {
    /* Mirrors languageAlternates() in lib/i18n.ts — x-default included. Google
       cross-checks sitemap hreflang against the on-page tags, so the two sets
       have to match key for key. */
    const languages: Record<string, string> = {};
    for (const locale of locales) languages[localeConfig(locale).hreflang] = absolute(locale, path);
    if (locales.includes(DEFAULT_LOCALE)) languages["x-default"] = absolute(DEFAULT_LOCALE, path);
    return locales.map((locale) => ({
      url: absolute(locale, path),
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
