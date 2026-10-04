"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  flushMetaQueue,
  hasAnalyticsConsent,
  subscribeConsent,
} from "../lib/consent";

/* Google Analytics 4 measurement ID. Public by nature (it ships in the page),
   so it has a default; NEXT_PUBLIC_GA_ID overrides it, and "" turns GA off. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-Q3GF3VZ8JC";

/* Meta Pixel ID. Public by nature (it ships in the page), so it has a default;
   NEXT_PUBLIC_META_PIXEL_ID overrides it, and setting that to "" turns it off. */
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1684052673155815";

type Tag = (...args: unknown[]) => void;
type TagWindow = Window & { gtag?: Tag; fbq?: Tag };

/*
 * Every analytics tool on the site, mounted only behind the visitor's consent.
 *
 * Vercel Web Analytics loads after "Accept". If consent is withdrawn later on
 * the same page the script can't be unloaded, so beforeSend drops every event
 * from then on.
 *
 * Google Analytics uses Consent Mode v2: the tag loads with all storage denied
 * and only after consent, and every later change is passed on as a consent
 * update. GA's advertising signals (ad_*) are never granted: it is used for
 * analytics only, and advertising measurement is the Meta Pixel's job.
 *
 * Meta Pixel loads only with marketing consent. It is a single-page app, so
 * every client-side navigation after the first is sent as another PageView.
 * Withdrawing consent mid-page revokes it, so the loaded pixel stops sending.
 */
export function ConsentedAnalytics() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const granted = consent?.analytics === true;
  const marketing = consent?.marketing === true;

  useEffect(() => {
    (window as TagWindow).gtag?.("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }, [granted]);

  useEffect(() => {
    (window as TagWindow).fbq?.("consent", marketing ? "grant" : "revoke");
  }, [marketing]);

  return (
    <>
      {granted && (
        <Analytics beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
      )}
      {granted && GA_ID && <GoogleAnalytics id={GA_ID} />}
      {marketing && META_PIXEL_ID && <MetaPixel id={META_PIXEL_ID} />}
    </>
  );
}

function MetaPixel({ id }: { id: string }) {
  const pathname = usePathname();
  /* The loader sends the first PageView itself; the effect below only
     reports the navigations that follow. */
  const lastPath = useRef(pathname);

  /* Meta's base code, run from an effect rather than a <Script> so that
     events queued before it (lib/consent.ts) are sent straight after init.
     An inline <script> element executes synchronously when appended. */
  useEffect(() => {
    if (!(window as TagWindow).fbq) {
      const base = document.createElement("script");
      base.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent','grant');
fbq('init',${JSON.stringify(id)});
fbq('track','PageView');`;
      document.head.appendChild(base);
    }
    flushMetaQueue();
  }, [id]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    (window as TagWindow).fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}

function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('consent','update',{analytics_storage:'granted'});
gtag('js',new Date());
gtag('config',${JSON.stringify(id)});`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
