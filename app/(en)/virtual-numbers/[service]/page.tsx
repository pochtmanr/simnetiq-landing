import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "../../../../components/pages/ServicePage";
import { getService, SERVICE_SLUGS } from "../../../../lib/content/services";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: PageProps<"/virtual-numbers/[service]">): Promise<Metadata> {
  const { service } = await params;
  const entry = getService(service);
  if (!entry) return {};
  return makeMetadata({
    locale: "en",
    path: `/virtual-numbers/${entry.slug}`,
    title: entry.en.metaTitle,
    description: entry.en.metaDescription,
  });
}

export default async function ServiceRoute({
  params,
}: PageProps<"/virtual-numbers/[service]">) {
  const { service } = await params;
  const entry = getService(service);
  if (!entry) notFound();
  return <ServicePage locale="en" entry={entry} />;
}
