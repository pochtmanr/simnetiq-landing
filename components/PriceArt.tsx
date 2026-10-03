import { CoinIcon } from "./CoinChip";

/*
 * Pricing card pictures: three small looping scenes, one per pricing fact,
 * built from white app-style slips on the card's painted background. They
 * carry no words — logos, ISO codes and numbers only — so they need no copy
 * in any locale. Every loop is CSS, paused until PlayWhenVisible marks the
 * section as on screen. Decorative: the fact's own title and body say it.
 *
 * Coin figures are illustrative, chosen to match the copy: 20 is the floor,
 * a messenger around 35, high-demand services in the hundreds.
 */

const coin = "h-[14px] w-[14px] shrink-0";

/* Fact 1 — "from 20 coins, but the service sets the price": a ticker of
   services, each with its own price, over a floor badge. */
const TICKER = [
  { slug: "telegram", name: "Telegram", price: 35 },
  { slug: "google", name: "Google", price: 90 },
  { slug: "tinder", name: "Tinder", price: 260 },
  { slug: "viber", name: "Viber", price: 20 },
] as const;

function ServiceTicker() {
  const rows = [...TICKER, TICKER[0]];
  return (
    <div className="flex w-full max-w-[230px] flex-col items-center gap-[10px]">
      <div className="price-slip price-ticker">
        <div className="price-ticker__list">
          {rows.map((r, i) => (
            <div key={i} className="price-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/services/${r.slug}.svg`} alt="" className="price-row__logo" />
              <span className="flex-1 truncate text-label font-medium text-ink">{r.name}</span>
              <span className="price-row__price figures" dir="ltr">
                <CoinIcon className={coin} />
                {r.price}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="price-floor figures" dir="ltr">
        <CoinIcon className={coin} />
        20+
      </span>
    </div>
  );
}

/* Fact 2 — "the price before you confirm": a country list with prices, the
   selection stepping down it, then the confirm button lighting up. */
const COUNTRIES = [
  { code: "GB", price: 42 },
  { code: "US", price: 55 },
  { code: "DE", price: 38 },
] as const;

function CountryPicker() {
  return (
    <div className="flex w-full max-w-[230px] flex-col gap-[10px]">
      <div className="price-slip price-picker">
        <span className="price-picker__sel" />
        {COUNTRIES.map((c) => (
          <div key={c.code} className="price-row">
            <span className="price-row__iso">{c.code}</span>
            <span className="price-row__bar" />
            <span className="price-row__price figures" dir="ltr">
              <CoinIcon className={coin} />
              {c.price}
            </span>
          </div>
        ))}
      </div>
      <span className="price-confirm">
        <svg viewBox="0 0 16 16" className="h-[16px] w-[16px]" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

/* Fact 3 — "no code, coins back": the wait runs out on a ring, the coins fly
   back, and the balance ticks up. */
function CoinsBack() {
  return (
    <div className="price-refund" dir="ltr">
      <span className="price-refund__ring">
        {/* Sized by .price-refund__ring > svg (inset by the ring's padding);
            no h-full/w-full here, which would override that and push the
            arc off the disc's centre. */}
        <svg viewBox="0 0 44 44" className="-rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(28,31,37,0.1)" strokeWidth="4" />
          <circle
            className="price-refund__arc"
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
          />
        </svg>
        <svg viewBox="0 0 24 24" className="price-refund__x" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
        </svg>
      </span>
      {/* The coins fly along the gap between the ring and the balance, so
          their path follows the layout instead of fixed pixel offsets. */}
      <span className="price-refund__track">
        {[0, 1, 2].map((i) => (
          <span key={i} className="price-refund__coin" style={{ animationDelay: `${i * 0.12}s` }}>
            <CoinIcon className="block h-[18px] w-[18px]" />
          </span>
        ))}
      </span>
      <span className="price-slip price-balance figures">
        <CoinIcon className="h-[16px] w-[16px] shrink-0" />
        <span className="price-balance__num">
          <span className="price-balance__old">120</span>
          <span className="price-balance__new">155</span>
        </span>
      </span>
    </div>
  );
}

export const PRICE_ART = [ServiceTicker, CountryPicker, CoinsBack];

/* Icon badges for the same three facts: a price tag, an eye on the price,
   and a return arrow. */
export const PRICE_ICONS = [
  <path key="tag" d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Zm4.5-4.5h.01" strokeLinecap="round" strokeLinejoin="round" />,
  <g key="eye" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </g>,
  <g key="back" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </g>,
];
