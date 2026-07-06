import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { languageAlternates } from "../../lib/i18n";
import { APP_NAME, COMPANY, SITE_URL } from "../../lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
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
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "SMS Activate by SIMNETIQ",
      },
    ],
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  twitter: {
    card: "summary_large_image",
    title: "SMS Activate от SIMNETIQ",
    description:
      "Номер для регистрации, а не на всю жизнь. Коды подтверждения за секунды.",
    images: ["/social-card.png"],
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SMS Activate by SIMNETIQ",
    url: `${SITE_URL}/ru`,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteNav locale="ru" />
        <main className="flex-1">{children}</main>
        <SiteFooter locale="ru" />
        <Analytics />
      </body>
    </html>
  );
}
