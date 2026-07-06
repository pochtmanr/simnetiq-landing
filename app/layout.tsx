import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://simnetiq.xyz"),
  title: "SMS Activate by SimNetIQ — receive SMS codes on a private number",
  description:
    "Get a real virtual number in 50+ countries and receive SMS verification codes in seconds. Sign up for Telegram, WhatsApp, Google and 35+ services without giving out your personal number.",
  openGraph: {
    title: "SMS Activate by SimNetIQ",
    description:
      "A phone number for the sign-up, not for life. Real virtual numbers in 50+ countries, verification codes in seconds.",
    url: "https://simnetiq.xyz",
    siteName: "SMS Activate by SimNetIQ",
    images: [{ url: "/icon.png", width: 1024, height: 1024 }],
    type: "website",
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
