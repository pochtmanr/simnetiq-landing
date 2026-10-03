import type { Metadata } from "next";
import { AlternativesIndexPage } from "../../../components/pages/AlternativesIndexPage";
import { alternativesUi } from "../../../lib/content/ui";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/alternatives">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = alternativesUi(locale).hub;
  return makeMetadata({
    locale,
    path: "/alternatives",
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function AlternativesPage({
  params,
}: PageProps<"/[locale]/alternatives">) {
  return <AlternativesIndexPage locale={asLocale((await params).locale)} />;
}
