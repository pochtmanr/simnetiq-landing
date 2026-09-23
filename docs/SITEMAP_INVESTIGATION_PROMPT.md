# Task: why Google Search Console shows 0 discovered pages from the sitemap

## Context
- Site: the Next.js app in `landing/`, live at `https://simnetiq.xyz`.
- Two locales: English with no prefix (`/`) and Russian under `/ru`.
- The Search Console property is verified and working, since Search appearance data shows. But the
  submitted sitemap reports **0 discovered pages**.
- Find the real root cause with evidence first. Only then fix it.

## Where to look
- `landing/app/sitemap.ts` (~96 lines) and `landing/app/robots.ts`
- `landing/lib/site.ts`, which defines `SITE_URL = "https://simnetiq.xyz"`
- `landing/lib/i18n.ts` and the route groups `app/(en)`, `app/(ru)` and `app/(admin)`
- `landing/next.config.ts`, plus any proxy or middleware that could rewrite or redirect
  `/sitemap.xml` or `/robots.txt`
- `landing/AGENTS.md`: this Next.js version has breaking changes. Read
  `node_modules/next/dist/docs/` for the current sitemap and robots conventions and don't rely on memory.

## Checks, against the live site and not just the code
1. `curl -sIL https://simnetiq.xyz/sitemap.xml` and `curl -s https://simnetiq.xyz/sitemap.xml | head -60`.
   Check:
   - the status code and redirect chain
   - `Content-Type` (it should be `application/xml`)
   - any `x-robots-tag` header
   - that the body is valid XML
2. Test the same URL with `www.`, without it, and with `http://`. Every `<loc>` must use exactly the host
   and protocol of the Search Console property. Find out whether it is a Domain property or a URL-prefix
   property; ask the user if unsure.
3. `curl -s https://simnetiq.xyz/robots.txt`. Does it point to the correct sitemap URL? Does it block
   anything it shouldn't?
4. Compare every `<loc>` in the sitemap with real pages. Look for:
   - the wrong domain (`simnetiq.store`, `localhost`, `*.vercel.app`)
   - URLs that return 404 or redirect
   - `/ru` URLs duplicated or missing
   - malformed `hreflang` alternates
   - an empty list when dynamic data (blog, services, countries) fails to load at build time
5. Confirm production runs the current `sitemap.ts`. Compare the live `/sitemap.xml` with a local
   `npm run build && npm start` then `curl localhost:3000/sitemap.xml`.
   - Deploys come only from the `rpochtman-lang` remote
     (`https://github.com/rpochtman-lang/simnetiq-landing`), branch `main`.
   - As of 2026-09-23, local `main` is one commit (`1c7316a`, README) ahead of `rpochtman-lang/main`
     (`a8a972c`), and the working tree has uncommitted landing and admin changes.
6. `curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" -sI https://simnetiq.xyz/sitemap.xml`.
   Rule out Vercel Deployment Protection or the firewall blocking Googlebot.
7. Search Console can show "0" or "Couldn't fetch" for a day or more after a sitemap is submitted. Ask
   the user for the submission date and the exact status Search Console shows.

## Deliverable
- The root cause with evidence: curl output, plus file and line.
- The minimal fix, verified locally.
- What to do in Search Console afterwards (for example, resubmitting the sitemap) and how long to wait.
- Don't commit or push without asking. When you do:
  - Commit only the sitemap-related files. Unrelated admin work sits in the tree and may not compile.
  - Commit as `rpochtman-lang <269783741+rpochtman-lang@users.noreply.github.com>`.
  - Push to `rpochtman-lang main`, per `landing/CLAUDE.md`.
