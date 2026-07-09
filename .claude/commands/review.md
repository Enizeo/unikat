---
description: Cross-model AI review loop — audit the built site and fix until it passes
argument-hint: "[path to brief — defaults to ai/brief.md]"
---

You are the **review** step (stage 6). You audit the built site against `ai/review/rubric.md`, fix what fails, and **loop until it passes** — so the operator's first human look is on an already-clean site. You supersede the old `/verify-build` (its mechanical checks are dimension 4 here).

## Read first
- `ai/review/rubric.md` — the dimensions, severity gating, JSON contract, exit/`needs-human`/loop-cap rules. This governs the whole step.
- `ai/_generated/site-plan.md`, the winning `ai/_generated/directions/<slug>/concept.md`, and the brief.

## The loop (max 4 rounds)
Each round:

1. **Mechanical checks (always you, fast):**
   - `npm run build` and `npx tsc --noEmit` — capture failures verbatim → `blocker`.
   - Grep hardcoded hex/px outside `app/globals.css :root` in `components/` and `app/` → each hit `major`.
   - `font-display`/`font-heading` resolves to a real family.
   - Plan ⇄ page parity + route inventory + shared chrome in `app/layout.tsx` + legal parity.
   - List every unresolved `// MISSING:` / `// REVIEW:`.

2. **Qualitative cross-model review:** run the configured reviewer (`$REVIEWER_CMD`, default `codex exec`) over the rubric + the *rendered copy* (run the build first; the reviewer can't see the live site) + the relevant section source, for dimensions distinctiveness / conversion / copy / accessibility. The reviewer returns the **findings JSON** from the rubric.
   - **Model-agnostic fallback:** if `$REVIEWER_CMD` is missing / not logged in / errors, run the identical rubric as an adversarial Claude sub-agent with the same JSON contract. State which path ran. (Optionally run both and merge findings.)

3. **Fix:** apply fixes for every `blocker` and `major` (and cheap `minor`s). For copy `blocker`s that are fabrications, you cannot invent the fact — mark `needs-human`.

4. **Re-check the changed surface.** Exit when **0 blockers and 0 majors**. Raise `needs-human` (and stop) for unresolvable facts or a subjective distinctiveness standoff after 2 rounds. Hard-stop at 4 rounds with a summary.

## Codex invocation (reference)
`codex exec "<contents of ai/review/rubric.md>\n\n--- REVIEW TARGET ---\n<diff or rendered copy + section source>"` → expect findings JSON on stdout (Codex runs non-interactive, read-only sandbox, in the repo workdir, on its default model — add `--model <id>` only to override). The final stdout line is the model's reply; parse the JSON from it. Write each round's raw JSON + a human-readable summary to `ai/_generated/review/round-N.{json,md}`.

## Output
A concise pass/fail summary per dimension, what was fixed each round, and either "clean — ready for human review" or the `needs-human` items. Then hand to **`/visual-review` (stage 7)** — it renders the now-clean site across devices and judges the painted pixels (overlap / overflow / crops / responsive breakage) this copy/code pass can't see — before the operator's final look.
