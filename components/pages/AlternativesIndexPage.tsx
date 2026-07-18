import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { ALL_ALTERNATIVES } from "../../lib/content/alternatives";
import {
  ALTERNATIVES_HUB_UI,
  ALTERNATIVES_UI,
} from "../../lib/content/alternativesUi";
import { localePath, type Locale } from "../../lib/i18n";

/** /alternatives — card grid over the comparison registry. Mirrors
 *  BlogIndexPage; the card body reuses each entry's metaDescription rather
 *  than adding a summary field to AlternativeEntry. */
export function AlternativesIndexPage({ locale }: { locale: Locale }) {
  const t = ALTERNATIVES_HUB_UI[locale];
  const chrome = ALTERNATIVES_UI[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: chrome.breadcrumbHome, path: "/" },
            { name: chrome.breadcrumb, path: "/alternatives" },
          ]}
        />
      </div>

      <section className="pb-[60px] pt-[10px]">
        <span className="section-label">{t.label}</span>
        <h1 className="max-w-3xl text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
          {t.title}
        </h1>
        <p className="mt-[22px] max-w-xl text-subheading text-steel-gray">
          {t.sub}
        </p>
      </section>

      <section className="grid gap-[22px] pb-[40px] md:grid-cols-2 lg:grid-cols-3">
        {ALL_ALTERNATIVES.map((alt) => {
          const c = alt[locale];
          return (
            <Link
              key={alt.slug}
              href={localePath(locale, `/alternatives/${alt.slug}`)}
              className="card group flex flex-col transition-colors hover:!border-signal-blue"
            >
              <span className="tag-chip">{alt.competitorName}</span>
              <h2 className="mt-[22px] text-subheading">{c.hero.title}</h2>
              <p className="mt-[10px] flex-1 text-label text-steel-gray">
                {c.metaDescription}
              </p>
              <span className="blue-link mt-[22px] text-label">
                {t.readMore} →
              </span>
            </Link>
          );
        })}
      </section>

      <p className="pb-[94px] text-caption text-ash-gray">
        {chrome.disclaimer}
      </p>
    </div>
  );
}
