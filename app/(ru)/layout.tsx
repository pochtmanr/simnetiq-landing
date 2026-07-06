import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { languageAlternates } from "../../lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simnetiq.xyz"),
  title: {
    default: "SMS Activate от SIMNETIQ — приём SMS-кодов на приватный номер",
    template: "%s — SMS Activate от SIMNETIQ",
  },
  description:
    "Получите настоящий виртуальный номер в 50+ странах и принимайте SMS-коды подтверждения за секунды. Регистрируйтесь в Telegram, WhatsApp, Google и 35+ сервисах, не раскрывая личный номер.",
  alternates: {
    canonical: "/ru",
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: "SMS Activate от SIMNETIQ",
    description:
      "Номер для регистрации, а не на всю жизнь. Настоящие виртуальные номера в 50+ странах, коды за секунды.",
    url: "https://simnetiq.xyz/ru",
    siteName: "SMS Activate by SIMNETIQ",
    images: [{ url: "/icon.png", width: 1024, height: 1024 }],
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteNav locale="ru" />
        <main className="flex-1">{children}</main>
        <SiteFooter locale="ru" />
      </body>
    </html>
  );
}
