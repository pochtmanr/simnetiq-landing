import type { Metadata } from "next";
import { AlternativesIndexPage } from "../../../components/pages/AlternativesIndexPage";
import { ALTERNATIVES_HUB_UI } from "../../../lib/content/alternativesUi";
import { makeMetadata } from "../../../lib/seo";

export const metadata: Metadata = makeMetadata({
  locale: "en",
  path: "/alternatives",
  title: ALTERNATIVES_HUB_UI.en.metaTitle,
  description: ALTERNATIVES_HUB_UI.en.metaDescription,
});

export default function AlternativesPage() {
  return <AlternativesIndexPage locale="en" />;
}
