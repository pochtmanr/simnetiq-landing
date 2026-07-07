import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "../../../../../components/pages/BlogPostPage";
import { BLOG_SLUGS, getPost } from "../../../../../lib/content/blog";
import { makeMetadata } from "../../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ru/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return makeMetadata({
    locale: "ru",
    path: `/blog/${post.slug}`,
    title: post.ru.title,
    description: post.ru.description,
    ogType: "article",
  });
}

export default async function BlogPostRoute({
  params,
}: PageProps<"/ru/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPostPage locale="ru" post={post} />;
}
