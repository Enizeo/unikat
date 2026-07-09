# Brief Schema — the exact output the interview must emit

The interviewer ends by writing a `brief.md` in **exactly** this structure. The generator (`/intake`) parses these headings literally — **deviating from them breaks the pipeline.** Keep the heading numbers and the field names. Leave a field blank to omit it; blank REQUIRED fields get a `// MISSING:` marker, never a fabricated value.

Two kinds of fields:
- **FACT** — used verbatim, never invented (proof, deliverables, credentials, legal, contact, links, prices).
- **DIRECTION** — interpreted by the generator (voice; the thin Visual Direction block).

## Adaptive map (which field unlocks which section — applied per page in multi-page mode)
```
pain_points present .................. Problem
desired_outcomes present ............. Outcome
approach OR pillars present .......... Mechanism
deliverables ≥ 3 ..................... Offer
any proof fact present ............... Proof
bio present .......................... About
faqs present, or audience+offer ..... FAQ
lead_capture: on + magnet ............ Lead Capture
always (per page) .................... Hero, CTA
always (global) ...................... Navbar, Footer
legal_pages ≠ none ................... /impressum + /datenschutz + footer links
```

---

## Template

```markdown
# Brief — <brand_name>

## 0. Site Config   (REQUIRED)
- **language:** de            <!-- en | de | … -->
- **legal_pages:** de-impressum-datenschutz   <!-- none | de-impressum-datenschutz -->
- **lead_capture:** off       <!-- on | off -->
- **primary_goal:** enquire   <!-- book-call | buy | signup | enquire -->

## 1. Identity
- **brand_name:** …           (REQUIRED, fact)
- **one_liner:** …            (REQUIRED — what you do, for whom, in one sentence)
- **tagline:** …              (OPTIONAL)
- **voice:** …                (OPTIONAL, direction — 3–5 words, inferred from how they speak)

## 1b. Story — the brand-story spine (feeds /art-direction's "Roots in the intake")
- **story:** …                (REQUIRED — the founder's path + the ONE unrepeatable fact no competitor has; this is what a distinctive art direction is built on. A breathwork coach's "Hebamme, 20 Jahre Kreißsaal, Breathwork wie eine Geburt" is the model — one lived, unrepeatable fact.)

## 2. Audience
- **who_they_are:** …         (REQUIRED)
- **pain_points:** (OPTIONAL list → unlocks Problem)
  - …
- **desired_outcomes:** (OPTIONAL list → unlocks Outcome)
  - …

## 3. Offer
- **offer_name:** …           (REQUIRED, fact)
- **format:** …               (OPTIONAL, fact)
- **pricing:** …              (OPTIONAL, fact — blank if not public)
- **deliverables:** (OPTIONAL — 3+ unlocks Offer; titles are facts)
  - **<title>** — <description>

## 4. How it works
- **approach:** …             (OPTIONAL → unlocks Mechanism)
- **pillars:** (OPTIONAL — 2–4; unlocks Mechanism)
  - **<name>** — <description>

## 5. Proof — STRICT facts, never invented
- **testimonials:** (OPTIONAL → Proof; verbatim quote + name [+ role])
  - "<quote>" — <Name, role>
- **stats:** (OPTIONAL → Proof; value + label)
  - <value> — <label>
- **credentials:** (OPTIONAL → Proof)
  - …
- **logos:** (OPTIONAL — filenames in ai/reference/assets/)

## 6. About
- **bio:** …                  (OPTIONAL → unlocks About; 2–4 short paragraphs, facts)
- **person_credentials:** (OPTIONAL, facts)
  - …
- **portrait:** <filename>    (OPTIONAL — in ai/reference/assets/)
- **personal_note:** …        (OPTIONAL)

## 7. Conversion
- **primary_cta_href:** …     (REQUIRED, fact — destination)
- **primary_cta_label:** …    (OPTIONAL — else derived from primary_goal)
- **secondary_cta:** …        (OPTIONAL — label + href)
- **reassurance:** …          (OPTIONAL)
- **contact_email:** …        (OPTIONAL, fact)
- **social_links:** (OPTIONAL, facts)
  - <Platform> — <url>

## 8. Lead Magnet — required only if lead_capture: on
- **magnet_name:** …          (REQUIRED-IF-ON, fact)
- **magnet_desc:** …          (REQUIRED-IF-ON)
- **form_fields:** email      (OPTIONAL — default: email only)

## 9. FAQ
- **faqs:** (OPTIONAL — verbatim if present; else generator may draft from audience + offer)
  - Q: …
    A: …

## 10. Legal — required only if legal_pages ≠ none   (facts; missing → // MISSING)
- **legal_name:** …
- **street_address:** …
- **postal_city:** …
- **country:** …
- **phone:** …
- **email:** …
- **handelsregister:** …      (or "nicht zutreffend — Einzelperson")
- **ust_id:** …
- **content_responsible:** …

## 11. Visual Direction — DIRECTION (deliberately THIN; the design AI originates the rest)
- **adjectives:** …           (REQUIRED — 3–5 words on the feeling, NOT the look)
- **emotional_effect:** …     (REQUIRED — what should shift in the visitor)
- **no_gos:** …               (REQUIRED — hard exclusions the client named, e.g. specific stock-photo clichés)
```

### Multi-page
To produce a multi-page site, append a `## Pages` block — one `### Page …` entry per route, each with `route`, `nav_label`, `nav_order`, plus that page's own content fields (reusing the headings above). The top-level blocks (Site Config, Identity, global Conversion, Legal, Visual Direction) stay global. Legal pages (`/impressum`, `/datenschutz`) are always their own routes when legal is on.

### What changed from v1
The **Visual Direction** block is intentionally minimal — `adjectives`, `emotional_effect`, `no_gos` only. v1 asked clients for preferred colors, fonts, and type styles; v2 does **not** — those are originated by `/art-direction`. A client's stray color/font opinion is captured only if it's a hard no-go.
