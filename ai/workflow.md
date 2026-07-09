# Workflow — How to generate a website (v2)

The generator turns a client brief into a **distinctive**, multi-page, conversion-focused site. The design is **originated** under a wow-mandate (see `ai/art-direction.md`), not assembled from a fixed template — that is the core change from v1. An AI review loop runs **before** any human looks, so the operator's first review is on an already-clean site.

There are **eight stages**, run as slash commands. Most gates are AI; the one heavy human decision is choosing the winning art direction (stage 3).

```
0. /interview      (run OUTSIDE the repo, German, with the client)  → ai/brief.md
1. /intake         structure-only plan (no visuals)                 → ai/_generated/site-plan.md   [human: skim facts]
2. /art-direction  originate 2–3 divergent directions               → ai/_generated/directions/<slug>/
3. /direction-gate AI judge ranks → operator confirms winner        → ai/_generated/winner.txt      [human: pick winner]
4. /design-system  promote winner into real tokens + device         → app/globals.css, layout, signature.tsx, /design-system  [human: skim]
5. /build-site     full multi-page site on the winner               → app/**, components/sections/**
6. /review         cross-model AI loop on copy + code until clean   → ai/_generated/review/round-N.*  [AI-judge, looped]
7. /visual-review  render across devices, judge pixels, fix until clean → ai/_generated/visual-review/  [AI-judge, looped]
8. (human)         final look + deploy to Vercel
```

## Stage 0 — `/interview` (the client briefing)
The brief is collected by an AI interviewer that runs **outside this repo**: the operator pastes the prompt-pack (`ai/interview/interview-prompt.md` + `ai/interview/brief-schema.md`) into a fresh Claude/ChatGPT chat and runs a ~20–30 min German conversation with the client. It emits a `brief.md` in the locked schema. The operator pastes that into **`ai/brief.md`**. The interview gets facts, story, and voice — **not** design (clients don't art-direct). `/interview` just assembles the pack.

## Single-page or multi-page
A brief produces **one page** by default. A `## Pages` block (one `### Page …` per route, with `route`/`nav_label`/`nav_order` + that page's content) produces a **multi-page** site. The top-level blocks (Site Config, Identity, global Conversion, Legal, Visual Direction) stay global; navbar + footer become global chrome in `app/layout.tsx`; the cta repeats per page. Legal pages (`/impressum`, `/datenschutz`) are their own routes when legal is on.

## The stages in detail
1. **`/intake`** → `ai/_generated/site-plan.md`: which sections per page, in order, with data sources. **Structure only — no layouts/zones** (those depend on the direction). Runs the conversion-floor check. *Gate:* skim the plan, fix the brief, re-run.
2. **`/art-direction`** → 2–3 sketched directions (`concept.md` + `tokens.draft.css` each), genuinely divergent (restrained / bold / conceptual), each with a signature device. *No gate yet.*
3. **`/direction-gate`** → an AI judge (cross-model if available) ranks the directions into `verdict.md`; the operator confirms a winner (`/direction-gate <slug>` → `winner.txt`). *The one heavy human gate — cheap, since it's three one-pagers.*
4. **`/design-system`** → promotes the winner into real brand tokens in `app/globals.css`, wires fonts, builds `components/signature.tsx`, regenerates `/design-system`. Then runs a **cross-model foundation review** (rubric's `/design-system` scope: distinctiveness + signature device + no-gos honored + build) and fixes blockers/majors — catching a weak foundation before the whole site is built on it. *Gate:* open `/design-system`, confirm it feels like the brand.
5. **`/build-site`** → builds the planned sections (direction-shaped, signature device threaded ≥3×, motion applied) + chrome + legal, assembles routes.
6. **`/review`** → mechanical checks + cross-model qualitative review (distinctiveness/conversion/copy/code/a11y), auto-fixes, loops until 0 blockers+majors or `needs-human`. *AI gate.*
7. **`/visual-review`** → renders the built site across the Core-3 device matrix (mobile 375 · tablet 768 · desktop 1440) via Playwright (`scripts/visual-review.mjs`), runs DOM probes (overflow / collision / broken + crop-risk images) **and** an eyes-on screenshot pass against `ai/review/visual-rubric.md`, auto-fixes the rendered defects a copy/code review can't see, loops until 0 blockers+majors or `needs-human`. *AI gate.*
8. **Human** → final look + deploy.

Each command optionally takes a brief path argument; all default to `ai/brief.md`.

## The reference files (what each command leans on)
- `ai/sections.md` — section catalog (include-when + content models) + per-section craft appendix.
- `ai/art-direction.md` — the wow mandate + origination method (stage 2).
- `ai/tokens-spec.md` — the token plumbing contract (categories fixed, values brand-derived).
- `ai/design-language.md` — positive craft rules for building the winning direction.
- `ai/review/rubric.md` — cross-model review dimensions + severity (stages 3 and 6).
- `ai/review/visual-rubric.md` — the rendered-pixel bar for stage 7 (collision / overflow / image-framing / spacing / responsive / polish).
- `scripts/visual-review.mjs` — the Playwright harness stage 7 runs (Core-3 screenshots + DOM probes → `ai/_generated/visual-review/`).
- `ai/system-rules.md` — no-hallucination contract: AI writes copy, never invents facts.
- `ai/interview/` — the client-interview prompt-pack + brief schema (stage 0).

`ai/_generated/` is disposable build state and is git-ignored.
