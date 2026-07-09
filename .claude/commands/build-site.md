---
description: Build the section components and assemble the page(s) from the approved site plan
argument-hint: "[path to brief — defaults to ai/brief.md]"
---

You are the **build** step. You implement exactly the sections in the approved site plan and assemble the page(s).

## Preamble (required)
This repo runs a modified Next.js with breaking changes vs. your training data (see `AGENTS.md`). **Before writing any Next-specific code (routing, nested routes, shared layouts, metadata, components, `app/` files), read the relevant guides in `node_modules/next/dist/docs/`.**

## Read first
- `ai/_generated/site-plan.md` — **the structural contract.** It lists the global chrome (navbar/footer), a route inventory, and one section block per page (section order + data sources; no layouts/zones — those are yours to set from the winning direction). Build exactly the sections listed for each page, in that order. Do not add or drop sections or routes. If the plan is missing, stop and tell the operator to run `/intake`.
- `ai/_generated/winner.txt` → the winning `ai/_generated/directions/<slug>/concept.md` — **the visual contract.** Apply its layout motifs, signature device, and motion to every section. If missing, stop and tell the operator to run `/direction-gate` + `/design-system`.
- `ai/sections.md` — Part 1 (content models) and Part 3 (the per-section craft appendix). Consult the appendix entry for each section you write.
- `ai/system-rules.md` — what AI may and must not generate. Honor it strictly.
- The brief (`$1` or `ai/brief.md`) — the source of all content and facts. Global blocks apply to every page; each `### Page` block is the content for its route.
- `ai/design-language.md` — hierarchy, rhythm, color, motion, the recurring-device rule.
- `ai/reference/copy/` and `ai/reference/assets/` if present.

## Do
1. **Implement each planned section once** in `components/sections/<id>.tsx`, each with its co-located typed props interface from the catalog. Section components are reused across pages — instantiated with each page's data. Give each section a **direction-shaped layout** (the concept's motifs — sections are not fixed shapes; only their content models/props are fixed). **Thread the signature device** (`components/signature.tsx`) through ≥3 sections, and apply motion (`components/motion.tsx`) per the concept. Build `components/navbar.tsx` and `components/footer.tsx` too. Reuse `components/ui/` primitives and `lib/cn.ts`; use design tokens only — no hardcoded hex or px outside the token system. TypeScript, no `any`.
2. **Write copy** from the brief only. Facts (proof, deliverables, credentials, legal, links, contact) are verbatim — never invented. Missing required field → render nothing and add `// MISSING: [field] — [what's needed]`. Ambiguity → `// REVIEW: …`. Optional missing → omit.
3. **Shared chrome → `app/layout.tsx`.** Render `<Navbar />` above `{children}` and `<Footer />` below it, so every route shares them. Navbar gets the brand, one link per page (cross-route paths, ordered per the plan), and the global primary CTA (href `#kontakt`/`#cta` — resolves to the cta section on whichever page is open). Footer gets nav + legal + social links. Wire fonts/metadata defaults here per the design-system step; read the Next docs for the layout/metadata API first.
   - *Single-page plan (no per-page blocks):* keep navbar/footer in `app/page.tsx` with in-page anchors, as before.
4. **Assemble one route per page.** For each page block in the plan, write `app/<route>/page.tsx` (the `/` page is `app/page.tsx`) importing and rendering exactly that page's planned section set in order. Each page sets its own `export const metadata` (title/description from the brief). The cta-target section carries the stable `id` (`kontakt`) the navbar/hero link to. Sections own their spacing; the page adds none.
5. **Legal** — only if config is `de-impressum-datenschutz`: generate `app/impressum/page.tsx` + `app/datenschutz/page.tsx` from the Legal block (German), minimal/clean, linked from the footer. `// MISSING:` for absent required legal fields. If `none`, skip and emit no legal links.

## Verify & stop
For each page, the set of section imports in `app/<route>/page.tsx` must equal that page's section list in the plan — no more, no less. Navbar/Footer must live in `app/layout.tsx` (multi-page). The signature device must appear in ≥3 sections. Print the file list you wrote and remind the operator to run `/review`. Then stop.
