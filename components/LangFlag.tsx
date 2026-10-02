import type { Locale } from "../lib/i18n";

/*
 * Round flag for the language switcher. Inline SVG rather than emoji: Windows
 * renders flag emoji as two bare letters. The circle comes from the wrapper's
 * radius instead of a clipPath, so repeated flags on one page never collide on
 * an id. The inset ring keeps the white bands from dissolving into the white
 * nav bar.
 */

const US_STRIPE = 24 / 13;

function Us() {
  return (
    <>
      <rect width="24" height="24" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={i * US_STRIPE} width="24" height={US_STRIPE} fill="#fff" />
      ))}
      <rect width="12" height={7 * US_STRIPE} fill="#3C3B6E" />
      {[2.4, 6, 9.6].flatMap((x) =>
        [2.6, 6.4, 10.2].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.85" fill="#fff" />
        )),
      )}
    </>
  );
}

function Ru() {
  return (
    <>
      <rect width="24" height="8" fill="#fff" />
      <rect y="8" width="24" height="8" fill="#0039A6" />
      <rect y="16" width="24" height="8" fill="#D52B1E" />
    </>
  );
}

const FLAGS: Record<Locale, () => React.ReactElement> = { en: Us, ru: Ru };

export function LangFlag({
  locale,
  className = "h-[18px] w-[18px]",
}: {
  locale: Locale;
  className?: string;
}) {
  const Flag = FLAGS[locale];
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
        <Flag />
      </svg>
      <span className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(28,31,37,0.12)]" />
    </span>
  );
}
