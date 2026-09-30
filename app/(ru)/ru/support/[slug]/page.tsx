import { notFound } from "next/navigation";
import { HELP_ARTICLES } from "../../../../../lib/content/help";
import { HelpArticlePage } from "../../../../../components/pages/HelpArticlePage";
import { makeMetadata } from "../../../../../lib/seo";

export function generateStaticParams() { return HELP_ARTICLES.map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = HELP_ARTICLES.find(a => a.slug === slug);
  if (!article) notFound();
  return makeMetadata({ locale: "ru", path: `/support/${slug}`, title: article.ru.title, description: article.ru.sections[0].paragraphs[0] });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = HELP_ARTICLES.find(a => a.slug === slug);
  if (!article) notFound();
  return <HelpArticlePage article={article} locale="ru" />;
}
