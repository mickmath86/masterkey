# MasterKey / Mathias Real Estate Group — Design System Reference

> This file documents the visual brand system extracted from the live site (`mathiasregroup.com`). Use it as the single source of truth when building slide decks, reports, or any new UI that needs to match the site's look and feel.

---

## Brand Identity

| Property | Value |
|---|---|
| **Brand name** | MasterKey / Mathias Real Estate Group |
| **Primary domain** | mathiasregroup.com |
| **Tagline territory** | Expert agents + cutting-edge technology |
| **Primary markets** | Thousand Oaks · Newbury Park · Ventura · Camarillo · Westlake Village · Oxnard |
| **DRE (Mike)** | 01892427 |
| **DRE (Mark)** | 01921484 |
| **Phone** | 805.262.9707 |
| **Address** | 1000 Business Center Circle #112, Thousand Oaks, CA |

---

## Color Palette

### Background Tiers (Dark Mode — primary aesthetic for lead pages)

| Role | Tailwind Class | Approx Hex | Notes |
|---|---|---|---|
| Page background (darkest) | `bg-gray-950` | `#030712` | Used on hero sections of buyerguide, sellguide, rent-vs-sell |
| Surface / card | `bg-white/5` | semi-transparent white | Form cards on dark bg |
| Border | `border-white/10` | ~10% white | Subtle separator on dark |
| Input background | `bg-white/10` | ~10% white | Dark mode form fields |
| Input border | `border-white/20` | ~20% white | Resting state |

### Background Tiers (Light Mode — used in body sections and reports)

| Role | Tailwind Class | Approx Hex |
|---|---|---|
| Page background | `bg-white` | `#ffffff` |
| Subtle section | `bg-gray-50` | `#f9fafb` |
| Card background | `bg-white` | `#ffffff` |
| Card border | `border-gray-100` | `#f3f4f6` |

### Accent Colors (by feature/tool)

| Context | Primary Accent | Highlight |
|---|---|---|
| **Sellguide / Seller tools** | `orange-500` (`#f97316`) | `orange-400` hover |
| **Buyerguide / Buyer tools** | `green-500` (`#22c55e`) | `green-400` hover |
| **Rent-vs-Sell / Financial** | `blue-600` (`#2563eb`) | `blue-500` hover |
| **MarketPulse dashboard** | `green-400` / `green-600` | conditional: `red-500` |
| **Market balance — Buyer's** | `orange-600` | `bg-orange-50` |
| **Error / validation** | `red-400` | `red-400` text |
| **Warning / amber** | `amber-400` | `amber-100` bg |

### Key Color Values for Slide Decks

```
Background dark:      #030712  (gray-950)
Background mid-dark:  #111827  (gray-900)
Surface on dark:      rgba(255,255,255,0.05)
Primary orange:       #f97316  (orange-500)
Primary green:        #22c55e  (green-500)
Primary blue:         #2563eb  (blue-600)
White text:           #ffffff
Muted white text:     rgba(255,255,255,0.60)
Label/caption text:   rgba(255,255,255,0.40)
Border on dark:       rgba(255,255,255,0.10)
Light page bg:        #ffffff
Light body text:      #030712  (gray-950)
Light muted text:     #6b7280  (gray-500)
Light card border:    #f3f4f6  (gray-100)
```

---

## Typography

### Font Family
- **Primary font:** `Switzer` (loaded via `@theme { --font-sans: Switzer, system-ui, sans-serif; }`)
- **Fallback:** `system-ui`, `sans-serif`
- Switzer is a geometric grotesque — clean, modern, slightly techy feel

### Type Scale (Tailwind classes used across key pages)

| Element | Tailwind | Size | Weight |
|---|---|---|---|
| Hero headline (H1) | `text-4xl sm:text-5xl font-bold` | 36–48px | 700 |
| Section headline (H2) | `text-2xl sm:text-3xl font-bold` | 24–30px | 700 |
| Card title / H3 | `text-xl font-bold` or `text-base font-semibold` | 16–20px | 600–700 |
| Body / paragraph | `text-sm` or `text-base` | 14–16px | 400 |
| Caption / label | `text-xs` | 12px | 400–500 |
| Overline / eyebrow | `text-xs font-semibold uppercase tracking-widest` | 12px | 600 |
| Stat / metric number | `text-5xl font-bold` or `text-3xl font-bold` | 30–48px | 700 |

### Type Rules
- Hero headlines: `leading-tight` — tight line height
- Body copy: `leading-relaxed` — comfortable reading
- Eyebrow labels above headlines: `uppercase tracking-widest text-xs font-semibold` + accent color (e.g. `text-orange-500` or `text-green-400`)
- Numbers / stats: always `font-bold`, accent color when positive/negative

---

## Spacing & Layout

### Container / Max-width
- Content max width: `max-w-4xl` (56rem) on most pages
- Narrow content: `max-w-md` (28rem) for forms
- Wide layout: `max-w-7xl` for full-page dashboards
- Padding: `px-6 lg:px-12` or `px-4`

### Section Rhythm
- Hero section padding: `pb-0` (runs into next section)
- Section padding: `py-16` or `py-24 sm:py-32`
- Card internal padding: `p-5` or `p-6`
- Gap between cards: `gap-4` or `gap-6`

### Border Radius
- Cards: `rounded-2xl` (16px) — standard card
- Buttons: `rounded-lg` (8px) — standard CTA
- Pills / badges: `rounded-full`
- Icons: `rounded-xl` (12px) — icon container

---

## Components & Patterns

### Hero Section (Dark)
```
bg-gray-950 (dark background)
├── Ambient glow (decorative): absolute positioned divs with blur-3xl + accent-color/10
├── NavbarMinimal (theme="dark") — centered logo, transparent background
├── Eyebrow badge: bg-[accent]/10 border-[accent]/20 text-[accent] rounded-full px-3 py-1.5
├── H1: text-4xl sm:text-5xl font-bold text-white leading-tight
├── Subheadline: text-white/60 text-lg leading-relaxed
└── Form card: bg-white/5 border border-white/10 rounded-2xl p-6
```

### Form Inputs (Dark Mode)
```
bg-white/10 border border-white/20 rounded-lg
text-sm text-white placeholder-white/30
focus:ring-2 focus:ring-[accent] focus:border-[accent] focus:outline-none
```

### CTA Button (Primary)
```
Seller context:  bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg py-3
Buyer context:   bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg py-3
Finance context: bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3
```

### Stat/Metric Cards (Light)
```
bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
  Label: text-[10px] font-semibold uppercase tracking-widest text-gray-400
  Value: text-5xl font-bold text-gray-950 (or accent color)
  Delta: text-green-500 / text-red-500 with ArrowUpRight / ArrowDownRight icon
```

### Section Cards (Light body on dark page)
```
bg-white py-16
  Card grid: bg-gray-50 rounded-2xl border border-gray-100 p-6
  Icon container: w-9 h-9 rounded-xl bg-[accent]-100 flex items-center justify-center
  Icon: text-[accent]-600
  Title: font-semibold text-gray-950 text-sm
  Body: text-xs text-gray-500 leading-relaxed
```

### Trust/Social Proof Bar
```
text-xs text-gray-400 flex items-center gap-6
  Icon: text-[accent]-500
```

### Progress / Step Indicator (Sellguide)
```
Progress bar: h-1 rounded-full bg-gray-200 → bg-orange-400 fill
Overline:     text-xs font-semibold uppercase tracking-widest text-orange-500
```

---

## Logo & Branding Assets

| Asset | Path | Usage |
|---|---|---|
| Standard logo (light bg) | `MasterKeyLogo` component | Light pages |
| Inline white logo | `MasterKeyLogoInlineWhite` component | Dark hero navbars |
| White mark only | `MasterkeyWhiteMark` component | Compact dark contexts |
| Mike's headshot | `/public/mike-avatar.png` | Agent bio slides |
| Mark's headshot | `/public/team/mark-avatar.jpeg` | Agent bio slides |

The logo is a geometric radial mark (8 nodes orbiting a center dot) — think "key" or "network" — paired with wordmark "MasterKey" in Switzer.

---

## Ambient / Decorative Elements

### Glow Blobs (Hero backgrounds)
Used on dark hero sections to add depth without photography:
```css
absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full
bg-[accent-color]/10 blur-3xl
```
Typical pairs:
- Sellguide hero: `orange-600/10` top-right + `amber-500/8` bottom-left
- Buyerguide hero: `green-600/10` top-right + `teal-500/8` bottom-left
- RVS / finance: `blue-600/10` + `indigo-500/8`

### Gradient Mesh (Landing V4)
```
pointer-events-none absolute inset-x-0 -bottom-16
h-40 max-w-2xl rounded-t-full
bg-gradient-to-b via-amber-50 to-purple-100 blur-3xl
```

---

## Data Visualization

Charts are rendered with **Recharts**. Standard style:

| Element | Style |
|---|---|
| Chart background | transparent (inherits page bg) |
| Grid lines | `stroke: oklch(0.922 0 0)` (border color) — subtle |
| Line / area color | accent color matching context |
| Tooltip | white bg, rounded-lg, shadow, gray-900 text |
| Axis labels | text-xs text-gray-400 |
| Positive delta | `text-green-500` + `TrendingUp` icon |
| Negative delta | `text-red-500` + `TrendingDown` icon |

---

## Slide Deck Design Spec

Use the following when building PowerPoint / Google Slides / any presentation that should match the site:

### Slide Dimensions
- 16:9 widescreen (1920×1080 or 1280×720)

### Slide Background Options
1. **Dark hero slide** — `#030712` background with decorative glow blob (accent color, ~10% opacity, large blur radius in corner)
2. **Light content slide** — `#ffffff` background, `#f9fafb` card areas
3. **Dark accent slide** — `#111827` (gray-900), used for section dividers

### Slide Typography
- Headlines: Switzer Bold, white or `#030712`
- Body: Switzer Regular, `rgba(255,255,255,0.70)` on dark / `#374151` (gray-700) on light
- Eyebrow/label: Switzer SemiBold, uppercase, letter-spacing 0.1em, accent color
- Numbers/stats: Switzer Bold, large (48–72pt), accent color or white

### Color Usage Per Slide Type
| Slide purpose | Accent |
|---|---|
| Cover / city intro | Orange (`#f97316`) |
| Market stats / pricing | Orange or neutral |
| Buyer/demand side data | Green (`#22c55e`) |
| Financial / equity analysis | Blue (`#2563eb`) |
| Market balance / condition | Conditional: green (buyer), orange (balanced), red (seller) |
| Agent bio / call to action | Orange |

### Standard Slide Elements
- **Eyebrow text** above headline: `THOUSAND OAKS · MAY 2026` in uppercase, tracking-widest, accent color
- **Stat cards**: White card on dark slide, rounded-2xl, value in large bold, label in gray-400, delta indicator
- **Progress/bar charts**: Accent color fill on gray-200 track
- **Footer strip** (every slide): MasterKey logo left · `mathiasregroup.com` center · DRE # right — all in white/40 or gray-400 at small size
- **Section divider slides**: Dark (`#111827`) with centered eyebrow + section title

---

## Micro-copy & Voice

- Tone: confident but approachable — not salesy, data-driven
- CTA copy patterns: "Get My Report", "Schedule a Consultation", "See Your Numbers", "Let's Talk"
- Trust signals: "Updated monthly", "No obligation", "Local experts"
- Avoid: jargon, hyperbole, exclamation points
- Numbers always formatted: `$1,250,000` (full commas), `+4.2%`, `32 days`

---

## Tailwind v4 Notes

The project uses **Tailwind CSS v4** with `@import 'tailwindcss'` and a custom `@theme` block (no `tailwind.config.ts`). All custom tokens live in `src/styles/tailwind.css`:

- Custom font: `--font-sans: Switzer`
- Custom radius: `--radius-4xl: 2rem`
- CSS variable tokens mapped via `@theme inline` for shadcn/ui compatibility
- Dark mode: `.dark` class (manual toggle, not `prefers-color-scheme`)
