import type { Metadata } from "next";
import { LegalDocument } from "../../../components/Legal";
import { legal } from "../../../lib/content/ui";
import { DEFAULT_LOCALE } from "../../../lib/i18n";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

/** Last substantive change to the policy, in every locale. */
const UPDATED_AT = "2026-09-30";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = legal(locale, "privacy").meta;
  return makeMetadata({ locale, path: "/privacy-policy", title: t.title, description: t.description });
}

export default async function PrivacyPolicyPage({
  params,
}: PageProps<"/[locale]/privacy-policy">) {
  const locale = asLocale((await params).locale);
  return (
    <LegalDocument
      doc={legal(locale, "privacy")}
      locale={locale}
      updatedAt={UPDATED_AT}
      translated={locale !== DEFAULT_LOCALE}
    />
  );
}
