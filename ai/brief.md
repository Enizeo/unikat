<!--
  BRIEF — the single source of truth for one website.

  This is the active brief the generation commands read. To start a new project,
  replace the content below with your own, keeping the headings and the
  REQUIRED / OPTIONAL tags. It ships filled with the "Northline" example so the
  format is self-documenting.

  Two kinds of fields:
    • FACT      — the generator must use it verbatim and may NOT invent it
                  (proof, deliverables, credentials, legal, contact, links).
    • DIRECTION — the generator interprets it (voice, visual direction).
  Leave a field blank to omit it. Blank REQUIRED fields are flagged, not faked.

  ─────────────────────────────────────────────────────────────────────────────
  SINGLE-PAGE OR MULTI-PAGE. By default this brief produces one page. To produce
  a multi-page site, add a `## Pages` block: one `### Page …` entry per route
  (route, nav_label, nav_order, plus that page's own content fields). The
  top-level blocks (Site Config, Identity, global Conversion, Legal, Visual
  Direction) stay GLOBAL and are shared by every page; navbar + footer become
  global chrome (rendered once in app/layout.tsx) and the cta section repeats on
  every page so the primary CTA always resolves. Northline below is a single-page
  example; the per-page content fields reuse the very same headings shown here.

  ADAPTIVE MAP — which sections a field unlocks, applied PER PAGE in multi-page
  mode. The generator includes a section only when its data is present.

    pain_points present .................. Problem
    desired_outcomes present ............. Outcome
    approach OR pillars present .......... Mechanism
    deliverables ≥ 3 ..................... Offer
    any proof fact (testimonial/stat/
      credential/logo) present .......... Proof
    bio present .......................... About
    faqs present, or audience+offer ..... FAQ
    lead_capture: on  + magnet .......... Lead Capture
    always (per page) ................... Hero, CTA
    always (global) ..................... Navbar, Footer
    legal_pages ≠ none .................. /impressum + /datenschutz + footer links
  ─────────────────────────────────────────────────────────────────────────────
-->

# Brief — Northline

## 0. Site Config — drives global behavior   (REQUIRED)

- **language:** en                          <!-- en | de | … -->
- **legal_pages:** de-impressum-datenschutz <!-- none | de-impressum-datenschutz -->
- **lead_capture:** on                       <!-- on | off -->
- **primary_goal:** book-call               <!-- book-call | buy | signup | enquire -->

## 1. Identity

- **brand_name:** Northline                                          (REQUIRED, fact)
- **one_liner:** Sales coaching that fixes founder revenue by auditing real deal data before prescribing anything. (REQUIRED — what you do, for whom, in one sentence)
- **tagline:** Revenue clarity for founders who are done guessing.   (OPTIONAL)
- **voice:** Sharp, direct, unsentimental, authoritative              (OPTIONAL, direction — 3–5 words)

## 2. Audience

- **who_they_are:** (REQUIRED)
  B2B founders — SaaS, agencies, and professional service businesses — doing $500k–$5M in annual revenue. They have product-market fit and clients, but growth has stalled or turned erratic. Most have never had formal sales training; they built revenue on referrals and founder relationships and have hit the ceiling of that model.

- **pain_points:** (OPTIONAL list → unlocks Problem)
  - Revenue is inconsistent month to month and they can't predict what's coming in.
  - No real sales process — every deal is handled differently depending on who's in the room.
  - Too many calls with prospects who were never going to buy.
  - Hired a salesperson, it didn't work, and they didn't know how to fix it.
  - They underprice, over-explain, and discount when they shouldn't, because "selling" feels like manipulation.
  - Their best quarter came from two referrals they have no idea how to repeat.

- **desired_outcomes:** (OPTIONAL list → unlocks Outcome)
  - A predictable revenue number they can trust — consistent pipeline, consistent close rate.
  - A documented sales process the team can run without the founder in every deal.
  - The ability to qualify out fast and spend time only with ready buyers.
  - Confidence in pricing — knowing what they're worth and holding it.
  - A business they can step back from without revenue collapsing.

## 3. Offer

- **offer_name:** The Northline Revenue System                       (REQUIRED, fact)
- **format:** 1:1 coaching + async support — 90 days, two 60-minute calls per month, unlimited async via a private Slack channel. (OPTIONAL, fact)
- **pricing:**                                                        (OPTIONAL, fact — leave blank if not public)
- **deliverables:** (OPTIONAL — 3+ unlocks Offer; titles are facts, never invented)
  - **Pipeline Audit** — structured review of the last 12 months of deals (won, lost, stalled) to find exactly where revenue is leaking and why.
  - **Sales Process Design** — a documented, stage-by-stage process built from their actual deal data, not a generic framework.
  - **Qualification Framework** — a decision tree to qualify prospects in or out within the first 15 minutes of a call.
  - **Pricing & Positioning Review** — a direct assessment of pricing against market and value, with a clear recommendation on raising prices.
  - **Live Deal Support** — async support on active deals: review proposals, debrief losses, prep high-stakes calls.
  - **Rep Onboarding Playbook** — a documented playbook the first or next sales hire can follow from day one.

## 4. How it works

- **approach:** (OPTIONAL → unlocks Mechanism)
  Most revenue problems are diagnosis problems. Founders hire coaches who hand over scripts and frameworks, and nothing changes because the real issue was never identified. Northline starts with a full pipeline audit before recommending anything; every recommendation is traceable to a specific pattern in the client's own deal data.

- **pillars:** (OPTIONAL — 2–4; unlocks Mechanism)
  - **Diagnose first** — start with a forensic review of real deal data, not a survey. Won/lost/stalled patterns reveal the actual problem, which is almost never what the founder thinks.
  - **Build for their buyer** — design the process around how their specific buyers decide: their committee, timeline, objections. Generic processes fail because buyers aren't generic.
  - **Hold the pricing line** — discounting is a positioning problem, not a negotiation tactic. Fix positioning so pricing becomes defensible.
  - **Make it runnable without you** — the deliverable is a documented system, written down, tested, and transferable to a team.

## 5. Proof — STRICT facts, never invented

- **testimonials:** (OPTIONAL → contributes to Proof; verbatim quote + name [+ role])
  - "We'd been at $1.2M for two years. I thought we had a marketing problem. The pipeline audit showed we had a qualification problem — we were closing 1 in 8 discovery calls. Three months later we're closing 1 in 3 and revenue is up 40%." — Daniel K., founder, B2B SaaS, Berlin
  - "I raised prices by 35% during the engagement. I was terrified. We didn't lose a single client and closed two of our biggest deals ever in the same quarter." — Priya M., founder, strategy consultancy, London
  - "The sales playbook we built is the reason I could hire our first VP of Sales and actually trust them with the process. Before Northline I couldn't have explained our sales process to anyone." — Marcus T., agency founder, Amsterdam

- **stats:** (OPTIONAL → contributes to Proof; value + label)
  - 34% — average client revenue growth in the 90-day engagement
  - 9 of 11 — recent clients who renewed or referred within 6 months

- **credentials:** (OPTIONAL → contributes to Proof)
  - 11 years of B2B sales leadership across SaaS and professional services
  - Former VP of Sales at two venture-backed companies (Series A and Series B)
  - Featured in Lenny's Newsletter, The SaaS Podcast, Revenue Collective

- **logos:** (OPTIONAL — client/partner/media logos by filename in ai/reference/assets/)

## 6. About

- **bio:** (OPTIONAL → unlocks About; 2–4 short paragraphs, facts)
  Jonas Mehler spent eleven years in B2B sales before coaching founders. He was the person companies called when revenue stalled — VP of Sales at two venture-backed SaaS companies, both scaling past the point where founder-led sales had run out of road.

  The pattern was always the same: smart founders generating real revenue but unable to explain how their sales worked or why deals were won or lost. Not because they were bad at selling — because they'd never had to think about it systematically. The referrals came in, the relationships closed, and the process never got written down.

  Northline is the intervention he wished existed: not a course, not a script — a diagnostic process and coaching engagement that ends with something the founder can hand to someone else. He works with a maximum of six clients at a time, based in Zurich.

- **person_credentials:** (OPTIONAL, facts)
  - Former VP of Sales, Claros (Series A SaaS, exited 2021)
  - Former VP of Sales, Fieldmark (Series B, acquired 2023)
  - Revenue Collective member since 2017
  - B2B sales trainer, certified through MEDDIC Academy

- **portrait:** jonas-portrait.jpg                                   (OPTIONAL — filename in ai/reference/assets/)
- **personal_note:** "I'm not interested in helping founders who want to feel better about their revenue. I work with people who want to understand it." (OPTIONAL)

## 7. Conversion

- **primary_cta_href:** /call                                        (REQUIRED, fact — destination)
- **primary_cta_label:** Book a diagnosis call                       (OPTIONAL — else derived from primary_goal)
- **secondary_cta:**                                                 (OPTIONAL — label + href)
- **reassurance:** Free 30-minute call. No pitch.                    (OPTIONAL)
- **contact_email:** jonas@northline.co                              (OPTIONAL, fact)
- **social_links:** (OPTIONAL, facts)
  - LinkedIn — https://linkedin.com/in/jonasmehler
  - X — https://x.com/jonasmehler

## 8. Lead Magnet — required only if lead_capture: on

- **magnet_name:** The Pipeline Audit Template                       (REQUIRED-IF-ON, fact)
- **magnet_desc:** The exact spreadsheet and scoring framework Northline uses in week one — review your last 20 deals (won, lost, stalled) to find where revenue is leaking. (REQUIRED-IF-ON)
- **form_fields:** email                                             (OPTIONAL — default: email only)

## 9. FAQ

- **faqs:** (OPTIONAL — verbatim if present; else the generator may draft from audience + offer)
  - Q: Is this for early-stage founders?
    A: No. If you're pre-revenue or pre-product-market fit, this isn't the right engagement. Northline is for founders with a working business and a revenue ceiling they can't break through.
  - Q: What if I've already worked with a sales coach?
    A: Most sales coaching is framework delivery. If it didn't stick, it's usually because the diagnosis was skipped. We start there.

## 10. Legal — required only if legal_pages ≠ none   (facts; missing → // MISSING marker)

- **legal_name:** Jonas Mehler
- **street_address:** // MISSING
- **postal_city:** // MISSING, Zürich
- **country:** Schweiz
- **phone:** // MISSING
- **email:** jonas@northline.co
- **handelsregister:** (nicht zutreffend — Einzelperson)
- **ust_id:** // MISSING
- **content_responsible:** Jonas Mehler, Adresse wie oben

## 11. Visual Direction — DIRECTION (the generator interprets; never invents facts)

- **adjectives:** Sharp, direct, cold, precise, authoritative        (REQUIRED)
- **emotional_effect:** Visitors should feel caught out — like someone finally said the thing they've been avoiding. Slight discomfort, then relief. Recognition, not inspiration. (REQUIRED)
- **color — prefer:** Near-black backgrounds (very dark cool gray, not pure black), cold off-white text, a single sharp accent (electric amber or cold electric blue). One color does the work. (REQUIRED)
- **color — avoid:** Warm tones, earth tones, greens, anything that reads "wellness." No gradients. No softness. (REQUIRED)
- **type — prefer (heading):** A sharp condensed or high-contrast sans with tension; tight tracking; clinical weight contrast. Financial-terminal energy. (REQUIRED)
- **type — prefer (body):** Clean neutral sans, highly legible at small sizes, no personality of its own. (REQUIRED)
- **type — avoid:** Serifs, rounded/humanist sans, scripts, anything warm or approachable. (REQUIRED)
- **references:** Between a Bloomberg terminal and a serious investigative publication — a quant firm's working tool, not its marketing site. (OPTIONAL)
- **no_gos:** "Success" stock photography (handshakes, suits at whiteboards, skyline confidence); bright saturated colors; rounded corners everywhere; friendly illustration; anything motivational-poster; light backgrounds as the primary treatment. (REQUIRED)

<!--
  OPTIONAL SATELLITE INPUTS (referenced when present, skipped when empty):
    ai/reference/moodboard/   visual references and inspiration
    ai/reference/copy/        raw copy samples / voice examples
    ai/reference/assets/      images to use on the page (referenced by filename)
-->
