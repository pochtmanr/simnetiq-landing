import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticlePage } from "../../../../components/pages/HelpArticlePage";
import { getHelpArticle, getHelpArticles, helpLocales } from "../../../../lib/content/help";
import { asLocale } from "../../../../lib/routing";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getHelpArticles(asLocale(params.locale)).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/support/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const article = getHelpArticle(locale, slug);
  if (!article) return {};
  return makeMetadata({
    locale,
    path: `/support/${article.slug}`,
    title: article.copy.title,
    description: article.copy.metaDescription,
    available: helpLocales(article.slug),
  });
}

export default async function HelpArticleRoute({
  params,
}: PageProps<"/[locale]/support/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const article = getHelpArticle(locale, slug);
  if (!article) notFound();
  return <HelpArticlePage article={article} locale={locale} />;
}
