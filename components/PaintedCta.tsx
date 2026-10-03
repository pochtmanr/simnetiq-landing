import Link from "next/link";
import { AmbientBg } from "./AmbientBg";
import { PlayWhenVisible } from "./PlayWhenVisible";
import { StoreBadges } from "./StoreBadges";
import { localePath, type Locale } from "../lib/i18n";

/** Closing call to action for the virtual-number pages: the home download
 *  card's painted field, sized to the page grid instead of the full sheet. */
export function PaintedCta({
  locale,
  title,
  supportLabel,
  placement,
}: {
  locale: Locale;
  title: string;
  supportLabel?: string;
  placement: "service_cta" | "hub_cta";
}) {
  return (
    <section className="py-[94px]">
      <PlayWhenVisible className="media-card rounded-card">
        <AmbientBg src="/bg/jungle-temple.webp" scrim="left" focus="70% 50%" sizes="(max-width: 1200px) 100vw, 1200px" />
        <div className="relative flex flex-col items-start gap-[28px] px-[clamp(24px,5vw,56px)] py-[clamp(48px,6vw,80px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.svg" alt="" width={48} height={48} className="h-[48px] w-[48px]" />
          <h2 className="max-w-[20ch] text-heading-lg !text-white">{title}</h2>
          <div className="flex flex-col items-start gap-[16px]">
            <StoreBadges dark locale={locale} placement={placement} />
            {supportLabel && (
              <Link href={localePath(locale, "/support")} className="blue-link blue-link--white text-label">
                {supportLabel}
              </Link>
            )}
          </div>
        </div>
      </PlayWhenVisible>
    </section>
  );
}
