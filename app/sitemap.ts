import type { MetadataRoute } from "next";
import { ALL_ALTERNATIVES } from "../lib/content/alternatives";
import { BLOG_POSTS } from "../lib/content/blog";
import { ALL_COUNTRIES } from "../lib/content/countries";
import { ALL_SERVICES } from "../lib/content/services";
import { absolute } from "../lib/seo";

/* Registry-driven: static chrome pages are listed here, everything else
   derives from the content registries — publishing a page is just adding it
   to its registry. */

type Freq = "weekly" | "monthly" | "yearly";

/** Most recent updatedAt across a set of registry entries. Hub pages render
 *  their registry, so this is their real last-modified — Google discounts
 *  lastmod site-wide once it catches you overstating it. */
function latest(...groups: ReadonlyArray<ReadonlyArray<{ updatedAt: string }>>): string {
  return groups
    .flat()
    .reduce((max, entry) => (entry.updatedAt > max ? entry.updatedAt : max), "");
}

const STATIC_PATHS: Array<{
  path: string;
  lastModified: string;
  changeFrequency: Freq;
  priority: number;
}> = [
  { path: "/", lastModified: "2026-07-07", changeFrequency: "monthly", priority: 1 },
  {
    path: "/virtual-numbers",
    lastModified: latest(ALL_SERVICES, ALL_COUNTRIES),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { path: "/blog", lastModified: latest(BLOG_POSTS), changeFrequency: "weekly", priority: 0.8 },
  { path: "/support", lastModified: "2026-07-06", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", lastModified: "2026-07-06", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", lastModified: "2026-07-06", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...STATIC_PATHS,
    ...ALL_SERVICES.map((s) => ({
      path: `/virtual-numbers/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.7,
    })),
    ...ALL_COUNTRIES.map((c) => ({
      path: `/virtual-numbers/country/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.6,
    })),
    ...ALL_ALTERNATIVES.map((a) => ({
      path: `/alternatives/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.5,
    })),
    ...BLOG_POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as Freq,
      priority: 0.6,
    })),
  ];

  return entries.flatMap(({ path, lastModified, changeFrequency, priority }) => {
    /* Mirrors languageAlternates() in lib/i18n.ts — x-default included. Google
       cross-checks sitemap hreflang against the on-page tags, so the two sets
       have to match key for key. */
    const alternates = {
      languages: {
        en: absolute("en", path),
        ru: absolute("ru", path),
        "x-default": absolute("en", path),
      },
    };
    return (["en", "ru"] as const).map((locale) => ({
      url: absolute(locale, path),
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
      alternates,
    }));
  });
}
