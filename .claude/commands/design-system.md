---
description: Promote the winning art direction into the real brand token system + showcase page
argument-hint: "[path to brief — defaults to ai/brief.md]"
---

You are the **design system** step (stage 4). You take the **winning** art direction and turn its sketch into the real, wired brand system: tokens, fonts, the signature device, and the `/design-system` showcase. You set brand tokens and the device — not page sections.

## Preamble (required)
This repo runs a modified Next.js with breaking changes vs. your training data (see `AGENTS.md`). **Before writing any Next-specific code (`next/font`, layout, metadata), read the relevant guides in `node_modules/next/dist/docs/`.**

## Read first
- `ai/_generated/winner.txt` → the winning slug → its `ai/_generated/directions/<slug>/concept.md` + `tokens.draft.css`. **This is the contract for this step.** If `winner.txt` is missing, stop and tell the operator to run `/direction-gate`.
- `ai/tokens-spec.md` — the plumbing contract (token categories, the dual-access pattern, frozen component APIs, the `/design-system` page structure).
- `ai/design-language.md` — the craft bar.
- The brief — Identity + the Visual Direction no-gos (the Rationale must show they're honored).

## Do
1. **`app/globals.css` `:root`** — promote the winner's `tokens.draft.css` into the real tokens: full `stone` (25–950), `primary` (50–950), `accent` (50–950) ramps + semantic colors; set the brand-derived **`--radius-base`**, **`--type-ratio`** + `--text-display`, **spacing** (`--section-pad-*`), and **motion** (`--motion-*`) values from the concept. No hardcoded hex/px anywhere outside `:root`.
2. **Shadows** in `@theme inline` — derive the shadow color from the neutral dark end at low opacity (a sharp/flat direction may make them nearly invisible — valid).
3. **Fonts** — load the winner's display + body faces in `app/layout.tsx` via `next/font`, add the CSS variable(s) to the `<html>` className, repoint `--brand-font-sans` / `--brand-font-display` in `:root`. The `font-display`/`font-heading` utility must always resolve to a real family. A distinct display face is expected unless the concept explicitly says otherwise.
4. **`app/layout.tsx` metadata** — set brand title/description.
5. **`components/signature.tsx`** — build the winner's **signature visual device** from the concept's sketch, consuming brand tokens. It will be imported by ≥3 sections in `/build-site`.
6. **UI primitives** in `components/ui/` — review each; fix hardcoded values or wrong token refs. You MAY re-personalize variant classes within the frozen API (e.g. uppercase tracking, square corners to match the direction) but never add/remove/rename props.
7. **`app/design-system/page.tsx`** — regenerate per `ai/tokens-spec.md`'s page structure: Colors, Typography (show the brand scale + display face + the type-ratio), Spacing, Shadows, Radius, Buttons, Forms, Surfaces, Badges, **the Signature Device** (rendered + how it recurs), **a Motion demo** (Reveal/CountUp/etc. live), and a **Rationale** tying token choices to the brand's emotional truth and showing how the no-gos are honored. Use the inline helpers (`ColorSwatch`, `ColorPalette`, `Section`, `SubSection`).

## Cross-model foundation review (before the human gate)
The design system is the foundation every section will inherit — a weak or generic foundation is far cheaper to fix now than after `/build-site`. So run a cross-model review **here**, scoped to the foundation:
1. Run `npm run build` and confirm `/design-system` renders.
2. Review against `ai/review/rubric.md` at its **`/design-system` scope** (distinctiveness of the token system + the signature device; no-gos honored; contrast/accessibility; build only — copy/conversion/parity don't apply yet). Use the configured reviewer (`$REVIEWER_CMD`, default `codex exec`) for an independent second model; **fall back** to an adversarial Claude reviewer if it's missing/not-logged-in/errors. State which path ran. Expect the rubric's findings JSON.
3. **Fix** every `blocker` and `major` (e.g. "palette is gray+blue default", "signature device is generic / won't recur", "a no-go is violated", "headings fall back to body font"), then re-check. Write the round to `ai/_generated/review/design-system.{json,md}`.

## Stop for the human gate
Print what you changed + the foundation-review result, then **stop** so the operator can visually review `/design-system` — it should feel like *this brand*, not a recolor — before `/build-site`.
