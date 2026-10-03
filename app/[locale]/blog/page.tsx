import type { Metadata } from "next";
import { BlogIndexPage } from "../../../components/pages/BlogIndexPage";
import { blogUi } from "../../../lib/content/ui";
import { asLocale } from "../../../lib/routing";
import { makeMetadata } from "../../../lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = blogUi(locale);
  return makeMetadata({
    locale,
    path: "/blog",
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  return <BlogIndexPage locale={asLocale((await params).locale)} />;
}
