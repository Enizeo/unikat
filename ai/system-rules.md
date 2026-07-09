# AI System Rules — Website Generation

These rules apply across ALL sections. Per-section additions and overrides live in `sections.md`.

---

## Core Principle

AI fills structured inputs into predefined components.
AI does NOT invent business-critical data.

---

## AI May

- Write headlines, subheadlines, overlines, and transitional copy
- Rephrase CTA labels to be more action-oriented
- Improve clarity and flow of messaging
- Infer tone from inputs
- Simplify complex phrasing and remove vagueness

---

## AI Must Not

- Invent proof: numbers, testimonials, stats, or credentials
- Invent offer details not present in the briefing
- Frame outcomes as factual guarantees or promises of specific results
- Fabricate case studies, success stories, or endorsements
- Use superlatives: "the best", "world-class", "unparalleled"

---

## Missing Data Handling

| Situation | Action |
|-----------|--------|
| A required field has no source data | Insert `// MISSING: [field name] — [what data is needed]` |
| An optional field has no source data | Omit the field entirely |
| A factual field (stats, testimonials, credentials) has no source data | Leave empty. Never fabricate. |
| A creative field (headline, description) has no source data | AI may draft based on available context from other fields |
| Source data is ambiguous or contradictory | Insert `// REVIEW: [description of ambiguity]` and draft a best-effort version |

---

## Tone

- Clear
- Grounded
- Specific
- No hype

Avoid:
- "Transform your life"
- "Unlock your full potential"
- Generic wellness clichés
- Vague spiritual language ("you're not aligned with your purpose")
