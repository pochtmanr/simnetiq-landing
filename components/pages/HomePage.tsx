import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CoinChip, type CoinTier } from "../CoinChip";
import { HeroCta } from "../HeroCta";
import { LiveInbox } from "../LiveInbox";
import { StoreBadges } from "../StoreBadges";
import { localePath, type Locale } from "../../lib/i18n";
import { blogUi, COIN_PACKS, homeUi, MARQUEE_SERVICES } from "../../lib/content/ui";
import { getService, getServices } from "../../lib/content/services";
import { getAlternatives } from "../../lib/content/alternatives";
import { getPosts } from "../../lib/content/blog";
import { Arrow } from "../Arrow";
import { AmbientBg } from "../AmbientBg";
import { PlayWhenVisible } from "../PlayWhenVisible";
import { PRICE_ART, PRICE_ICONS } from "../PriceArt";

/* Pricing cards' art fields, one plate per fact. The middle card frames the
   temple and its light shaft, so it doesn't repeat the sky on either side. */
const PRICE_BGS = [
  { src: "/bg/curtain-sky.webp" },
  { src: "/bg/jungle-temple.webp", focus: "50% 55%" },
  { src: "/bg/forest-rays.webp", focus: "85% 60%" },
];

/* Coin packs climb the metal tiers in order, smallest pack first. */
const COIN_TIERS: CoinTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

/* Step 1's picture: the service list as chips, one already chosen. */
const PICK_CHIPS = [
  { slug: "telegram", name: "Telegram" },
  { slug: "whatsapp", name: "WhatsApp" },
  { slug: "google", name: "Google" },
] as const;

function StepPick() {
  return (
    <div className="flex flex-wrap gap-[8px]">
      {PICK_CHIPS.map((c, i) => (
        <span key={c.slug} className={`pick-chip${i === 0 ? " pick-chip--on" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/services/${c.slug}.svg`} alt="" className="h-[18px] w-[18px]" />
          {c.name}
          {i === 0 && (
            <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      ))}
      <span className="pick-chip pick-chip--more">100+</span>
    </div>
  );
}

/* Step 2's picture: the number as the app shows it, waiting for the SMS.
   07700 900xxx is Ofcom's range reserved for fiction, so it rings no one. */
function StepNumber({ waiting }: { waiting: string }) {
  return (
    <div className="number-slip">
      <span className="flex items-center justify-between gap-[12px]">
        <span className="figures text-[18px] tracking-[0.02em] text-ink" dir="ltr">
          +44 7700 900418
        </span>
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="8" y="8" width="12" height="12" rx="3" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      </span>
      <span className="mt-[10px] flex items-center gap-[8px] text-label text-muted">
        <span className="wait-dots">
          <span />
          <span />
          <span />
        </span>
        {waiting}
      </span>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  id,
  onInk = false,
}: {
  label: string;
  title: string;
  id?: string;
  onInk?: boolean;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <span className={`section-label ${onInk ? "!text-accent" : ""}`}>
        {label}
      </span>
      <h2 className="text-heading">{title}</h2>
    </div>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = homeUi(locale);
  const tags = blogUi(locale).tags;
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)]">
      {/* Hero — the reference system's two-column split: tinted copy panel on
          the left, heavier tint on the right holding the product. The device
          bleeds off the panel's bottom edge rather than sitting inside it. */}
      <section className="grid items-stretch gap-[22px] pt-[40px] md:min-h-[min(82vh,780px)] md:grid-cols-2 md:pt-[56px]">
        <div className="flex flex-col gap-[22px]">
          {/* Copy panel: the headline holds the top, the explanation sits
              under a hairline at the foot. */}
          <div className="panel hero-rise flex flex-1 flex-col justify-between gap-[40px]">
            <div>
              <span className="section-label">{t.hero.label}</span>
              <h1 className="text-heading-lg">
                {t.hero.titleTop}
                <span className="block text-ink-muted/80">{t.hero.titleAccent}</span>
              </h1>
            </div>

            <p className="max-w-[46ch] border-t border-border pt-[21px] text-prose text-ink-muted">
              {t.hero.body}
            </p>
          </div>
          <HeroCta locale={locale} />
        </div>
        <PlayWhenVisible className="panel media-card hero-rise flex items-center justify-center [animation-delay:0.12s]">
          <AmbientBg src="/bg/colonnade.webp" scrim="none" priority sizes="(max-width: 768px) 100vw, 600px" />
          <Image
            src="/app/hero-services.png"
            alt=""
            width={670}
            height={1100}
            priority
            className="h-auto w-full max-w-[400px] drop-shadow-[0_18px_40px_rgba(8,30,74,0.28)]"
          />
        </PlayWhenVisible>
      </section>


      {/* Stats strip — sits one hero-gap under the hero, in the copy panel's
          grey, so the two read as a single block. */}
      <section className="pt-[22px]" id="stats">
        <div className="panel hero-rise grid grid-cols-2 gap-[28px] [animation-delay:0.18s] lg:grid-cols-4">
          {t.stats.items.map((s) => (
            <div key={s.label}>
              <span className="figures text-[clamp(34px,4vw,44px)] leading-none tracking-[-0.03em] text-accent-deep">
                {s.value}
              </span>
              <p className="mt-[11px] text-label text-ink">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pt-[94px]" id="how-it-works">
        <SectionHeading label={t.how.label} title={t.how.title} />
        <PlayWhenVisible className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.how.steps.map((step, i) => (
            <div
              key={step.title}
              className={`card step-card step-card--${i + 1} flex flex-col${i === 2 ? " media-card" : ""}`}
            >
              {i === 2 && <AmbientBg src="/bg/forest-rays.webp" scrim="top" focus="20% 30%" />}
              <span className="section-label step-card__label">
                {t.how.step} {i + 1}
              </span>
              <h3 className="text-subheading step-card__title">{step.title}</h3>
              {/* The last step shows the code arriving instead of describing
                  it; its sentence stays for screen readers and crawlers. */}
              {i === t.how.steps.length - 1 ? (
                <>
                  <p className="sr-only">{step.body}</p>
                  <div className="mt-auto pt-[24px]">
                    <LiveInbox copy={t.how.inbox} className="relative" />
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-[11px] text-body step-card__body">{step.body}</p>
                  <div className="mt-auto pt-[28px]" aria-hidden>
                    {i === 0 ? <StepPick /> : <StepNumber waiting={t.how.waiting} />}
                  </div>
                </>
              )}
            </div>
          ))}
        </PlayWhenVisible>
      </section>

      {/* Services */}
      <section className="scroll-mt-24 pt-[94px]" id="services">
        <span className="section-label text-center">{t.services.label}</span>
        <h2 className="text-center text-heading">{t.services.title}</h2>
        <div className="logo-strip mx-[calc(50%-50vw)] mt-[28px]" aria-hidden>
          <div className="marquee-track flex items-center gap-[36px] px-4">
            {[...MARQUEE_SERVICES, ...MARQUEE_SERVICES].map((slug, i) => (
              <span
                key={`${slug}-${i}`}
                className="logo-chip"
                style={{ "--logo": `url(/services/${slug}.svg)` } as CSSProperties}
              />
            ))}
          </div>
        </div>
        <p className="mt-[14px] text-center text-caption text-muted">
          {t.services.caption}
        </p>
      </section>


      {/* Features */}
      <section className="pt-[94px]" id="features">
        <div className="panel">
          <SectionHeading label={t.features.label} title={t.features.title} />
          <p className="mt-[14px] max-w-xl text-body text-ink-muted">
            {t.features.sub}
          </p>
          <div className="mt-[34px] grid gap-x-[34px] gap-y-[28px] sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f) => (
              <div key={f.title} className="border-t border-white/70 pt-[21px]">
                <h3 className="text-body text-ink">{f.title}</h3>
                <p className="mt-[11px] text-label text-ink-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing — coins, and the honest version of how they're spent. */}
      <section className="pt-[94px]" id="pricing">
        <SectionHeading label={t.pricing.label} title={t.pricing.title} />
        <p className="mt-[14px] max-w-2xl text-body text-ink-muted">
          {t.pricing.sub}
        </p>
        <div className="mt-[28px] flex flex-wrap items-center gap-[11px]">
          <span className="text-label text-muted">{t.pricing.packsLabel}</span>
          {COIN_PACKS.map((pack, i) => (
            <CoinChip
              key={pack}
              amount={pack}
              unit={t.pricing.coinsUnit}
              tier={COIN_TIERS[Math.min(i, COIN_TIERS.length - 1)]}
            />
          ))}
        </div>
        {/* Each fact gets a picture of itself: a painted art field with a
            small looping scene, an icon badge, then the copy on white. */}
        <PlayWhenVisible className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {t.pricing.facts.map((fact, i) => {
            const Art = PRICE_ART[i % PRICE_ART.length];
            return (
              <div key={fact.title} className="card price-card flex flex-col">
                <div className="price-art media-card" aria-hidden>
                  <AmbientBg {...PRICE_BGS[i % PRICE_BGS.length]} scrim="none" />
                  <Art />
                </div>
                <span className="price-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                    {PRICE_ICONS[i % PRICE_ICONS.length]}
                  </svg>
                </span>
                <h3 className="mt-[14px] text-subheading">{fact.title}</h3>
                <p className="mt-[11px] text-label text-ink-muted">{fact.body}</p>
              </div>
            );
          })}
        </PlayWhenVisible>
        <p className="mt-[21px] text-caption text-muted">{t.pricing.note}</p>
      </section>

      {/* Inside the app — its own ink card, cut out of the page by a strip
          of the desk above and below, so the change of section is a change
          of surface. The phones stand in a staggered row and run off the
          card's bottom edge; on phones the row becomes a swipeable strip. */}
      <section className="pt-[94px]" id="inside">
        <div className="sheet-cut">
          <div className="sheet-cut__card panel--ink">
            <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,34px)] pt-[clamp(48px,6vw,84px)]">
              <div className="grid gap-[21px] md:grid-cols-[1.2fr_1fr] md:items-end">
                <SectionHeading
                  label={t.showcase.label}
                  title={t.showcase.title}
                  onInk
                />
                <p className="max-w-[44ch] text-body text-white/65 md:justify-self-end">
                  {t.showcase.body}
                </p>
              </div>
              <div className="showcase-row mt-[clamp(40px,5vw,64px)]">
                {t.showcase.shots.map((shot) => (
                  <figure key={shot.src} className="showcase-shot">
                    <figcaption className="text-label text-white/60">
                      {shot.caption}
                    </figcaption>
                    <Image
                      src={shot.src}
                      alt=""
                      width={503}
                      height={900}
                      sizes="(max-width: 768px) 62vw, 270px"
                      className="h-auto w-full"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by service — the site's internal-linking hub section. Sits
          straight after the showcase: the reader has just seen the app, so the
          next thing offered is a way into it. Plain canvas, like every other
          non-panel section. */}
      <section className="pt-[94px]" id="browse">
        <SectionHeading label={t.browse.label} title={t.browse.title} />
        <p className="mt-[14px] max-w-xl text-body text-ink-muted">
          {t.browse.body}
        </p>
        <div className="mt-[34px] flex flex-wrap gap-[11px]">
          {getServices(locale).map((s) => (
            <Link
              key={s.slug}
              href={localePath(locale, `/virtual-numbers/${s.slug}`)}
              className="inline-flex items-center gap-[8px] rounded-pill bg-card px-[14px] py-[9px] text-label text-ink transition-colors hover:bg-panel"
            >
              <img src={s.logo} alt="" className="h-5 w-5" />
              {s.name}
            </Link>
          ))}
          <Link
            href={localePath(locale, "/virtual-numbers")}
            className="inline-flex items-center rounded-pill border border-border px-[16px] py-[9px] text-label text-accent-deep transition-colors hover:border-accent-deep"
          >
            {t.browse.allLink} <Arrow />
          </Link>
        </div>
      </section>

      {/* Use cases / personas */}
      <section className="pt-[94px]" id="use-cases">
        <SectionHeading label={t.personas.label} title={t.personas.title} />
        <div className="mt-[34px] grid gap-[22px] sm:grid-cols-2 lg:grid-cols-5">
          {t.personas.items.filter((p) => getService(locale, p.slug)).map((p) => (
            <div key={p.title} className="flex flex-col border-t border-border pt-[21px]">
              <h3 className="text-body text-ink">{p.title}</h3>
              <p className="mt-[11px] flex-1 text-label text-ink-muted">
                {p.body}
              </p>
              <Link
                href={localePath(locale, `/virtual-numbers/${p.slug}`)}
                className="blue-link mt-[14px] text-label"
              >
                {p.linkLabel} <Arrow />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Compare — internal crawl path to the /alternatives pages */}
      <section className="pt-[94px]" id="compare">
        <div className="panel">
          <SectionHeading label={t.compare.label} title={t.compare.title} />
          <p className="mt-[14px] max-w-xl text-body text-ink-muted">
            {t.compare.body}
          </p>
          <div className="mt-[34px] flex flex-wrap gap-[11px]">
            {getAlternatives(locale).map((a) => (
              <Link
                key={a.slug}
                href={localePath(locale, `/alternatives/${a.slug}`)}
                className="rounded-pill bg-card px-[18px] py-[9px] text-label text-ink transition-colors hover:text-accent-deep"
              >
                {t.compare.vsLabel} {a.competitorName} <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — the reference system's serif question / sans answer pairing,
          kept as <details> so the accordion behaviour survives. */}
      <section className="pt-[94px]" id="faq">
        <SectionHeading label={t.faq.label} title={t.faq.title} />
        <div className="mt-[34px]">
          {t.faq.items.map((item, i) => (
            <details
              key={item.q}
              className={`group py-[21px] ${i > 0 ? "border-t border-border" : ""}`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-heading-sm font-medium text-ink">
                  {item.q}
                </h3>
                <span className="mt-[6px] shrink-0 text-accent-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-[11px] max-w-[62ch] text-body text-ink-muted">
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
            {t.blog.allLink} <Arrow />
          </Link>
        </div>
        <div className="mt-[34px] grid gap-[22px] md:grid-cols-3">
          {getPosts(locale).slice(0, 3).map((post) => {
            const c = post.copy;
            return (
              <Link
                key={post.slug}
                href={localePath(locale, `/blog/${post.slug}`)}
                className="card group flex flex-col transition-colors hover:bg-panel"
              >
                <div className="flex flex-wrap gap-[8px]">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tags[tag as keyof typeof tags] ?? tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-[21px] text-subheading">{c.title}</h3>
                <p className="mt-[11px] flex-1 text-label text-ink-muted">
                  {c.excerpt}
                </p>
                <span className="blue-link mt-[21px] text-label">
                  {t.blog.readMore} <Arrow />
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href={localePath(locale, "/blog")}
          className="blue-link mt-[21px] inline-block text-label sm:hidden"
        >
          {t.blog.allLink} <Arrow />
        </Link>
      </section>

      {/* Download — the sheet's last card, in the brand's soft blue. The
          -mb cancels <main>'s bottom padding so this card is the sheet's
          rounded end, the part that lifts off the footer. A phone rises
          from its bottom edge, mid-activation. */}
      <section className="-mb-[94px] pt-[94px]" id="download">
        <div className="sheet-cut sheet-cut--end">
          <PlayWhenVisible className="sheet-cut__card media-card">
            <AmbientBg src="/bg/jungle-temple.webp" scrim="left" focus="70% 50%" sizes="100vw" />
            <div className="relative mx-auto grid w-full max-w-[1200px] gap-x-[34px] px-[clamp(20px,4vw,34px)] md:grid-cols-[1.15fr_1fr]">
              <div className="flex flex-col items-start gap-[28px] py-[clamp(56px,7vw,96px)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo.svg" alt="" width={56} height={56} className="h-[56px] w-[56px]" />
                <h2 className="max-w-[17ch] text-heading-lg !text-white">{t.cta.title}</h2>
                <div className="flex flex-col items-start gap-[16px]">
                  <StoreBadges dark locale={locale} placement="final_cta" />
                  <Link href={localePath(locale, "/support")} className="blue-link blue-link--white text-label">
                    {t.cta.support}
                  </Link>
                </div>
              </div>
              {/* Two phones, both themes: the dark one mid-activation in
                  front, the light one behind it showing a finished
                  activation, offset up and to the side. */}
              <div className="download-devices" aria-hidden>
                <div className="download-device download-device--back">
                  <Image
                    src="/app/shot-activations.png"
                    alt=""
                    width={503}
                    height={900}
                    sizes="(max-width: 768px) 60vw, 280px"
                    className="h-auto w-full"
                  />
                </div>
                <div className="download-device download-device--front">
                  <Image
                    src="/app/shot-waiting.png"
                    alt=""
                    width={501}
                    height={900}
                    sizes="(max-width: 768px) 70vw, 320px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </PlayWhenVisible>
        </div>
      </section>
    </div>
  );
}
