import type { NextConfig } from "next";

/* Headers for the operator panel and its API routes.
 *
 *   X-Robots-Tag     noindex even for responses that carry no <meta> (JSON,
 *                    redirects), and for crawlers that ignore robots.txt
 *   frame-ancestors  the panel must never render inside someone else's page:
 *   / X-Frame-Options a framed sign-in or a framed "Delete account" button is
 *                    a clickjacking kit. Both headers, for old browsers.
 *   Referrer-Policy  admin URLs carry user and activation ids; links out of
 *                    the panel (dashboards, GitHub) must not leak them
 *   Cache-Control    nothing under /admin may sit in a shared or browser
 *                    cache — the HTML is a static shell, but the API routes
 *                    answer with data
 */
const ADMIN_HEADERS = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "no-store" },
];

const nextConfig: NextConfig = {
  experimental: {
    // Required for app/global-not-found.tsx — with two root layouts (en/ru
    // route groups) there is no single layout to compose a global 404 from.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/admin", headers: ADMIN_HEADERS },
      { source: "/admin/:path*", headers: ADMIN_HEADERS },
      { source: "/api/admin/:path*", headers: ADMIN_HEADERS },
    ];
  },
};

export default nextConfig;
