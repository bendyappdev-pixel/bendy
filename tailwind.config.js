/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────────────────────
// BENDY — CINEMATIC FACELIFT
// Drop-in replacement for tailwind.config.js
//
// The old navy/sunset/pine palette is REMOVED, along with the temporary
// legacy aliases (navy, sunset, forest, sage, mountain, earth, sand, snow and
// the `heading` font alias) that existed only to keep the build green during
// migration. Nothing in src/ references them. Re-check with:
//   grep -rnE "navy-|sunset-|pine-[0-9]|bg-forest|bg-sage|bg-mountain|bg-earth|bg-sand|bg-snow" src/
// ─────────────────────────────────────────────────────────────────────────────
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Core surfaces ──────────────────────────────────────────────
        // Named "film" because the whole system reads as a graded film frame.
        film: {
          black: '#070605', // page background, hero letterbox bars
          deep:  '#0d0b08', // alternating section background (Almanac)
          coal:  '#15110c', // third-level surface (Marquee / events table)
          white: '#f2ede1', // primary text — warm bone, NEVER pure #fff
        },

        // ── Accent ─────────────────────────────────────────────────────
        ember: {
          DEFAULT: '#e07a3a', // section kickers, links, active nav, CTA hover
          50:      'rgba(224,122,58,0.5)', // 50% ember for borders
        },
        flame: '#c95228', // REC pulse dot, newsletter button hover

        // ── Functional secondaries ─────────────────────────────────────
        gold: '#c9a06b', // Food & Drink chapter numeral
        pine: '#5b7a4f', // Outdoor chapter numeral, Sequence 02
        lake: '#5a7d92', // Deschutes river on map, Kids chapter numeral

        // ── Crowd-report semantics (do not restyle ad hoc) ─────────────
        crowd: {
          empty:  '#7fb262', // "Quiet"
          mod:    '#e3b34c', // "Some people"
          packed: '#d8623a', // "Crowded"
        },
      },

      // ── Text opacity tiers ───────────────────────────────────────────
      // Use these instead of ad-hoc /60 /40 modifiers so tiers stay consistent.
      textColor: {
        mist:    'rgba(242,237,225,0.65)', // secondary body copy
        whisper: 'rgba(242,237,225,0.40)', // metadata, labels, timestamps
      },

      borderColor: {
        hair:   'rgba(242,237,225,0.12)', // standard hairline divider
        'hair-soft': 'rgba(242,237,225,0.06)',
      },

      fontFamily: {
        // Condensed display — every headline, big numeral, and stat.
        // Replaces Outfit.
        display: ['"Big Shoulders Display"', 'Anton', 'system-ui', 'sans-serif'],
        // Body copy + UI. Replaces Instrument Sans.
        body:    ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        // Editorial voice — pull quotes, taglines, place names ONLY.
        serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
        // All data: timecodes, coordinates, labels, kickers, stats.
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      letterSpacing: {
        caps: '0.22em', // the small-caps mono label treatment
      },

      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        emberPulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(201,82,40,0.5)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(201,82,40,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(201,82,40,0)' },
        },
      },
      animation: {
        ticker: 'ticker 70s linear infinite',
        'ember-pulse': 'emberPulse 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}
