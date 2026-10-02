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
    default: "SMS Code by SIMNETIQ â receive SMS codes on a private number",
    template: "%s â SMS Code by SIMNETIQ",
  },
  description:
    "Get a real virtual number in 100+ countries and receive SMS verification codes in seconds. Sign up for Telegram, WhatsApp, Google and 100+ services without giving out your personal number.",
  alternates: {
    canonical: "/",
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: "SMS Code by SIMNETIQ",
    description:
      "A phone number for the sign-up, not for life. Real virtual numbers in 100+ countries, verification codes in seconds.",
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
    <html lang="en" className={`${golos.variable} ${unbounded.variable} h-full`}>
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
