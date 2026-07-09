# Review Rubric — the bar every site must clear before a human looks

This rubric is shared by three stages, each scoping to the dimensions that apply yet:
- **`/direction-gate`** — ranks the 2–3 art directions (scores dimensions 1–2 at sketch level + brand-fit).
- **`/design-system`** — reviews the built **foundation** before the site is built on it: dimension **1 (distinctiveness)** of the token system + signature device, that the **no-gos are honored**, dimension **5 (accessibility/contrast)**, and that `npm run build` + `/design-system` render (dimension 4, build only). Copy, conversion, and plan-parity do **not** apply yet (no sections exist). This is a cheap gate on an expensive-to-rebuild foundation.
- **`/review`** — audits the built site and loops until it passes (all dimensions).

It is **reviewer-agnostic**: the same rubric drives Codex (preferred, an independent model) or a Claude adversarial reviewer (fallback). The reviewer's job is to be a skeptic, not a cheerleader — assume the work is generic until proven otherwise.

---

## Output contract (STRICT)

The reviewer returns **JSON only** — no prose around it. A findings array:

```json
{
  "summary": "one-line overall verdict",
  "findings": [
    {
      "dimension": "distinctiveness | conversion | copy | code | accessibility",
      "severity": "blocker | major | minor",
      "file": "path or 'site-wide'",
      "locator": "section id / line / selector / 'hero'",
      "problem": "what is wrong, concretely",
      "suggested_fix": "the specific change to make"
    }
  ]
}
```

For `/direction-gate`, the reviewer instead returns a ranking object:
```json
{
  "ranking": [{ "slug": "...", "score": 0-100, "reasons": "...", "risks": "..." }],
  "recommended": "<slug>",
  "convergence_warning": "present if two directions are the same idea recolored, else null"
}
```

---

## Dimensions

### 1. Distinctiveness — *the headline criterion*
- Could a stranger tell this came from a template? If yes → finding.
- Does a named **signature device recur in ≥3 sections**? If absent or one-off → `major`.
- Any generic tells: default centered hero, three-card grid as the page skeleton, gray-text-on-white with one blue button, body font used for headings, weak H1? Each → finding.
- Does the page express the direction's **concept thesis**, or is it a recolor of a default? A recolor → `major`.
- (Direction-gate) Are the 2–3 directions genuinely divergent? If two are the same idea → `convergence_warning`.

### 2. Conversion
- Single clear **primary CTA**, visually dominant, appearing **≥2×**. Missing/weak → `major`.
- A credibility element (proof/testimonial/stat/credential) present and visible → else `major`.
- Hero sells the **transformation/outcome**, not a product label. Generic "Welcome to X" hero → `major`.
- Form (if lead capture) is low-friction and the value is clear.

### 3. Copy quality (German market)
- **No fabrication** — every fact, number, quote, credential traces to the brief. Any invented fact → `blocker`. (This inherits `system-rules.md` and outranks everything.)
- On the brief's **voice**; reads like a person, not a content mill.
- **No AI tells** — no "In der heutigen schnelllebigen Welt…", no empty superlatives ("weltklasse", "einzigartig" without proof), no em-dash overuse, no vague wellness/spiritual filler, no motivational-poster lines.
- German market rules: correct German, **no gendering** (`*innen` etc.), include English translation only where the brief's content is non-German.

### 4. Code / build correctness
- `npm run build` clean and `npx tsc --noEmit` clean. Failures → `blocker`, quoted verbatim.
- **No hardcoded hex/px** outside `globals.css :root` (grep `components/`, `app/`). Each hit → `major`.
- `font-display`/`font-heading` resolves to a real family (no silent fallback to body).
- **Plan ⇄ page parity**: each `## Page: <route>` in `site-plan.md` has a matching `app/<route>/page.tsx` whose section imports equal the plan's list (order included). Drift → `major`.
- **Route inventory parity** + shared chrome (Navbar/Footer in `app/layout.tsx`, not duplicated) + legal parity (impressum/datenschutz present iff configured).
- No unresolved `// MISSING:` / `// REVIEW:` left in shipped code → each `major` (or `blocker` if legal/required).

### 5. Accessibility
- Images have meaningful alt text; focus-visible rings present; brand color contrast meets AA on text; heading order sane (one h1/page, no skipped levels); **`prefers-reduced-motion` respected** (motion is decorative, never load-bearing).

---

## Severity → action

| Severity | Meaning | Loop action |
|----------|---------|-------------|
| `blocker` | build/type failure, fabricated fact, missing required legal, a11y violation | Must fix. Loop continues. |
| `major` | weak distinctiveness, off-voice/AI-tell copy, conversion gap, token/parity drift | Fix. Loop continues. |
| `minor` | polish | Fix if cheap; else log and proceed. |

**Exit condition:** zero `blocker` **and** zero `major`. Then hand to the human operator for the final look.

**`needs-human` escape:** raise this (and stop looping) when a finding cannot be resolved without a real fact the brief lacks (fabrication can't be "fixed" by inventing), or when a subjective distinctiveness disagreement persists after 2 rounds. Surface it rather than spinning.

**Loop cap:** hard stop at **4 rounds**; on cap, emit a summary of what remains and hand to the human.
