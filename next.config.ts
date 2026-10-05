import type { NextConfig } from "next";

/* Headers for the operator panel and its API routes.
 *
 *   X-Robots-Tag     noindex even for responses that carry no <meta> (JSON,
 *                    redirects), and for crawlers that ignore robots.txt
 *   frame-ancestors  the panel must never render inside someone else's page:
 *   / X-Frame-Options a framed sign-in or a framed "Delete account" button is
 *                    a clickjacking kit. Both headers, for old browsers.
 *                    One exception for the pages (not the API): Telegram Web
 *                    runs Mini Apps in an iframe on web.telegram.org, so the
 *                    panel pages allow exactly that ancestor. X-Frame-Options
 *                    cannot express an allowlist, so the pages carry only the
 *                    CSP (which modern browsers apply in its place); the
 *                    Telegram phone and desktop apps use a webview, no frame.
 *   Referrer-Policy  admin URLs carry user and activation ids; links out of
 *                    the panel (dashboards, GitHub) must not leak them
 *   Cache-Control    nothing under /admin may sit in a shared or browser
 *                    cache — the HTML is a static shell, but the API routes
 *                    answer with data
 */
const COMMON_HEADERS = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "no-store" },
];

/* The panel pages: framable by Telegram Web only (the Mini App). */
const ADMIN_PAGE_HEADERS = [
  ...COMMON_HEADERS,
  { key: "Content-Security-Policy", value: "frame-ancestors https://web.telegram.org" },
];

/* The admin API: never framed. */
const ADMIN_API_HEADERS = [
  ...COMMON_HEADERS,
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  experimental: {
    // Required for app/global-not-found.tsx — with two root layouts
    // (app/[locale] and the (admin) group) there is no single layout to
    // compose a global 404 from.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/admin", headers: ADMIN_PAGE_HEADERS },
      { source: "/admin/:path*", headers: ADMIN_PAGE_HEADERS },
      { source: "/api/admin/:path*", headers: ADMIN_API_HEADERS },
    ];
  },
};

export default nextConfig;
