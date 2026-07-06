import Link from "next/link";
import { StarGlyph } from "./StarGlyph";
import { localePath, type Locale } from "../lib/i18n";
import { FOOTER } from "../lib/content/common";
import { APP_STORE_URL, PLAY_STORE_URL, SUPPORT_EMAIL } from "../lib/site";

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const t = FOOTER[locale];
  return (
    <footer className="mt-[94px] bg-off-black px-[clamp(24px,6vw,69px)] pb-[34px] pt-[50px] text-pure-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[30px] text-center">
        <StarGlyph className="h-5 w-5" />
        <p className="text-heading">SMS Activate</p>
        <p className="text-body text-pure-white/60">{t.tagline}</p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-[22px] gap-y-[10px] text-label"
        >
          <a href={APP_STORE_URL} className="ghost-link">
            App Store
          </a>
          <a href={PLAY_STORE_URL} className="ghost-link">
            Google Play
          </a>
          <Link href={localePath(locale, "/support")} className="ghost-link">
            {t.support}
          </Link>
          <Link href={localePath(locale, "/privacy-policy")} className="ghost-link">
            {t.privacy}
          </Link>
          <Link href={localePath(locale, "/terms-of-service")} className="ghost-link">
            {t.terms}
          </Link>
        </nav>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="blue-link text-label">
          {SUPPORT_EMAIL}
        </a>
        <p className="text-caption text-pure-white/40">
          © {new Date().getFullYear()} SIMNETIQ LTD. {t.rights}
        </p>
      </div>
    </footer>
  );
}
