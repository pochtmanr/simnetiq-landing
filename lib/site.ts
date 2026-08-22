export const SITE_URL = "https://simnetiq.xyz";
export const APP_STORE_URL = "https://apps.apple.com/us/app/id6803515179";
/* No Play Store listing exists yet for SMS Code — the Android button is
   removed sitewide (see StoreBadges/SiteFooter) rather than pointed at a
   placeholder or the old app. Re-add PLAY_STORE_URL here once a listing
   exists. */
export const SUPPORT_EMAIL = "support@simnetiq.store";
export const COMPANY = "SIMNETIQ LTD";
/* The parent brand. simnetiq.xyz is this product's site; simnetiq.store is the
   company's own, and the domain the support address belongs to. */
export const COMPANY_SITE = "simnetiq.store";
export const COMPANY_URL = "https://simnetiq.store";

/* ---------------------------------------------------------------------------
 * Registered company details.
 *
 * Companies Act 2006 s.82 and the Companies (Trading Disclosures) Regulations
 * require a UK company's websites to state its registered name, its registered
 * number, its place of registration and its registered office address. None of
 * that appears anywhere on this site today.
 *
 * >>> OWNER ACTION: replace the two placeholders with the values on the
 * >>> certificate of incorporation. Until then COMPANY_DETAILS_READY is false
 * >>> and the footer renders exactly as it does now — no bracketed placeholder
 * >>> is ever shown to a visitor, but the disclosure is also still missing.
 * ------------------------------------------------------------------------- */
export const COMPANY_NUMBER = "[COMPANY NUMBER]";
export const COMPANY_REGISTERED_IN = "England and Wales";
export const COMPANY_REGISTERED_OFFICE = "[REGISTERED OFFICE ADDRESS]";

export const COMPANY_DETAILS_READY =
  !COMPANY_NUMBER.startsWith("[") && !COMPANY_REGISTERED_OFFICE.startsWith("[");

/* Same handle everywhere: @simnetiq. Also fed to Organization.sameAs in
   lib/seo.ts, which is what tells search engines these profiles are us. */
export const SOCIALS = [
  { name: "X", url: "https://x.com/simnetiq" },
  { name: "Instagram", url: "https://www.instagram.com/simnetiq/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/simnetiq/" },
] as const;
export const APP_NAME = "SMS Code";
