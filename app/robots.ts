import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

/* /admin is disallowed as well as noindex'd (layout metadata, the
   X-Robots-Tag header in next.config.ts). A Disallow alone does not keep a URL
   out of results — a crawler that never fetches the page never sees its
   noindex — so it is belt and braces, not the control. It does keep
   well-behaved crawlers from hammering the sign-in form. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
