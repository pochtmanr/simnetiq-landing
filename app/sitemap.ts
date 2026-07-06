import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

const PATHS: Array<{ path: string; changeFrequency: "monthly" | "yearly"; priority: number }> = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/support", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
];

function url(path: string, locale: "en" | "ru"): string {
  const prefix = locale === "ru" ? "/ru" : "";
  return path === "/" ? `${SITE_URL}${prefix || "/"}` : `${SITE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-06");
  return PATHS.flatMap(({ path, changeFrequency, priority }) => {
    const alternates = {
      languages: { en: url(path, "en"), ru: url(path, "ru") },
    };
    return [
      { url: url(path, "en"), lastModified, changeFrequency, priority, alternates },
      { url: url(path, "ru"), lastModified, changeFrequency, priority, alternates },
    ];
  });
}
