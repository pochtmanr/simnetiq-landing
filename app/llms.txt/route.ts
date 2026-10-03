import { DEFAULT_LOCALE, LOCALES, localeConfig, type Locale } from "../../lib/i18n";
import { absolute } from "../../lib/seo";
import { APP_STORE_URL, COMPANY, COMPANY_REGISTERED_IN, SUPPORT_EMAIL } from "../../lib/site";
import { SERVICES_META } from "../../lib/content/services/meta";
import { ALTERNATIVES_META } from "../../lib/content/alternatives/meta";
import { getCountries } from "../../lib/content/countries";
import { alternativesUi, blogUi, legal, servicesUi, supportUi, ui } from "../../lib/content/ui";

/* llms.txt (https://llmstxt.org), generated from the same registries as the
 * sitemap so a new service, country or language shows up here on its own.
 * The key facts are hand-written English: they are product claims, and an
 * LLM reads English regardless of the page language. */

export const dynamic = "force-static";

const list = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : items.join("");

function localizedPages(locale: Locale): string {
  const t = ui(locale);
  const rows: [string, string][] = [
    [t.site.name, "/"],
    [servicesUi(locale).hub.metaTitle, "/virtual-numbers"],
    [alternativesUi(locale).hub.metaTitle, "/alternatives"],
    [blogUi(locale).metaTitle, "/blog"],
    [supportUi(locale).meta.title, "/support"],
    [legal(locale, "privacy").meta.title, "/privacy-policy"],
    [legal(locale, "terms").meta.title, "/terms-of-service"],
  ];
  return rows.map(([label, path]) => `- [${label}](${absolute(locale, path)})`).join("\n");
}

export function GET() {
  const en = DEFAULT_LOCALE;
  const others = LOCALES.filter((l) => l !== en);
  const languages = LOCALES.map((l) => localeConfig(l).nativeName);
  const prefixes = others.map((l) => `/${l}`);

  const body = `# ${ui(en).site.name}

> SMS Code is a mobile app (iOS) by ${COMPANY} that provides temporary virtual phone numbers in 100+ countries for receiving SMS verification codes, so people can sign up for online services (Telegram, WhatsApp, Google, Instagram and 100+ more) without revealing their personal phone number. ${new URL(absolute(en, "/")).host} is the official website, available in ${list(languages)}.

Key facts:
- Pricing: one-time in-app coin packs (20, 55, 120, 250 or 700 coins); an activation costs from 20 coins, but 20 is the floor rather than the typical price — the cost is driven mainly by the service and adjusted by the country, and a high-demand service can cost several hundred coins in every country. The exact price is shown in the app before you confirm. No subscription; coins never expire. Pack prices are set in the App Store and vary by region.
- A code usually arrives within seconds. An activation runs for 15 minutes; a pending activation can be cancelled in the app and the coins return to the balance. Swapping to another number from the activation screen requires holding the current number for two minutes first (a supplier rule) and is capped at three swaps per activation; up to three activations can be held at once.
- No SIM or eSIM is installed, and the app needs an internet connection to show the code. Numbers are for one-time verification codes, not for long-term use or 2FA: when an activation ends the number returns to the supplier's pool and may later be issued to someone else.
- Coins live with the SMS Code account, not the App Store receipt. An anonymous user who reinstalls gets a new account and does not keep the balance; signing in (Apple, Google or an email code) is what preserves it.
- Operator: ${COMPANY}, a company registered in ${COMPANY_REGISTERED_IN}. Support: ${SUPPORT_EMAIL} (replies usually within one business day).
- Download: App Store ${APP_STORE_URL} — there is no Google Play listing yet.

## Pages

- [Home](${absolute(en, "/")}): what the app does, how it works in three steps, supported services, pricing packs, FAQ
- [Virtual numbers hub](${absolute(en, "/virtual-numbers")}): index of all per-service and per-country guides
- [Service guides](${absolute(en, `/virtual-numbers/${SERVICES_META[0].slug}`)}): one guide per service (${SERVICES_META.map((s) => s.name).join(", ")}) at /virtual-numbers/<service> — the real verification flow, service-specific tips and FAQs
- [Country guides](${absolute(en, "/virtual-numbers/country/united-states")}): one guide per country (${getCountries(en).map((c) => c.copy.name).join(", ")}) at /virtual-numbers/country/<country> — dialing codes, formats, what each country's numbers suit
- [Comparisons](${absolute(en, `/alternatives/${ALTERNATIVES_META[0].slug}`)}): fair comparisons with ${list(ALTERNATIVES_META.map((a) => a.competitorName))} at /alternatives/<competitor>
- [Blog](${absolute(en, "/blog")}): guides on virtual numbers, privacy and SMS verification
- [Support](${absolute(en, "/support")}): contact form and self-help for activation, billing and restore-purchase issues
- [Privacy Policy](${absolute(en, "/privacy-policy")}): what data is collected and how it is used (UK GDPR)
- [Terms of Service](${absolute(en, "/terms-of-service")}): acceptable use, coins, disclaimers, governing law (England and Wales)
${
  others.length
    ? `
## Other languages

The site is also published under ${list(prefixes)}, with the same paths after the prefix. English is the source; where a translation and the English legal text differ, the English version prevails.
${others.map((l) => `\n### ${localeConfig(l).nativeName}\n\n${localizedPages(l)}`).join("\n")}
`
    : ""
}`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
