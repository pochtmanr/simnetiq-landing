import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "../../../../components/pages/ServicePage";
import { getService, getServices, serviceLocales } from "../../../../lib/content/services";
import { asLocale } from "../../../../lib/routing";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getServices(asLocale(params.locale)).map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/virtual-numbers/[service]">): Promise<Metadata> {
  const { locale: raw, service } = await params;
  const locale = asLocale(raw);
  const entry = getService(locale, service);
  if (!entry) return {};
  return makeMetadata({
    locale,
    path: `/virtual-numbers/${entry.slug}`,
    title: entry.copy.metaTitle,
    description: entry.copy.metaDescription,
    available: serviceLocales(entry.slug),
  });
}

export default async function ServiceRoute({
  params,
}: PageProps<"/[locale]/virtual-numbers/[service]">) {
  const { locale: raw, service } = await params;
  const locale = asLocale(raw);
  const entry = getService(locale, service);
  if (!entry) notFound();
  return <ServicePage locale={locale} entry={entry} />;
}
