/*
 * Coin-pack chip for the pricing section. Each pack gets a metal tier —
 * bronze up to diamond — so the row reads as "bigger pack, richer coin"
 * without printing prices, which the App Store sets per region anyway.
 *
 * One flat SVG coin serves every tier: its fills come from the --coin-base /
 * --coin-dark vars that the .coin-chip--{tier} class sets.
 */

export type CoinTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="coin-chip__coin h-[20px] w-[20px] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" style={{ fill: "var(--coin-base)" }} />
      <circle
        cx="12"
        cy="12"
        r="7.5"
        fill="none"
        strokeWidth="1.6"
        style={{ stroke: "var(--coin-dark)" }}
        opacity="0.5"
      />
    </svg>
  );
}

export function CoinChip({
  amount,
  unit,
  tier,
}: {
  amount: string;
  unit: string;
  tier: CoinTier;
}) {
  return (
    <span className={`coin-chip coin-chip--${tier}`}>
      <CoinIcon />
      <span className="font-medium text-ink">{amount}</span>
      <span className="text-ink-muted">{unit}</span>
    </span>
  );
}
