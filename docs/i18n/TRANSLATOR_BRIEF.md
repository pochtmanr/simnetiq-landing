# Translator brief — simnetiq.xyz

One agent, one locale. Source of truth: `content/locales/en/`. Terms: `docs/i18n/glossary.json`.

## Workflow

1. Create `content/locales/<code>/` and translate **every** en file (same file names, same folders). UI files (`ui`, `home`, `support`, `privacy`, `terms`, `services-ui`, `alternatives-ui`, `blog-ui`) are mandatory; a missing collection file just leaves that page unpublished in your locale.
2. `npm run i18n:sync`
3. `npm run i18n:check -- --locale=<code>` until **0 errors**; fix warnings too.
4. Add the registry entry (table below) to `LOCALE_REGISTRY` in `lib/locales.ts`.
5. `npm run build` must pass. Optional: add a flag to `components/LangFlag.tsx` (falls back to a code disc).

## Never change

- Keys, key order, array lengths, booleans, numbers.
- `type`, `src`, `slug`, `serviceSlug`, `path`, any URL / e-mail / domain.
- `{placeholders}` (e.g. `{supportEmail}`) and `%s` in `ui.site.titleTemplate`.
- Inline markup: `**bold**`, `*em*`, `[text](url)` — translate the text, keep the URL.
- Heading `id`s may be localized only as lowercase ASCII slugs (transliterate; ru does `dva-raznykh-instrumenta`).
- Brand names stay in Latin script: SMS Code, SIMNETIQ, App Store, eSIM, every service and competitor name.

## SEO localization

- **Localize, don't translate.** Titles and H1s use the phrase people in that market actually search (see `seoKeywords` in the glossary): service page ≈ "<virtual number> for <Service>", country page ≈ "<country> virtual number".
- **Titles ≤ 60 chars** (CJK ≤ 32). Don't add the brand — the layout appends ` — <site.name>` only when it fits. Home `meta.title` is used as-is.
- **Descriptions 120–160 chars** (CJK 50–90): primary keyword + concrete benefit, unique per page, no mid-word truncation.
- `ui.site.name` = "SMS Code" + local "by" + "SIMNETIQ" (ru: "SMS Code от SIMNETIQ"); `titleTemplate` = `%s — <site.name>`.
- FAQs: phrase questions the way users there ask them, not word for word.
- Use the glossary terms (coins, activation, balance…) — they match the app.

## Accuracy

- No invented claims, prices, numbers or guarantees. Keep "usually within seconds", "100+", coin pack sizes (20/55/120/250/700). No currencies, no subscription language.
- Keep honest caveats (limits, when a competitor suits better).
- Legal (`privacy`, `terms`): faithful, never change meaning; `prevailingNotice` must say the English version prevails.

## Language mechanics

- Register: match the app — ru/fr/tr/id/hi/ar polite "you" (вы, vous, siz, Anda, आप); es informal tú; pt neutral-formal "você/a sua"; zh 你/您 as in app.
- Fixed numbers take the correct grammatical form (CLDR plurals: ru "2 минуты", "5 минут"; ar dual/plural). No ICU plural syntax.
- Native punctuation: ru/fr « », French non-breaking space before `: ; ! ?`, es ¿ ¡, zh full-width ，。！？：“ ”, ar ، ؟, hi ।. Turkish İ/ı.
- Western digits (0–9) everywhere, including ar and hi.
- ar: just write the text — layout mirrors automatically; no manual RTL marks.

## Registry entries

```ts
{ code: "zh", hreflang: "zh-Hans", ogLocale: "zh_CN", dir: "ltr", nativeName: "中文", script: "han", dateLocale: "zh-CN" },
{ code: "hi", hreflang: "hi", ogLocale: "hi_IN", dir: "ltr", nativeName: "हिन्दी", script: "devanagari", dateLocale: "hi-IN" },
{ code: "es", hreflang: "es", ogLocale: "es_ES", dir: "ltr", nativeName: "Español", script: "latin", dateLocale: "es" },
{ code: "pt", hreflang: "pt", ogLocale: "pt_BR", dir: "ltr", nativeName: "Português", script: "latin", dateLocale: "pt-BR" },
{ code: "id", hreflang: "id", ogLocale: "id_ID", dir: "ltr", nativeName: "Bahasa Indonesia", script: "latin", dateLocale: "id-ID" },
{ code: "ar", hreflang: "ar", ogLocale: "ar_AR", dir: "rtl", nativeName: "العربية", script: "arabic", dateLocale: "ar" },
{ code: "fr", hreflang: "fr", ogLocale: "fr_FR", dir: "ltr", nativeName: "Français", script: "latin", dateLocale: "fr-FR" },
{ code: "tr", hreflang: "tr", ogLocale: "tr_TR", dir: "ltr", nativeName: "Türkçe", script: "latin", dateLocale: "tr-TR" },
```

Also add the new code's greeting to `n8n/simnetiq-reply-workflow.json` if it isn't there yet.
