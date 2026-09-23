// Global 404 for URLs that match no route at all. With two root layouts
// (en/ru route groups) there is no single layout to compose a 404 from, so
// this page renders standalone and must import its own styles and font.
//
// It is prerendered once, so it cannot know the locale on the server. Both
// languages are in the markup; the inline script below runs before first
// paint and sets <html lang="ru"> for /ru… paths or a Russian browser, and the
// CSS shows only the matching block. No flash, no request-time API.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NOT_FOUND } from "../lib/content/common";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — SMS Code by SIMNETIQ",
  robots: { index: false },
};

const pickLocale = `try{var p=location.pathname,l=(navigator.language||"").toLowerCase();if(p==="/ru"||p.indexOf("/ru/")===0||(p.indexOf("/en/")!==0&&l.indexOf("ru")===0))document.documentElement.lang="ru"}catch(e){}`;

const localeCss = `html[lang="ru"] [data-l="en"],html:not([lang="ru"]) [data-l="ru"]{display:none}`;

function Body({ locale }: { locale: "en" | "ru" }) {
  const t = NOT_FOUND[locale];
  return (
    <div
      data-l={locale}
      lang={locale}
      className="flex flex-col items-center"
    >
      <span className="tag-chip">404</span>
      <h1 className="mt-[22px] text-heading">{t.title}</h1>
      <p className="mt-[10px] max-w-md text-body text-ink-muted">{t.body}</p>
      <Link href={locale === "ru" ? "/ru" : "/"} className="cta mt-[30px]">
        {t.back}
      </Link>
    </div>
  );
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLocale }} />
        <style dangerouslySetInnerHTML={{ __html: localeCss }} />
      </head>
      <body className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <Body locale="en" />
        <Body locale="ru" />
      </body>
    </html>
  );
}
