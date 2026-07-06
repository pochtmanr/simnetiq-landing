import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { languageAlternates } from "../../lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simnetiq.xyz"),
  title: {
    default: "SMS Activate by SIMNETIQ — receive SMS codes on a private number",
    template: "%s — SMS Activate by SIMNETIQ",
  },
  description:
    "Get a real virtual number in 50+ countries and receive SMS verification codes in seconds. Sign up for Telegram, WhatsApp, Google and 35+ services without giving out your personal number.",
  alternates: {
    canonical: "/",
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: "SMS Activate by SIMNETIQ",
    description:
      "A phone number for the sign-up, not for life. Real virtual numbers in 50+ countries, verification codes in seconds.",
    url: "https://simnetiq.xyz",
    siteName: "SMS Activate by SIMNETIQ",
    images: [{ url: "/icon.png", width: 1024, height: 1024 }],
    type: "website",
    locale: "en_US",
    alternateLocale: "ru_RU",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteNav locale="en" />
        <main className="flex-1">{children}</main>
        <SiteFooter locale="en" />
      </body>
    </html>
  );
}
