/* Validates content/locales against en, the source of truth.
 *
 *   npm run i18n:check                 every locale folder
 *   npm run i18n:check -- --locale=es  one locale
 *   npm run i18n:check -- --strict     warnings fail too
 *
 * Errors break the build (prebuild runs this). Warnings are SEO advice a
 * translator should act on but that can't be decided mechanically. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv, { type ErrorObject } from "ajv";
import { DEFAULT_LOCALE, LOCALE_REGISTRY, type Script } from "../lib/locales";
import { SERVICES_META } from "../lib/content/services/meta";
import { COUNTRIES_META } from "../lib/content/countries/meta";
import { BLOG_META } from "../lib/content/blog/meta";
import { ALTERNATIVES_META } from "../lib/content/alternatives/meta";
import { HELP_META } from "../lib/content/help/meta";
import { BARREL, LOCALES_DIR, fileKeys, localeDirs, renderBarrel } from "./i18n-files";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--locale="))?.split("=")[1];
const strict = args.includes("--strict");

const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`);

const COLLECTIONS: Record<string, readonly { slug: string }[]> = {
  services: SERVICES_META,
  countries: COUNTRIES_META,
  blog: BLOG_META,
  alternatives: ALTERNATIVES_META,
  help: HELP_META,
};

/** Values that are data, not copy: they must stay byte-identical to en. */
const STRUCTURAL_KEYS = new Set(["type", "src", "slug", "serviceSlug", "path"]);
/** Heading anchors may be localized, but only as ASCII slugs (ru transliterates). */
const ANCHOR = "^[a-z0-9]+(-[a-z0-9]+)*$";
const isUrlish = (s: string) => /^(\/|https?:|mailto:|#)/.test(s);

const glossary = JSON.parse(
  readFileSync(join(LOCALES_DIR, "..", "..", "docs", "i18n", "glossary.json"), "utf8"),
) as { doNotTranslate: string[]; aliases: Record<string, Record<string, string[]>> };

const byLength = (a: string, b: string) => b.length - a.length;
const BRANDS = [
  ...SERVICES_META.map((s) => s.name),
  ...ALTERNATIVES_META.map((a) => a.competitorName),
].sort(byLength);
const PROTECTED = [...glossary.doNotTranslate, ...BRANDS].sort(byLength);
const hasWord = (s: string, token: string) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^\\p{L}\\p{N}])`, "u").test(s);

/* ---------- budgets ------------------------------------------------------ */

/** Google truncates by pixel width, so CJK, at roughly two Latin characters
 *  per glyph, gets about half the character budget. */
const BUDGETS: Record<"wide" | "narrow", { title: number; desc: [number, number]; descHard: [number, number] }> = {
  narrow: { title: 60, desc: [120, 160], descHard: [90, 180] },
  wide: { title: 32, desc: [50, 90], descHard: [35, 110] },
};
const budgetFor = (script: Script) => BUDGETS[script === "han" ? "wide" : "narrow"];

function seoRole(key: string, path: string): "title" | "description" | null {
  const entry = key.includes("/");
  if (path === "/metaTitle" || path === "/hub/metaTitle" || path === "/meta/title") return "title";
  if (entry && (key.startsWith("blog/") || key.startsWith("help/")) && path === "/title") return "title";
  if (path === "/metaDescription" || path === "/hub/metaDescription" || path === "/meta/description") return "description";
  if (key.startsWith("blog/") && path === "/description") return "description";
  return null;
}

/* ---------- script detection -------------------------------------------- */

const SCRIPT_RE: Record<Script, RegExp> = {
  latin: /\p{Script=Latin}/gu,
  cyrillic: /\p{Script=Cyrillic}/gu,
  han: /\p{Script=Han}/gu,
  devanagari: /\p{Script=Devanagari}/gu,
  arabic: /\p{Script=Arabic}/gu,
};
const count = (s: string, re: RegExp) => s.match(re)?.length ?? 0;

/** Copy with brand names, URLs, e-mails, placeholders and markup removed —
 *  what is left is the part a translator was supposed to translate. */
function translatable(s: string): string {
  let out = s
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+|\{\w+\}|%s/g, " ");
  for (const token of PROTECTED) out = out.split(token).join(" ");
  return out.replace(/\b(SMS|OTP|SIM|API|ID|2FA|KYC|VPN|iOS|Android|eSIM)\b/g, " ");
}

/* ---------- structural parity via ajv ------------------------------------ */

function schemaOf(value: Json, key?: string): object {
  if (typeof value === "string") {
    if (key === "id") return { type: "string", pattern: ANCHOR };
    return (key && STRUCTURAL_KEYS.has(key)) || isUrlish(value)
      ? { const: value }
      : { type: "string", minLength: 1 };
  }
  if (typeof value === "number" || typeof value === "boolean" || value === null) return { const: value };
  if (Array.isArray(value)) {
    return {
      type: "array",
      items: value.map((v) => schemaOf(v, key)),
      minItems: value.length,
      maxItems: value.length,
    };
  }
  return {
    type: "object",
    properties: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, schemaOf(v, k)])),
    required: Object.keys(value),
    additionalProperties: false,
  };
}

const ajv = new Ajv({ allErrors: true, strict: false });

function describe(e: ErrorObject): string {
  const at = e.instancePath || "/";
  if (e.keyword === "additionalProperties") return `${at}: extra key "${(e.params as { additionalProperty: string }).additionalProperty}" (not in en)`;
  if (e.keyword === "required") return `${at}: missing key "${(e.params as { missingProperty: string }).missingProperty}"`;
  if (e.keyword === "const") return `${at}: must stay ${JSON.stringify((e.params as { allowedValue: unknown }).allowedValue)} (structural, never translated)`;
  if (e.keyword === "minLength") return `${at}: empty string`;
  if (e.keyword === "pattern") return `${at}: anchor must be a lowercase ASCII slug (transliterate, don't use native script)`;
  if (e.keyword === "minItems" || e.keyword === "maxItems") return `${at}: array length differs from en (${e.message})`;
  return `${at}: ${e.message}`;
}

/* ---------- per-string checks ------------------------------------------- */

const multiset = (xs: string[]) => [...xs].sort().join("\u0000");
const placeholders = (s: string) => s.match(/\{\w+\}|%s/g) ?? [];
const linkTargets = (s: string) => [...s.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
const boldMarks = (s: string) => s.split("**").length - 1;
const emMarks = (s: string) => s.replace(/\*\*/g, "").split("*").length - 1;

function walkStrings(en: Json, tr: Json, path: string, visit: (en: string, tr: string, path: string, key: string) => void, key = "") {
  if (typeof en === "string" && typeof tr === "string") return visit(en, tr, path, key);
  if (Array.isArray(en) && Array.isArray(tr)) {
    en.forEach((v, i) => i < tr.length && walkStrings(v, tr[i], `${path}/${i}`, visit, key));
    return;
  }
  if (en && tr && typeof en === "object" && typeof tr === "object" && !Array.isArray(en) && !Array.isArray(tr)) {
    for (const k of Object.keys(en)) if (k in tr) walkStrings(en[k], tr[k], `${path}/${k}`, visit, k);
  }
}

function checkString(locale: string, script: Script, file: string, key: string, path: string, enValue: string, value: string, fieldKey: string) {
  const where = `${file} ${path}`;

  const role = seoRole(key, path);
  if (role) {
    const b = budgetFor(script);
    if (role === "title" && value.length > b.title) {
      err(where, `title is ${value.length} chars, budget ${b.title}: "${value}"`);
    }
    if (role === "description") {
      const [hardMin, hardMax] = b.descHard;
      const [min, max] = b.desc;
      if (value.length < hardMin || value.length > hardMax) err(where, `description is ${value.length} chars, must be ${hardMin}-${hardMax} (aim for ${min}-${max})`);
      else if (value.length < min || value.length > max) warn(where, `description is ${value.length} chars, aim for ${min}-${max}`);
    }
  }

  if (locale === DEFAULT_LOCALE) return;
  if (STRUCTURAL_KEYS.has(fieldKey) || fieldKey === "id" || isUrlish(enValue)) return;

  if (multiset(placeholders(enValue)) !== multiset(placeholders(value))) {
    err(where, `placeholders changed: en has [${placeholders(enValue).join(", ")}], got [${placeholders(value).join(", ")}]`);
  }
  if (multiset(linkTargets(enValue)) !== multiset(linkTargets(value))) {
    err(where, `link targets changed: en has [${linkTargets(enValue).join(", ")}], got [${linkTargets(value).join(", ")}]`);
  }
  if (boldMarks(enValue) !== boldMarks(value) || emMarks(enValue) !== emMarks(value)) {
    err(where, "**bold** / *em* markers don't match en");
  }

  /* Our own names everywhere; third-party brands only where they are the
     search keyword (titles, descriptions) — elsewhere rephrasing may drop them.
     makeMetadata appends ui.site.titleTemplate when that result is still ≤60
     characters (TITLE_BUDGET in lib/seo.ts). Home is the one absolute title.
     A brand the template already adds does not also have to sit in a short
     title — on CJK that repeat is the whole budget. */
  const aliases = glossary.aliases[locale] ?? {};
  const template = titleTemplateFor(locale);
  const tokens = role ? PROTECTED : glossary.doNotTranslate;
  for (const token of tokens) {
    if (!hasWord(enValue, token)) continue;
    if (value.includes(token) || (aliases[token] ?? []).some((a) => value.includes(a))) continue;
    const templated = template ? template.length - 2 + value.length : Number.POSITIVE_INFINITY;
    if (role === "title" && path !== "/meta/title" && template.includes(token) && templated <= 60) continue;
    warn(where, `"${token}" from en is missing — keep it, in Latin script`);
  }

  const rest = translatable(value);
  const latin = count(rest, SCRIPT_RE.latin);
  if (script === "latin") {
    if (value === enValue && /\s/.test(translatable(enValue).trim()) && count(translatable(enValue), SCRIPT_RE.latin) >= 15) {
      warn(where, `identical to en — untranslated? "${value.slice(0, 80)}"`);
    }
    return;
  }
  const native = count(rest, SCRIPT_RE[script]);
  if (latin >= 12 && native === 0) err(where, `no ${script} text — left in English? "${value.slice(0, 80)}"`);
  else if (latin >= 4 && native === 0) warn(where, `no ${script} text — fine for a loanword, otherwise translate: "${value}"`);
  else if (latin + native >= 40 && native / (latin + native) < 0.5) warn(where, `mostly Latin letters for a ${script} locale — check for untranslated words`);
}

/** Unregistered folders (translation in progress) have no registry entry
 *  yet, so take the dominant non-Latin script of their own copy. */
function inferScript(locale: string, keys: string[]): Script {
  const totals = new Map<Script, number>();
  const visit = (v: Json) => {
    if (typeof v === "string") {
      const rest = translatable(v);
      for (const sc of Object.keys(SCRIPT_RE) as Script[]) totals.set(sc, (totals.get(sc) ?? 0) + count(rest, SCRIPT_RE[sc]));
    } else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === "object") Object.values(v).forEach(visit);
  };
  for (const key of keys) {
    try {
      visit(readJson(locale, key));
    } catch {}
  }
  const all = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  const [best, n] = [...totals].filter(([sc]) => sc !== "latin").sort((a, b) => b[1] - a[1])[0];
  return n / all > 0.2 ? best : "latin";
}

/* ---------- run ---------------------------------------------------------- */

const readJson = (locale: string, key: string): Json =>
  JSON.parse(readFileSync(join(LOCALES_DIR, locale, `${key}.json`), "utf8"));

const titleTemplates = new Map<string, string>();
function titleTemplateFor(locale: string): string {
  const cached = titleTemplates.get(locale);
  if (cached !== undefined) return cached;
  let template = "";
  try {
    const ui = readJson(locale, "ui") as { site?: { titleTemplate?: string } };
    template = ui.site?.titleTemplate ?? "";
  } catch {
    template = "";
  }
  titleTemplates.set(locale, template);
  return template;
}

const enKeys = new Set(fileKeys(DEFAULT_LOCALE));
const isCollectionKey = (key: string) => key.split("/")[0] in COLLECTIONS && key.includes("/");
const uiKeys = [...enKeys].filter((k) => !isCollectionKey(k));

for (const [folder, meta] of Object.entries(COLLECTIONS)) {
  for (const { slug } of meta) {
    if (!enKeys.has(`${folder}/${slug}`)) err(`en/${folder}/${slug}.json`, "missing — every entry in meta.ts needs an en file");
  }
}

const registry: Record<string, { script: Script }> = Object.fromEntries(
  LOCALE_REGISTRY.map((l) => [l.code, l]),
);
const dirs = localeDirs();
for (const code of Object.keys(registry)) {
  if (!dirs.includes(code)) err(`content/locales/${code}`, "registered in lib/locales.ts but the folder is missing");
}

const schemas = new Map<string, ReturnType<typeof ajv.compile>>();
const enCache = new Map<string, Json>();
const enJson = (key: string) => {
  if (!enCache.has(key)) enCache.set(key, readJson(DEFAULT_LOCALE, key));
  return enCache.get(key)!;
};

for (const locale of dirs) {
  if (only && locale !== only) continue;
  const config = registry[locale];
  if (!config) {
    warn(`content/locales/${locale}`, "folder is not in LOCALE_REGISTRY yet — add the entry once this check passes");
  }
  const keys = fileKeys(locale);
  const script: Script = config?.script ?? inferScript(locale, keys);

  for (const key of uiKeys) {
    if (!keys.includes(key)) err(`${locale}/${key}.json`, "missing — every locale needs all UI files");
  }

  let published = 0;
  let collectionTotal = 0;
  for (const key of keys) {
    const file = `${locale}/${key}.json`;
    if (!enKeys.has(key)) {
      err(file, "orphan — no en counterpart (renamed or removed slug?)");
      continue;
    }
    if (isCollectionKey(key)) published++;

    let value: Json;
    try {
      value = readJson(locale, key);
    } catch (e) {
      err(file, `invalid JSON: ${(e as Error).message}`);
      continue;
    }
    const en = enJson(key);

    if (locale !== DEFAULT_LOCALE) {
      let validate = schemas.get(key);
      if (!validate) {
        validate = ajv.compile(schemaOf(en));
        schemas.set(key, validate);
      }
      if (!validate(value)) for (const e of validate.errors ?? []) err(file, describe(e));
    }

    const anchors = new Set<string>();
    walkStrings(en, value, "", (enValue, v, path, fieldKey) => {
      if (fieldKey === "id") {
        if (anchors.has(v)) err(`${file} ${path}`, `duplicate anchor "${v}"`);
        anchors.add(v);
      }
      if (!v.trim()) {
        if (locale === DEFAULT_LOCALE) err(`${file} ${path}`, "empty string");
      }
      else checkString(locale, script, file, key, path, enValue, v, fieldKey);
    });
  }
  for (const k of enKeys) if (isCollectionKey(k)) collectionTotal++;
  if (locale !== DEFAULT_LOCALE && published < collectionTotal) {
    warnings.push(`${locale}: ${published}/${collectionTotal} collection pages translated — the rest are simply not published in ${locale}`);
  }
}

try {
  if (readFileSync(BARREL, "utf8") !== renderBarrel()) err("content/locales/index.generated.ts", "out of date — run `npm run i18n:sync`");
} catch {
  err("content/locales/index.generated.ts", "missing — run `npm run i18n:sync`");
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
const failed = errors.length > 0 || (strict && warnings.length > 0);
console.log(
  `\ni18n:check ${failed ? "failed" : "passed"} — ${errors.length} error(s), ${warnings.length} warning(s)` +
    (only ? ` [locale ${only}]` : ""),
);
process.exit(failed ? 1 : 0);
