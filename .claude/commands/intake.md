---
description: Validate the brief and produce a reviewable site plan (no code)
argument-hint: "[path to brief — defaults to ai/brief.md]"
---

You are the **intake & planning** step of the website generator. You write a plan only — **no code, no components, no CSS.**

## Read first
- The brief: `$1` if provided, otherwise `ai/brief.md`.
- `ai/sections.md` — the section catalog (Part 1 include-when rules + Part 2 ordering & guardrails).
- `ai/design-language.md` — the craft bar (for the conversion-floor + rhythm checks). **Do not assign concrete visual layouts/zones/backgrounds here** — those are art-direction-dependent and are decided after `/art-direction` + `/design-system`. This step plans *structure* only.
- If present, the satellite inputs: `ai/reference/moodboard/`, `ai/reference/copy/`, `ai/reference/assets/`. Skip silently if empty.

## Single-page vs. multi-page
The brief is **multi-page** when it contains a `## Pages` block — one `### Page …` entry per route, each carrying `route`, `nav_label`, `nav_order`, and its own page-scoped content fields. The brief's top-level blocks (Site Config, Identity, global Conversion, Legal, Visual Direction) are **global** and shared by every page.

If there is **no `## Pages` block**, treat the whole brief as a **single page** (legacy behavior) and produce one section order.

Section selection is **per page**: every `include-when` rule (Problem/Outcome/Mechanism/Offer/Proof/About/FAQ/leadCapture) is evaluated against *that page's* fields. `hero`, `cta`, `footer` are always in for every page.

## Do
1. **Validate globals.** Confirm the global REQUIRED fields exist: site config; identity `brand_name`; visual direction; and — if `legal_pages ≠ none` — the Legal block. If `lead_capture: on`, a magnet must be present. List every gap.
2. **Validate each page.** Every page needs a `route`, a `nav_label`, a hero source (`one_liner`/headline), and a CTA target. List per-page gaps.
3. **Resolve config** — language, legal_pages, lead_capture, primary_goal (and the derived CTA label if `primary_cta_label` is blank).
4. **Plan the global chrome** — the **navbar** (brand + one link per page, ordered by `nav_order`, + the global primary CTA) and the **footer** (nav links + legal links + social). In multi-page mode these are shared across all routes (rendered once in `app/layout.tsx`), and navbar links are cross-route paths (`/sessions`), not in-page anchors. The primary CTA resolves to the `cta` section anchor (`#kontakt`/`#cta`), which repeats on every page.
5. **For each page**: pick sections by applying each catalog `include-when` rule to that page's content; order them along the default narrative spine (note any deviation with a one-line reason); record per section the **data source** (which brief fields) and CTA copy where relevant. **Do not assign layouts or background zones** — the winning art direction decides those at build time. Structure and content mapping only.
6. **Run the conversion-floor + structural checks per page** and record each result. If a page fails the conversion floor (no credibility element, or CTA appears <2×), flag it prominently — do not silently proceed.

## Output — write ONLY this file
`ai/_generated/site-plan.md`, with:
- **Resolved config** (one line) — language · legal_pages · lead_capture · primary_goal.
- **Global chrome** — navbar (brand · ordered nav links → routes · primary CTA copy/target) and footer (links · social · legal). Single-page: note "navbar anchors in-page."
- **Route inventory** — every route to be generated (`/`, `/sessions`, …, plus `/impressum` + `/datenschutz` when legal is on).
- **One block per page**, headed `## Page: <route> — <nav_label>`, each with:
  - **Section order** — numbered; each line: `id — source · CTA copy (if any)`. (No layout/zone — those are decided at build time from the winning art direction.)
  - **Excluded sections + why** — every catalog section not included and the failed include-when.
  - **Structural check** — CTA appearances (≥2), credibility element present (y/n). (Layout-variety and background-zone checks move to `/build-site` + `/review`, since they depend on the chosen direction.)
- **Missing / review flags** — every `// MISSING` required field and any `// REVIEW` ambiguity, grouped by page (or global).

End by printing a short summary (routes planned; per-page sections in/out; any flags) and **stop for operator review.** Do not run other commands.
