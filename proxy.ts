import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./lib/locales";

/* Locale routing. Every page lives under app/[locale]; the default locale is
 * served without a prefix:
 *
 *   /support      -> rewritten (invisibly) to /en/support
 *   /ru/support   -> served as-is
 *   /en/support   -> 308 to /support, so the default locale has exactly one URL
 *
 * Never negotiates on Accept-Language: crawlers send none, and every locale
 * must stay reachable at its own URL for hreflang to mean anything. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if ((LOCALES as string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  /* Everything except API routes, the operator panel, the OG image, Next
     internals and any path with a file extension (public/, sitemap.xml,
     robots.txt, icons). */
  matcher: ["/((?!api|admin|og|_next|_vercel|.*\\..*).*)"],
};
