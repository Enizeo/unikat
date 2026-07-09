# Section Library — Adaptive Catalog + Reference

The generator builds a page by **picking sections from this catalog based on what the brief contains**, not from a fixed funnel. There is no required section count and no fixed order beyond the default spine below.

- **Part 1 — Catalog** is the picking path: for each section, its `include-when` rule, required brief fields, and content model (the props interface). `/intake` reads this to produce the site plan.
- **Part 2 — Ordering & guardrails** is how the picked sections are sequenced and quality-checked.
- **Part 3 — Reference appendix** is the craft path: per-section purpose, copy rules, and failure modes. `/build-site` consults the relevant entry while writing each section.

Global no-hallucination rules live in `system-rules.md`. Visual/layout craft lives in `design-language.md`; the design's point of view is originated in `art-direction.md`. This file is service/B2B-agnostic — "the offer," "the buyer," "the person behind it" — not coaching-specific.

---

## Part 1 — Catalog

Each component lives in `components/sections/<id>.tsx` (Navbar in `components/navbar.tsx`) with a co-located typed props interface. Optional props that have no data are simply not passed.

### navbar — always
Persistent orientation + always-visible primary CTA.
```ts
interface NavbarProps {
  brandName: string;
  navLinks?: { label: string; href: string }[]; // single-page: 3–4 in-page anchors. multi-page: one link per route, ordered by nav_order
  primaryCta: { label: string; href: string };   // matches Hero; href is the CTA anchor (e.g. #kontakt) or external
}
```
*Multi-page:* the navbar is global chrome (rendered once in `app/layout.tsx`) and its `navLinks` are cross-route paths (`/sessions`, `/ueber-mich`), not in-page anchors. The primary CTA still points at the `cta` section anchor, which repeats on every page so it always resolves.

### hero — always
Orient: who this is for, the core promise, the primary action. Does not sell.
```ts
interface HeroProps {
  overline?: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  proof?: { value: string; label: string }[]; // FACTS only, max 2–3
}
```

### problem — include when `audience.pain_points` present
"I understand where you are." Sits in the tension; does not solve.
```ts
interface ProblemProps {
  headline: string;
  subheadline?: string;
  painPoints: { statement: string; detail?: string }[]; // 3–5
  closingLine?: string;
}
```

### outcome — include when `audience.desired_outcomes` present
"Here's where you could be." Resolves the tension; does not explain how.
```ts
interface OutcomeProps {
  headline: string;
  subheadline?: string;
  outcomes: { statement: string; detail?: string }[]; // 3–5, mirror the pain points
  image?: { src: string; alt: string };
}
```

### mechanism — include when `approach` or `pillars` present
"Why this works / how it works." Intellectual credibility through specificity.
```ts
interface MechanismProps {
  headline: string;
  subheadline?: string;
  pillars: { title: string; description: string; icon?: string }[]; // 2–4
  philosophy?: string;
}
```

### offer — include when `deliverables` has ≥3 items
"What you actually get." Clarity, not persuasion. Deliverable titles are FACTS.
```ts
interface OfferProps {
  headline: string;
  subheadline?: string;
  items: { title: string; description: string; icon?: string }[]; // 3–8
  format?: string;
  cta?: { label: string; href: string };
}
```

### proof — include when ≥1 of testimonials / stats / credentials / logos present
Third-party validation. **Strictest section: every data point is verbatim from the brief.**
```ts
interface ProofProps {
  headline: string;
  testimonials?: { quote: string; name: string; role?: string; image?: { src: string; alt: string } }[];
  stats?: { value: string; label: string }[];
  credentials?: { label: string; logo?: { src: string; alt: string } }[];
  logos?: { src: string; alt: string }[];
}
```

### about — include when `bio` present
"Who is behind it." People buy from people; feel like meeting them, not a CV.
```ts
interface AboutProps {
  headline: string;
  bio: string | string[];          // 2–4 paragraphs
  image: { src: string; alt: string };
  credentials?: string[];          // 3–5
  personalNote?: string;
}
```

### faq — include when `faqs` present, or audience + offer present (drafted)
Resolve the objections that block a decision. If `faqs` present, use verbatim; else FAQ is a creative section the generator may draft (see system-rules).
```ts
interface FaqProps {
  headline: string;
  items: { question: string; answer: string }[]; // 5–8
}
```

### leadCapture — include when `site_config.lead_capture: on` and a magnet is provided
Lower-friction conversion for visitors not ready for the primary action.
```ts
interface LeadCaptureProps {
  headline: string;
  description: string;
  incentive?: string;
  formFields: { field: string; placeholder: string; required: boolean }[]; // default: email only
  buttonLabel: string;
  privacyNote?: string;
}
```

### cta — always
The primary conversion moment. Inline form when the goal is a call/enquiry (`book-call`/`enquire`); a prominent link button when the goal points to a dedicated destination (`buy`/`signup`, or an external booking page). The wrapper carries the CTA anchor id the navbar/hero link to.
```ts
interface CtaProps {
  headline: string;
  subheadline?: string;
  primaryCta: { label: string; href: string }; // label = submit text when formFields present
  formFields?: { field: string; label?: string; placeholder: string; type?: string; required: boolean }[]; // ≤4
  successMessage?: string;
  secondaryCta?: { label: string; href: string };
  reassurance?: string;
}
```

### footer — always
Closure + utility + baseline trust. No sales copy, no primary CTA. Renders legal links when `legal_pages ≠ none`.
```ts
interface FooterProps {
  brandName: string;
  tagline?: string;
  links?: { label: string; href: string }[];        // utility + legal (Impressum, Datenschutz)
  socialLinks?: { platform: string; href: string; icon?: string }[];
  contactEmail?: string;
  copyright: string;                                  // "© {year} {brandName}"
}
```

---

## Part 2 — Ordering & guardrails

**Default narrative spine** (drop any section whose include-when is false; reorder only with a stated reason):

```
hero → [problem] → [outcome] → [mechanism] → [offer]
     → [proof] → [about] → [leadCapture?] → [faq] → cta → footer
```

- `leadCapture` position is flexible — after mechanism, after proof, or just before cta — whichever best fits the goal.
- The navbar renders above all sections (fixed/sticky). Each section owns its vertical spacing; the page adds no inter-section spacing.

**Multi-page** (brief has a `## Pages` block): each page is planned **independently** — its own spine, its own conversion-floor and guardrail checks against its own sections. The `hero`, `cta`, and `footer`-anchored CTA repeat on every page (the cta section carries `id="kontakt"`). Navbar and footer are **global chrome** shared by all routes via `app/layout.tsx`; the navbar lists every page route (ordered by `nav_order`). Each route is a real page under `app/<route>/page.tsx` (home = `app/page.tsx`).

**Conversion-quality floor** (so an adaptive page still converts):
- The primary CTA must appear **at least twice** (hero + cta minimum; navbar counts as persistent).
- At least **one credibility element** must be present somewhere — a Proof section, the hero proof row, or About credentials. If the brief has no proof facts at all, the plan **flags** this rather than shipping an unconvincing page.

**Visual guardrails** — in v2 these depend on the chosen art direction, so they are **not** assigned at plan time. They are applied by `/build-site` (against the winning `concept.md`) and enforced by `/review` (see `design-language.md`):
- ≤ 3 sections may use a card grid as their primary layout.
- ≥ 3 distinct background zones across the page.
- No more than 2 consecutive sections share the same layout pattern.
- H1 (hero) clearly larger than section H2s; the primary CTA is visually unmissable; the signature device recurs in ≥3 sections.

**Legal & anchors:**
- `legal_pages: de-impressum-datenschutz` → generate `app/impressum/page.tsx` + `app/datenschutz/page.tsx` and link both from the footer. `none` → skip both and emit no legal links.
- The CTA-target section gets a stable `id` (default `cta`); navbar/hero hrefs resolve to it.

---

## Part 3 — Reference appendix (per-section craft)

Consult the entry for the section being written. "Avoid" lists are failure modes.

### Hero
- Headline names a transformation/outcome, never a product label. Subheadline bridges to the CTA and does not repeat the headline. CTA label is specific ("Book a diagnosis call"), never "Get started."
- Don't default to centered single-column — choose a layout that fits the visual direction (split with image, asymmetric data panel, or bold typographic break).
- Avoid: product-label headline, subheadline restating the headline, vague CTA, invented proof numbers, disconnected stock imagery.

### Problem
- Name specific, observable situations in the audience's own language — not abstract feelings ("you feel stuck"). Empathetic, not alarmist. Each pain point distinct. No stats/quotes/medical claims.
- Avoid: vague or generic pains, 6+ items, fear-mongering, bleeding into the solution.

### Outcome
- Each outcome is a specific observable state, mirroring a pain point. Aspirational but honest — no guarantees, no income/revenue claims.
- Avoid: vague emotional states, outcomes that don't answer the problems, hyperbole, 6+ items.

### Mechanism
- Intelligent and specific — this is where expertise shows. Each pillar self-contained and distinct from title + description alone. No invented research, methodology names, or scientific claims.
- Avoid: buzzword pillars, 5+ pillars, overlap with Outcome (results) or Offer (deliverables), manifesto-length philosophy.

### Offer
- Item titles are specific deliverables (facts), not benefits. Descriptions connect deliverable → result. Format details concrete. Don't invent counts/hours/sessions, pricing, or bonuses.
- Avoid: benefits disguised as deliverables, <3 or >8 items, title-only items, overlap with Mechanism.

### Proof
- **Strictest rules.** AI may only draft the headline and choose which proof to feature. Never invent quotes, names, roles, stat values/labels, credentials, or logos. Quotes describe a specific result, not generic praise. Let evidence speak — no superlatives.
- Avoid: generic praise, 5+ testimonials, anonymous quotes, clutter from too many proof types, repeating hero proof.

### About
- Sounds like the person; focuses on relevance to the visitor over full career history; includes one human detail. Credentials listed simply. Never invent biography, credentials, affiliations, client names, or results.
- Avoid: LinkedIn-summary tone, missing/low-effort photo, 5+ or 1-sentence bio, credentials dominating the story.

### FAQ
- Questions in the visitor's voice; answers start with the answer, then explain; state real limitations honestly. Priority: qualification → logistics → investment → outcome → comparison → risk. Don't invent pricing, schedules, guarantees, or named-competitor comparisons. No "Great question!" filler, no hidden sales copy.
- Avoid: planted questions, paragraph answers, avoiding price/commitment/risk, duplicates.

### Lead Capture
- Headline names the thing offered, not "sign up." Button is value-specific ("Send me the template"), never "Submit." Keep visible copy <50 words; default to email-only. The magnet itself is a fact from the brief — don't invent what it contains.
- Must be visually distinct (use `bg-surface-elevated` or an accent border — never blend into a dark theme) and must not visually compete with the primary CTA.
- Avoid: no clear value exchange, too many fields, generic-newsletter look, missing privacy note.

### CTA
- Invitation, not a re-pitch; assumes the visitor is ready. Submit/CTA label matches the hero. When the goal is a call/enquiry, include an inline form (≤4 fields: name, email, optional company, one qualifying field derived from the offer) and an on-brand `successMessage` ("Got it. Jonas will be in touch within 48 hours."). Never invent scarcity, urgency, pricing, or destinations.
- Avoid: link-only when the offer is a consultation, 5+ fields, generic success message, CTA label mismatch, manufactured urgency.

### Navbar
- Links are short anchor labels ("How it works", "About", "FAQ"); CTA label matches the hero exactly. Mobile: hamburger that closes on link/CTA tap; smooth open/close fitting the brand tone. Lightweight — must not compete with the hero. Brand name verbatim.

### Footer
- Tagline is a quiet brand statement, not a headline. Standard link labels; include legal links when legal pages exist. Don't invent social URLs, email, or brand name. Icon-based socials; stacks gracefully on mobile.
- Avoid: visual heaviness, sales copy or a primary CTA, broken/empty social links.
