import type { Metadata } from "next";
import { CookieSettingsButton } from "../../../components/CookieSettingsButton";
import { LegalDocument } from "../../../components/Legal";
import { legal, ui } from "../../../lib/content/ui";
import { DEFAULT_LOCALE } from "../../../lib/i18n";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

/** Last substantive change to the policy, in every locale. */
const UPDATED_AT = "2026-10-04";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cookie-policy">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = legal(locale, "cookies").meta;
  return makeMetadata({ locale, path: "/cookie-policy", title: t.title, description: t.description });
}

export default async function CookiePolicyPage({
  params,
}: PageProps<"/[locale]/cookie-policy">) {
  const locale = asLocale((await params).locale);
  return (
    <LegalDocument
      doc={legal(locale, "cookies")}
      locale={locale}
      updatedAt={UPDATED_AT}
      translated={locale !== DEFAULT_LOCALE}
    >
      {/* The policy's "change your choice" section points here. */}
      <div className="mt-[34px] border-t border-border pt-[30px]">
        <CookieSettingsButton className="cta cursor-pointer">
          {ui(locale).footer.cookieSettings}
        </CookieSettingsButton>
      </div>
    </LegalDocument>
  );
}
