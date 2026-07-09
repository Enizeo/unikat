---
description: Visual review loop — render the built site across devices, judge the painted pixels, fix until it looks client-ready
argument-hint: "[base-url — defaults to http://localhost:3000]"
---

You are the **visual review** step (stage 7). Stage 6 (`/review`) audited *copy + code*
but is blind to the rendered layout — it says so itself. You audit the **painted pixels**
across devices and **loop until the site looks like something you could hand to the client
unseen.** You run after `/review` is clean and before the human's final look.

## Read first
- `ai/review/visual-rubric.md` — the dimensions (collision, overflow, image-framing, spacing, responsive, polish), severity gating, JSON contract, exit/`needs-human`/loop-cap. This governs the whole step.
- `scripts/visual-review.mjs` — the harness you run. Core-3 matrix (mobile 375 · tablet 768 · desktop 1440), auto-discovers routes, writes screenshots + `findings.json`.

## Setup (once)
- Ensure deps: `npm install` and, if Chromium isn't present, `npx playwright install chromium`.
- Build a production-faithful server (catches what `next dev` hides):
  `npm run build` then `npm run start &` (background). Wait for `http://localhost:3000` to answer (poll it). Use that as the base URL.

## The loop (max 3 rounds)
Each round:

1. **Capture** — `node scripts/visual-review.mjs` (pass `--base-url` if not :3000). It writes `ai/_generated/visual-review/<route>/<device>.{full,fold}.png` + `findings.json`.

2. **Read the automated layer** — parse `findings.json`. Every `horizontalOverflow.overflow`, `brokenImages`, `collisions`, and `textClipping` entry is a **hard flag** (a gate you cannot fudge): treat as real until you confirm in the screenshot it's intentional. `cropRiskImages` are **review candidates** — open them and decide.

3. **Look** — open **every** screenshot with the Read tool (it renders images). Go route by route, device by device. Judge each against `ai/review/visual-rubric.md`. The probes catch geometry; only your eye catches "this looks cheap" (dimension V6). Be a skeptic — assume broken until the pixels prove clean.

4. **Merge** findings (automated + visual) into one array in the rubric's JSON shape. Write it to `ai/_generated/visual-review/round-N.json` + a short `round-N.md` summary.

5. **Fix** every `blocker` and `major` (and cheap `minor`s) in the section components / `app/globals.css`:
   - overflow → `min-w-0`, `overflow-x-hidden` on the right container, `max-w-full`, responsive variants; find the offending selector from the probe.
   - off-center portrait → `object-position` (e.g. `className="object-[50%_30%]"`).
   - cramped/broken responsive → fix the breakpoint variants (`sm:`/`md:`/`lg:`).
   - weak/empty hero, spacing, alignment → per the rubric.
   - Keep the token discipline from stage 6: no hardcoded hex/px outside `globals.css :root`.

6. **Re-capture the changed surface** (rebuild if you touched components: `npm run build` then restart). Exit when **0 blockers and 0 majors across all route × device**. Raise `needs-human` (and stop) when a defect needs a *new source asset* (a portrait cropped too tight to save, a missing image). Hard-stop at 3 rounds with a summary.

## Output
A per-device pass/fail summary, what was fixed each round, and either **"clean — ready for human / client"** with the path to the final screenshot set, or the `needs-human` items with their screenshots. Then stop and hand back to the operator.

> Always tear down the background `npm run start` server when done.
