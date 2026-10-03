import type { Metadata } from "next";
import { LegalDocument } from "../../../components/Legal";
import { legal } from "../../../lib/content/ui";
import { DEFAULT_LOCALE } from "../../../lib/i18n";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

/** Last substantive change to the terms, in every locale. */
const UPDATED_AT = "2026-09-30";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms-of-service">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = legal(locale, "terms").meta;
  return makeMetadata({ locale, path: "/terms-of-service", title: t.title, description: t.description });
}

export default async function TermsOfServicePage({
  params,
}: PageProps<"/[locale]/terms-of-service">) {
  const locale = asLocale((await params).locale);
  return (
    <LegalDocument
      doc={legal(locale, "terms")}
      locale={locale}
      updatedAt={UPDATED_AT}
      translated={locale !== DEFAULT_LOCALE}
    />
  );
}
