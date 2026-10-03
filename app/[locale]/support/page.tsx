import type { Metadata } from "next";
import { SupportPageContent } from "../../../components/pages/SupportPageContent";
import { supportUi } from "../../../lib/content/ui";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/support">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = supportUi(locale).meta;
  return makeMetadata({ locale, path: "/support", title: t.title, description: t.description });
}

export default async function SupportPage({ params }: PageProps<"/[locale]/support">) {
  return <SupportPageContent locale={asLocale((await params).locale)} />;
}
