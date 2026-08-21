import type { Metadata } from "next";
import { SupportPageContent } from "../../../../components/pages/SupportPageContent";
import { languageAlternates } from "../../../../lib/i18n";

export const metadata: Metadata = {
  title: "Поддержка",
  description:
    "Помощь с SMS Code — активации, оплата, монеты и вопросы по аккаунту. Обычно отвечаем в течение одного рабочего дня.",
  alternates: {
    canonical: "/ru/support",
    languages: languageAlternates("/support"),
  },
};

export default function SupportPage() {
  return <SupportPageContent locale="ru" />;
}
