import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

/* ---------------------------------------------------------------------------
 * Root layout for the operator panel.
 *
 * This is a *root* layout, not a nested one: the app has no app/layout.tsx —
 * (en) and (ru) each own their own <html> — so this route group owns its own
 * document too. Nothing from the marketing layouts reaches here, and that is
 * the point rather than an oversight. Deliberately absent:
 *
 *   SiteNav / SiteFooter   marketing chrome, and every link in them is a
 *                          locale-aware public page
 *   the locale switcher    the panel is English-only; there is one operator
 *   JsonLd / OpenGraph /   structured data and social cards exist to get a
 *   twitter / alternates   page indexed and shared, which is the opposite of
 *                          what this route wants
 *   <Analytics/>           an operator's clicks are not product telemetry, and
 *                          admin URLs must not land in an analytics dashboard
 *   Cormorant              the panel is a tool; Inter alone is enough.
 *
 * There is no chrome here either — no header, no nav. The panel's header lives
 * inside AuthGate's `ready` branch, where only a verified operator sees it.
 * ------------------------------------------------------------------------ */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EFF1F5",
  colorScheme: "light",
};

export const metadata: Metadata = {
  /* Neutral on purpose: tab titles end up in history sync and screenshots. */
  title: "SMS Code by SIMNETIQ",
  /* The route is reachable by anyone (it shows a sign-in form), so this is
     what keeps it out of search results. It is also absent from the
     sitemap. */
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
