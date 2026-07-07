import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlternativePage } from "../../../../components/pages/AlternativePage";
import {
  ALTERNATIVE_SLUGS,
  getAlternative,
} from "../../../../lib/content/alternatives";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALTERNATIVE_SLUGS.map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: PageProps<"/alternatives/[competitor]">): Promise<Metadata> {
  const { competitor } = await params;
  const entry = getAlternative(competitor);
  if (!entry) return {};
  return makeMetadata({
    locale: "en",
    path: `/alternatives/${entry.slug}`,
    title: entry.en.metaTitle,
    description: entry.en.metaDescription,
  });
}

export default async function AlternativeRoute({
  params,
}: PageProps<"/alternatives/[competitor]">) {
  const { competitor } = await params;
  const entry = getAlternative(competitor);
  if (!entry) notFound();
  return <AlternativePage locale="en" entry={entry} />;
}
