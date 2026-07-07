import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "../../../../components/pages/BlogPostPage";
import { BLOG_SLUGS, getPost } from "../../../../lib/content/blog";
import { makeMetadata } from "../../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return makeMetadata({
    locale: "en",
    path: `/blog/${post.slug}`,
    title: post.en.title,
    description: post.en.description,
    ogType: "article",
  });
}

export default async function BlogPostRoute({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <BlogPostPage locale="en" post={post} />;
}
