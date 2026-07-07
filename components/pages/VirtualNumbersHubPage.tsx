import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { StoreBadges } from "../StoreBadges";
import { ALL_SERVICES } from "../../lib/content/services";
import type { ServiceCategory } from "../../lib/content/services/types";
import { SERVICES_UI } from "../../lib/content/servicesUi";
import { localePath, type Locale } from "../../lib/i18n";

const CATEGORY_ORDER: ServiceCategory[] = [
  "messaging",
  "social",
  "other",
  "finance",
  "shopping",
  "travel",
  "entertainment",
  "dev",
];

/** /virtual-numbers — the crawl hub: every service page one click away. */
export function VirtualNumbersHubPage({ locale }: { locale: Locale }) {
  const t = SERVICES_UI[locale];
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    entries: ALL_SERVICES.filter((s) => s.category === category),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumbHub, path: "/virtual-numbers" },
          ]}
        />
      </div>

      <section className="pb-[60px] pt-[10px]">
        <span className="section-label">{t.hub.label}</span>
        <h1 className="max-w-3xl text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
          {t.hub.title}
        </h1>
        <p className="mt-[22px] max-w-xl text-subheading text-steel-gray">
          {t.hub.sub}
        </p>
      </section>

      {grouped.map(({ category, entries }) => (
        <section key={category} className="pb-[60px]">
          <span className="section-label">{t.categories[category]}</span>
          <div className="mt-[15px] grid grid-cols-2 gap-[15px] sm:grid-cols-3 lg:grid-cols-4">
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                href={localePath(locale, `/virtual-numbers/${entry.slug}`)}
                className="group flex items-center gap-[15px] rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white px-[22px] py-[18px] transition-colors hover:border-signal-blue"
              >
                <img src={entry.logo} alt="" className="h-7 w-7" loading="lazy" />
                <span className="text-body text-off-black">{entry.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <p className="text-caption text-ash-gray">{t.hub.allNote}</p>

      <section className="py-[94px]">
        <div className="card flex flex-col items-center gap-[30px] text-center">
          <h2 className="max-w-2xl text-heading">{t.ctaTitle}</h2>
          <StoreBadges locale={locale} placement="hub_cta" />
        </div>
      </section>
    </div>
  );
}
