import type { Metadata } from "next";
import { BlogIndexPage } from "../../../components/pages/BlogIndexPage";
import { BLOG_UI } from "../../../lib/content/blogUi";
import { makeMetadata } from "../../../lib/seo";

export const metadata: Metadata = makeMetadata({
  locale: "en",
  path: "/blog",
  title: BLOG_UI.en.metaTitle,
  description: BLOG_UI.en.metaDescription,
});

export default function BlogPage() {
  return <BlogIndexPage locale="en" />;
}
