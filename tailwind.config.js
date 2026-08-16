/** @type {import('tailwindcss').Config} */

// "Paper and Dots" v1 — tokens transcribed from the Design System doc.
// Intended weights are noted per size; apply them with font-medium / font-bold
// so they stay overridable.
module.exports = {
  content: ["./_site/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // ── Approved five. Taken from the artwork: her hair, her dress, her ribbon.
        paper: '#FBFBF9',        // page ground — cool neutral, not white
        plate: '#DBE5D9',        // sage — the rail, never behind body text
        ink: '#2D3B52',          // navy — headings, active tab, signature
        ribbon: '#CB4838',       // accent — rationed
        mist: '#EFF3EC',         // hover fill

        // ── Derived. Every neutral is navy mixed into paper, one rule, one family.
        //    Percentages chosen so anything carrying text clears WCAG AA (4.5:1).
        'ink-soft': '#566173',   // navy 80% — body copy .............. 6.04:1
        meta: '#6B7584',         // navy 70% — dates, years, labels ... 4.50:1
        edge: '#BDC1C7',         // navy 30% — borders, leaders ....... decorative
        rule: '#E6E8E8',         // navy 10% — hairlines .............. decorative

        // ── Sage mixed into paper, for surfaces that aren't the rail.
        'plate-soft': '#EBF0E9', // sage 50% — code block ground

        // ── Code. Two hues, everything else is weight. All ≥4.5:1 on plate-soft.
        //    Plain text is `ink`, punctuation is `ink-soft`.
        'code-key': '#A93526',   // ribbon deepened — keywords ...... 5.64:1
        'code-str': '#4B6845',   // sage hue 110° darkened — strings  5.40:1
        'code-com': '#5E6877',   // meta deepened — comments ........ 4.88:1
      },
      fontFamily: {
        // Two voices: Zen carries UI and headings, Newsreader carries language.
        // Mono is not part of the identity — it appears inside code blocks only.
        sans: ['"Zen Kaku Gothic New"', 'sans-serif'],
        serif: ['Newsreader', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        site: ['44px', { lineHeight: '1.22', letterSpacing: '0.004em' }],   // 700
        essay: ['38px', { lineHeight: '1.30', letterSpacing: '0.004em' }],  // 700
        sig: ['30px', { lineHeight: '1' }],                                 // serif italic
        pull: ['21px', { lineHeight: '1.60' }],                             // serif italic
        prose: ['20px', { lineHeight: '1.85' }],                            // serif
        row: ['19px', { lineHeight: '1.45', letterSpacing: '0.008em' }],    // 500
        note: ['17px', { lineHeight: '1.80' }],                             // serif
        flag: ['16px', { lineHeight: '1' }],                                // serif italic, (new)
        year: ['15px', { letterSpacing: '0.12em' }],
        period: ['13px', { letterSpacing: '0.12em' }],
        stamp: ['12px', { letterSpacing: '0.14em' }],                       // dates — Zen, tracked
        chip: ['12px', { letterSpacing: '0.08em' }],
        social: ['12px', { letterSpacing: '0.16em' }],                      // 500
        ctrl: ['11px', { letterSpacing: '0.20em' }],                        // 500
        kicker: ['11px', { letterSpacing: '0.14em' }],                      // mono
        label: ['11px', { letterSpacing: '0.18em' }],
      },
      maxWidth: {
        measure: '44ch',       // split view
        'measure-wide': '62ch', // full width
      },
      gridTemplateColumns: {
        // Pane / rail. 62/38 is the widest split where the dotted leader still
        // has room to read as a rule, and the narrowest where the figure keeps
        // sage around her. Note this forces her to ~72% of rail height at
        // realistic viewport heights — at 90% she overflows a 38% rail.
        split: '62fr 38fr',
        full: '1fr 0px',
      },
      borderRadius: {
        // Corners stay tighter than the drawing is soft.
        ctrl: '3px',   // buttons, chips, labels
        art: '10px',   // imagery
      },
    },
  },
  plugins: [],
}
