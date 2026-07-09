# Tokens Spec — the plumbing contract

This replaces v1's `design-system-spec.md`. The difference is the whole point of v2:

> **v1 fixed the token *values* (one radius scale, one type scale, fixed shadows) for every brand. v2 fixes only the *plumbing* — which token categories exist and how they're exposed. The *values* are derived per brand from the chosen art direction.**

So this file is short and structural. It says *what slots must exist and how to wire them*. The art direction (`art-direction.md`) and `/design-system` decide *what goes in them*.

---

## The dual-access pattern (fixed)

All tokens are CSS custom properties in `:root` (in `app/globals.css`), then exposed to Tailwind via `@theme inline`. This makes every token available both as `var(--x)` and as a Tailwind utility (`bg-primary-700`, `rounded-md`, `text-display`). This mechanism never changes.

```
:root            → raw brand value (the only place hex/px literals may live)
@theme inline    → maps the :root var to a Tailwind utility token
components/*      → reference utilities/vars by NAME only — never literals
```

**Hard rule:** zero hardcoded hex or px outside the `:root` block in `globals.css`. Every color, radius, font size, spacing step, and motion timing a component uses must resolve through a token. `/review` greps for violations.

---

## Token categories that MUST exist (names fixed, values brand-derived)

### Color
- **Neutral ramp `stone-*`** — 12 steps (`25,50,100,200,300,400,500,600,700,800,900,950`), near-bg → near-fg. The neutral's *temperature* is a brand choice (warm paper vs cold gray), but the ramp must exist and span the full range.
- **Primary ramp `primary-*`** — 11 steps (`50–950`). The brand-carrying color.
- **Accent ramp `accent-*`** — 11 steps (`50–950`). The second color. A direction may choose to barely use it (restraint is valid) but the ramp must exist.
- **Semantic** — `--success/-light`, `--warning/-light`, `--error/-light`, `--info/-light`. Tune to the palette, don't leave default traffic-light colors clashing with the brand.
- **Surface** — `--background`, `--surface`, `--surface-elevated`, `--surface-sunken`.
- **Text** — `--foreground`, `--foreground-muted`, `--foreground-subtle`.
- **Border** — `--border`, `--border-strong`, `--border-subtle`.
- **Ring** — `--ring` (focus-visible).

### Radius — BRAND-DERIVED (was fixed in v1)
Driven by **one** personality anchor; the ramp derives via `calc()`:
```css
--radius-base: 0.5rem;                         /* sharp brand → 0; soft → 0.75rem+; pill → large */
--radius-sm:   calc(var(--radius-base) * 0.5);
--radius-md:   var(--radius-base);
--radius-lg:   calc(var(--radius-base) * 1.5);
--radius-xl:   calc(var(--radius-base) * 2);
--radius-full: 9999px;
```
A precision brand sets `--radius-base: 0` and the whole component family becomes sharp from one line.

### Typography — BRAND-DERIVED (was Tailwind defaults in v1)
- **Faces:** `--brand-font-sans` (body) and `--brand-font-display` (headings). A real display face is the default expectation, not the exception — load it in `layout.tsx` via `next/font`. Leaving display = sans is only valid if the thesis explicitly calls for it.
- **Scale:** a brand modular scale, not Tailwind's built-in steps:
```css
--type-ratio: 1.25;                            /* the direction picks the ratio */
--text-base: 1rem;
--text-lg:   calc(var(--text-base) * var(--type-ratio));
--text-xl:   calc(var(--text-lg)   * var(--type-ratio));
--text-2xl:  calc(var(--text-xl)   * var(--type-ratio));
/* …continue… */
--text-display: clamp(3rem, 8vw, 11rem);       /* the poster step; size to the thesis */
```
Expose `--text-display` and `--font-display` through `@theme inline` so `text-display` / `font-display` are real utilities.

### Spacing rhythm — BRAND-DERIVED (new)
```css
--space-unit: 0.25rem;       /* base rhythm */
--section-pad-tight: 4rem;   /* focused sections */
--section-pad-airy:  9rem;   /* sections that breathe */
```
Airy/tight alternation is a brand decision, not per-section guesswork.

### Motion — BRAND-DERIVED (new)
```css
--motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
--motion-fast: 0.4s;
--motion-base: 0.7s;          /* a breath-paced brand sets these slower */
```

### Shadow
5 levels `--shadow-xs … --shadow-xl`. Shadow color derived from the neutral dark end at low opacity (not pure black) so it carries the brand temperature. A sharp/flat direction may make these nearly invisible — valid.

---

## Components — APIs frozen, appearance brand-driven

`components/ui/` holds the primitives. **This is the one thing kept fixed from v1: the component *APIs* (props, variants, sizes) do not change**, so sections never break. Their *appearance* changes for free because they reference token names, not values.

| File | Props (frozen) |
|------|----------------|
| `button.tsx` | `variant`: primary/secondary/outline/ghost/destructive · `size`: sm/md/lg |
| `card.tsx` | `variant`: default/elevated/outlined |
| `badge.tsx` | `variant`: default/primary/accent/success/warning/error |
| `container.tsx` | `size`: sm/md/lg/xl/full |
| `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio.tsx` | `label`/`error`/`hint` (+ `options` for select) |

In `/design-system`, you may **re-personalize variant classes** within the frozen API (e.g. uppercase tracking on buttons for a bold direction, square corners for a precise one) — but never add/remove/rename props. Verify no hardcoded values crept in.

The **signature device** is NOT a ui primitive — it's a per-brand `components/signature.tsx` built from the winning `concept.md`. The motion primitives live in `components/motion.tsx` (see `design-language.md`).

`lib/cn.ts` (clsx + tailwind-merge) is used by every component. Unchanged.

---

## `/design-system` page (regenerated per brand)

`app/design-system/page.tsx` is a dry internal reference, not marketing. It must show, in order: **Colors** (neutral/primary/accent ramps as swatches + semantic + surface/text hierarchy), **Typography** (the brand scale H1→caption with the display face + the type-ratio shown), **Spacing** (the rhythm tokens), **Shadows** (5 levels), **Radius** (derived ramp), **Buttons** (variants × sizes), **Forms** (input/textarea/select/checkbox/radio states), **Surfaces** (card variants on sunken bg), **Badges**, **the Signature Device** (rendered + a one-line how-it-recurs note), **a Motion demo** (Reveal/CountUp/etc. live), and a **Rationale** tying token choices to the brand's emotional truth + how it honors the no-gos. Inline helpers: `ColorSwatch`, `ColorPalette`, `Section`, `SubSection`.
