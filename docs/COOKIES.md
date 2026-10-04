# Cookies, consent, analytics & ads tracking

The site asks before running any analytics or ad measurement. Everything that
reads or writes on the visitor's device beyond the consent cookie itself goes
through one gate.

## Model

| Category | What | Consent |
| --- | --- | --- |
| Strictly necessary | `sc_consent` — first-party, 12 months | none needed |
| Analytics | Vercel Web Analytics (cookieless) + Google Analytics 4 (`_ga`, `_ga_<ID>`, 2 years) | opt-in |
| Marketing | Meta Pixel (`_fbp`, 90 days; `_fbc` when arriving from an ad click) | opt-in, separate switch |

GA4 is analytics only: Consent Mode keeps every `ad_*` signal `denied`, always.
Ad measurement is the Meta Pixel's job and lives in its own category, so a
visitor can allow analytics and refuse ads.

`sc_consent` holds `{"v":2,"analytics":bool,"marketing":bool,"ts":<ms>}`,
`Path=/` so one choice covers every locale. A missing, unparsable, old-version or
>12-month-old value counts as "no choice", and the banner shows again.

## Files

- `lib/consent.ts` — read/write the cookie, the `useSyncExternalStore` store,
  `openCookieSettings()`, `trackEvent()`, and deletion of `_ga*` / `_fbp` /
  `_fbc` on withdrawal.
- `components/CookieConsent.tsx` — banner (bright card, bottom centre) +
  preferences `<dialog>` with the Analytics and Marketing switches, mounted once
  in `app/[locale]/layout.tsx`. Strings: `ui.json` → `cookies`.
- `components/ConsentedAnalytics.tsx` — mounts `<Analytics />` and GA4 with
  analytics consent, the Meta Pixel with marketing consent. Vercel events are
  also filtered in `beforeSend`, and the pixel gets `fbq('consent','revoke')`,
  because a loaded script can't be unloaded when consent is withdrawn mid-page.
- `components/CookieSettingsButton.tsx` — reopens the dialog (footer, Cookie
  Policy page).
- Copy: `content/locales/<code>/cookies.json` (the `/cookie-policy` page) and
  `privacy.json` §3–§6.

## Rules

- **Never call `track()`, `gtag()` or `fbq()` directly.** Use
  `trackEvent(name, props)` from `lib/consent.ts`; it no-ops without consent and
  fans out to every tool the visitor allowed. GA receives the name snake_cased
  (`CTA Click iOS` → `cta_click_ios`); Meta receives it as a custom event with
  spaces removed (`CTAClickiOS`).
- **Any new script that sets cookies or identifies a browser** goes inside
  `ConsentedAnalytics` behind the right flag, never straight into a layout.
- **Adding a category, or changing what a tool is used for:** bump
  `CONSENT_VERSION` (everyone is asked again), add the row to the dialog and
  `ui.json` in all locales, and update `cookies.json` + `privacy.json` in all
  locales, by hand. Bump `UPDATED_AT` on both pages and the sitemap dates.

---

# Setup guide

## 1. Google Analytics 4

The code is done and the measurement ID is set; it goes live with the next deploy.

1. **Create the property.** <https://analytics.google.com> → Admin → Create →
   Property. Name `simnetiq.xyz`, reporting time zone and currency of the
   business. Business details → whatever fits; objective → "Understand web and
   app traffic" / "Generate leads".
2. **Add a Web data stream.** Admin → Data streams → Add stream → Web →
   URL `https://simnetiq.xyz`, name `Website`. Leave **Enhanced measurement** on
   (scrolls, outbound clicks — the App Store button clicks show up as outbound
   clicks too). Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. **Privacy settings** (these keep the Cookie Policy true):
   - Admin → Data collection → **Google signals: off**; "Allow ads
     personalization": off for all regions.
   - Admin → Data retention → **14 months**.
   - Admin → Data streams → Website → Configure tag settings → Define internal
     traffic → add your own IP(s); then Admin → Data filters → set the
     "Internal traffic" filter to **Active**.
4. **Turn it on.** The ID `G-Q3GF3VZ8JC` is the default in
   `components/ConsentedAnalytics.tsx`, so deploying is enough — no Vercel env
   needed. `NEXT_PUBLIC_GA_ID` on Vercel overrides it (set it to an empty string
   to switch GA off); it's baked in at build, so redeploy after changing it.
5. **Verify** (incognito window):
   - Before choosing: DevTools → Network, filter `google` → nothing.
   - Accept → `gtag/js` loads and `collect?…` requests fire, carrying `gcs=G1…`.
   - GA → Admin → DebugView, or Reports → Realtime: your visit appears.
   - Footer → Cookie settings → turn Analytics off → Save: `_ga*` cookies are
     gone (Application → Cookies) and no new `collect` requests fire.
6. **Key events.** After a day of traffic: Admin → Events → find
   `cta_click_ios` → mark as **Key event**. That's the "went to the App Store"
   conversion.
7. **Search Console link.** Admin → Product links → Search Console → link the
   `simnetiq.xyz` property, so organic queries show up in GA.

## 2. Meta Pixel

Pixel `1684052673155815` is wired in (`ConsentedAnalytics.tsx`) and loads only
after the visitor turns on Marketing. Set `NEXT_PUBLIC_META_PIXEL_ID` on Vercel
to override the ID, or to an empty string to switch the pixel off. The
`<noscript>` image from Meta's snippet is deliberately left out: it would fire
without consent.

What it sends: `PageView` on load and on every client-side navigation, plus
every `trackEvent()` call as a custom event (e.g. `CTAClickiOS` with
`placement`).

1. **Verify the domain.** Meta Business Suite → Settings → Brand safety →
   Domains → add `simnetiq.xyz` → DNS TXT record (add it at the DNS host) →
   Verify. Needed to configure web events and for iOS 14+ measurement.
2. **Check it fires.** Install the *Meta Pixel Helper* Chrome extension →
   open the site → Accept → the helper shows `PageView`. Events Manager →
   the pixel → *Test events* → enter `https://simnetiq.xyz` → click around.
3. **Make the App Store click a conversion.** Events Manager → the pixel →
   Custom conversions → Create → event `CTAClickiOS` → category *Lead*
   (or *Start trial*). Use that as the optimisation event for website-traffic
   campaigns.
4. **Withdrawal check.** Cookie settings → Marketing off → Save: `_fbp` is gone,
   and Pixel Helper shows no new events.
5. *Later, optional:* Conversions API (server-side events) improves match rates
   but needs its own consent handling — not needed to start.

## Download event — every App Store button

Every link to the App Store fires one event, `CTA Click iOS`, with a
`placement` parameter saying which button it was. In GA it arrives as
`cta_click_ios`; in Meta as the custom event `CTAClickiOS`.

| placement | Button |
| --- | --- |
| `hero` | Home hero "Download on the App Store" card |
| `nav` | "Get the app" in the top nav (desktop and mobile menu) |
| `final_cta` | Home page last card (Download) and painted CTA cards |
| `service_hero` / `country_hero` / `alternative_hero` | Badge at the top of service, country and alternative pages |
| `service_cta` / `hub_cta` / `browse` | Lower-page badges (alternative pages, hub, blog posts) |
| `footer` | "App Store" link in the footer |

New App Store links must use `TrackedLink` (or `StoreBadges`) so they're
counted. To see placements in GA reports, register `placement` as a custom
dimension: Admin → Custom definitions → Create → scope *Event*, parameter
`placement`.

## 3. Do we need AppsFlyer (or similar)?

What the site trackers can and can't see: GA and the Pixel see a visitor
**click the App Store badge**. Neither can see the **install**, the **first
open** or a **coin purchase**, because those happen in the App Store and the
app. Today the app has no attribution SDK (RevenueCat only), and the privacy
policy and App Store privacy label say so.

Recommended order:

1. **Now, free — App Store campaign links.** In App Store Connect → App
   Analytics → Campaigns, generate links with `pt` (provider token) and `ct`
   (campaign) and use a distinct `ct` per channel (e.g. `ct=meta_feed`,
   `ct=site_hero`, `ct=blog`). Installs and proceeds per campaign then appear in
   App Analytics (only for users who opted into sharing with developers, so it's
   a sample, not a full count). Zero code in the app.
2. **When you run Meta app-install / purchase campaigns — pick one:**
   - **Meta SDK in the app** (`react-native-fbsdk-next`) + SKAdNetwork: lets Meta
     optimise for installs and purchases. Cheapest option if Meta is the only
     paid channel.
   - **An MMP (AppsFlyer, Adjust, Branch, Singular)**: one SDK that attributes
     installs across every ad network, handles SKAdNetwork conversion values and
     deep links. Worth it once paid spend is meaningful *and* spread across 2+
     channels (Meta + Google + TikTok…). AppsFlyer has a free tier for a limited
     number of attributed installs.
   - Either way, **RevenueCat** can forward purchase/renewal events to Meta,
     AppsFlyer, Adjust or Firebase server-side (RevenueCat → Integrations), so
     revenue reaches the ad network without extra purchase-tracking code.
   - Either way, the app then needs: an **App Tracking Transparency** prompt
     (`expo-tracking-transparency`) before reading the IDFA, an updated **App
     Store privacy label** ("Data used to track you"), and updated app privacy
     policy text. That's an app release + legal copy change, so plan it as one
     piece of work.
3. **Optional — Firebase Analytics in the app**, linked to the same GA4
   property, if you want one funnel from site visit to in-app activation.
   Same privacy-label and policy updates apply.

Rule of thumb: start with campaign links + Pixel + GA; add the Meta SDK or an
MMP the moment you spend real money on app-install ads, because without it Meta
can't optimise for installs and you can't compute cost per install.
