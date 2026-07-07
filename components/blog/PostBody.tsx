import Link from "next/link";
import { JsonLd } from "../JsonLd";
import { StoreBadges } from "../StoreBadges";
import type { Block } from "../../lib/content/blog/types";
import { getService } from "../../lib/content/services";
import { BLOG_UI } from "../../lib/content/blogUi";
import { localePath, type Locale } from "../../lib/i18n";
import { faqPage } from "../../lib/seo";

/** Render a post's Block[] in the site's own type scale. The faq block also
 *  emits FAQPage JSON-LD so answers are structured-data for free. */
export function PostBody({
  locale,
  blocks,
}: {
  locale: Locale;
  blocks: Block[];
}) {
  const t = BLOG_UI[locale];
  return (
    <div className="flex flex-col gap-[22px]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="max-w-[68ch] text-body text-steel-gray">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-[34px] scroll-mt-24 text-heading"
              >
                {block.text}
              </h2>
            );
          case "list": {
            const cls =
              "flex max-w-[68ch] flex-col gap-[10px] text-body text-steel-gray";
            const marker = (n: number) =>
              block.ordered ? (
                <span className="shrink-0 text-signal-blue">{n + 1}.</span>
              ) : (
                <span className="shrink-0 text-signal-blue">·</span>
              );
            return block.ordered ? (
              <ol key={i} className={cls}>
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-[10px]">
                    {marker(j)}
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className={cls}>
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-[10px]">
                    {marker(j)}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          case "steps":
            return (
              <div key={i} className="grid gap-[22px] md:grid-cols-3">
                {block.items.map((step, j) => (
                  <div key={step.title} className="card !p-[26px]">
                    <span className="section-label">{j + 1}</span>
                    <h3 className="text-subheading">{step.title}</h3>
                    <p className="mt-[10px] text-label text-steel-gray">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            );
          case "callout":
            return (
              <p
                key={i}
                className="max-w-[68ch] rounded-[22px] border-[0.5px] border-signal-blue/40 bg-signal-blue/[0.04] px-[22px] py-[18px] text-body text-off-black"
              >
                {block.text}
              </p>
            );
          case "faq":
            return (
              <div key={i}>
                <JsonLd data={faqPage(block.items)} />
                <div className="overflow-hidden rounded-[30px] border-[0.5px] border-black/[0.06] bg-pure-white">
                  {block.items.map((item, j) => (
                    <details
                      key={item.q}
                      className={`group px-[clamp(22px,4vw,34px)] py-[22px] ${
                        j > 0 ? "border-t-[0.5px] border-black/[0.06]" : ""
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
              </div>
            );
          case "image":
            return (
              <figure key={i}>
                <img
                  src={block.src}
                  alt={block.alt}
                  className="w-full rounded-[30px] border-[0.5px] border-black/[0.06]"
                  loading="lazy"
                />
                {block.caption && (
                  <figcaption className="mt-[10px] text-caption text-ash-gray">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "cta": {
            const service = block.serviceSlug
              ? getService(block.serviceSlug)
              : undefined;
            return (
              <div
                key={i}
                className="card my-[12px] flex flex-col items-center gap-[22px] text-center"
              >
                <h3 className="max-w-md text-subheading">{t.ctaTitle}</h3>
                <p className="text-label text-steel-gray">{t.ctaBody}</p>
                <StoreBadges locale={locale} placement="browse" />
                {service && (
                  <Link
                    href={localePath(
                      locale,
                      `/virtual-numbers/${service.slug}`,
                    )}
                    className="blue-link text-label"
                  >
                    {service.name} →
                  </Link>
                )}
              </div>
            );
          }
        }
      })}
    </div>
  );
}
