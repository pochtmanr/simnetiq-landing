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
 *   Cormorant              matching app/global-not-found.tsx, which also loads
 *                          Inter alone. AuthGate renders that 404 body when it
 *                          has nothing to show, and a font this layout loaded
 *                          but the real 404 did not would make the two render
 *                          differently.
 *
 * There is no chrome here either — no header, no nav, no "Admin" wordmark.
 * Anything painted at this level would frame the 404 body that AuthGate shows
 * to a visitor who has not signed in, and a 404 wrapped in an admin header is
 * not a 404. The panel's header lives inside AuthGate's `ready` branch, where
 * only a verified operator ever sees it.
 *
 * Inter carries `cyrillic` because the shared 404 copy is half Russian.
 * ------------------------------------------------------------------------ */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EFF1F5",
  colorScheme: "light",
};

export const metadata: Metadata = {
  /* Neutral on purpose. Naming the tool in the tab title would announce the
     route to anyone glancing at a screen, and to any history sync. */
  title: "SMS Code by SIMNETIQ",
  /* Belt and braces. middleware.ts already answers 404 to anyone without the
     entry cookie or a session, so a crawler should never reach this markup —
     but if one ever does, it must not index or follow. Task 10 keeps the route
     out of the sitemap; robots.txt deliberately stays silent, because a
     Disallow rule would publish the very path it is trying to hide. */
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
