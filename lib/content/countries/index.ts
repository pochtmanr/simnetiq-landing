import { collection } from "../load";
import { COUNTRIES_META } from "./meta";
import type { CountryCopy, CountryMeta } from "./types";

/* meta.ts IS the publish switch — same policy as ../services/index.ts. */

const countries = collection<CountryMeta, CountryCopy>(COUNTRIES_META, "countries");

export const COUNTRY_SLUGS = countries.slugs;
export const getCountries = countries.all;
export const getCountry = countries.get;
export const countryLocales = countries.locales;
