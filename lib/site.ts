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

// Verified against Companies House on 30 September 2026:
// https://find-and-update.company-information.service.gov.uk/company/16861177
export const COMPANY_NUMBER = "16861177";
export const COMPANY_REGISTERED_IN = "England and Wales";
export const COMPANY_REGISTERED_OFFICE = "2 Frederick Street, Kings Cross, London, United Kingdom, WC1X 0ND";

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
