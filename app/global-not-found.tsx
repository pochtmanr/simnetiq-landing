// Global 404 for URLs that match no route at all (in practice: paths the
// locale proxy leaves alone, such as a missing /foo.png). The locale and admin
// trees are separate root layouts, so this page renders standalone and must
// import its own styles and font.
//
// It is prerendered once, so it cannot know the locale on the server. Every
// locale's copy is in the markup; the inline script below runs before first
// paint and sets <html lang> from the path prefix or the browser language, and
// the CSS shows only the matching block. No flash, no request-time API.
import type { Metadata } from "next";
import Link from "next/link";
import { ui } from "../lib/content/ui";
import { golos } from "../lib/fonts";
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from "../lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: `404 — ${ui(DEFAULT_LOCALE).site.name}`,
  robots: { index: false },
};

const others = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

const pickLocale = `try{var L=${JSON.stringify(others)},p=location.pathname.split("/")[1],n=(navigator.language||"").toLowerCase().split("-")[0],l=L.indexOf(p)>=0?p:(p!==${JSON.stringify(DEFAULT_LOCALE)}&&L.indexOf(n)>=0?n:"");if(l)document.documentElement.lang=l}catch(e){}`;

const localeCss = [
  ...others.map((l) => `html[lang="${l}"] [data-l]:not([data-l="${l}"])`),
  `html${others.map((l) => `:not([lang="${l}"])`).join("")} [data-l]:not([data-l="${DEFAULT_LOCALE}"])`,
].join(",") + "{display:none}";

function Body({ locale }: { locale: Locale }) {
  const t = ui(locale).notFound;
  return (
    <div data-l={locale} lang={locale} className="flex flex-col items-center">
      <span className="tag-chip">404</span>
      <h1 className="mt-[22px] text-heading">{t.title}</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">{t.body}</p>
      <Link href={localePath(locale, "/")} className="cta mt-[30px]">
        {t.back}
      </Link>
    </div>
  );
}

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${golos.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLocale }} />
        <style dangerouslySetInnerHTML={{ __html: localeCss }} />
      </head>
      <body className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        {LOCALES.map((locale) => (
          <Body key={locale} locale={locale} />
        ))}
      </body>
    </html>
  );
}
