import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlternativePage } from "../../../../components/pages/AlternativePage";
import {
  alternativeLocales,
  getAlternative,
  getAlternatives,
} from "../../../../lib/content/alternatives";
import { asLocale } from "../../../../lib/routing";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getAlternatives(asLocale(params.locale)).map((a) => ({ competitor: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/alternatives/[competitor]">): Promise<Metadata> {
  const { locale: raw, competitor } = await params;
  const locale = asLocale(raw);
  const entry = getAlternative(locale, competitor);
  if (!entry) return {};
  return makeMetadata({
    locale,
    path: `/alternatives/${entry.slug}`,
    title: entry.copy.metaTitle,
    description: entry.copy.metaDescription,
    available: alternativeLocales(entry.slug),
  });
}

export default async function AlternativeRoute({
  params,
}: PageProps<"/[locale]/alternatives/[competitor]">) {
  const { locale: raw, competitor } = await params;
  const locale = asLocale(raw);
  const entry = getAlternative(locale, competitor);
  if (!entry) notFound();
  return <AlternativePage locale={locale} entry={entry} />;
}
