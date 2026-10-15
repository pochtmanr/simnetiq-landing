"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "../lib/consent";
import { isSupportTopic, SUPPORT_TOPICS, type SupportTopicId } from "../lib/content/help/types";
import type { SupportDict } from "../lib/content/ui";
import { localePath, type Locale } from "../lib/i18n";
import { Arrow } from "./Arrow";

type Status = "idle" | "sending" | "sent" | "error";
type Step = "topic" | "help" | "form" | "solved";

/* Turnstile is opt-in. Unset (the default) and nothing about this form changes:
   no third-party script, no widget, and the API route skips verification. Set
   it together with TURNSTILE_SECRET_KEY on the server — one without the other
   is the configuration that breaks submissions. */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/* Topic → the article that answers it. Refund leaves the form entirely: almost
   every refund request is one Apple has to decide, so the guide is the answer
   and "submit anyway" on that page brings the visitor back here. The topics
   with a summary in `form.selfServe` get a deflection step first. */
const GUIDE: Partial<Record<SupportTopicId, string>> = {
  refund: "/support/refund-apple",
  sms: "/support/sms-not-received",
  code: "/support/code-rejected",
  coins: "/support/missing-coins",
  account: "/support/account-balance#delete",
};
type SelfServeTopic = keyof SupportDict["form"]["selfServe"];
const hasSelfServe = (t: SupportTopicId): t is SelfServeTopic =>
  t === "sms" || t === "code" || t === "coins" || t === "account";

/** What the app (or a help article) handed us in the query string. */
type Context = {
  accountId?: string;
  appVersion?: string;
  service?: string;
  country?: string;
};

export function SupportForm({ locale, t }: { locale: Locale; t: SupportDict["form"] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("topic");
  const [topic, setTopic] = useState<SupportTopicId | null>(null);
  const [ctx, setCtx] = useState<Context>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  // Read the query string after hydration rather than through searchParams,
  // so /support stays a static page.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next: Context = {
      accountId: q.get("uid") ?? undefined,
      appVersion: q.get("v") ?? undefined,
      service: q.get("service") ?? undefined,
      country: q.get("country") ?? undefined,
    };
    // The account id is a lookup hint for us, not something analytics should
    // see in a page URL: drop it (and the version) from the address bar now.
    if (q.has("uid") || q.has("v")) {
      const clean = new URLSearchParams(q);
      clean.delete("uid");
      clean.delete("v");
      const rest = clean.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`);
    }
    const fromQuery = q.get("topic");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL
    setCtx(next);
    if (!isSupportTopic(fromQuery)) return;
    // "anyway=1": the visitor has already read the guide for this topic.
    if (q.get("anyway") === "1") {
      setTopic(fromQuery);
      setStep("form");
    } else if (fromQuery === "refund") {
      router.replace(localePath(locale, GUIDE.refund!));
    } else {
      setTopic(fromQuery);
      setStep(hasSelfServe(fromQuery) ? "help" : "form");
    }
  }, [locale, router]);

  function choose(next: SupportTopicId) {
    setTopic(next);
    setError(null);
    trackEvent("Support Topic", { topic: next });
    if (next === "refund") {
      router.push(localePath(locale, GUIDE.refund!));
      return;
    }
    setStep(hasSelfServe(next) ? "help" : "form");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          topic,
          accountId: ctx.accountId ?? null,
          appVersion: ctx.appVersion ?? null,
          locale,
          // Turnstile injects this hidden field into the enclosing form.
          turnstileToken: data["cf-turnstile-response"] ?? null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? t.genericError);
      }
      setStatus("sent");
      trackEvent("Support Sent", { topic: topic ?? "other" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t.genericError);
    }
  }

  if (status === "sent" || step === "solved") {
    const solved = step === "solved";
    return (
      <div className="card text-center" role="status">
        <span className="tag-chip">{solved ? t.solved : t.sentChip}</span>
        <h2 className="mt-[22px] text-heading">{solved ? t.solvedTitle : t.sentTitle}</h2>
        <p className="mx-auto mt-[10px] max-w-md text-body text-ink-muted">
          {solved ? t.solvedBody : t.sentBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStep("topic");
            setTopic(null);
          }}
          className="cta mt-[30px]"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  if (step === "topic" || !topic) {
    return (
      <div className="card">
        <h2 className="font-sans text-subheading font-medium">{t.stepTopic}</h2>
        <div className="mt-[18px] grid gap-[10px] sm:grid-cols-2">
          {SUPPORT_TOPICS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => choose(id)}
              className="flex items-center justify-between gap-[10px] rounded-[14px] border border-border px-[18px] py-[14px] text-start text-body text-ink transition-colors hover:border-accent hover:bg-panel focus-visible:border-accent focus-visible:outline-none"
            >
              {t.topics[id]}
              <Arrow />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-[10px]">
      <span className="tag-chip">{t.topics[topic]}</span>
      <button
        type="button"
        className="blue-link text-label"
        onClick={() => {
          setStep("topic");
          setTopic(null);
          setError(null);
        }}
      >
        {t.changeTopic}
      </button>
    </div>
  );

  if (step === "help" && hasSelfServe(topic)) {
    const help = t.selfServe[topic];
    return (
      <div className="card flex flex-col gap-[18px]">
        {header}
        <h2 className="font-sans text-subheading font-medium">{help.title}</h2>
        <ul className="flex flex-col gap-[10px] ps-[20px] text-body text-ink-muted [&>li]:list-disc">
          {help.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Link className="blue-link text-label" href={localePath(locale, GUIDE[topic]!)}>
          {t.readGuide} <Arrow />
        </Link>
        <div className="flex flex-wrap gap-[10px]">
          <button
            type="button"
            className="cta"
            onClick={() => {
              trackEvent("Support Deflected", { topic });
              setStep("solved");
            }}
          >
            {t.solved}
          </button>
          <button
            type="button"
            className="rounded-[12px] border border-border px-[24px] py-[13px] text-[14px] font-medium text-ink hover:bg-panel"
            onClick={() => setStep("form")}
          >
            {t.stillNeed}
          </button>
        </div>
      </div>
    );
  }

  const wantsActivation = topic === "sms" || topic === "code";
  const wantsOrder = topic === "refund" || topic === "coins" || topic === "account";

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-[22px]">
      {header}
      {topic === "refund" && (
        <p className="rounded-[14px] bg-panel p-[16px] text-label text-ink-muted">
          {t.refundNote}{" "}
          <Link className="blue-link" href={localePath(locale, GUIDE.refund!)}>
            {t.readGuide}
          </Link>
        </p>
      )}

      <div className="grid gap-[22px] sm:grid-cols-2">
        <label className="flex flex-col gap-[6px]">
          <span className="text-caption text-ink-muted">{t.name}</span>
          <input
            name="name"
            required
            maxLength={200}
            autoComplete="name"
            placeholder={t.namePlaceholder}
            className="field"
          />
        </label>
        <label className="flex flex-col gap-[6px]">
          <span className="text-caption text-ink-muted">{t.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            className="field"
          />
        </label>
      </div>

      {wantsActivation && (
        <div className="grid gap-[22px] sm:grid-cols-3">
          <label className="flex flex-col gap-[6px]">
            <span className="text-caption text-ink-muted">{t.service}</span>
            <input name="service" maxLength={80} defaultValue={ctx.service} placeholder={t.servicePlaceholder} className="field" />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="text-caption text-ink-muted">{t.country}</span>
            <input name="country" maxLength={80} defaultValue={ctx.country} placeholder={t.countryPlaceholder} className="field" />
          </label>
          <label className="flex flex-col gap-[6px]">
            <span className="text-caption text-ink-muted">{t.when}</span>
            <input name="when" maxLength={80} placeholder={t.whenPlaceholder} className="field" />
          </label>
        </div>
      )}

      {wantsOrder && (
        <label className="flex flex-col gap-[6px]">
          <span className="text-caption text-ink-muted">{t.orderId}</span>
          <input name="orderId" maxLength={64} autoComplete="off" placeholder={t.orderIdPlaceholder} className="field" />
        </label>
      )}

      <label className="flex flex-col gap-[6px]">
        <span className="text-caption text-ink-muted">{t.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4500}
          rows={6}
          placeholder={t.messagePlaceholders[topic]}
          className="field resize-y"
        />
      </label>

      {ctx.accountId && <p className="text-caption text-muted">{t.accountAttached}</p>}

      {/* Honeypot — invisible to people, tempting to bots */}
      <div className="absolute -start-[9999px] top-auto" aria-hidden>
        <label>
          {t.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
          />
        </>
      )}

      {status === "error" && error && (
        <p className="text-label text-accent-deep" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" disabled={status === "sending"} className="cta disabled:opacity-50">
          {status === "sending" ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
