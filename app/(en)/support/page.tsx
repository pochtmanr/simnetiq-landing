import type { Metadata } from "next";
import { SupportPageContent } from "../../../components/pages/SupportPageContent";
import { languageAlternates } from "../../../lib/i18n";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with SMS Activate — activations, billing, credits and account questions. We usually reply within one business day.",
  alternates: {
    canonical: "/support",
    languages: languageAlternates("/support"),
  },
};

export default function SupportPage() {
  return <SupportPageContent locale="en" />;
}
