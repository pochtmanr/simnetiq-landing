import type { Locale } from "../locales";
import { requireLocaleFile } from "./load";

/* Page chrome, one JSON file per locale per area. The English files define the
   shape; every other locale must match it key for key (npm run i18n:check). */

export type UiDict = typeof import("../../content/locales/en/ui.json");
export type HomeDict = typeof import("../../content/locales/en/home.json");
export type ServicesUiDict = typeof import("../../content/locales/en/services-ui.json");
export type AlternativesUiDict = typeof import("../../content/locales/en/alternatives-ui.json");
export type BlogUiDict = typeof import("../../content/locales/en/blog-ui.json");
export type SupportDict = typeof import("../../content/locales/en/support.json");
export type LegalDict = typeof import("../../content/locales/en/privacy.json");

export const ui = (locale: Locale) => requireLocaleFile<UiDict>(locale, "ui");
export const homeUi = (locale: Locale) => requireLocaleFile<HomeDict>(locale, "home");
export const servicesUi = (locale: Locale) => requireLocaleFile<ServicesUiDict>(locale, "services-ui");
export const alternativesUi = (locale: Locale) =>
  requireLocaleFile<AlternativesUiDict>(locale, "alternatives-ui");
export const blogUi = (locale: Locale) => requireLocaleFile<BlogUiDict>(locale, "blog-ui");
export const supportUi = (locale: Locale) => requireLocaleFile<SupportDict>(locale, "support");
export const legal = (locale: Locale, doc: "privacy" | "terms") =>
  requireLocaleFile<LegalDict>(locale, doc);

/* Locale-neutral pieces of the home page. */

/** Logo marquee order (public/services/<slug>.svg). */
export const MARQUEE_SERVICES = [
  "telegram", "whatsapp", "google", "instagram", "facebook", "tiktok",
  "discord", "tinder", "snapchat", "apple", "netflix", "paypal",
  "uber", "steam", "viber", "signal", "twitter", "aliexpress",
  "wechat", "line", "airbnb", "grab", "vkcom", "adidas", "cursor",
  "twitch", "binance", "ebay", "reddit", "fiverr", "shopee",
  "kakaotalk", "zalo",
] as const;

/** Coin pack sizes, smallest first. */
export const COIN_PACKS = ["20", "55", "120", "250", "700"] as const;
