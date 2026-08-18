# Design System: Bendy — Cinematic Facelift

**This document supersedes the previous navy/sunset design system.** Several of
that system's rules are deliberately reversed here; see § 9 for the diff. The
tokens live in `tailwind.config.js` and `src/index.css`, and those two files —
not this document — are authoritative when they disagree.

---

## 1. Visual Theme & Atmosphere

A field guide shot as a film. Warm-black surfaces, condensed uppercase display
type set very large and very tight, monospace for every piece of data, and one
ember accent reserved for anything live, active or clickable. Corners are
square everywhere. Dividers are hairlines, never filled panels. Every photo is
a graded film frame with a vignette, a light grain, and a mono slate label.

- **Density:** data-dense where the content is data (almanac, conditions,
  marquee), generous where it is photography.
- **Motion:** near-still. The ticker scrolls, the REC dot pulses, links change
  colour, reels scale 0.5% on hover. That is the entire motion vocabulary.
- **Voice:** editorial and local. Sections are "scenes", guides are
  "sequences", the events table is "the marquee", the footer is film credits.

---

## 2. Colour Palette & Roles

| Token | Hex | Role |
|---|---|---|
| `film-black` | `#070605` | Page background; letterbox bars |
| `film-deep` | `#0d0b08` | Alternating section background |
| `film-coal` | `#15110c` | Third-level surface (events table) |
| `film-white` | `#f2ede1` | Primary text — warm bone, **never `#fff`** |
| `mist` | `rgba(242,237,225,0.65)` | Secondary body copy |
| `whisper` | `rgba(242,237,225,0.40)` | Metadata, labels, timestamps |
| `hair` | `rgba(242,237,225,0.12)` | Standard hairline divider |
| `ember` | `#c9a06b` | **The** accent — kickers, links, active nav, live. Re-graded to gold Aug 2026 (Benji's call via the design-tweaks pass); the token name stays `ember` |
| `ember-50` | `rgba(201,160,107,0.5)` | Ember at 50%, for borders |
| `flame` | `#c95228` | REC pulse dot, newsletter button hover |
| `gold` | `#c9a06b` | Food & Drink chapter; ad-unit accent. Now equal to `ember` — acceptable overlap, they never compete in one composition |
| `pine` | `#5b7a4f` | Outdoor chapter |
| `lake` | `#5a7d92` | Deschutes river, Kids chapter |
| `crowd-empty` | `#7fb262` | Crowd level: "Quiet" |
| `crowd-mod` | `#e3b34c` | Crowd level: "Some people" |
| `crowd-packed` | `#d8623a` | Crowd level: "Crowded" |

**Banned:** pure `#000` as a text or surface colour (it *is* used for
`.letterbox` bars, deliberately); pure `#fff`; the entire old
`navy-*` / `sunset-*` / `pine-[0-9]` scale; any gradient that is not a vignette
or a photo scrim.

**Never use a Tailwind opacity modifier on an arbitrary CSS variable.**
`border-[var(--ember)]/50` silently fails in Tailwind 3 and falls back to light
grey. Use the pre-defined `--ember-50` variable instead.

**Never use ember on ad units.** The accent stays reserved for live and
interactive product elements so ads do not read as UI. Ads use `gold`,
`text-mist` and `text-whisper`.

---

## 3. Typography

| Family | Weights | Role |
|---|---|---|
| **Big Shoulders Display** | 500, 800, 900 | Every headline, numeral, stat, list-item title |
| **Bricolage Grotesque** | 300–700 | Body copy and UI |
| **Instrument Serif** (italic) | 400 | Taglines and pull quotes **only** |
| **JetBrains Mono** | 300–500 | All data: timecodes, coords, labels, kickers |

Type roles, all defined as component classes in `src/index.css`:

| Class | Spec |
|---|---|
| `.film-display` | Big Shoulders 800, uppercase, `letter-spacing: -0.005em`, `line-height: 0.85` |
| `.film-display-thin` | Big Shoulders 500, uppercase, `line-height: 0.9` |
| `.serif-i` | Instrument Serif italic 400, `letter-spacing: -0.01em` |
| `.small-caps` | JetBrains Mono, uppercase, `10.5px`, `letter-spacing: 0.22em` |
| `.stencil` | Big Shoulders 900, `letter-spacing: -0.02em`, `line-height: 0.8` |

**Do not stack extra negative leading on `.film-display`.** The class already
sets `line-height: 0.85`; adding `leading-[0.78]` on top makes glyphs overflow
their box and collide with the line below.

### Fluid scale

| Level | Size |
|---|---|
| Hero wordmark | `clamp(110px, 22vw, 340px)` |
| Scene headline | `clamp(40px, 7.5vw, 112px)` |
| Sub-headline | `clamp(36px, 6vw, 92px)` |
| Sequence title | `clamp(32px, 5.5vw, 72px)` |
| Stencil numeral | `clamp(56px, 13vw, 180px)` |
| Stat numeral | `clamp(40px, 6vw, 104px)` |

Both ends of this scale differ from the original handoff, deliberately, and
both are load-bearing:

- The **floors** are lower because the handoff's 56px scene-headline floor
  overflowed a 390px phone on words like "Itineraries." and pushed the whole
  document into horizontal scroll.
- The **ceilings** are lower because the handoff's 140px overflowed the
  8-column headline track on words like "Programme." and bled up to 102px into
  the supporting copy sitting beside it. These are the largest values that
  keep the longest headline in the product inside its own column.

If you add a headline with a longer single word than "Itineraries." (12
characters), re-measure before trusting the ceiling.

---

## 4. Components

Use these; do not reinvent them.

| Component | Import | Notes |
|---|---|---|
| `Reel` | `components/ui/Reel` | **Every photo in the product is a Reel.** Props: `src, alt, label, timecode, brackets, leak, hoverable, priority, scrim, className, style, children`. Renders a real `<picture>` with a WebP source, lazy-loads, and carries alt text. |
| `SceneHeader` | `components/ui/SceneHeader` | `{ scene, kicker, title, meta?, children?, as?, size? }` — the numbered section header used on every page. |
| `CrowdBadge` | `components/ui/CrowdBadge` | Also exports `CrowdLegend`, `crowdMeta`, `crowdMetaForCamping`. The single source of truth for how busy-ness is coloured and worded. |
| `ViewfinderMark` | `components/ui/ViewfinderMark` | The brand mark: a square with edge cross-hairs and a centre dot. |
| `BulletinTicker` | `components/layout/BulletinTicker` | The live-data bar above the masthead. |
| `SequenceCard` | `components/guides/SequenceCard` | A guide as a cinematic title card with a call-sheet strip. Also exports `SequenceCardCompact`. |

Utility classes: `.btn-primary`, `.btn-secondary`, `.container-app`,
`.row-hover`, `.letterbox`, `.scrubber`, `.horizon`, `.rec`, `.live-caret`,
`.scrim-b`, `.scrim-l`.

- **Buttons:** square. Primary is bone fill / black text, hovering to ember.
  Secondary is a hairline border at 30% white, hovering to 100% + 5% fill.
- **Chips and filters:** square, hairline border, ember when active. Never pills.
  Exception — the map's category filters form a **rail**: one hairline strip above
  the canvas (inside the map's frame, never floating over it), whose chips are
  dot + `.small-caps` text with no individual boxes; active is ember text and a
  full-opacity dot. Labels stay visible at every width — the rail wraps rather
  than degrading to bare dots.
- **Loaders:** mono text ("Loading map…"), not spinners on flat UI.
- **Nav links:** `.small-caps`, `text-mist`, hover `text-film-white`, active
  `text-ember`. No underline, no box.

---

## 5. Layout

- **Container:** `.container-app` — `max-w-[1500px]`, `px-6 lg:px-10`.
- **Section padding:** `py-20` standard, `py-14` for compact bands.
- **Grid:** 12-column. CSS Grid for all multi-column layouts.
- **Border radius:** `0` everywhere except `rounded-full` on status dots.
- **Borders:** `1px solid rgba(242,237,225,0.12)`. Sections separate with
  `border-y`, list items with `border-b`.
- **Shadows:** none on flat UI. Only `text-shadow` on type over photography:
  `0 2px 20px rgba(0,0,0,0.6)`, or `0 4px 40px rgba(0,0,0,0.5)` on the hero.
- **Full-height sections:** `min-h-[100dvh]`, never `h-screen`.
- The header is **not fixed** — it scrolls away. There is no spacer div.

---

## 6. Photography

`.reel::after` vignettes only the frame's *edges*. Any display type set over a
photograph needs a scrim — `scrim="bottom" | "left" | "both"` on the `Reel` —
or it drops below contrast over bright images. Scrims and vignettes are the
only gradients the system permits.

Alternate the `leak` prop across sequential reels so the warm light-leak does
not repeat identically.

### Attribution

`src/data/photoCredits.ts` is the site's record of who shot what, built from
each original file's embedded EXIF/XMP. `Reel` looks a credit up from its own
`src` and renders it automatically, so **every photo in the product is
attributed without its caller doing anything**. Pass `credit={false}` to
suppress, or `creditPosition="top"` on any frame whose bottom edge is covered
by a letterbox bar.

Unlike `label` and `timecode`, the credit is **not** hidden below `md` — it is
attribution, and attribution that disappears on a phone isn't attribution.

`scripts/optimize-images.mjs` calls `withMetadata()` so copyright and creator
fields survive optimisation in both the JPEG and the WebP. Do not remove it;
sharp strips metadata by default and would erase the provenance this file is
built from.

The footer names every credited contributor and carries a standing notice
inviting unattributed photographers to claim or withdraw their work. When you
add photography, add its credit to `photoCredits.ts` — or add its path to
`UNATTRIBUTED` so the count in that notice stays honest.

All photography under `public/images/` is processed by
`npm run optimize:images`, which caps the long edge at 2400px, re-encodes the
original, and writes a WebP sibling at the same path. **Every raster the app
references must have a WebP sibling** — a `<picture>` whose matching `<source>`
404s does *not* fall back to the `<img>`, it simply fails to render. Re-run the
script after adding any image.

---

## 7. Responsive rules (learned the hard way — do not regress these)

- **`grid-cols-12` with `gap-8` or larger overflows a 390px phone.** Eleven
  32px gutters is 352px, wider than the viewport, and Tailwind's
  `minmax(0,1fr)` tracks collapse to zero rather than the gaps shrinking. Use
  `gap-6` on mobile and step up at `md:` / `lg:`.
- **A `col-span-1` / `col-span-2` track is 12–36px on mobile** and will not
  hold a 34px display numeral. Use flex with a fixed-width block instead.
- **`clamp()` floors must fit 390px.** The handoff's 56px scene-headline floor
  overflows on words like "Itineraries."; the floors in § 3 are the corrected
  values.
- **Flex children carrying wide content need `min-w-0`.** A flex item defaults
  to `min-width: auto` and refuses to shrink below its content, which is how
  the bulletin ticker pushed the whole document into horizontal scroll.
- `.letterbox` lower-thirds stack vertically on mobile.
- Reel `label` / `timecode` metadata is hidden below `md` — it is decorative
  and crowds small screens. The `Reel` component handles this.
- All 12-col grids collapse to a single column below `md`.

**Acceptance check:** no page may scroll horizontally at 1440px or 390px.

---

## 8. Accessibility

- `:focus-visible` gets a 2px ember outline at a 2px offset. The system removes
  rounded surfaces and most borders, which also removes the affordances focus
  normally borrows — do not remove the ring.
- `prefers-reduced-motion: reduce` stops the ticker scroll and the REC pulse.
  Both are continuous and unstoppable, exactly the class of motion WCAG 2.2.2
  asks us to let users turn off.
- The mobile nav is a `role="dialog" aria-modal="true"`, closes on Escape,
  moves focus to its close button on open, and locks body scroll.
- Decorative reel photography is `alt=""` and `aria-hidden`. Photography that
  carries meaning must be given a real `alt`.
- Active nav links carry `aria-current="page"`; filter toggles carry
  `aria-pressed`.
- `src/index.css` sets `a { color: var(--ember) }` at the base layer, so any
  heading inside a block-level `<Link>` must set `text-film-white` explicitly
  or it silently inherits ember.
- Crowd levels are always shown in plain language ("Quiet · go now", "Some
  people", "Crowded · lot full"), never as raw EMPTY / MODERATE / PACKED
  coding, which review found unintuitive to first-time visitors.

---

## 9. What this reverses from the previous system

| Previous system | This system |
|---|---|
| No pure black | Uses `#000` for `.letterbox` bars — deliberate, cinematic |
| No generic serifs ever | Instrument Serif italic for taglines — a specific editorial voice, not a fallback |
| `rounded-xl` / `rounded-2xl` | Square corners everywhere |
| Hero left-aligned, never centred | Hero wordmark is centred — it is a title card |
| `Outfit` + `Instrument Sans` | Big Shoulders Display + Bricolage Grotesque |
| Header blurs and stays fixed on scroll | Header is static and scrolls away |
| Spring-feel hover, staggered reveals | Near-still; no entrance animations or scroll reveals |
| Cards with `backdrop-blur` and elevation | Hairline rows and full-bleed reels |
| Category badges as tinted `rounded-full` pills | Square hairline chips, ember when active |

---

## 10. Rules carried over unchanged

- No emoji in UI.
- No `h-screen` — use `min-h-[100dvh]`.
- No gradient text.
- No bouncing scroll indicators.
- No AI copywriting clichés ("Seamless", "Unleash", "Next-Gen", "Elevate").
- Maximum 1 primary + 1 secondary CTA in the hero.
- No equal 3-column category grids.
- CSS Grid for all multi-column layouts.
- No broken image links.

## Addendum — Aug 2026 field-map scene

Scene 05 on the homepage is a **full-bleed live map** (`min(88vh,900px)`, min
620px): the real Mapbox canvas edge to edge, top/bottom scrims for type,
overlaid header (title at `clamp(44px,6vw,92px)`), LIVE clock + boxed
`CrowdLegend` top-right, and a bottom conditions strip built from the same
honest data rows as the Transmission drawer. Crowd pins open a **slide-out
drawer** (`sm:w-[420px]`, translate-x transition, Escape / ✕ / click-outside
closes) showing the real report — never invented narrative. Film grain runs at
0.17 site-wide.

## Addendum — Aug 2026 scroll motion

Three scroll behaviors extend the motion vocabulary; nothing else does.

1. **The cut** — `.reveal` + `useReveal` (`src/hooks/useReveal.ts`): a section
   fades and settles 14px the first time it enters the viewport, once, never
   re-triggering. Wired centrally in `SceneHeader` (all pages), plus chapter
   bands, sequence cards and end-slate stats (staggered 70ms).
2. **The runtime bar** — 2px scroll-progress scrubber pinned to the viewport
   top (`RuntimeBar` in `App.tsx`, `.runtime-bar`), ember fill on no track.
3. **The count-up** — end-slate numerals count from zero over 900ms on first
   view (`StatValue` in HomePage).

All three are neutralised by the `prefers-reduced-motion` block in
`index.css`. Still banned: parallax inside reels (breaks the locked-frame
metaphor), scroll-jacking/snap/pinning, animation libraries.
