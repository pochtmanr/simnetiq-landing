"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/*
 * Verification codes landing in the app — the product's single important
 * moment, shown in the "code lands in the app" step instead of described. Every few seconds
 * a new message drops in at the top of a three-deep stack, its digits arrive
 * one by one, and the oldest falls away.
 *
 * Bubbles are keyed by arrival number, so a message keeps its DOM node as it
 * moves down the stack and the slot change animates through a CSS transition;
 * only the newcomer mounts, which is what runs its entry keyframes.
 *
 * Decorative (aria-hidden): the step's own copy stays in the DOM for readers.
 * Server render and reduced motion both get the same static, filled stack.
 * The timer only runs while the stack is on screen and the tab is visible.
 */

const MESSAGES = [
  { slug: "telegram", name: "Telegram", code: "48213" },
  { slug: "google", name: "Google", code: "591024" },
  { slug: "whatsapp", name: "WhatsApp", code: "318604" },
  { slug: "instagram", name: "Instagram", code: "802417" },
  { slug: "discord", name: "Discord", code: "274915" },
  { slug: "tiktok", name: "TikTok", code: "6390" },
] as const;

const VISIBLE = 3;
const INTERVAL_MS = 3400;
const FIRST = VISIBLE - 1;

type InboxCopy = { codeLabel: string; now: string; secondsAgo: string };

export function LiveInbox({ copy, className = "" }: { copy: InboxCopy; className?: string }) {
  const [tick, setTick] = useState(FIRST);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let onScreen = false;
    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && !timer) timer = setInterval(() => setTick((t) => t + 1), INTERVAL_MS);
      if (!run && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (timer) clearInterval(timer);
    };
  }, []);

  /* Slots 0..VISIBLE-1 are shown; slot VISIBLE is the one fading out. */
  const items = [];
  for (let slot = 0; slot <= VISIBLE; slot++) {
    const arrival = tick - slot;
    if (arrival < 0) continue;
    items.push({ arrival, slot, msg: MESSAGES[arrival % MESSAGES.length] });
  }

  const age = (slot: number) => {
    const seconds = Math.round((slot * INTERVAL_MS) / 1000);
    return seconds === 0 ? copy.now : copy.secondsAgo.replace("{n}", String(seconds));
  };

  return (
    <div ref={ref} className={`sms-stack ${className}`} aria-hidden>
      {items.map(({ arrival, slot, msg }) => {
        const fresh = slot === 0 && tick > FIRST;
        return (
          <div
            key={arrival}
            className={`sms-bubble${fresh ? " sms-bubble--new" : ""}`}
            data-out={slot === VISIBLE || undefined}
            style={{ "--slot": slot } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/services/${msg.slug}.svg`} alt="" className="sms-bubble__logo" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-[8px]">
                <span className="text-label font-medium text-ink">{msg.name}</span>
                <span className="text-caption text-muted">{age(slot)}</span>
              </span>
              <span className="mt-[2px] flex items-baseline gap-[8px]">
                <span className="text-label text-ink-muted">{copy.codeLabel}</span>
                <span className="sms-bubble__code figures" dir="ltr">
                  {[...msg.code].map((digit, i) => (
                    <span
                      key={i}
                      className={fresh ? "digit-in" : undefined}
                      style={fresh ? { animationDelay: `${0.4 + i * 0.08}s` } : undefined}
                    >
                      {digit}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
