import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Golos_Text, Unbounded } from "next/font/google";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { JsonLd } from "../../components/JsonLd";
import { languageAlternates } from "../../lib/i18n";
import { organization, softwareApplication, webSite } from "../../lib/seo";
import { APP_NAME, SITE_URL } from "../../lib/site";

/* Text face: Paratype's Golos, built for interface copy in Latin and
   Cyrillic alike, so /ru reads as native rather than as a fallback. */
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/* Display face for h1/h2, stat figures and the wordmark. Wide and round,
   so it sits apart from the compact text face instead of competing with
   it. Variable, used at 500–600 only. */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F3F4F7",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  title: {
    default: "SMS Code от SIMNETIQ — приём SMS-кодов на приватный номер",
    template: "%s — SMS Code от SIMNETIQ",
  },
  description:
    "Получите настоящий виртуальный номер в 100+ странах и принимайте SMS-коды подтверждения за секунды. Регистрируйтесь в Telegram, WhatsApp, Google и 100+ сервисах, не раскрывая личный номер.",
  alternates: {
    canonical: "/ru",
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: "SMS Code от SIMNETIQ",
    description:
      "Номер для регистрации, а не на всю жизнь. Настоящие виртуальные номера в 100+ странах, коды за секунды.",
    url: "https://simnetiq.xyz/ru",
    siteName: "SMS Code by SIMNETIQ",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "SMS Code by SIMNETIQ",
      },
    ],
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  twitter: {
    card: "summary_large_image",
    title: "SMS Code от SIMNETIQ",
    description:
      "Номер для регистрации, а не на всю жизнь. Коды подтверждения за секунды.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golos.variable} ${unbounded.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={[organization(), webSite("ru"), softwareApplication("ru")]}
        />
        <SiteNav locale="ru" />
        <main className="flex-1">{children}</main>
        <SiteFooter locale="ru" />
        <Analytics />
      </body>
    </html>
  );
}
