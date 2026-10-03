# simnetiq.xyz — SMS Code Website & Admin

The public website for the **SMS Code** iOS app (SIMNETIQ LTD), plus the internal operator console. A single Next.js app serves three things:

1. **Marketing and SEO site** in English and Russian: service and country landing pages, competitor alternatives, and a blog.
2. **Legal and support pages** that the app and the App Store link to: Terms, Privacy and Support.
3. **Admin panel** at `/admin`, used to run the product (users, purchases, delivery, support, system health).

| | |
|---|---|
| Production | https://simnetiq.xyz (Vercel) |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4; tokens in `app/globals.css`, documented in [`docs/DESIGN.md`](docs/DESIGN.md) |
| Data | Supabase (shared with the app, project `zkuwqvtwlomktysuymyw`), accessed with the anon key only |
| Analytics | `@vercel/analytics` |
| Related | App + backend: [`../sms-expo`](../sms-expo) · Workspace docs: [`../docs`](../docs) |

---

## Features

- **Two languages:** English at `/…` and Russian at `/ru/…`, each with its own root layout, `hreflang` alternates and a language switcher.
- **Programmatic SEO pages, each written by hand:**
  - `/virtual-numbers`: hub page
  - `/virtual-numbers/[service]`: 34 services (Telegram, WhatsApp, Google, …)
  - `/virtual-numbers/country/[country]`: 21 countries
  - `/alternatives` and `/alternatives/[slug]`: 5 competitor comparisons
  - `/blog` and `/blog/[slug]`: 7 articles
- **Legal pages:** `/terms-of-service` and `/privacy-policy`. The App Store listing and the app link to them.
- **Support page:** `/support` with a form that stores tickets in Supabase and emails the team through n8n. Cloudflare Turnstile is optional.
- **SEO infrastructure:**
  - `sitemap.ts` and `robots.ts` (which blocks `/api/`)
  - a dynamic Open Graph image at `/og`
  - JSON-LD (Organization, WebSite, MobileApplication, FAQPage, BreadcrumbList, Article)
  - `/llms.txt`, generated from the content registries
- **Admin panel:** password + TOTP login. All data comes from `admin_*` Postgres RPCs; see [`docs/ADMIN.md`](docs/ADMIN.md).

## Project structure

```
app/
  [locale]/             public site: root layout + pages for every locale (thin wrappers)
  (admin)/admin/        admin panel (own layout, noindex)
  api/support/          POST: support form → Supabase RPC → n8n
  api/admin/support/reply/   POST: admin reply → RPC → n8n → RPC
  og/                   Open Graph image route (locale-neutral brand card)
  llms.txt/             generated llms.txt
  sitemap.ts, robots.ts, global-not-found.tsx, globals.css
proxy.ts                locale routing: unprefixed URLs serve the default locale
components/
  pages/                page bodies shared by every locale (HomePage, ServicePage, CountryPage, …)
  blog/                 blog post renderer
  SiteNav, SiteFooter, SupportForm, StoreBadges, JsonLd, Breadcrumbs, …
content/locales/<code>/ ALL site copy, one JSON file per page per language (see "Content model")
lib/
  locales.ts            the locale registry: the one list every route, sitemap and hreflang derives from
  content/              locale-neutral data (meta.ts per collection), types and loaders
  admin/                admin Supabase client, session guard, typed RPC wrappers, formatters
  i18n.ts               localised paths, hreflang alternates, date formatting
  fonts.ts              web fonts, including per-script faces (CJK, Devanagari, Arabic)
  seo.ts                metadata and JSON-LD builders
  site.ts               site constants: URLs, company details, App Store link, support email
public/                 app screenshots, brand logo, service logos
scripts/                i18n:sync and i18n:check
supabase/migrations/    support-form migrations (see "Database")
n8n/                    importable n8n workflows for support email + setup guide
docs/                   DESIGN.md (design system), ADMIN.md (admin panel), i18n/ (translator brief + glossary)
```

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
cp .env.example .env.local     # then fill in values
npm install
npm run dev                    # http://localhost:3000
```

Other commands:

```bash
npm run build       # production build (runs i18n:sync + i18n:check first, then prerenders every page)
npm run start       # serve the build
npm run lint        # ESLint (next config)
npm run i18n:sync   # regenerate content/locales/index.generated.ts after adding/removing a JSON file
npm run i18n:check  # validate every locale against en (structure, placeholders, script, SEO budgets)
```

## Environment variables

All variables are listed in [`.env.example`](.env.example). Set them in `.env.local` for local work and in Vercel → Project → Settings → Environment Variables for deployments.

| Variable | Required | Exposure | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | public | Anon key. RLS and RPC grants limit what it can do. |
| `N8N_SUPPORT_WEBHOOK_URL` | for support email | server | n8n webhook that emails the team a new ticket |
| `N8N_SUPPORT_REPLY_WEBHOOK_URL` | optional | server | n8n webhook that emails an admin reply to the customer. If unset, replies are saved but marked "not emailed". |
| `N8N_WEBHOOK_SECRET` | with n8n | server | Shared secret sent to both n8n webhooks |
| `SUPPORT_IP_HASH_SALT` | optional | server | Salt for the one-way hash of the submitter's IP (flood control). If unset, no IP-derived value is stored. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional | public | Cloudflare Turnstile site key. Set it together with the secret, or leave both unset. |
| `TURNSTILE_SECRET_KEY` | optional | server | Cloudflare Turnstile secret |

> **No service-role key, ever.** This site writes only through `security definer` RPCs that the anon key may call. If `SUPABASE_SERVICE_ROLE_KEY` shows up in Vercel or in `.env.local`, delete it. On a public website it would give read/write access to every production table.

## Content model

Copy and data are split so a translator never touches code:

- **`lib/content/<collection>/meta.ts`** holds locale-neutral data (slug, brand name, logo, category, dates, related slugs, dialing codes). It is the **publish switch**: an entry that isn't listed there appears in no route, sitemap, hub page or footer.
- **`content/locales/<code>/…json`** holds the copy, one file per page per language: `ui`, `home`, `support`, `privacy`, `terms`, `services-ui`, `alternatives-ui`, `blog-ui`, plus `services/`, `countries/`, `blog/`, `alternatives/` and `help/` `<slug>.json`. `en` is the source of truth; TypeScript types are inferred from the en files.
- A page is published in a language **only if that language's file exists**. Availability drives routes, the sitemap, hreflang and internal links, so a partial translation never produces a half-English page.

| Content | Add a new one |
|---|---|
| Service / country / alternative / blog post / help article | Add the entry to the collection's `meta.ts`, write `content/locales/en/<collection>/<slug>.json` (copy a sibling for the shape), add a logo at `public/services/<slug>.svg` for services, then `npm run i18n:sync`. Keep `BLOG_META` sorted newest first. |
| UI strings | Edit `content/locales/en/<file>.json`, then mirror the key in every other locale |

**Editorial policy:** pages are not doorway pages — every page carries copy genuinely specific to it. Don't put invented pricing, "unlimited" claims or subscription language on the site. The coin packs shown must match the app's five product IDs. Translations are written by AI agents following [`docs/i18n/TRANSLATOR_BRIEF.md`](docs/i18n/TRANSLATOR_BRIEF.md) and must pass `npm run i18n:check`.

## Routing & i18n

- `lib/locales.ts` is the locale registry. Every page lives under `app/[locale]`, which sets `<html lang dir>` and the script's web font per locale; `dynamicParams = false` everywhere, so only registered locales and published slugs exist.
- `proxy.ts` serves the default locale (en) without a prefix by rewriting `/x` to `/en/x`, and 308-redirects `/en/x` back to `/x`. It never redirects on Accept-Language.
- `next.config.ts` enables `experimental.globalNotFound`, because `app/[locale]` and `app/(admin)` are both root layouts.
- Adding a language: follow [`docs/i18n/TRANSLATOR_BRIEF.md`](docs/i18n/TRANSLATOR_BRIEF.md) — translate into `content/locales/<code>/`, pass `i18n:check` and the build, then add the registry entry.

## Support pipeline

```
/support form ─POST─▶ /api/support
   ├─ validate + (optional) Turnstile verify
   ├─ hash IP with SUPPORT_IP_HASH_SALT
   ├─ rpc submit_support_request()  →  public.support_requests   (anon-callable, rate-limited in SQL)
   └─ n8n webhook (N8N_SUPPORT_WEBHOOK_URL + secret) → email to the team
```

Admins reply from `/admin/support`. See [`docs/ADMIN.md`](docs/ADMIN.md#support-replies). Setup and import steps for the n8n workflows are in [`n8n/README.md`](n8n/README.md).

## Admin panel

The panel is served at `/admin`, which shows a sign-in screen. Its security properties:

- one allow-listed admin email, password + mandatory TOTP
- all authority in Postgres (`is_admin()` on every `admin_*` RPC)
- audit logging of every sensitive read and every mutation
- no secrets in the web app

Full details, screens and the RPC catalogue are in [`docs/ADMIN.md`](docs/ADMIN.md).

## Database

The website uses the app's Supabase project. Schema changes are made in the app repo, `sms-expo/supabase/migrations/`, including every `admin_*` RPC and `support_replies`. This repo holds only the two original support-form migrations:

- `supabase/migrations/20260706000000_create_support_requests.sql`: the `support_requests` table and RLS
- `supabase/migrations/20260822000000_submit_support_request.sql`: the anon-callable `submit_support_request()` RPC

Both are already applied in production. Apply any new SQL through the Supabase SQL Editor.

## Deployment

Vercel project `romans-projects-44e28a53/simnetiq-landing` builds `main` from **the `rpochtman-lang` remote** (`rpochtman-lang/simnetiq-landing`).

```bash
gh auth switch --user rpochtman-lang
git push rpochtman-lang main
```

`origin` (`pochtmanr/simnetiq-landing`) is a mirror. **Pushing to it doesn't deploy**, even though `git push` reports success. Always confirm the new deployment in Vercel.

Before deploying, make sure the Vercel environment variables match `.env.example`.

## Quality

- `npm run lint` and `npm run build` must pass. The build prerenders every static page and fails on type errors.
- There are no automated tests yet. Check changes with the production build, then check the pages listed below in a browser:
  - `/`
  - `/ru`
  - one service page and one country page
  - `/support` (submit a test ticket)
  - `/admin`

## Known gaps

- `COMPANY_NUMBER` and `COMPANY_REGISTERED_OFFICE` in `lib/site.ts` are still placeholders. The footer hides the UK company disclosure until real values are filled in.
- Several Terms of Service sections carry a `NOT REVIEWED BY A LAWYER` marker in the source. They need legal review in both languages.
- `n8n/README.md` asks for the live support workflow to be re-imported so that the removed auto-reply step is gone in production too.
