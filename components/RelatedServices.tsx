import Link from "next/link";
import { getService } from "../lib/content/services";
import { SERVICES_UI } from "../lib/content/servicesUi";
import { localePath, type Locale } from "../lib/i18n";

/** Card links to other service pages; slugs not (yet) in the registry are
 *  skipped, so cross-links can be authored ahead of the pages they point to. */
export function RelatedServices({
  locale,
  slugs,
}: {
  locale: Locale;
  slugs: string[];
}) {
  const t = SERVICES_UI[locale];
  const entries = slugs
    .map((slug) => getService(slug))
    .filter((e) => e !== undefined);
  if (entries.length === 0) return null;
  return (
    <section className="pt-[94px]">
      <span className="section-label">{t.relatedLabel}</span>
      <h2 className="text-heading">{t.relatedTitle}</h2>
      <div className="mt-[34px] grid grid-cols-2 gap-[15px] sm:grid-cols-3 lg:grid-cols-5">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={localePath(locale, `/virtual-numbers/${entry.slug}`)}
            className="group flex flex-col items-center gap-[12px] rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white px-4 py-[26px] transition-colors hover:border-signal-blue"
          >
            <img
              src={entry.logo}
              alt=""
              className="h-8 w-8"
              loading="lazy"
            />
            <span className="text-label text-off-black">{entry.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
