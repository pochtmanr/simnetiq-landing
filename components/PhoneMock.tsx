"use client";

import { useEffect, useState } from "react";
import { PHONE_MOCK } from "../lib/content/common";
import type { Locale } from "../lib/i18n";

/**
 * Animated phone mock: an OTP text message "arrives" for a rotating set of
 * services, rendered as a real iOS Messages conversation. Pure client-side
 * loop; freezes on the first frame when the visitor prefers reduced motion.
 *
 * The device uses real iPhone proportions (~71:146 body ratio) and a true
 * CSS-3D body: stacked translateZ slabs give it visible thickness under the
 * hero tilt, with side buttons on the exposed rail. Hairline "signal rings"
 * radiate behind it, per the design system.
 */

type Scene = {
  service: string;
  number: string;
  code: string;
};

const SCENES: Scene[] = [
  { service: "Telegram", number: "+31 6 45 09 11 27", code: "48329" },
  { service: "WhatsApp", number: "+48 512 380 664", code: "71054" },
  { service: "Google", number: "+44 7911 623 810", code: "90266" },
  { service: "Instagram", number: "+62 812 5501 8834", code: "35471" },
];

// Phases within one scene: typing indicator -> message bubble -> hold.
const TYPING_MS = 1400;
const SCENE_MS = 4600;

const RINGS = [430, 590, 750];

// Device thickness: one 2px slab per step behind the front face.
const DEPTH_STEPS = 7;

// iOS Messages palette (depicting the OS, not the site theme)
const IOS = {
  bubble: "#e9e9eb",
  secondaryText: "#8e8e93",
  placeholder: "#c7c7cc",
  hairline: "rgba(60, 60, 67, 0.13)",
};

function Bubble({
  service,
  code,
  animate,
  dimmed,
  codeLine,
}: {
  service: string;
  code: string;
  animate: boolean;
  dimmed?: boolean;
  codeLine: (service: string) => string;
}) {
  return (
    <div
      key={service}
      className={`rounded-[18px] rounded-bl-[5px] px-3.5 py-2.5 ${!dimmed && animate ? "bubble-in" : ""}`}
      style={{ background: IOS.bubble }}
    >
      <p className="text-[13px] leading-snug text-black">{codeLine(service)}</p>
      <p
        className={`mt-0.5 tracking-[0.14em] text-signal-blue underline decoration-[0.5px] underline-offset-[3px] ${dimmed ? "text-[20px]" : "text-[25px]"}`}
      >
        {!dimmed && animate
          ? code.split("").map((d, i) => (
              <span
                key={`${service}-${i}`}
                className="digit-pop inline-block"
                style={{ animationDelay: `${0.08 * i + 0.15}s` }}
              >
                {d}
              </span>
            ))
          : code}
      </p>
    </div>
  );
}

export function PhoneMock({ locale = "en" }: { locale?: Locale }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [animate, setAnimate] = useState(true);
  const t = PHONE_MOCK[locale];

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
  const prevScene = SCENES[(sceneIdx + SCENES.length - 1) % SCENES.length];

  return (
    <div aria-hidden className="relative mx-auto w-[270px] sm:w-[300px]">
      {/* Signal rings radiating from the phone */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden sm:block">
        {RINGS.map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border-[0.5px]"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderColor: `rgba(0, 113, 227, ${0.18 - i * 0.055})`,
            }}
          />
        ))}
      </div>

      {/* Perspective stage: float wrapper preserves 3D so the tilt reads */}
      <div className="[perspective:1600px]">
        <div className={animate ? "phone-float" : ""}>
          <div className="phone-tilt relative aspect-[71/146] w-full">
            {/* Device thickness: back plate + slabs from -16px up to the front face */}
            <div
              className="absolute inset-0 rounded-[54px]"
              style={{ transform: "translateZ(-16px)", background: "#08090b" }}
            />
            {Array.from({ length: DEPTH_STEPS }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-[54px]"
                style={{
                  transform: `translateZ(${-2 * (i + 1)}px)`,
                  background: "#121316",
                }}
              />
            ))}

            {/* Side buttons on the rails, sunk to mid-thickness */}
            <div
              className="absolute -right-[2px] top-[128px] h-14 w-[3px] rounded-full bg-[#232529]"
              style={{ transform: "translateZ(-8px)" }}
            />
            <div
              className="absolute -left-[2px] top-[96px] h-6 w-[3px] rounded-full bg-[#232529]"
              style={{ transform: "translateZ(-8px)" }}
            />
            <div
              className="absolute -left-[2px] top-[130px] h-10 w-[3px] rounded-full bg-[#232529]"
              style={{ transform: "translateZ(-8px)" }}
            />
            <div
              className="absolute -left-[2px] top-[176px] h-10 w-[3px] rounded-full bg-[#232529]"
              style={{ transform: "translateZ(-8px)" }}
            />

            {/* Front face: metallic rail sheen around the screen */}
            <div
              className="relative flex h-full w-full flex-col rounded-[54px] border-[0.5px] border-black/30 p-[9px]"
              style={{
                background:
                  "linear-gradient(140deg, #3c3f45 0%, #17181b 28%, #0f1012 72%, #2a2d32 100%)",
              }}
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[45px] bg-white">
                {/* Status bar + Messages header share one gray surface */}
                <div
                  className="border-b-[0.5px]"
                  style={{ borderColor: IOS.hairline, background: "#f2f2f7" }}
                >
                  {/* Status bar + Dynamic Island */}
                  <div className="relative flex items-center justify-center pb-1.5 pt-3.5">
                    <div className="absolute left-7 top-3.5 text-[12px] font-medium text-black">
                      9:41
                    </div>
                    <div className="h-6 w-[88px] rounded-full bg-black" />
                    <div className="absolute right-7 top-4 flex items-center gap-[5px]">
                      <div className="flex items-end gap-[2px]">
                        <span className="h-[4px] w-[3px] rounded-[1px] bg-black" />
                        <span className="h-[6px] w-[3px] rounded-[1px] bg-black" />
                        <span className="h-[8px] w-[3px] rounded-[1px] bg-black" />
                      </div>
                      <div className="h-[10px] w-[18px] rounded-[3px] border-[0.5px] border-black/40 p-[1.5px]">
                        <div className="h-full w-[70%] rounded-[1.5px] bg-black" />
                      </div>
                    </div>
                  </div>

                  {/* Conversation header: back button, avatar, sender */}
                  <div className="relative flex flex-col items-center gap-1 px-6 pb-2.5 pt-1">
                    <svg
                      width="11"
                      height="20"
                      viewBox="0 0 11 20"
                      fill="none"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <path
                        d="M9.5 1.5L1.5 10L9.5 18.5"
                        stroke="#0071e3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#a9aeb7] to-[#878c94] text-[16px] font-medium text-white">
                      {scene.service[0]}
                    </div>
                    <div className="flex items-center gap-0.5 text-[11px] text-black">
                      {scene.number}
                      <svg width="7" height="9" viewBox="0 0 7 9" fill="none" className="mt-px">
                        <path d="M1.5 1L5.5 4.5L1.5 8" stroke={IOS.secondaryText} strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 px-4 pb-3 pt-3">
                  <div
                    className="self-center text-[10px]"
                    style={{ color: IOS.secondaryText }}
                  >
                    <span className="font-medium">{t.today}</span> 9:41
                  </div>

                  {/* Previous code, already used */}
                  <div className="max-w-[85%] self-start opacity-60">
                    <Bubble
                      service={prevScene.service}
                      code={prevScene.code}
                      animate={animate}
                      dimmed
                      codeLine={t.codeLine}
                    />
                  </div>

                  <div className="max-w-[85%] self-start">
                    {showBubble ? (
                      <Bubble
                        service={scene.service}
                        code={scene.code}
                        animate={animate}
                        codeLine={t.codeLine}
                      />
                    ) : (
                      <div
                        className="flex w-16 items-center justify-center gap-1.5 rounded-[18px] rounded-bl-[5px] px-4 py-4"
                        style={{ background: IOS.bubble }}
                      >
                        <span className="typing-dot h-1.5 w-1.5 rounded-full" style={{ background: IOS.secondaryText }} />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full" style={{ background: IOS.secondaryText, animationDelay: "0.2s" }} />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full" style={{ background: IOS.secondaryText, animationDelay: "0.4s" }} />
                      </div>
                    )}
                  </div>

                  {/* Keyboard autofill suggestion mirroring iOS one-tap copy */}
                  <div
                    className={`self-start rounded-[10px] px-3 py-1.5 text-[11px] text-signal-blue transition-opacity duration-500 ${showBubble ? "opacity-100" : "opacity-0"}`}
                    style={{ background: "rgba(0, 113, 227, 0.08)" }}
                  >
                    {t.copy(scene.code)}
                  </div>
                </div>

                {/* Message input bar */}
                <div className="flex items-center gap-2 px-3 pb-1.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] leading-none"
                    style={{ background: IOS.bubble, color: IOS.secondaryText }}
                  >
                    +
                  </div>
                  <div
                    className="flex-1 rounded-full border-[0.5px] px-3 py-[5px] text-[12px]"
                    style={{ borderColor: IOS.hairline, color: IOS.placeholder }}
                  >
                    {t.inputPlaceholder}
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2 pt-1">
                  <div className="h-1 w-24 rounded-full bg-black/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
