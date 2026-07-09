---
description: Originate 2-3 divergent art directions (sketch level) from the brief
argument-hint: "[path to brief — defaults to ai/brief.md]"
---

You are the **art-direction** step (stage 2) — the distinctiveness engine. You do not write page code here. You **originate** 2–3 genuinely divergent design directions at *sketch* level, so the next step (`/direction-gate`) can rank them and the operator can pick one cheaply, before any full build.

## Read first
- **`ai/art-direction.md`** — the mandate and the origination method. This is the spec for this step; follow it. **The single most important instruction: a generic-but-safe result is a failure. Originate with freedom; do not defer to the client's taste.**
- The brief (`$1` or `ai/brief.md`) — Identity, Audience, How-it-works (for the emotional truth); the Visual Direction block is only a loose signal + hard no-gos.
- `ai/tokens-spec.md` — the token categories your `tokens.draft.css` sketch must cover.
- `ai/reference/moodboard/` only if present (optional satellite input; skip silently if empty).

## Do
1. Run the origination method from `ai/art-direction.md` (emotional truth → concept thesis → derive palette/type/radius/spacing/motion/device, each with a reason → name it → 3–4 layout motifs) — **once per direction**.
2. Produce **2–3 directions that obey the anti-convergence rule**: one restrained/editorial, one bold/expressive, one unexpected/conceptual. If two could swap palettes and become the same site, throw one out and go further.
3. Every direction must define **one signature visual device** that will recur in ≥3 sections, with a small JSX/CSS sketch.

## Output — write ONLY these files (no page code, no globals.css yet)
For each direction, `ai/_generated/directions/<slug>/`:
- **`concept.md`** — the sections specified in `ai/art-direction.md` (Name, Emotional truth, Concept thesis, **Roots in the intake** — explicit brand-story grounding citing the brief/intake fields, Palette POV, Type system, Radius/spacing/motion, Signature device + sketch, Layout motifs, Why it serves the brief). The operator is choosing a brand story at the gate; the "Roots in the intake" paragraph is what makes that choice transparent — never reduce it to one line.
- **`tokens.draft.css`** — a `:root` sketch (anchor hex, `--radius-base`, `--type-ratio`, font variable names, motion timings) per `ai/tokens-spec.md`. Not yet wired into `@theme`.

End by printing the direction names + one-line theses and **stop** — tell the operator to run `/direction-gate`. Do not write component or CSS files.
