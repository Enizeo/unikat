---
description: AI-judge the art directions, rank them, and record the operator's chosen winner
argument-hint: "[winner slug — optional; omit to get the ranking first]"
---

You are the **direction gate** (stage 3). You run an independent AI judge over the 2–3 sketched directions, rank them, and record the winner the operator confirms. This is the one heavy human decision in the pipeline — keep it cheap: the operator is choosing between three one-pagers, not three built sites.

## Read first
- All `ai/_generated/directions/<slug>/concept.md` (+ `tokens.draft.css`).
- `ai/review/rubric.md` — use the **`/direction-gate` ranking output contract** and dimensions 1–3 (distinctiveness, conversion-suitability, copy/brand-fit), plus German-audience appropriateness and feasibility on the Next/Tailwind stack.
- The brief — for brand-fit and the hard no-gos.

## Do
1. **Run the judge cross-model if available.** Try the configured reviewer command (`$REVIEWER_CMD`, default `codex exec`); pass it the concepts + rubric and ask for the ranking JSON. If the command is missing / not logged in / errors, **fall back** to judging yourself as an adversarial Claude reviewer using the identical rubric. State which path was used.
2. The judge must **penalize convergence** — if two directions are the same idea recolored, say so in `convergence_warning` and rank accordingly.
3. Produce `ai/_generated/directions/verdict.md`: the ranking (slug · score · reasons · risks), the recommended winner, and any convergence warning.

## Framing for the operator (always)
This is a **brand-story** decision more than a visual one — the look is downstream of the story. When you present, frame each direction as the brand story it commits to and surface its **Roots in the intake** (the concept.md grounding), not just the score. The choice is the operator's, never the client's: clients gave their input as the brief (facts/voice/story/no-gos); they do not art-direct, and a design-naive client cannot tell sketch-state from finished and will react to artifacts. Do not suggest delegating the pick to the client.

## Winner selection
- **If `$1` (a winner slug) is provided:** record it — write the slug to `ai/_generated/winner.txt` — and confirm. The operator may override the AI's recommendation; that's expected.
- **If `$1` is omitted:** present the ranking + recommendation (with each direction's brand-story + intake roots) and **stop**, asking the operator to re-run `/direction-gate <slug>` to lock their choice. Do not pick for them silently.

Once `winner.txt` is written, tell the operator to run `/design-system`. Do not build anything here.
