import Link from "next/link";
import { getService } from "../lib/content/services";
import { servicesUi } from "../lib/content/ui";
import { localePath, type Locale } from "../lib/i18n";

/** Chip links to other service pages; slugs not (yet) published in this
 *  locale are skipped, so cross-links can be authored ahead of the pages they
 *  point to. */
export function RelatedServices({
  locale,
  slugs,
}: {
  locale: Locale;
  slugs: string[];
}) {
  const t = servicesUi(locale);
  const entries = slugs
    .map((slug) => getService(locale, slug))
    .filter((e) => e !== undefined);
  if (entries.length === 0) return null;
  return (
    <section className="pt-[94px]">
      <span className="section-label">{t.relatedLabel}</span>
      <h2 className="text-heading">{t.relatedTitle}</h2>
      <div className="mt-[28px] flex flex-wrap gap-[10px]">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={localePath(locale, `/virtual-numbers/${entry.slug}`)}
            className="chip !py-[10px] !ps-[10px] !pe-[16px] !text-[14px]"
          >
            <img src={entry.logo} alt="" className="h-6 w-6" loading="lazy" />
            {entry.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
