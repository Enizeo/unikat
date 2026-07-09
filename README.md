# Unikat — distinctive site generator

*Unikat (German): a one-of-a-kind piece. The promise of this generator: a site that could
only belong to this one brand — never a template.*

Turn a client brief into a **distinctive**, multi-page, conversion-focused website
(Next.js 16 · React 19 · Tailwind v4 · brand-derived token system). The design is
**originated** under a wow-mandate (see `ai/art-direction.md`) — not assembled from a
fixed template — and an AI review loop runs **before** any human looks, so your first
review is on an already-clean site. It's **adaptive**: it builds the sections the brief
supports, with no fixed funnel.

This repo is a **GitHub template**. Each client site = its own repo (or `client/*`
branch) created from it. The starter evolves here on `main`; examples live on
`example/*` branches.

## Schnellstart (Deutsch)

So baust du deine **eigene** Website — du brauchst keinerlei Programmier-Erfahrung:

1. **Repo anlegen:** Oben rechts auf **"Use this template" → "Create a new repository"** klicken (GitHub-Account nötig). Ein Repo pro Website.
2. **Voraussetzungen installieren:** [Node.js](https://nodejs.org) (Version 20+) und [Claude Code](https://claude.com/claude-code). Dann das Repo klonen (in VS Code: "Clone Git Repository" und die URL deines neuen Repos einfügen).
3. **Claude Code im Projektordner starten** und einfach schreiben: *"Ich will meine Website bauen — führ mich durch."* Claude kennt den ganzen Ablauf (steht in `CLAUDE.md`), erledigt die Technik (`npm install` etc.) und führt dich auf Deutsch durch alle Stufen.
4. **Das Interview:** Claude interviewt dich direkt im Chat zu deinem Business (~20–30 Min) — Geschichte, Angebot, Fakten. Wichtig: Es fragt bewusst **nicht** nach Farben oder Design. Das Design entsteht später — deine Entscheidung ist die Wahl zwischen 2–3 fertigen Design-Richtungen.
5. **Danach laufen die Stufen 1–7** (Tabelle unten) unter Claudes Führung durch: Planung → Design-Richtungen → deine Wahl → Aufbau → zwei KI-Qualitätsprüfungen. Am Ende: anschauen, feedbacken, live gehen (z. B. Vercel — auch dabei führt dich Claude).

Die Doku unten ist auf Englisch — musst du nicht lesen. Fragen? Einfach Claude im Repo fragen, es kennt den ganzen Aufbau. Baust du eine Site **für jemand anderen** (Kundenprojekt), nutze `/interview client` für das externe Kundeninterview.

## How to build a site — the 8 stages

The brief is collected by an **AI interview** — in-session when you build your own site,
via an external prompt-pack for client projects. Everything runs as Claude Code slash commands. Most gates are AI; the one heavy
human decision is picking the winning art direction.

| Stage | Command | Does | Gate |
|---|---|---|---|
| 0 | `/interview` | Runs the German brand interview **in-session** with the site owner and writes `ai/brief.md` (`/interview client`: emits the prompt-pack for an external client interview instead) | — |
| 1 | `/intake` | Picks sections per page → `ai/_generated/site-plan.md` (structure only, no code) | Skim the plan |
| 2 | `/art-direction` | Originates 2–3 divergent design directions (sketch level) | — |
| 3 | `/direction-gate` | AI judge ranks them; you confirm a winner → `winner.txt` | **Pick winner** |
| 4 | `/design-system` | Promotes the winner into real brand tokens, fonts, the signature device, `/design-system` page + a cross-model foundation review | Open `/design-system` |
| 5 | `/build-site` | Builds the planned sections (direction-shaped) + chrome + legal | — |
| 6 | `/review` | Cross-model AI loop (distinctiveness / conversion / copy / code / a11y) until clean | AI-judge |
| 7 | `/visual-review` | Renders the site across devices, judges the painted pixels, fixes overlap / overflow / crops / responsive breakage until clean | AI-judge |
| 8 | (human) | Final look + deploy to Vercel | **Ship** |

Each command optionally takes a brief path (defaults to `ai/brief.md`).

After the copy/code review (6) passes, **`/visual-review` (7)** renders the running site
across the Core-3 device matrix (mobile 375 · tablet 768 · desktop 1440) and loops on the
*rendered pixels* — overlap, horizontal overflow, off-center crops, broken responsive
layouts — that a text/code review can't see. It needs Playwright (`npx playwright install
chromium`, once).

Cross-model review runs at **three** gates — the direction gate (3), the design-system
foundation (4), and the final review (6) — using **Codex** (via your ChatGPT login) as an
independent second model when available, falling back to a Claude adversarial reviewer
otherwise. Set `REVIEWER_CMD` to override the reviewer command (default `codex exec`).

### Cross-model review (Codex) — one-time setup
The Codex CLI gives `/review` and `/direction-gate` a genuine *second model*. It's
optional — without it they run a Claude adversarial reviewer with the same rubric — but
recommended. Run these yourself (the global install + interactive login need your
permissions; in Claude Code prefix with `!`):
```
brew install codex               # preferred (no sudo); npm -g needs a writable prefix
codex login status               # confirm you're logged in via ChatGPT (else: codex login)
codex exec "reply with the single word OK"   # smoke test → should print OK
```
Once `codex` is on your PATH, the review commands pick it up automatically.

## Starting a new client

- **Recommended:** GitHub → *Use this template* → new repo → run `/interview` with the client → run stages 1–7 → deploy.
- Or branch within a repo: `git switch -c client/<name>`, then the same steps.

When starting from a repo that already has a built site, clear the prior output first so
the adaptive build is clean:
```
rm -rf components/sections components/navbar.tsx app/design-system app/impressum app/datenschutz
```

## How it works (the reference files)

- `ai/brief.md` — the single input (emitted by the interview). Facts (proof, deliverables, legal…) are used verbatim and never invented; directions (voice, the thin visual block) are interpreted.
- `ai/interview/` — the German client-interview prompt-pack + the locked brief schema.
- `ai/sections.md` — section **catalog** (include-when rules + content models) + per-section craft **appendix**.
- `ai/art-direction.md` — the wow mandate + the method to **originate** a design point of view (the heart of v2).
- `ai/tokens-spec.md` — the token **plumbing** contract: categories are fixed, values are brand-derived (radius / type-scale / spacing / motion per brand).
- `ai/design-language.md` — positive craft rules for building the winning direction.
- `ai/review/rubric.md` — the cross-model copy/code review dimensions + severity gating.
- `ai/review/visual-rubric.md` — the stage-7 rendered-pixel bar (collision / overflow / image-framing / spacing / responsive / polish).
- `ai/system-rules.md` — the no-hallucination contract.
- `ai/workflow.md` — the 8-stage workflow in one page.

`ai/_generated/` is disposable build state (git-ignored).

## Examples

- `ai/brief.md` ships filled with the fictional **"Northline"** brief (dark, data-forward B2B) so the schema is self-documenting; `ai/_examples/sparse-plumber.md` shows a deliberately thin brief.
- Full example builds will live on `example/*` branches as they are added.

## Local dev

```
npm install
npm run dev      # http://localhost:3000  (also /design-system once generated)
npm run build    # production build + typecheck
```
