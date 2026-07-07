import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryPage } from "../../../../../../components/pages/CountryPage";
import {
  COUNTRY_SLUGS,
  getCountry,
} from "../../../../../../lib/content/countries";
import { makeMetadata } from "../../../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ru/virtual-numbers/country/[country]">): Promise<Metadata> {
  const { country } = await params;
  const entry = getCountry(country);
  if (!entry) return {};
  return makeMetadata({
    locale: "ru",
    path: `/virtual-numbers/country/${entry.slug}`,
    title: entry.ru.metaTitle,
    description: entry.ru.metaDescription,
  });
}

export default async function CountryRoute({
  params,
}: PageProps<"/ru/virtual-numbers/country/[country]">) {
  const { country } = await params;
  const entry = getCountry(country);
  if (!entry) notFound();
  return <CountryPage locale="ru" entry={entry} />;
}
