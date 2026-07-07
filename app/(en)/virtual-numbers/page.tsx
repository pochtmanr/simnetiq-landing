import type { Metadata } from "next";
import { VirtualNumbersHubPage } from "../../../components/pages/VirtualNumbersHubPage";
import { SERVICES_UI } from "../../../lib/content/servicesUi";
import { makeMetadata } from "../../../lib/seo";

export const metadata: Metadata = makeMetadata({
  locale: "en",
  path: "/virtual-numbers",
  title: SERVICES_UI.en.hub.metaTitle,
  description: SERVICES_UI.en.hub.metaDescription,
});

export default function VirtualNumbersPage() {
  return <VirtualNumbersHubPage locale="en" />;
}
