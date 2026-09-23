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
| Panel Deep | `#A9C9F3` | `--color-panel-deep` | Deepest tint, the top of the how-it-works step ramp. `#1E5AA8` fails AA on it, so labels here go ink |
| Panel Strong | `#C8DCF7` | `--color-panel-strong` | Heaviest tint — hero product column, stats band, final CTA. The app's `accentSoft`, and the colour of the mark's dots and backdrop bubble |
| Panel Ink | `#23262C` | `--color-panel-ink` | The dark counter-panel: browse band and the product showcase. The app's `ink` |
| Ink | `#23262C` | `--color-ink` | Headings and body text |
| Ink Muted | `#5B6270` | `--color-ink-muted` | Long-form prose and secondary copy — 5.9:1 on canvas, which `--color-muted` is not |
| Muted | `#868C97` | `--color-muted` | Captions, notes, low-emphasis labels only. Never body copy |
| Border | `#E1E4EA` | `--color-border` | Hairline dividers, field edges, the nav's dropdown panels. The app's `border` |
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
matters more than the contrast, it is one line in `.cta`.

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
| nav bar, cards, panels, fields | 14px | `--radius-card` |
| buttons | 12px | `--radius-button` |
| badges and chips | 999px | `--radius-pill` |

Three radii, two of them within two pixels of each other. Buttons used to be
full pills and the nav bar used to be 7px with a hairline outline of its own;
the bar now carries the same 14px as every card and panel, so it reads as one
more of the site's surfaces rather than a separate piece of chrome, and buttons
sit a step tighter at 12px — an action is a smaller, harder object than the
surface holding it, and the nav CTA never out-curves the bar it sits in. The
pill is kept for what a pill is actually for — a label you read, not a target
you press.

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

### `.cta` / `.cta--dark` / `.cta--sm`
The primary CTA: brand gradient, white text, 12px radius, 13/24 padding,
brightness lift on hover. `--dark` inverts to a white fill for use on
`.panel--ink`. `--sm` drops to 13px/9-18 for the nav bar, whose 11px vertical
padding cannot hold the full-size button.

### `.hero-cta-card` / `.hero-cta-arrow`
The hero's action, as a card of its own under the copy panel rather than a
button inside it — so the panel carries the argument and the card carries the one
action, and the target is the full column width. `.panel--ink` fill, because a
second tinted panel under the first would read as one continued surface.
Right-aligned 46px outline arrow that shifts 4px on hover; the card lightens to
`#2D3138`. Lives in `components/HeroCta.tsx`.

### `.tag-chip`
`#C8DCF7` fill, `#1E5AA8` text, full pill, 4/12 padding, 12px/500.

### `.section-label`
The eyebrow. Inter 11px/600, uppercase, 0.08em tracking, `--color-accent-deep`.
The only uppercase treatment in the system — nowhere else.

### `.blue-link` / `.blue-link--ink`
`--color-accent-deep`, 1px transparent bottom border that fills on hover.
`--ink` swaps the colour to `--color-accent` for use on `.panel--ink`, where
accent-deep drops to 2.2:1 and the light accent measures 5.3:1.

### `.field`
White, 1px `--color-border`, 14px radius, accent border on focus.

### `.logo-strip` / `.logo-chip`
The coverage marquee. `.logo-strip` masks its own edges with a horizontal
`transparent → opaque → transparent` gradient, so logos rise out of the canvas
and sink back into it rather than being cut off — a mask, not two overlay
gradients, so it survives whatever the band behind it is filled with.

`.logo-chip` renders one 52px logo twice: the glyph's own alpha masks a flat
`#AAB0BC`, and the real SVG sits above it at `opacity: 0`. Hover crossfades the
two over 200ms and pauses the track. One grey rather than 33 brand colours —
the strip is a texture at rest and a set of recognisable marks when you reach
for one. Under `hover: none` the real logos show by default, since a touch
device would otherwise never see past the tint.

## Motion

Every animation is defined once in `globals.css` and every one is disabled under
`prefers-reduced-motion: reduce`:

- `hero-rise` — hero panels enter on a 0.7s cubic-bezier, the product column
  delayed 0.12s
- `marquee` — 38s linear coverage strip

That is the whole list. The hero device is static and centred in its panel — it
does not bob.

Transitions elsewhere are 150ms ease on colour, border-colour or brightness
only — with one 200ms exception, the coverage logos' tint-to-colour crossfade.

## Layout

Max-width 1200px, `clamp(20px, 4vw, 34px)` gutters, 94px between sections.

The home page rhythm, in order:

canvas hero (left column = `panel` copy + `.hero-cta-card`, stacked with a 22px
gap; right column = one full-height `panel--strong` holding the device;
`min-h` 82vh capped at 780px) →
panel-strong stats → canvas how-it-works (three cards walking the tint ramp
panel-deep → panel-strong → panel) → canvas coverage marquee → panel features →
canvas pricing → **ink** product showcase → panel browse band → canvas
use-cases → panel compare → canvas FAQ → canvas blog → panel-strong final CTA →
ink footer.

The product showcase is the page's only dark band, which is the point: it is
where the app's dark-mode screens live. The only panel-strong full-bleed is the
final CTA, so the heaviest tint reads as the page's closing note.

The nav sits in that same `max-w-[1200px]` container with the same gutters, so
the bar's edges land on the hero panels' edges. It is sticky, and the header
around it paints nothing — only the bar itself is opaque, so the page runs under
it rather than behind a canvas-filled band. Its gutters are click-through
(`pointer-events-none` on the header, handed back on the bar). Logo left, links
centre (`lg` and up; a dropdown panel below that), language switcher and a
`.cta--sm` right.

The two full-bleed bands use `mx-[calc(50%-50vw)] w-screen` against
`body { overflow-x: clip }` — that clip is what stops the 100vw width (which
includes the scrollbar) from producing a horizontal scrollbar.

## Imagery

Product-first and UI-native. The hero and the showcase use the real App Store
screenshots, exported without a background so the device floats on whatever
panel it lands on — `public/app/*.png`, rendered through `components/AppShot.tsx`.
No lifestyle photography, no stock. Service logos are the brands' own SVGs in
`public/services/`, shown bare on the coverage marquee rather than boxed — and
they are the real marks, Google's four-colour G and Instagram's gradient camera
included, not flattened one-colour stand-ins. The marquee greys them at rest
(see `.logo-chip`); the file on disk stays true to the brand.

## Do's and Don'ts

### Do
- Take colours from `sms-expo/lib/theme.ts`. It is the source of truth; this file mirrors it
- Use the gradient for every filled CTA, and `#1E5AA8` for every link and eyebrow
- Layer canvas → card → panel → panel-strong → panel-ink to build depth
- Keep 14px on the nav bar, cards, panels and fields, 12px on buttons, 999px on badges and chips
- Give every dark band a job: it exists to hold the app's dark-mode screens

### Don't
- Never put `#59A1FC` on white as text — it fails contrast. That is what `--color-accent-deep` is for
- Never add `box-shadow`. Depth is the layer stack
- Don't bold the serif, and don't set h3 or smaller in it
- Don't use `--color-muted` for body copy — it is a caption colour
- Don't introduce a hue outside the blue ramp; the mark has exactly three colours
- Don't put the uppercase 0.08em treatment anywhere but eyebrow labels
