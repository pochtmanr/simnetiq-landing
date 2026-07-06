"use client";

import { useEffect, useState } from "react";

/**
 * Animated phone mock: an OTP text message "arrives" for a rotating set of
 * services. Pure client-side loop; freezes on the first frame when the
 * visitor prefers reduced motion.
 */

type Scene = {
  slug: string;
  service: string;
  color: string;
  number: string;
  code: string;
};

const SCENES: Scene[] = [
  { slug: "telegram", service: "Telegram", color: "#26A5E4", number: "+31 6 45 09 11 27", code: "48329" },
  { slug: "whatsapp", service: "WhatsApp", color: "#25D366", number: "+48 512 380 664", code: "71054" },
  { slug: "google", service: "Google", color: "#4285F4", number: "+44 7911 623 810", code: "90266" },
  { slug: "instagram", service: "Instagram", color: "#E4405F", number: "+62 812 5501 8834", code: "35471" },
];

// Phases within one scene: typing indicator -> message bubble -> hold.
const TYPING_MS = 1400;
const SCENE_MS = 4600;

export function PhoneMock() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setAnimate(false);
      setShowBubble(true);
      return;
    }
    let bubbleTimer: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setSceneIdx((i) => (i + 1) % SCENES.length);
      setShowBubble(false);
      bubbleTimer = setTimeout(() => setShowBubble(true), TYPING_MS);
    }, SCENE_MS);
    bubbleTimer = setTimeout(() => setShowBubble(true), TYPING_MS);
    return () => {
      clearInterval(cycle);
      clearTimeout(bubbleTimer);
    };
  }, []);

  const scene = SCENES[sceneIdx];

  return (
    <div
      aria-hidden
      className="relative mx-auto w-[300px] sm:w-[330px] rounded-[3rem] bg-ink p-[10px] shadow-[0_40px_80px_-24px_rgba(26,26,46,0.35)]"
    >
      <div className="rounded-[2.4rem] bg-bg overflow-hidden">
        {/* Status bar + notch */}
        <div className="relative flex items-center justify-center pt-3 pb-1">
          <div className="absolute left-6 top-3 text-[11px] font-semibold text-ink">9:41</div>
          <div className="h-6 w-28 rounded-full bg-ink" />
        </div>

        {/* Conversation header */}
        <div className="flex flex-col items-center gap-1 border-b border-ink/5 px-6 pb-3 pt-2 bg-card">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: scene.color }}
          >
            <img
              src={`/services/${scene.slug}.svg`}
              alt=""
              className="h-5 w-5 brightness-0 invert"
            />
          </div>
          <div className="text-xs font-semibold text-ink">{scene.number}</div>
          <div className="text-[10px] text-muted">virtual number · active</div>
        </div>

        {/* Thread */}
        <div className="flex h-[300px] flex-col justify-end gap-3 px-4 pb-5 pt-4">
          <div className="self-center rounded-full bg-ink/5 px-3 py-1 text-[10px] text-muted">
            Today
          </div>

          <div className="max-w-[85%] self-start">
            {showBubble ? (
              <div
                key={scene.slug}
                className={`rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm ${animate ? "bubble-in" : ""}`}
              >
                <p className="text-[13px] leading-snug text-ink">
                  Your {scene.service} code is
                </p>
                <p className="mt-1 font-mono text-[26px] font-semibold tracking-[0.18em] text-accent-deep">
                  {scene.code.split("").map((d, i) => (
                    <span
                      key={`${scene.slug}-${i}`}
                      className={animate ? "digit-pop inline-block" : "inline-block"}
                      style={animate ? { animationDelay: `${0.08 * i + 0.15}s` } : undefined}
                    >
                      {d}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <div className="flex w-16 items-center justify-center gap-1.5 rounded-2xl rounded-bl-md bg-card px-4 py-4 shadow-sm">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: "0.2s" }} />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: "0.4s" }} />
              </div>
            )}
          </div>

          {/* Copy chip mirrors the in-app one-tap copy */}
          <div
            className={`self-start rounded-full bg-accent px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition-opacity duration-500 ${showBubble ? "opacity-100" : "opacity-0"}`}
          >
            Copy code
          </div>
        </div>
      </div>
    </div>
  );
}
