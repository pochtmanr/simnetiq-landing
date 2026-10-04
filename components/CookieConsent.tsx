"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  onOpenCookieSettings,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "../lib/consent";
import { localePath, type Locale } from "../lib/i18n";
import type { UiDict } from "../lib/content/ui";

type Strings = UiDict["cookies"];

const noop = () => () => {};

const ALL: ConsentChoice = { analytics: true, marketing: true };
const NONE: ConsentChoice = { analytics: false, marketing: false };

/*
 * The consent banner and the preferences dialog, mounted once per page.
 *
 * Banner: a bright white card floating at the bottom centre. It never renders on the server, so a visitor who already chose never sees it
 * flash; it doesn't block the page or take focus. Reject and Accept are the
 * same size, side by side — refusing must be as easy as agreeing.
 *
 * Dialog: a native <dialog> opened modal, so focus trapping, Esc and the
 * backdrop come from the browser. Opens from the banner's Customize, the
 * footer's Cookie settings, or the Cookie Policy page (openCookieSettings()).
 * Nothing is pre-ticked: each switch (analytics, marketing) starts at the
 * stored choice, or off.
 */
export function CookieConsent({ locale, t }: { locale: Locale; t: Strings }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  /* false during SSR and hydration, true after: the banner waits for this so
     the server HTML and the first client render agree. */
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();
  const switchId = useId();
  const marketingSwitchId = useId();

  const openDialog = useCallback(() => {
    const stored = getConsentSnapshot();
    setAnalytics(stored?.analytics ?? false);
    setMarketing(stored?.marketing ?? false);
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => onOpenCookieSettings(openDialog), [openDialog]);

  const choose = (value: ConsentChoice) => {
    writeConsent(value);
    dialogRef.current?.close();
  };

  const policyHref = localePath(locale, "/cookie-policy");
  const showBanner = mounted && consent === null;

  return (
    <>
      {showBanner && (
        <section className="consent-banner" aria-label={t.bannerLabel}>
          <div className="flex items-start gap-[14px]">
            <CookieGlyph />
            <div className="min-w-0">
              <h2 className="consent-banner__title">{t.bannerTitle}</h2>
              <p className="mt-[6px] text-label text-ink-muted">
                {t.bannerBody}{" "}
                <Link href={policyHref} className="blue-link">
                  {t.policyLink}
                </Link>
              </p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-[8px]">
              <button type="button" className="consent-btn consent-btn--ghost" onClick={() => choose(NONE)}>
                {t.reject}
              </button>
              <button type="button" className="consent-btn consent-btn--solid" onClick={() => choose(ALL)}>
                {t.accept}
              </button>
            </div>
            <button type="button" className="consent-banner__more" onClick={openDialog}>
              {t.customize}
            </button>
          </div>
        </section>
      )}

      <dialog ref={dialogRef} className="consent-dialog" aria-labelledby={titleId}>
        <div className="flex items-start justify-between gap-[16px]">
          <h2 id={titleId} className="font-display text-heading-sm font-medium">
            {t.dialogTitle}
          </h2>
          <button
            type="button"
            className="consent-close"
            aria-label={t.close}
            onClick={() => dialogRef.current?.close()}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-[8px] text-label text-ink-muted">
          {t.dialogIntro}{" "}
          <Link href={policyHref} className="blue-link" onClick={() => dialogRef.current?.close()}>
            {t.policyLink}
          </Link>
        </p>

        <div className="mt-[22px] flex flex-col gap-[8px]">
          <div className="consent-row">
            <div className="min-w-0">
              <h3 className="text-body text-ink">{t.necessaryTitle}</h3>
              <p className="mt-[4px] text-label text-muted">{t.necessaryBody}</p>
            </div>
            <span className="consent-pill">{t.alwaysOn}</span>
          </div>
          <div className="consent-row">
            <div className="min-w-0">
              <h3 className="text-body text-ink">
                <label htmlFor={switchId}>{t.analyticsTitle}</label>
              </h3>
              <p className="mt-[4px] text-label text-muted">{t.analyticsBody}</p>
            </div>
            <button
              id={switchId}
              type="button"
              role="switch"
              aria-checked={analytics}
              className="consent-switch"
              onClick={() => setAnalytics((a) => !a)}
            >
              <span className="consent-switch__thumb" aria-hidden />
            </button>
          </div>
          <div className="consent-row">
            <div className="min-w-0">
              <h3 className="text-body text-ink">
                <label htmlFor={marketingSwitchId}>{t.marketingTitle}</label>
              </h3>
              <p className="mt-[4px] text-label text-muted">{t.marketingBody}</p>
            </div>
            <button
              id={marketingSwitchId}
              type="button"
              role="switch"
              aria-checked={marketing}
              className="consent-switch"
              onClick={() => setMarketing((m) => !m)}
            >
              <span className="consent-switch__thumb" aria-hidden />
            </button>
          </div>
        </div>

        <div className="consent-dialog__actions">
          <div className="grid grid-cols-2 gap-[8px]">
            <button type="button" className="consent-btn consent-btn--ghost" onClick={() => choose(NONE)}>
              {t.rejectAll}
            </button>
            <button type="button" className="consent-btn consent-btn--ghost" onClick={() => choose(ALL)}>
              {t.acceptAll}
            </button>
          </div>
          <button type="button" className="cta justify-center" onClick={() => choose({ analytics, marketing })}>
            {t.save}
          </button>
        </div>
      </dialog>
    </>
  );
}

/* A cookie with a bite out of it, drawn in the accent. */
function CookieGlyph() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      aria-hidden
      className="mt-[2px] shrink-0 text-accent"
    >
      <path
        d="M17 3a14 14 0 1 0 14 14.6 5 5 0 0 1-5.4-5.1A5 5 0 0 1 20.2 7 5 5 0 0 1 17 3Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="14" r="1.8" fill="currentColor" />
      <circle cx="15.5" cy="22.5" r="1.8" fill="currentColor" />
      <circle cx="22.5" cy="21" r="1.5" fill="currentColor" />
      <circle cx="10" cy="20.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
