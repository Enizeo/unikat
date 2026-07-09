# Design Language — craft rules for building the winning direction

`art-direction.md` decides *what* the site is. This file is the craft bar for *building it well* once a direction has won. These are **positive** rules — things to do — not a list of fears. (v1's failure-mode table is demoted to a footnote; it was never the problem.)

The winning direction's `concept.md` outranks generic instinct. When in doubt, ask "does this serve the thesis?" — not "is this safe?"

---

## 1. Hierarchy is the first thing the eye resolves
The H1 must win the page instantly — significantly larger / heavier / tighter than section H2s, sized off the brand's `--text-display`/scale, not a timid `text-4xl`. Overlines and captions are *different in kind* from body (weight + tracking + case), not just smaller. Let some sections lead with content directly — not every section needs headline + subhead + intro.

## 2. The signature device must actually recur
The direction's signature device (`components/signature.tsx`) appears in **≥3 sections**. It is the single strongest "this is one specific brand" signal. If you build the site and the device shows up once, you've lost the distinctiveness the direction was chosen for. Thread it: hero + one mid-page section + the CTA is the minimum.

## 3. Rhythm: make scrolling feel like movement
Use the brand's `--section-pad-tight` / `--section-pad-airy` deliberately — some sections compress, some breathe. Alternate background zones (`background → surface → sunken → accent-tint`) so the page has **≥3 distinct zones**. Vary layout pattern section-to-section; no more than 2 consecutive sections share a layout. Cards are *one* option — use them only for genuinely list-like content, and never as the default skeleton of the whole page.

## 4. Color does work
The primary/accent palette must appear in meaningful, structural ways — a tinted or dark section band, the emotional shift from Problem→Outcome, the eye-path to the CTA — not just as a button fill and a border. At least one section should carry a non-neutral background drawn from the palette. (A deliberately restrained direction — see "Terminal" — earns its restraint with *one* precise accent doing visible work; that is not the same as neutral collapse.)

## 5. Motion is part of the design, not decoration
Use `components/motion.tsx` primitives in service of the thesis, at the brand's motion timing:
- **`Reveal`** — fade+rise into view (the default entrance).
- **`CountUp`** — animate stat figures (great when numbers *are* the argument).
- **`useParallax`** — scroll-linked depth on hero/background imagery.
- **`Magnetic`** — CTA drift toward cursor (energetic directions only).
- **`Marquee`** / **`Skew`** — kinetic banners and slanted chips (bold directions).

Pick the few that fit; a calm direction uses slow Reveals and nothing else, a bold one uses the full kit. **Always** respect `prefers-reduced-motion` — the globals block zeroes animations; never rely on motion to convey information.

## 6. The CTA is unmissable
The primary CTA is visually dominant wherever it appears — size, color, and placement make it the obvious next move. It appears ≥2× across a page. It never blends into the body.

## 7. Premium = intentional, not minimal
Every element has a reason. Whitespace gives important things room (it doesn't fill gaps). Shadows/borders/radius follow one consistent logic. The page should feel authored by a person with a point of view — which, after `art-direction.md`, it now has.

---

### Footnote — failure modes to still avoid
These were v1's whole "design principles." They're real, but they're hygiene, not strategy: **card monoculture** (every section a 3-card grid), **neutral collapse** (the page never leaves gray — distinct from earned restraint), **flat rhythm** (identical padding everywhere), **heading inflation** (every section padded with headline+subhead+intro), **CTA blindness** (CTA same weight as everything). If you followed rules 1–7, you avoided all five for free.
