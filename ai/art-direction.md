# Art Direction — How to originate a design with a point of view

This is the heart of the generator. Stages 1–7 assemble, copy, and verify; **this stage decides what the site *is*.** Everything downstream serves the direction you choose here.

v1 failed because it told the model what *not* to do ("don't be generic") and locked it into a fixed palette + fixed components. That produces variety, never distinctiveness. This file does the opposite: it gives you a **positive method to originate** a design that could only belong to this one brand.

---

## The mandate

> **You are art-directing, not decorating.** The goal is maximum first-open *wow* — the feeling a visitor gets in the first second that this is a real, considered, specific thing made by someone with taste. Effort and tokens are **not** a constraint at this stage. You have **freedom**.
>
> A generic-but-safe result is a **failure**. A distinctive-but-slightly-risky result is the **target**. When you catch yourself reaching for the safe default — centered hero, three cards, gray text, one blue button — stop and choose the braver option.

Two hard limits sit above this freedom, and they never bend:

1. **Facts are sacred.** Freedom is over *aesthetics only* — palette, type, motion, layout, the signature device. You never invent a fact, a number, a testimonial, or a credential (`system-rules.md` outranks this file on anything factual).
2. **The site owner does not art-direct — even when the owner is the person you are talking to, building their own site.** Service-business owners are experts in their craft, not in design; asked for visual opinions, they reliably steer toward the generic. Honor their *facts, voice, story, and explicit no-gos* — originate everything else yourself. A brief's "Visual Direction" block is a loose signal, not a spec. Never treat a color/font opinion as a constraint unless it's a listed no-go. The owner's big design moment comes at the direction gate — choosing between finished directions, not specifying them upfront.

> **The SBR lesson.** The best site this stack ever produced ("SBR", a motorsport-events client) had *minimal* usable client input — the client's own site was poor, and the only brand assets (a logo, an Instagram grid) arrived *after* the design was already strong, and only nudged the palette. The distinctiveness came entirely from the model originating a direction under this mandate, with freedom. Weak input is not an excuse for weak output. It is the normal condition. Originate anyway.

---

## The origination method

Run this sequence for **each** direction you produce. Do not skip to tokens — the tokens must *fall out of* the thesis, with a stated reason for each, or the result is just a recolor.

### 1. Find the single emotional truth
Read the brief's Identity, Audience, and How-it-works. Ignore the Visual Direction block for now. Ask: **what does this brand actually do to a person?** Not what it sells — what shifts in the visitor. One sentence. ("Someone finally said the thing I've been avoiding." "I can breathe again." "These people are serious and I'm in safe hands.")

### 2. Translate it into a concept thesis
Turn the emotional truth into **one metaphor or organizing idea** the entire design will serve. This is the spine. Name it in a short phrase. Examples: *"a quant firm's working tool, not its marketing site"*, *"a race-poster at the start line"*, *"a still room where the light moves."* Everything after this must be traceable to the thesis.

### 3. Derive the design system *from* the thesis
For each axis, choose a value **and write the one-line reason it serves the thesis.** No reason = you defaulted.

- **Palette POV** — the color story (not just hues: their *relationship* — one dominant, a tension, where the eye is pulled). Full ramps come later in `/design-system`; here, name the anchors and the logic.
- **Type system** — a real display face with character (loaded via `next/font`) + a body face. Name them. Decide the scale's *attitude*: is display type huge and tight (poster), or restrained and precise (terminal)? A site whose headings are the body font in bold is a confessed failure of nerve.
- **Radius personality** — sharp (0), soft, or pill. One choice, derived from the thesis (precision → sharp; warmth → soft).
- **Spacing rhythm** — does the page breathe (airy) or compress (dense, urgent)? Where does it alternate?
- **Motion** — which `components/motion.tsx` primitives this direction leans on (Reveal / CountUp / Magnetic / parallax / marquee / skew) and the *one* signature interaction.
- **Imagery treatment** — full-bleed cinematic? framed? none (type-and-color only)? Decide even when assets are thin.

### 4. Name the direction
A short evocative name (`Terminal`, `Start Line`, `Stillraum`). The name is a commitment device — if you can't name it, it has no point of view yet.

### 5. Define the signature device
**Every direction must have ONE recurring visual device** — a motif that threads through **≥3 sections** and makes the site instantly recognizable. SBR's was a yellow-grey-red tri-stripe + skewed kinetic chips. It is the single highest-leverage distinctiveness move. Name it, describe it in words, and sketch it (a few lines of JSX/CSS is enough) so `/design-system` can build it as `components/signature.tsx`. A direction without a signature device is incomplete.

### 6. Sketch 3–4 layout motifs
Concrete moves, sketch-level (not full pages): the hero treatment, how the signature device appears, one section that breaks the grid, the CTA treatment. Enough that a reader can *see* it.

---

## The anti-convergence rule

You produce **2–3 directions, and they must be genuinely divergent** — different *theses*, not three recolors of one safe idea. Force range across these axes:

- **One restrained / editorial** — confident, quiet, typographic. Wow through precision and hierarchy.
- **One bold / expressive** — saturated, kinetic, large type, strong motion. Wow through energy.
- **One unexpected / conceptual** — takes the thesis somewhere literal-minded designers wouldn't. Wow through surprise.

If two of your directions could swap palettes and become the same site, you have failed the rule — throw one out and go further. The downstream AI judge (`/direction-gate`) explicitly rejects "same direction recolored."

---

## Output (per direction)

Write `ai/_generated/directions/<slug>/concept.md` and `ai/_generated/directions/<slug>/tokens.draft.css`.

**`concept.md`** sections, in order:
1. **Name** + one-line positioning.
2. **Emotional truth** (1 sentence).
3. **Concept thesis** (1 short paragraph — the metaphor/spine).
3a. **Roots in the intake** (REQUIRED — 1 short paragraph). Make the brand-story basis explicit: cite the *specific* brief fields / intake answers (identity, audience, how-it-works, story, the client's own words) that the emotional truth and thesis are built on. Quote or name them. The operator is choosing a **brand story** here, not just a look — without this grounding the choice is opaque to them. A direction whose thesis cannot be traced to real intake material is a red flag (you invented a story the client didn't give).
4. **Palette POV** — anchors + the color logic + reason.
5. **Type system** — display + body faces (named, `next/font`-loadable) + scale attitude + reason.
6. **Radius / spacing / motion** — each with its reason.
7. **Signature device** — name, description, and a small JSX/CSS sketch.
8. **Layout motifs** — 3–4 concrete moves.
9. **Why it serves the brief** — tie back to the emotional truth and respect of the client's no-gos.

**`tokens.draft.css`** — a `:root` sketch (anchor hex values, `--radius-base`, `--type-ratio`, font variable names, motion timings). Not yet wired into `@theme`; that happens in `/design-system` on the winner. Follow the categories in `tokens-spec.md`.

---

## Worked examples (for range, not to copy)

These show the method producing three *divergent* theses. Study the move from emotional truth → thesis → derived system → signature device. Do not reuse these palettes.

### A — "Terminal" (restrained / cold) — from the Northline brief
- **Emotional truth:** "Someone finally said the thing about my revenue I'd been avoiding."
- **Thesis:** *A quant firm's internal working tool, not its marketing site.* The site reads like an instrument: precise, unsentimental, built to be trusted, not liked.
- **Palette:** near-black cool-gray ground (`~#0E0F12`), cold off-white text, **one** sharp accent (electric amber) used only where the eye must go. No second accent. The restraint *is* the credibility.
- **Type:** a high-contrast condensed sans for headings with tight tracking (financial-terminal tension); a neutral, highly legible body sans with no personality. Scale attitude: confident but not loud — hierarchy through weight + tracking contrast, not size alone.
- **Radius:** `0` (sharp). Precision has no rounded corners. **Spacing:** dense and gridded in data/proof sections, breathing only at the hero and CTA. **Motion:** minimal — CountUp on the stats (the numbers *are* the argument), a single quiet Reveal cadence. No parallax, no magnetic play; that would undercut seriousness.
- **Signature device:** a thin **hairline data-grid rule** — 1px dividers forming an instrument-panel grid that frames stats, the proof table, and section edges. Recurs in hero, proof, and about.
- **Why it serves the brief:** the no-gos (no success-stock-photography, no soft wellness, no light-background-primary, no gradients) are honored by construction; the discomfort-then-relief emotional effect comes from cold precision, not reassurance.

### B — "Start Line" (bold / expressive) — the SBR pattern
- **Emotional truth:** "I get to ride the same track MotoGP rides — and I'll be looked after."
- **Thesis:** *A race-poster at the start line.* Adrenaline, motion, the second before the lights go out.
- **Palette:** near-black ground, a hot primary (racing red), a high-vis secondary (gold), a steel grey — pulled into a three-color brand stripe.
- **Type:** a tall condensed display sans (Oswald-class) at extreme scale (up to ~11rem), uppercase, `leading-[0.82]`, tight tracking — start-line board energy. Mono for telemetry-style kickers with wide tracking.
- **Radius:** mostly sharp, with skewed (not rounded) shapes. **Spacing:** big, cinematic. **Motion:** the full kit — parallax hero, CountUp stats, Magnetic CTAs, a scrolling marquee banner.
- **Signature device:** the **yellow-grey-red tri-stripe** + skewed kinetic chips (`-skew-x-12` outer, `skew-x-12` inner to keep text upright). Threads the navbar, section kickers, and CTAs.
- **Why it serves the brief:** the energy *is* the product (a trackday); the device ties directly to real merch, so it reads as authentically theirs.

### C — "Stillraum" (conceptual / warm) — a breathwork facilitator
- **Emotional truth:** "Here, I can finally exhale."
- **Thesis:** *A still room where the light moves.* The page itself should feel like a slow breath — nothing demands; everything settles.
- **Palette:** warm paper ground (off-white, not white), a deep grounded primary (forest/clay), a soft luminous accent (low-gold) used like light falling, never as a button-fill cliché.
- **Type:** a humanist serif or a warm display for headings (presence without shouting); a calm, generous body sans. Scale attitude: large but soft, never poster-loud.
- **Radius:** soft (generous, organic). **Spacing:** very airy — long exhales of whitespace; the rhythm itself is the message. **Motion:** slow, breath-paced Reveals (long duration, gentle ease); a single parallax on the hero image; no kinetic/magnetic energy (would break the calm).
- **Signature device:** a **breath-arc** — a thin expanding/contracting arc or gradient that recurs as a section divider and behind the hero, echoing an inhale. Threads hero, mechanism, and CTA.
- **Why it serves the brief:** honors the standing rule against vague spiritual clichés by being *felt* (rhythm, light, space) rather than *said*; no kitsch, no lotus-and-mandala stock.

Notice: A, B, and C cannot swap palettes and become the same site. That is the bar.
