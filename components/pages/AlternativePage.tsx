import Link from "next/link";
import { Breadcrumbs } from "../Breadcrumbs";
import { JsonLd } from "../JsonLd";
import { StoreBadges } from "../StoreBadges";
import type { AlternativeEntry } from "../../lib/content/alternatives/types";
import { ALTERNATIVES_UI } from "../../lib/content/alternativesUi";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Template for /alternatives/[competitor] — fair, factual comparison. */
export function AlternativePage({
  locale,
  entry,
}: {
  locale: Locale;
  entry: AlternativeEntry;
}) {
  const t = ALTERNATIVES_UI[locale];
  const c = entry[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      <JsonLd data={faqPage(c.faqs)} />
      <div className="pt-[40px]">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t.breadcrumbHome, path: "/" },
            { name: t.breadcrumb, path: `/alternatives/${entry.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative pb-[70px] pt-[10px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[180px] bottom-0 left-[calc(50%-50vw)] -z-10 w-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 72% 32%, rgba(0, 113, 227, 0.08), transparent 68%)",
          }}
        />
        <span className="section-label">
          {t.heroLabel} · {entry.competitorName}
        </span>
        <h1 className="max-w-3xl text-[clamp(32px,4.2vw,50px)] leading-[1.08] tracking-[-0.02em]">
          {c.hero.title}
        </h1>
        {c.hero.intro.map((p, i) => (
          <p
            key={i}
            className={`max-w-xl text-steel-gray ${i === 0 ? "mt-[22px] text-subheading" : "mt-[15px] text-body"}`}
          >
            {p}
          </p>
        ))}
        <div className="mt-[30px]">
          <StoreBadges locale={locale} />
        </div>
      </section>

      {/* Honest positioning */}
      <section className="grid gap-[22px] md:grid-cols-2">
        <div className="card">
          <h2 className="text-subheading">{c.whenThem.title}</h2>
          <p className="mt-[10px] text-body text-steel-gray">
            {c.whenThem.body}
          </p>
        </div>
        <div className="card !border-signal-blue">
          <h2 className="text-subheading">{c.whenUs.title}</h2>
          <p className="mt-[10px] text-body text-steel-gray">{c.whenUs.body}</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pt-[94px]">
        <h2 className="text-heading">{c.comparison.title}</h2>
        <div className="mt-[34px] overflow-x-auto rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b-[0.5px] border-black/[0.06]">
                <th className="px-[clamp(22px,4vw,34px)] py-[18px] text-label font-normal text-ash-gray" />
                <th className="px-[22px] py-[18px] text-label font-normal text-ash-gray">
                  {entry.competitorName}
                </th>
                <th className="px-[22px] py-[18px] text-label font-normal text-signal-blue">
                  {t.comparisonUsColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.comparison.rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    i > 0 ? "border-t-[0.5px] border-black/[0.06]" : ""
                  }
                >
                  <td className="px-[clamp(22px,4vw,34px)] py-[18px] text-label text-pure-black">
                    {row.label}
                  </td>
                  <td className="px-[22px] py-[18px] text-label text-steel-gray">
                    {row.competitor}
                  </td>
                  <td className="px-[22px] py-[18px] text-label text-steel-gray">
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {c.comparison.note && (
          <p className="mt-[15px] text-caption text-ash-gray">
            {c.comparison.note}
          </p>
        )}
      </section>

      {/* Switching steps */}
      <section className="pt-[94px]">
        <span className="section-label">{t.switchLabel}</span>
        <h2 className="text-heading">{c.switchSteps.title}</h2>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {c.switchSteps.steps.map((step) => (
            <div key={step.title} className="card">
              <h3 className="text-subheading">{step.title}</h3>
              <p className="mt-[10px] text-label text-steel-gray">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl pt-[94px]">
        <span className="section-label">{t.faqLabel}</span>
        <h2 className="text-heading">FAQ</h2>
        <div className="mt-[34px] overflow-hidden rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white">
          {c.faqs.map((item, i) => (
            <details
              key={item.q}
              className={`group px-[clamp(22px,4vw,34px)] py-[22px] ${
                i > 0 ? "border-t-[0.5px] border-black/[0.06]" : ""
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-signal-blue transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-[10px] max-w-[56ch] text-label text-steel-gray">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-[94px]">
        <div className="card flex flex-col items-center gap-[30px] text-center">
          <h2 className="max-w-2xl text-heading">{t.ctaTitle}</h2>
          <StoreBadges locale={locale} placement="service_cta" />
          <Link
            href={localePath(locale, "/support")}
            className="blue-link text-label"
          >
            {t.ctaSupport}
          </Link>
        </div>
        <p className="mx-auto mt-[22px] max-w-2xl text-center text-caption text-ash-gray">
          {t.disclaimer}
        </p>
      </section>
    </div>
  );
}
