import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "../../../../../components/pages/ServicePage";
import { getService, SERVICE_SLUGS } from "../../../../../lib/content/services";
import { makeMetadata } from "../../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ru/virtual-numbers/[service]">): Promise<Metadata> {
  const { service } = await params;
  const entry = getService(service);
  if (!entry) return {};
  return makeMetadata({
    locale: "ru",
    path: `/virtual-numbers/${entry.slug}`,
    title: entry.ru.metaTitle,
    description: entry.ru.metaDescription,
  });
}

export default async function ServiceRoute({
  params,
}: PageProps<"/ru/virtual-numbers/[service]">) {
  const { service } = await params;
  const entry = getService(service);
  if (!entry) notFound();
  return <ServicePage locale="ru" entry={entry} />;
}
