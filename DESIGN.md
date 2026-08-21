# SMS Code — Style Reference
> The app's palette in the reference system's structure

**Theme:** light

SMS Code's site borrows its *structure* from a light editorial system — flat and
shadowless surfaces, depth built by stacking tinted panels rather than by
elevation, 14px cards, full-pill badges and buttons, and a whisper-weight serif
display over a humanist sans. It borrows none of that system's colour. Every
value below comes from the product itself: `sms-expo/lib/theme.ts` and
`sms-expo/assets/brand-mark.svg`, so the site and the app share one palette.

The page rhythm is a deliberate alternation — canvas, tint, canvas, ink — and the
one dark band per screenful is where the app's own dark-mode screenshots live.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#EFF1F5` | `--color-canvas` | Page background. The app's `bg`, its splash ground and its adaptive-icon ground, all the same value |
| Card | `#FFFFFF` | `--color-card` | White card surfaces. The app's `card` |
| Panel | `#E7EAF1` | `--color-panel` | First tinted step up from the canvas — hero copy column, feature and compare blocks. The app's `cardElevated` |
| Panel Mid | `#DCE7F8` | `--color-panel-mid` | Interpolated mid step, for when a section needs to sit between panel and panel-strong |
| Panel Strong | `#C8DCF7` | `--color-panel-strong` | Heaviest tint — hero product column, stats band, final CTA. The app's `accentSoft`, and the colour of the mark's dots and backdrop bubble |
| Panel Ink | `#23262C` | `--color-panel-ink` | The dark counter-panel: browse band and the product showcase. The app's `ink` |
| Ink | `#23262C` | `--color-ink` | Headings and body text |
| Ink Muted | `#5B6270` | `--color-ink-muted` | Long-form prose and secondary copy — 5.9:1 on canvas, which `--color-muted` is not |
| Muted | `#868C97` | `--color-muted` | Captions, notes, low-emphasis labels only. Never body copy |
| Border | `#E1E4EA` | `--color-border` | Hairline dividers, field edges, the nav outline. The app's `border` |
| Accent | `#59A1FC` | `--color-accent` | Gradient start, focus edges, eyebrow labels on ink. **Never** as text on white — 2.65:1 |
| Accent Deep | `#1E5AA8` | `--color-accent-deep` | The one saturated dark: links, eyebrow labels, stat numerals, the FAQ marker |
| Accent Dark | `#276CC5` | `--color-accent-dark` | Gradient end. The mark's own right-hand stop |

### The gradient

The mark's bubble runs `#59A1FC → #276CC5`, and that is the gradient for
decorative fills.

Filled CTAs use the **darker half of the same ramp**: `linear-gradient(90deg,
#276CC5, #1E5AA8)`. The app fills its buttons with the lighter pair via
`components/GradientFill.tsx`, but white on `#59A1FC` is 2.65:1 and the app's
gradient tops out near 4:1 — both under AA for 14px text, on the single most
important element on the page. The darker pair reads as the same blue and
measures 5.3:1 to 9.7:1. If exact parity with the app's button colour ever
matters more than the contrast, it is one line in `.cta-pill`.

## Tokens — Typography

### Cormorant Garamond — display serif for h1 and h2 · `--font-display`
- **Weights:** 300 only. Never bold the serif.
- **Subsets:** latin **and cyrillic** — the RU pages carry the same headline voice.
- **Role:** h1 and h2, plus stat numerals and FAQ questions. Applied globally to
  `h1, h2` in the base layer, so pages don't opt in one heading at a time.
- **Not** h3 and below: at 18px and under, weight 300 Cormorant turns spindly.
  Those stay on the sans. The rule is about *size*, not tag — an `h2` that sits
  at `text-subheading` (Legal, Support, AlternativePage) carries
  `font-sans font-medium` to opt out, rather than being demoted to `h3` and
  breaking the document outline.

### Inter — everything else · `--font-sans`
- **Weights:** 400, 500, 600
- **Role:** body, navigation, UI labels, buttons, captions, h3 and below

### Type Scale

| Role | Size | Line height | Tracking | Token |
|------|------|-------------|----------|-------|
| caption | 11px | 1.5 | — | `--text-caption` |
| label | 13px | 1.45 | — | `--text-label` |
| body | 14px | 1.5 | — | `--text-body` |
| prose | 16px | 1.6 | — | `--text-prose` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 23px | 1.35 | — | `--text-heading-sm` |
| heading | clamp(30–40px) | 1.15 | -0.01em | `--text-heading` |
| heading-lg | clamp(38–56px) | 1.12 | -0.03em | `--text-heading-lg` |
| display | clamp(44–74px) | 1.05 | -0.03em | `--text-display` |

Long-form prose (blog posts, legal pages) uses 16px rather than the 14px body
step — 14px over 60+ character lines is uncomfortable to read.

## Tokens — Shapes

| Element | Value | Token |
|---------|-------|-------|
| nav | 7px | `--radius-nav` |
| cards, panels, fields | 14px | `--radius-card` |
| badges, buttons, chips | 999px | `--radius-pill` |

**Elevation: none.** No `box-shadow` anywhere. Depth is the layer stack —
canvas → card → panel → panel-strong → panel-ink — and nothing else. (The app
does carry a whisper shadow in light mode; the site deliberately does not.)

## Components

All defined in `app/globals.css`.

### `.card`
White, 14px radius, `clamp(24px, 3vw, 36px)` padding, no border, no shadow.
Separation from the canvas comes from the fill alone.

### `.panel` / `.panel--strong` / `.panel--ink`
Tinted block, 14px radius, `clamp(28px, 4vw, 42px)` padding. `--strong` steps up
to `#C8DCF7`; `--ink` goes to `#23262C` with canvas-coloured text.

### `.cta-pill` / `.cta-pill--dark`
The primary CTA: brand gradient, white text, full pill, 13/24 padding, brightness
lift on hover. `--dark` inverts to a white pill for use on `.panel--ink`.

### `.tag-chip`
`#C8DCF7` fill, `#1E5AA8` text, full pill, 4/12 padding, 12px/500.

### `.section-label`
The eyebrow. Inter 11px/600, uppercase, 0.08em tracking, `--color-accent-deep`.
The only uppercase treatment in the system — nowhere else.

### `.blue-link`
`--color-accent-deep`, 1px transparent bottom border that fills on hover.

### `.field`
White, 1px `--color-border`, 14px radius, accent border on focus.

## Motion

Every animation is defined once in `globals.css` and every one is disabled under
`prefers-reduced-motion: reduce`:

- `hero-rise` — hero panels enter on a 0.7s cubic-bezier, the product column
  delayed 0.12s
- `marquee` — 38s linear coverage strip

That is the whole list. The hero device is static and centred in its panel — it
does not bob.

Transitions elsewhere are 150ms ease on colour, border-colour or brightness only.

## Layout

Max-width 1200px, `clamp(20px, 4vw, 34px)` gutters, 94px between sections.

The home page rhythm, in order:

canvas hero (panel + panel-strong, `min-h` 82vh capped at 780px) → canvas
coverage marquee → panel-strong stats → canvas how-it-works (3 cards) → panel
features → **ink** browse band → canvas pricing → **ink** product showcase →
canvas use-cases → panel compare → canvas FAQ → canvas blog → panel-strong final
CTA → ink footer.

The two full-bleed bands use `mx-[calc(50%-50vw)] w-screen` against
`body { overflow-x: clip }` — that clip is what stops the 100vw width (which
includes the scrollbar) from producing a horizontal scrollbar.

## Imagery

Product-first and UI-native. The hero and the showcase use the real App Store
screenshots, exported without a background so the device floats on whatever
panel it lands on — `public/app/*.png`, rendered through `components/AppShot.tsx`.
No lifestyle photography, no stock. Service logos are the brands' own SVGs in
`public/services/`, shown bare on the coverage marquee rather than boxed.

## Do's and Don'ts

### Do
- Take colours from `sms-expo/lib/theme.ts`. It is the source of truth; this file mirrors it
- Use the gradient for every filled CTA, and `#1E5AA8` for every link and eyebrow
- Layer canvas → card → panel → panel-strong → panel-ink to build depth
- Keep 14px on cards and panels, 999px on badges and buttons
- Give every dark band a job: it exists to hold the app's dark-mode screens

### Don't
- Never put `#59A1FC` on white as text — it fails contrast. That is what `--color-accent-deep` is for
- Never add `box-shadow`. Depth is the layer stack
- Don't bold the serif, and don't set h3 or smaller in it
- Don't use `--color-muted` for body copy — it is a caption colour
- Don't introduce a hue outside the blue ramp; the mark has exactly three colours
- Don't put the uppercase 0.08em treatment anywhere but eyebrow labels
