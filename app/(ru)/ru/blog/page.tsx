import type { Metadata } from "next";
import { BlogIndexPage } from "../../../../components/pages/BlogIndexPage";
import { BLOG_UI } from "../../../../lib/content/blogUi";
import { makeMetadata } from "../../../../lib/seo";

export const metadata: Metadata = makeMetadata({
  locale: "ru",
  path: "/blog",
  title: BLOG_UI.ru.metaTitle,
  description: BLOG_UI.ru.metaDescription,
});

export default function BlogPage() {
  return <BlogIndexPage locale="ru" />;
}
