import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryPage } from "../../../../../components/pages/CountryPage";
import { countryLocales, getCountries, getCountry } from "../../../../../lib/content/countries";
import { asLocale } from "../../../../../lib/routing";
import { makeMetadata } from "../../../../../lib/seo";

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getCountries(asLocale(params.locale)).map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/virtual-numbers/country/[country]">): Promise<Metadata> {
  const { locale: raw, country } = await params;
  const locale = asLocale(raw);
  const entry = getCountry(locale, country);
  if (!entry) return {};
  return makeMetadata({
    locale,
    path: `/virtual-numbers/country/${entry.slug}`,
    title: entry.copy.metaTitle,
    description: entry.copy.metaDescription,
    available: countryLocales(entry.slug),
  });
}

export default async function CountryRoute({
  params,
}: PageProps<"/[locale]/virtual-numbers/country/[country]">) {
  const { locale: raw, country } = await params;
  const locale = asLocale(raw);
  const entry = getCountry(locale, country);
  if (!entry) notFound();
  return <CountryPage locale={locale} entry={entry} />;
}
