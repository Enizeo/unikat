# Visual Rubric — the rendered-pixel bar every site clears before a human looks

This is the **stage-7 (`/visual-review`)** companion to `ai/review/rubric.md`. Stage 6
reviews *copy text + source code* — by its own admission it "can't see the live site."
So overlap, off-center crops, horizontal scroll, and broken responsive layouts ship
straight through. This rubric closes that gap: it judges the **actual painted result**,
captured by `scripts/visual-review.mjs` across the Core-3 device matrix
(mobile 375×812 · tablet 768×1024 · desktop 1440×900).

The standard: **a site the operator could hand to the client unseen and they'd read it
as high-quality work.** Assume the layout is broken until the screenshots prove otherwise.

---

## Inputs the reviewer judges

1. `ai/_generated/visual-review/findings.json` — the **automated probe layer** (the
   cannot-fudge gates): horizontal overflow, off-canvas/clipped elements, text clipping,
   text collisions, broken images, crop-risk photos. Every hard flag here is real until
   shown to be intentional.
2. The **screenshots** — `<route>/<device>.full.png` (whole page) and `.fold.png`
   (above the fold), for **every** route × device. **Open and look at each one.** The
   probes catch geometry; only the eye catches "this looks cheap."

---

## Output contract (STRICT) — identical shape to `ai/review/rubric.md`

JSON only, no prose around it:

```json
{
  "summary": "one-line overall verdict",
  "findings": [
    {
      "dimension": "collision | overflow | image-framing | spacing | responsive | polish",
      "severity": "blocker | major | minor",
      "device": "mobile | tablet | desktop | all",
      "route": "/ausbildung",
      "file": "components/sections/hero.tsx",
      "locator": "selector / section id / 'hero portrait'",
      "evidence": "ai/_generated/visual-review/ausbildung/mobile.full.png + probe: horizontalOverflow.offenders[0]",
      "problem": "what is wrong, concretely, and on which device",
      "suggested_fix": "the specific Tailwind/CSS change"
    }
  ]
}
```

`file` should point at the section component or `app/globals.css`. Always name the
`device` and cite the screenshot (and probe path, if the automated layer flagged it) in
`evidence` — a finding with no visual evidence is a guess, not a finding.

---

## Dimensions

### V1. Collision — *no element sits on top of another*
- No text over text, text over an image caption, or button over copy. Overlap → `blocker`.
- The `collisions` probe is a strong signal; confirm in the screenshot (probes can false-positive on intentional layered design — a caption *designed* to sit on an image is fine if legible).
- Illegible text from a clash (contrast/overlap) → `blocker`.

### V2. Overflow & clipping — *nothing escapes or gets cut*
- **No horizontal scroll on any device** (the `horizontalOverflow` probe). On mobile this is the single most common defect → `blocker`.
- No content cut off at a viewport edge; no text jammed against the edge with no padding (gutter < ~16px on mobile) → `major`.
- No `textClipping` eating a heading/word (an element clipping its own content) → `major`.

### V3. Image framing — *every photo is well-composed*
- Portraits/photos are **focal-centered** — face/subject not cut off or pushed to an edge. The classic failure: an off-center portrait crop. → `major`.
- The `cropRiskImages` probe flags `object-fit:cover` images on a cropped frame with a **default** focal point — open each and judge: is the subject actually mis-framed? If yes → `major`, fix via `object-position` (or `className="object-[50%_30%]"`). If the framing is fine, dismiss it.
- No broken/empty images (`brokenImages` probe) → `blocker`. No visibly stretched/squashed aspect ratios → `major`.

### V4. Spacing & rhythm — *the page breathes consistently*
- Consistent section padding; no orphaned huge gaps, no cramped/touching blocks → `major`/`minor` by severity.
- Vertical rhythm holds at **every** breakpoint — a layout can be perfect on desktop and cramped on mobile. Judge each device.
- Headings, buttons, and cards align to a shared grid; nothing is 4px off from its neighbors → `minor` (unless it reads as broken).

### V5. Responsive integrity — *the layout adapts, not just shrinks*
- Grids reflow (multi-column → stacked), the nav collapses correctly (hamburger works, no overflowing link row), type scales down → else `major`.
- No desktop layout crushed into a mobile width (tiny text, side-by-side columns that should stack) → `major`.
- Tap targets on mobile aren't microscopic or overlapping → `minor`/`major`.

### V6. Premium polish — *the catch-all quality bar*
- Step back from each screenshot: **would a paying client read this as high-quality, finished work?** Anything that looks cheap, unbalanced, mis-aligned, or "off" → finding, severity by how much it cheapens the page.
- Hero lands with impact; nothing looks like a placeholder or an unstyled default. Weak/empty hero on any device → `major`.
- This dimension exists so "technically no overlap, but it just doesn't look good" still gets caught and fixed.

---

## Severity → action (same gate as stage 6)

| Severity | Meaning | Loop action |
|----------|---------|-------------|
| `blocker` | horizontal scroll, collision, broken/illegible content, cut-off subject | Must fix. Loop continues. |
| `major` | off-center portrait, cramped/broken responsive layout, weak hero, edge-jam | Fix. Loop continues. |
| `minor` | small alignment/spacing polish | Fix if cheap; else log and proceed. |

**Exit condition:** zero `blocker` **and** zero `major`, across **all** routes × devices.
Then hand the clean screenshot set to the operator.

**`needs-human` escape:** raise (and stop) when a defect can't be fixed in code because the
**source asset is wrong** — e.g. a portrait shot so tight that no `object-position` saves
it, or a missing image. Surface it with the screenshot rather than spinning.

**Loop cap:** hard stop at **3 rounds**; on cap, emit a summary of what remains + the
screenshots, and hand to the human.
