import type { Metadata } from "next";
import { JsonLd } from "../../components/JsonLd";
import { HomePage } from "../../components/pages/HomePage";
import { homeUi } from "../../lib/content/ui";
import { asLocale } from "../../lib/routing";
import { faqPage, makeMetadata } from "../../lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = homeUi(locale).meta;
  return makeMetadata({
    locale,
    path: "/",
    title: t.title,
    absoluteTitle: true,
    description: t.description,
    ogTitle: t.ogTitle,
    ogDescription: t.ogDescription,
    twitterDescription: t.twitterDescription,
  });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = asLocale((await params).locale);
  return (
    <>
      <JsonLd data={faqPage(locale, homeUi(locale).faq.items)} />
      <HomePage locale={locale} />
    </>
  );
}
