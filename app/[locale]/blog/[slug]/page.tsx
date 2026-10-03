import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "../../../../components/pages/BlogPostPage";
import { getPost, getPosts, postLocales } from "../../../../lib/content/blog";
import { asLocale } from "../../../../lib/routing";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getPosts(asLocale(params.locale)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const post = getPost(locale, slug);
  if (!post) return {};
  return makeMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: post.copy.title,
    description: post.copy.description,
    available: postLocales(post.slug),
    ogType: "article",
  });
}

export default async function BlogPostRoute({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const post = getPost(locale, slug);
  if (!post) notFound();
  return <BlogPostPage locale={locale} post={post} />;
}
