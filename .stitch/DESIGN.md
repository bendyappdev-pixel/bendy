# Design System: Bendy — Bend, Oregon Local Guide

## 1. Visual Theme & Atmosphere

A confident, place-rooted outdoor-culture interface. The atmosphere is like a well-worn trail map reimagined digitally — dark, atmospheric, and purposeful. Not a generic "app," but a living guide with character: the kind of thing a local would hand you and say *"trust this."*

- **Density:** 5/10 — Daily App Balanced. Breathing room in hero and sections; compact where data density is needed (events list, crowd reports)
- **Variance:** 6/10 — Offset Asymmetric. Not perfectly centered. Hero should pull left. Stats should break the grid.
- **Motion:** 5/10 — Fluid CSS. Purposeful hover states and staggered reveals; no gratuitous animation.

Core palette is built on deep Pacific Northwest night sky tones (navy/slate) with one warm accent — the amber-orange of a Bend sunset. Green is a functional secondary (outdoor/trail context), never decorative.

---

## 2. Color Palette & Roles

- **Night Sky** (#0f172a) — Primary background surface. Slate-950 depth.
- **Deep Slate** (#1e293b) — Card and container fill. One step above background.
- **Steel Slate** (#334155) — Hover states, secondary containers, borders.
- **Muted Iron** (#64748b) — Secondary text, metadata, descriptions.
- **Cloud White** (#f1f5f9) — Primary text, headings.
- **Fog** (#94a3b8) — Tertiary text, placeholders, timestamps.
- **Sunset Amber** (#f97316) — Single accent. CTAs, active nav states, category highlights, focus rings. Saturation ~85%. Use sparingly.
- **Ember Glow** (#fb923c) — Accent hover state only.
- **Trail Green** (#059669) — Functional secondary. Outdoor categories, crowd reports, conditions. Never decorative.
- **Forest Deep** (#047857) — Green hover state.

**Banned:** Pure black (#000000). Purple/neon gradients. Oversaturated accent combos. Warm/cool gray fluctuation (stay in Slate family exclusively).

---

## 3. Typography Rules

- **Display/Headlines:** `Outfit` — Track-tight, controlled scale. Weight hierarchy (700–800). Never screaming. Use size + weight, not size alone.
- **Body:** `Instrument Sans` — Relaxed leading (1.6–1.7), max 65ch per line, Fog (#94a3b8) for secondary paragraphs.
- **Mono:** `Geist Mono` — Timestamps, coordinates, metadata, event codes. Never for body copy.
- **Scale:** Clamp-based fluid type. Headlines: `clamp(2rem, 5vw, 4rem)`. Body minimum `1rem`.

**Banned:**
- `Inter` — too generic for a place-rooted brand
- Generic system font stacks as primary
- `Times New Roman`, `Georgia`, `Garamond` — no generic serifs ever
- `Space Grotesk` — overused AI-era default

---

## 4. Component Stylings

- **Primary Button:** Sunset Amber (#f97316) fill. White text. Rounded-xl (12px). Flat — no outer glow. Tactile `-1px translateY` on active:pressed. Hover: Ember Glow (#fb923c). Shadow only on hover: `0 4px 20px rgba(249,115,22,0.2)`.
- **Secondary Button:** `bg-white/10` fill, `border-white/15`, white text. Same shape. No glow. Hover: `bg-white/20`.
- **Cards:** `bg-slate-800/50` + `backdrop-blur-sm`. Rounded-2xl (16px). Border: `border-white/8`. Hover: `-translateY(2px)` + subtle shadow. Only used when elevation communicates hierarchy — not decoration.
- **Nav links:** Small (14px), medium weight. Active: Sunset Amber. Inactive: Fog (#94a3b8). No underline. No box.
- **Category Badges:** `rounded-full`. Tinted background at 20% opacity matching category color. Label text at 100% category color.
- **Loaders:** Skeletal shimmer matching layout dimensions. No circular spinners ever.
- **Empty States:** Composed — icon + concise label + action link. No "No data found" alone.

---

## 5. Layout Principles

- CSS Grid for all multi-column layouts. Never `calc()` percentage hacks.
- Max-width: `1280px` centered (`max-w-7xl`).
- Hero: **Left-aligned or Split Screen** — never fully centered when content warrants personality.
- Category grids: **NOT equal 3-column**. Use 2-column zig-zag, 2+1 asymmetric, or horizontal scroll.
- Stats section: Horizontal strip with border-top dividers, NOT equal icon-boxes on colored bg.
- Full-height sections: `min-h-[100dvh]` — never `h-screen`.
- Responsive: All multi-column collapses to single below 768px. No exceptions.

---

## 6. Motion & Interaction

- Spring-feel hover on cards: `transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot.
- Staggered list reveals: `animation-delay` cascade on event lists and category cards.
- Header: Smooth opacity + blur transition on scroll. Already implemented — keep.
- Image zoom on card hover: `scale(1.04)` with `overflow-hidden` on container. Already implemented — keep.
- No `animate-bounce` scroll indicators — content should pull users in naturally.
- No linear easing anywhere. Use `ease-out` or cubic-bezier spring curves.

---

## 7. Anti-Patterns (Banned)

- **No `Inter` font** — replace with Outfit + Instrument Sans
- **No bouncing scroll chevron/arrow** — remove the Hero scroll indicator
- **No 4-CTA hero** — maximum 1 primary + 1 secondary CTA in hero
- **No equal 3-column category grids** — break with asymmetric layout
- **No centered hero** — left-align or split the hero content
- **No generic round-number stats section** ("300+ Days of Sunshine" is fine as a real fact about Bend; the equal green boxes treatment is what needs fixing)
- **No gradient text** on non-headline elements (`.gradient-text` on coordinates is off)
- **No pure black** anywhere
- **No outer neon glows** on buttons
- **No AI copywriting clichés** ("Seamless", "Unleash", "Next-Gen", "Elevate")
- **No broken image links** — use picsum or local images only
- **No emojis in UI**
- **No `h-screen`** — use `min-h-[100dvh]`
