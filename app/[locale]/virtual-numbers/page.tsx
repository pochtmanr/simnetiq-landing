import type { Metadata } from "next";
import { VirtualNumbersHubPage } from "../../../components/pages/VirtualNumbersHubPage";
import { servicesUi } from "../../../lib/content/ui";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/virtual-numbers">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = servicesUi(locale).hub;
  return makeMetadata({
    locale,
    path: "/virtual-numbers",
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function VirtualNumbersPage({
  params,
}: PageProps<"/[locale]/virtual-numbers">) {
  return <VirtualNumbersHubPage locale={asLocale((await params).locale)} />;
}
