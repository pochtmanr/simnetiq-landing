import type { Metadata } from "next";
import { SupportPageContent } from "../../../components/pages/SupportPageContent";
import { languageAlternates } from "../../../lib/i18n";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with SMS Code — activations, billing, coins and account questions. Read troubleshooting guides or contact our support team by email.",
  alternates: {
    canonical: "/support",
    languages: languageAlternates("/support"),
  },
};

export default function SupportPage() {
  return <SupportPageContent locale="en" />;
}
