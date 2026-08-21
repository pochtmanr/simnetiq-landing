"use client";

import { useState } from "react";
import { SUPPORT_FORM } from "../lib/content/support";
import type { Locale } from "../lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";

export function SupportForm({ locale = "en" }: { locale?: Locale }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const t = SUPPORT_FORM[locale];

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
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? t.genericError);
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t.genericError);
    }
  }

  if (status === "sent") {
    return (
      <div className="card text-center" role="status">
        <span className="tag-chip">{t.sentChip}</span>
        <h2 className="mt-[22px] text-heading">{t.sentTitle}</h2>
        <p className="mx-auto mt-[10px] max-w-md text-body text-ink-muted">
          {t.sentBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="cta-pill mt-[30px]"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-[22px]">
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

      <label className="flex flex-col gap-[6px]">
        <span className="text-caption text-ink-muted">{t.topic}</span>
        <select name="topic" required defaultValue="" className="field">
          <option value="" disabled>
            {t.topicPlaceholder}
          </option>
          {t.topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-[6px]">
        <span className="text-caption text-ink-muted">{t.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder={t.messagePlaceholder}
          className="field resize-y"
        />
      </label>

      {/* Honeypot — invisible to people, tempting to bots */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden>
        <label>
          {t.honeypot}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && error && (
        <p className="text-label text-accent-deep" role="alert">
          {error}
        </p>
      )}

      <div>
        <button type="submit" disabled={status === "sending"} className="cta-pill disabled:opacity-50">
          {status === "sending" ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
