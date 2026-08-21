// Global 404 for URLs that match no route at all. With two root layouts
// (en/ru route groups) there is no single layout to compose a 404 from, so
// this page renders standalone and must import its own styles and font.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
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

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <span className="tag-chip">404</span>
        <h1 className="mt-[22px] text-heading">This page doesn’t exist</h1>
        <p className="mt-[10px] max-w-md text-body text-ink-muted">
          Такой страницы нет. Everything about SMS Code lives on the home
          page.
        </p>
        <div className="mt-[30px] flex items-center gap-[10px]">
          <Link href="/" className="cta-pill">
            Back to home
          </Link>
          <Link href="/ru" className="cta-pill">
            На главную
          </Link>
        </div>
      </body>
    </html>
  );
}
