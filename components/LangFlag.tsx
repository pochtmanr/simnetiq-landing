import type { Locale } from "../lib/i18n";

/*
 * Round flag for the language switcher. Inline SVG rather than emoji: Windows
 * renders flag emoji as two bare letters. The circle comes from the wrapper's
 * radius instead of a clipPath, so repeated flags on one page never collide on
 * an id. The inset ring keeps the white bands from dissolving into the white
 * nav bar.
 *
 * Each language is drawn as the country people already associate with it:
 * Brazil for Portuguese (pt-BR), Saudi Arabia for Arabic. Detail is only what
 * still reads inside an 18px circle.
 */

const US_STRIPE = 24 / 13;

function Star({
  cx,
  cy,
  r,
  fill,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  rotate?: number;
}) {
  return (
    <path
      fill={fill}
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${r})`}
      d="M0-1 .22-.31 .95-.31 .36.12 .59.81 0 .38-.59.81-.36.12-.95-.31-.22-.31Z"
    />
  );
}

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

function Cn() {
  return (
    <>
      <rect width="24" height="24" fill="#DE2910" />
      <Star cx={6.2} cy={6.2} r={3.1} fill="#FFDE00" />
      <Star cx={11.4} cy={2.7} r={1.05} fill="#FFDE00" rotate={20} />
      <Star cx={13.3} cy={5.2} r={1.05} fill="#FFDE00" rotate={45} />
      <Star cx={13.1} cy={8.2} r={1.05} fill="#FFDE00" rotate={70} />
      <Star cx={11} cy={10.4} r={1.05} fill="#FFDE00" rotate={20} />
    </>
  );
}

function In() {
  return (
    <>
      <rect width="24" height="8" fill="#FF9933" />
      <rect y="8" width="24" height="8" fill="#fff" />
      <rect y="16" width="24" height="8" fill="#138808" />
      <circle cx="12" cy="12" r="3.15" fill="none" stroke="#000080" strokeWidth="0.7" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 1.15}
            y1={12 + Math.sin(a) * 1.15}
            x2={12 + Math.cos(a) * 3.05}
            y2={12 + Math.sin(a) * 3.05}
            stroke="#000080"
            strokeWidth="0.45"
          />
        );
      })}
      <circle cx="12" cy="12" r="0.7" fill="#000080" />
    </>
  );
}

function Es() {
  return (
    <>
      <rect width="24" height="6" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
      <rect y="18" width="24" height="6" fill="#AA151B" />
    </>
  );
}

function Br() {
  return (
    <>
      <rect width="24" height="24" fill="#009C3B" />
      <polygon points="12,3.2 21.2,12 12,20.8 2.8,12" fill="#FFDF00" />
      <circle cx="12" cy="12" r="4.15" fill="#002776" />
    </>
  );
}

function Id() {
  return (
    <>
      <rect width="24" height="12" fill="#CE1126" />
      <rect y="12" width="24" height="12" fill="#fff" />
    </>
  );
}

function Sa() {
  return (
    <>
      <rect width="24" height="24" fill="#006C35" />
      <path
        d="M5.2 9.2h13.6"
        stroke="#fff"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M5.4 14.8c3.2-.9 7.4-1 11.4.5"
        stroke="#fff"
        strokeWidth="1.15"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M16.6 13.6l2.1 1.7-1.5.15z" fill="#fff" />
    </>
  );
}

function Fr() {
  return (
    <>
      <rect width="8" height="24" fill="#0055A4" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#EF4135" />
    </>
  );
}

function Tr() {
  return (
    <>
      <rect width="24" height="24" fill="#E30A17" />
      <circle cx="9.6" cy="12" r="6" fill="#fff" />
      <circle cx="11.3" cy="12" r="4.75" fill="#E30A17" />
      <Star cx={16.4} cy={12} r={2.35} fill="#fff" />
    </>
  );
}

const FLAGS: Record<Locale, () => React.ReactElement> = {
  en: Us,
  ru: Ru,
  zh: Cn,
  hi: In,
  es: Es,
  pt: Br,
  id: Id,
  ar: Sa,
  fr: Fr,
  tr: Tr,
};

function Code({ locale }: { locale: string }) {
  return (
    <>
      <rect width="24" height="24" fill="#E4E8EF" />
      <text
        x="12"
        y="12"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#23262C"
      >
        {locale.toUpperCase()}
      </text>
    </>
  );
}

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
        {Flag ? <Flag /> : <Code locale={locale} />}
      </svg>
      <span className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(28,31,37,0.12)]" />
    </span>
  );
}
