import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route concealment for /admin.
 *
 * ADMIN_ENTRY_SECRET is a curtain, not a lock. It decides whether /admin is
 * VISIBLE. It never decides whether anyone gets in: that is password + TOTP +
 * is_admin() in Postgres, enforced by the security-definer RPCs the browser
 * calls with the anon key. Nothing in this file authenticates anybody, and no
 * decision made here can hand out a single row of data. Treat a leaked secret
 * as "someone can see a sign-in form", not as a breach.
 *
 * Deliberately no Supabase SDK import. This runs ahead of every /admin request
 * and the SDK would be dragged into that bundle for nothing — cookie names and
 * one query parameter are all the information needed here.
 */

/** Query parameter carrying the knock, e.g. /admin?k=<secret>. */
const KNOCK_PARAM = "k";

const ENTRY_COOKIE = "admin_entry";
/** Scoped to /admin so the cookie is never attached to a marketing request. */
const ENTRY_COOKIE_PATH = "/admin";
const ENTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

/**
 * Rewrite target for the 404: a path that matches no route, so Next renders
 * app/global-not-found.tsx with exactly the status, headers and body any
 * mistyped URL gets. Rewriting rather than hand-building a body is the only
 * way the two stay identical as that page changes.
 *
 * Not Next's own /_not-found route, which is prerendered and answers with
 * Cache-Control: s-maxage=31536000. That both differs visibly from a real 404
 * and would invite a CDN to pin the 404 to /admin for a year, locking out the
 * operator the knock is supposed to let in.
 *
 * The name is deliberately dull: a rewrite always emits an
 * x-middleware-rewrite response header, and that header should read as
 * "nothing here", not as "something is hidden here".
 */
const NOT_FOUND_PATH = "/_404";

const encoder = new TextEncoder();

/**
 * Constant-time equality. Comparing SHA-256 digests rather than the strings
 * means the loop count leaks nothing about the secret's length either, and it
 * needs only Web Crypto, which both the Node and Edge runtimes provide.
 */
async function equalsSecret(candidate: string, secret: string): Promise<boolean> {
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(secret)),
  ]);
  const av = new Uint8Array(a);
  const bv = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < av.length; i += 1) {
    diff |= av[i] ^ bv[i];
  }
  return diff === 0;
}

/**
 * @supabase/ssr stores the session in cookies named
 * sb-<project-ref>-auth-token, sometimes suffixed .0/.1 when chunked. Their
 * presence only means "this browser has signed in at some point" — it is not
 * checked for validity, and does not need to be: it is a visibility hint that
 * keeps a signed-in operator working after the knock cookie is cleared.
 */
function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
}

function notFound(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = NOT_FOUND_PATH;
  url.search = "";
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.ADMIN_ENTRY_SECRET;

  // Fail closed. An unset secret means "nobody can see this", never "everybody
  // can" — a missing environment variable must not open the route.
  if (!secret) {
    return notFound(request);
  }

  const knock = request.nextUrl.searchParams.get(KNOCK_PARAM);
  if (knock !== null && (await equalsSecret(knock, secret))) {
    // Redirect to the bare path so the secret does not survive in the address
    // bar, in history, or in the Referer header of anything the page loads.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete(KNOCK_PARAM);
    const response = NextResponse.redirect(clean);
    response.cookies.set(ENTRY_COOKIE, secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: ENTRY_COOKIE_PATH,
      maxAge: ENTRY_COOKIE_MAX_AGE,
    });
    return response;
  }

  const entry = request.cookies.get(ENTRY_COOKIE)?.value;
  if (entry !== undefined && (await equalsSecret(entry, secret))) {
    return NextResponse.next();
  }

  if (hasSupabaseSessionCookie(request)) {
    return NextResponse.next();
  }

  return notFound(request);
}

export const config = {
  matcher: "/admin/:path*",
};
