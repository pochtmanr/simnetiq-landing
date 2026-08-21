import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { JsonLd } from "../../components/JsonLd";
import { languageAlternates } from "../../lib/i18n";
import { organization, softwareApplication, webSite } from "../../lib/seo";
import { APP_NAME, SITE_URL } from "../../lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Display serif for h1/h2 — weight 300 only, never bold. Cyrillic is
   loaded too so the RU pages get the same headline voice. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EFF1F5",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  title: {
    default: "SMS Code by SIMNETIQ — receive SMS codes on a private number",
    template: "%s — SMS Code by SIMNETIQ",
  },
  description:
    "Get a real virtual number in 150+ countries and receive SMS verification codes in seconds. Sign up for Telegram, WhatsApp, Google and 100+ services without giving out your personal number.",
  alternates: {
    canonical: "/",
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: "SMS Code by SIMNETIQ",
    description:
      "A phone number for the sign-up, not for life. Real virtual numbers in 150+ countries, verification codes in seconds.",
    url: "https://simnetiq.xyz",
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
    locale: "en_US",
    alternateLocale: "ru_RU",
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  twitter: {
    card: "summary_large_image",
    title: "SMS Code by SIMNETIQ",
    description:
      "A phone number for the sign-up, not for life. Verification codes in seconds.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={[organization(), webSite("en"), softwareApplication("en")]}
        />
        <SiteNav locale="en" />
        <main className="flex-1">{children}</main>
        <SiteFooter locale="en" />
        <Analytics />
      </body>
    </html>
  );
}
