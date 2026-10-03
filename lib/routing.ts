import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";

/** The [locale] param, narrowed. The layout's dynamicParams = false already
 *  404s unknown codes; this keeps pages type-safe without repeating it. */
export function asLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}
