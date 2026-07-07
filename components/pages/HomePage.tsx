import Link from "next/link";
import { PhoneMock } from "../PhoneMock";
import { StoreBadges } from "../StoreBadges";
import { localePath, type Locale } from "../../lib/i18n";
import { HOME, SERVICES } from "../../lib/content/home";
import { ALL_SERVICES } from "../../lib/content/services";
import { ALL_ALTERNATIVES } from "../../lib/content/alternatives";
import { BLOG_POSTS } from "../../lib/content/blog";

function SectionHeading({
  label,
  title,
  id,
}: {
  label: string;
  title: string;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <span className="section-label">{label}</span>
      <h2 className="text-heading">{title}</h2>
    </div>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = HOME[locale];
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      {/* Update banner */}
      <div className="mt-[50px] flex justify-center">
        <Link href={localePath(locale, "/#pricing")} className="cta-pill">
          <span className="tag-chip">{t.banner.chip}</span>
          {t.banner.text}
        </Link>
      </div>

      {/* Hero */}
      <section className="relative grid items-center gap-[60px] pb-[110px] pt-[50px] md:grid-cols-2 md:pt-[80px]">
        {/* Full-bleed background wash behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[140px] bottom-0 left-[calc(50%-50vw)] -z-10 w-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 72% 32%, rgba(0, 113, 227, 0.08), transparent 68%), radial-gradient(ellipse 55% 50% at 12% 78%, rgba(253, 253, 253, 0.9), transparent 70%)",
          }}
        />
        <div className="hero-rise">
          <span className="section-label">{t.hero.label}</span>
          <h1 className="text-[clamp(36px,4.8vw,58px)] leading-[1.08] tracking-[-0.02em]">
            {t.hero.titleTop}
            <br />
            <span className="text-signal-blue">{t.hero.titleAccent}</span>
          </h1>
          <p className="mt-[22px] max-w-md text-subheading text-steel-gray">
            {t.hero.body}
          </p>
          <div className="mt-[30px]">
            <StoreBadges locale={locale} />
          </div>
          <p className="mt-[15px] text-caption text-ash-gray">{t.hero.note}</p>
        </div>
        <div className="hero-rise [animation-delay:0.12s]">
          <PhoneMock locale={locale} />
        </div>
      </section>

      {/* Services */}
      <section className="scroll-mt-24" id="services">
        <span className="section-label text-center">{t.services.label}</span>
        <h2 className="text-center text-heading">{t.services.title}</h2>
        <div className="mx-[calc(50%-50vw)] mt-[30px] overflow-hidden" aria-hidden>
          <div className="marquee-track flex gap-[10px] px-4">
            {[...SERVICES, ...SERVICES].map((slug, i) => (
              <div
                key={`${slug}-${i}`}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border-[0.5px] border-black/[0.06] bg-pure-white"
              >
                <img src={`/services/${slug}.svg`} alt="" className="h-8 w-8" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-[15px] text-center text-caption text-ash-gray">
          {t.services.caption}
        </p>
      </section>

      {/* Stats strip */}
      <section className="pt-[94px]" id="stats">
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.items.map((s) => (
            <div
              key={s.label}
              className="border-t-[0.5px] border-black/[0.06] pt-[22px]"
            >
              <span className="text-[44px] leading-none tracking-[-0.02em] text-signal-blue">
                {s.value}
              </span>
              <p className="mt-[10px] text-label text-steel-gray">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pt-[94px]" id="how-it-works">
        <SectionHeading label={t.how.label} title={t.how.title} />
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.how.steps.map((step, i) => (
            <div key={step.title} className="card">
              <span className="section-label">
                {t.how.step} {i + 1}
              </span>
              <h3 className="text-subheading">{step.title}</h3>
              <p className="mt-[10px] text-body text-steel-gray">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="pt-[94px]" id="features">
        <div className="rounded-[63px] border-[0.5px] border-black/[0.06] bg-pure-white px-[clamp(16px,2.2vw,24px)] py-[clamp(18px,2.8vw,30px)]">
          <SectionHeading label={t.features.label} title={t.features.title} />
          <p className="mt-[15px] max-w-xl text-body text-steel-gray">
            {t.features.sub}
          </p>
          <div className="mt-[34px] grid gap-x-[34px] gap-y-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f) => (
              <div key={f.title} className="border-t-[0.5px] border-black/[0.06] pt-[22px]">
                <h3 className="text-body text-pure-black">{f.title}</h3>
                <p className="mt-[10px] text-label text-steel-gray">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by service — the site's internal-linking hub section.
          Full-bleed blue band via the marquee's mx-[calc(50%-50vw)] + w-screen
          trick; body has overflow-x: clip so no horizontal scroll appears. */}
      <section className="pt-[94px]" id="browse">
        <div className="mx-[calc(50%-50vw)] w-screen bg-signal-blue py-[clamp(40px,5vw,64px)] text-pure-white">
          <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
            <span className="section-label !text-pure-white/70">
              {t.browse.label}
            </span>
            <h2 className="max-w-2xl text-heading">{t.browse.title}</h2>
            <p className="mt-[15px] max-w-xl text-body text-pure-white/70">
              {t.browse.body}
            </p>
            <div className="mt-[34px] flex flex-wrap gap-[10px]">
              {ALL_SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={localePath(locale, `/virtual-numbers/${s.slug}`)}
                  className="inline-flex items-center gap-[8px] rounded-full bg-pure-white px-[14px] py-[8px] text-label text-off-black transition-opacity hover:opacity-85"
                >
                  <img src={s.logo} alt="" className="h-5 w-5" />
                  {s.name}
                </Link>
              ))}
              <Link
                href={localePath(locale, "/virtual-numbers")}
                className="inline-flex items-center rounded-full border-[0.5px] border-pure-white/50 px-[16px] py-[8px] text-label text-pure-white transition-colors hover:border-pure-white hover:bg-pure-white/10"
              >
                {t.browse.allLink} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pt-[94px]" id="pricing">
        <SectionHeading label={t.pricing.label} title={t.pricing.title} />
        <p className="mt-[15px] max-w-xl text-body text-steel-gray">
          {t.pricing.sub}
        </p>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.pricing.packs.map((pack) => (
            <div
              key={pack.name}
              className={`card ${pack.featured ? "!border-signal-blue" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="section-label !mb-0">{pack.name}</span>
                {pack.featured && <span className="tag-chip">{t.pricing.popular}</span>}
              </div>
              <div className="mt-[22px] flex items-baseline gap-[6px]">
                <span className="text-[44px] leading-none tracking-[-0.02em]">
                  {pack.credits}
                </span>
                <span className="text-label text-ash-gray">{pack.label}</span>
              </div>
              <p className="mt-[22px] text-label text-steel-gray">{pack.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-[22px] text-caption text-ash-gray">{t.pricing.note}</p>
      </section>

      {/* Use cases / personas */}
      <section className="pt-[94px]" id="use-cases">
        <SectionHeading label={t.personas.label} title={t.personas.title} />
        <div className="mt-[34px] grid gap-[22px] sm:grid-cols-2 lg:grid-cols-5">
          {t.personas.items.map((p) => (
            <div
              key={p.title}
              className="flex flex-col border-t-[0.5px] border-black/[0.06] pt-[22px]"
            >
              <h3 className="text-body text-pure-black">{p.title}</h3>
              <p className="mt-[10px] flex-1 text-label text-steel-gray">
                {p.body}
              </p>
              <Link
                href={localePath(locale, `/virtual-numbers/${p.slug}`)}
                className="blue-link mt-[15px] text-label"
              >
                {p.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Compare — internal crawl path to the /alternatives pages */}
      <section className="pt-[94px]" id="compare">
        <div className="card">
          <SectionHeading label={t.compare.label} title={t.compare.title} />
          <p className="mt-[15px] max-w-xl text-body text-steel-gray">
            {t.compare.body}
          </p>
          <div className="mt-[34px] flex flex-wrap gap-[10px]">
            {ALL_ALTERNATIVES.map((a) => (
              <Link
                key={a.slug}
                href={localePath(locale, `/alternatives/${a.slug}`)}
                className="rounded-full border-[0.5px] border-black/[0.08] px-[18px] py-[9px] text-label text-pure-black transition-colors hover:border-signal-blue hover:text-signal-blue"
              >
                {t.compare.vsLabel} {a.competitorName} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl pt-[94px]" id="faq">
        <SectionHeading label={t.faq.label} title={t.faq.title} />
        <div className="mt-[34px] overflow-hidden rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white">
          {t.faq.items.map((item, i) => (
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

      {/* From the blog */}
      <section className="pt-[94px]" id="blog">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading label={t.blog.label} title={t.blog.title} />
          <Link
            href={localePath(locale, "/blog")}
            className="blue-link mb-[6px] hidden shrink-0 text-label sm:block"
          >
            {t.blog.allLink} →
          </Link>
        </div>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((post) => {
            const c = post[locale];
            return (
              <Link
                key={post.slug}
                href={localePath(locale, `/blog/${post.slug}`)}
                className="card group flex flex-col transition-colors hover:!border-signal-blue"
              >
                <div className="flex flex-wrap gap-[10px]">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-[22px] text-subheading">{c.title}</h3>
                <p className="mt-[10px] flex-1 text-label text-steel-gray">
                  {c.excerpt}
                </p>
                <span className="blue-link mt-[22px] text-label">
                  {t.blog.readMore} →
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href={localePath(locale, "/blog")}
          className="blue-link mt-[22px] inline-block text-label sm:hidden"
        >
          {t.blog.allLink} →
        </Link>
      </section>

      {/* Final CTA — full-bleed white band (matches the browse band's full-width
          treatment); pure-white reads against the off-white page background.
          -mb pulls it flush to the footer so no off-white stripe shows in the
          footer's mt-[94px] gap. */}
      <section className="-mb-[94px] pt-[94px]">
        <div className="mx-[calc(50%-50vw)] w-screen bg-pure-white py-[clamp(40px,5vw,64px)]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[30px] px-[clamp(20px,4vw,34px)] text-center">
            <h2 className="max-w-2xl text-heading">{t.cta.title}</h2>
            <StoreBadges locale={locale} placement="final_cta" />
            <Link href={localePath(locale, "/support")} className="blue-link text-label">
              {t.cta.support}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
