import Image from "next/image";
import { PhoneMock } from "../components/PhoneMock";

const APP_STORE_URL = "https://apps.apple.com/us/app/sms-activate/id6768591062";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.theholylabs.esim";
const SUPPORT_EMAIL = "dima@holylabs.net";

const SERVICES = [
  "telegram", "whatsapp", "google", "instagram", "facebook", "tiktok",
  "discord", "tinder", "snapchat", "apple", "netflix", "paypal",
  "uber", "steam", "viber", "signal", "twitter", "aliexpress",
  "wechat", "line", "airbnb", "grab", "vkcom", "adidas", "cursor",
] as const;

const STEPS = [
  {
    title: "Pick a service and a country",
    body: "Choose what you're signing up for — Telegram, WhatsApp, Google, 35+ services — and where the number should be from.",
  },
  {
    title: "Get a real number instantly",
    body: "The app hands you a live virtual number. Paste it into the sign-up form like any other phone number.",
  },
  {
    title: "The code lands in the app",
    body: "The verification SMS shows up on screen within seconds. Tap once to copy the code, finish the sign-up, done.",
  },
];

const FEATURES = [
  {
    title: "Your real number stays yours",
    body: "Sign up for anything without handing your personal number to one more database, mailing list, or data breach.",
  },
  {
    title: "35+ services, 50+ countries",
    body: "From Telegram and WhatsApp to Steam and Tinder — with numbers from Europe, Asia, the Americas and more.",
  },
  {
    title: "Codes in seconds, not minutes",
    body: "Numbers are live the moment you get them. The SMS appears right in the app with one-tap copy.",
  },
  {
    title: "Pay per code, no subscription",
    body: "Buy a pack of activations once and spend them whenever. No monthly plan, no auto-renew, credits don't expire.",
  },
  {
    title: "No SIM, no eSIM, no contracts",
    body: "Nothing to install in your phone's settings and nothing tied to your identity. Just open the app.",
  },
  {
    title: "Cancel pending numbers anytime",
    body: "If a number doesn't fit, cancel the pending activation right from the app and grab a different one.",
  },
];

const PACKS = [
  { name: "Try it", credits: "1", label: "activation", note: "One sign-up, one code. Perfect first test." },
  { name: "Regular", credits: "5", label: "activations", note: "For a batch of accounts or ongoing testing.", featured: true },
  { name: "Power", credits: "10", label: "activations", note: "Best value per code for heavy users." },
];

const FAQ = [
  {
    q: "What exactly is a virtual number?",
    a: "A real phone number that exists on a carrier network but isn't tied to a SIM card in your pocket. It can receive SMS like any other number — you use it for the verification step, and your personal number never enters the picture.",
  },
  {
    q: "How fast does the code arrive?",
    a: "Usually within seconds of the service sending it. The activation screen updates live, so you'll see the SMS text and the code the moment it lands.",
  },
  {
    q: "Which services can I verify?",
    a: "35+ popular services including Telegram, WhatsApp, Google, Instagram, Facebook, TikTok, Discord, Tinder, Steam, PayPal and more — each with its own list of available countries.",
  },
  {
    q: "What if the code never arrives?",
    a: "You can cancel a pending activation directly in the app and take another number or try a different country. Support is one email away if anything looks off.",
  },
  {
    q: "Do my credits expire?",
    a: "No. Activation packs are one-time purchases, not subscriptions — unused activations stay on your balance until you spend them, and restore across devices with your store account.",
  },
  {
    q: "Is this legal to use?",
    a: "Yes — receiving SMS on a virtual number is a standard tool for privacy, QA and development. You're responsible for complying with the terms of the services you sign up for.",
  },
];

function AppStoreBadge() {
  return (
    <a
      href={APP_STORE_URL}
      className="flex h-14 items-center gap-3 rounded-2xl bg-ink px-5 text-white transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          Download on the
        </span>
        <span className="block text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  );
}

function PlayBadge() {
  return (
    <a
      href={PLAY_STORE_URL}
      className="flex h-14 items-center gap-3 rounded-2xl bg-ink px-5 text-white transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path fill="#00E3A0" d="M3.6 1.8 13.7 12 3.6 22.2c-.37-.2-.6-.6-.6-1.1V2.9c0-.5.23-.9.6-1.1z" />
        <path fill="#FFCF48" d="m17.3 8.4-3.6 3.6-10.1-10.2c.16-.09.5-.13.86.07l12.84 6.53z" />
        <path fill="#FF5C71" d="m17.3 15.6-12.84 6.53c-.36.2-.7.16-.86.07L13.7 12l3.6 3.6z" />
        <path fill="#3CB8FF" d="m17.3 8.4 3.5 1.78c1 .51 1 1.13 0 1.64l-3.5 1.78L13.7 12l3.6-3.6z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          Get it on
        </span>
        <span className="block text-lg font-semibold -mt-0.5">Google Play</span>
      </span>
    </a>
  );
}

function ServiceTile({ slug }: { slug: string }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
      <img src={`/services/${slug}.svg`} alt={slug} className="h-8 w-8" loading="lazy" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="SMS Activate app icon"
            width={40}
            height={40}
            className="rounded-xl shadow-sm"
          />
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-display)] text-base font-bold">
              SMS Activate
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              by SimNetIQ
            </div>
          </div>
        </div>
        <a
          href={APP_STORE_URL}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-deep"
        >
          Get the app
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-accent-deep">
            Virtual numbers · SMS verification
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[2.6rem] font-bold leading-[1.05] sm:text-6xl">
            A number for the sign&#8209;up.
            <br />
            <span className="text-accent">Not for life.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            SMS Activate gives you a real virtual number in 50+ countries and
            shows the verification code in seconds — so Telegram, WhatsApp,
            Google and 35+ other services never learn your personal number.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AppStoreBadge />
            <PlayBadge />
          </div>
          <p className="mt-4 text-sm text-muted">
            Live on both stores · one-time credit packs, no subscription
          </p>
        </div>
        <PhoneMock />
      </section>

      {/* Services marquee */}
      <section className="border-y border-ink/5 bg-card/60 py-10">
        <p className="mb-6 text-center font-mono text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Works with the sign-ups you actually do
        </p>
        <div className="overflow-hidden" aria-hidden>
          <div className="marquee-track flex gap-4 px-4">
            {[...SERVICES, ...SERVICES].map((slug, i) => (
              <ServiceTile key={`${slug}-${i}`} slug={slug} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          Three steps, about thirty seconds
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-3xl bg-card p-8 shadow-sm">
              <div className="font-mono text-sm font-semibold text-accent-deep">
                Step {i + 1}
              </div>
              <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Built for people who guard their number
          </h2>
          <p className="mt-4 max-w-xl text-white/60">
            Developers testing sign-up flows, marketers running accounts,
            and anyone tired of "enter your phone number to continue."
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7"
              >
                <h3 className="text-lg font-bold text-accent-soft">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          Pay for codes, not for a plan
        </h2>
        <p className="mt-4 max-w-xl text-ink/70">
          Credits are one-time in-app purchases. Spend one credit per
          activation, whenever you need it — this month or next year.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PACKS.map((pack) => (
            <div
              key={pack.name}
              className={`rounded-3xl p-8 shadow-sm ${
                pack.featured
                  ? "bg-plum text-white shadow-[0_24px_48px_-16px_rgba(92,75,182,0.5)]"
                  : "bg-card"
              }`}
            >
              <div
                className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${
                  pack.featured ? "text-white/70" : "text-muted"
                }`}
              >
                {pack.name}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-5xl font-bold">
                  {pack.credits}
                </span>
                <span className={pack.featured ? "text-white/70" : "text-muted"}>
                  {pack.label}
                </span>
              </div>
              <p
                className={`mt-4 text-[15px] leading-relaxed ${
                  pack.featured ? "text-white/80" : "text-ink/70"
                }`}
              >
                {pack.note}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Current pack prices are shown in the app — they vary by store and region.
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
          Questions, answered
        </h2>
        <div className="mt-10 flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl bg-card px-6 py-5 shadow-sm open:pb-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-accent-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-[2.5rem] bg-accent px-8 py-16 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold sm:text-4xl">
            Your next sign-up doesn't need your real number
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AppStoreBadge />
            <PlayBadge />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/5 bg-card/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
            />
            <span>SMS Activate · SIMNETIQ LTD</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-ink">
              Support
            </a>
            <a
              href="https://www.roamjet.net/privacy-policy"
              className="hover:text-ink"
            >
              Privacy policy
            </a>
            <a
              href="https://www.roamjet.net/terms-of-service"
              className="hover:text-ink"
            >
              Terms of service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
