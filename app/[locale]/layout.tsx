import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { JsonLd } from "../../components/JsonLd";
import { ui } from "../../lib/content/ui";
import { fontProps } from "../../lib/fonts";
import { LOCALES, isLocale, localeConfig } from "../../lib/i18n";
import { organization, softwareApplication, webSite } from "../../lib/seo";
import { APP_NAME, SITE_URL } from "../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  /* The desk grey, so the browser chrome reads as part of the desk. */
  themeColor: "#DCE0E6",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = ui(locale).site;
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: APP_NAME,
    title: { default: t.name, template: t.titleTemplate },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const config = localeConfig(locale);
  const fonts = fontProps(config.script);
  const t = ui(locale);
  return (
    <html
      lang={config.hreflang}
      dir={config.dir}
      className={`${fonts.className} h-full`}
      style={fonts.style}
    >
      <body className="site-body flex min-h-full flex-col">
        <JsonLd
          data={[organization(), webSite(locale), softwareApplication(locale)]}
        />
        {/* The site is a stack of cards on a grey desk: the page is a rounded
            sheet (cut into separate cards where a section changes surface),
            and at the end it lifts off the footer, an ink card waiting
            underneath. The corners belong to the cards and scroll with them. */}
        <div id="top" className="page-sheet flex flex-1 flex-col">
          <SiteNav locale={locale} t={t.nav} mainNavLabel={t.a11y.mainNav} />
          <main className="flex-1 pb-[94px]">{children}</main>
        </div>
        <SiteFooter locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
