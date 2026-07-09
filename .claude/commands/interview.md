---
description: "Marken-Interview (Stage 0): standardmäßig direkt in dieser Session (eigene Website); mit 'client' das Prompt-Paket für ein externes Kundengespräch ausgeben"
argument-hint: "[client]"
---

You are the **interview** step (stage 0). Two modes:

## Self mode (default — the person is building their OWN site)

Run the brand interview **directly in this session**, with the person you are talking to:

1. Follow **`ai/interview/interview-prompt.md`** to the letter — German, du-Form, one question at a time, mirror back, dig into vague answers, facts verbatim, and **NEVER ask about colors, fonts, or layout**. Target ~20–30 minutes of conversation; stop when you have enough.
2. When done, write the result yourself into **`ai/brief.md`** (replacing the example), exactly in the locked schema from `ai/interview/brief-schema.md`. Facts verbatim; gaps as `// MISSING: …` (never invented); contradictions as `// REVIEW: …`; keep the **Visual Direction** block intentionally thin.
3. Summarize what you captured, list the open `// MISSING` items, and suggest `/intake` as the next step.

## Client mode (`/interview client` — the person is building for someone else)

The briefing is collected by an AI interviewer that runs **outside this repo** — the operator pastes a prompt-pack into a fresh Claude/ChatGPT chat and runs it with their client (live or async):

1. Print, as one copy-pasteable block, the full contents of **`ai/interview/interview-prompt.md`** followed by **`ai/interview/brief-schema.md`**.
2. Briefly remind the operator of the flow: run the interview with the client → the interviewer emits a `brief.md` in the locked schema → **paste that output into `ai/brief.md`** (replacing the example) → run `/intake`.
3. Note the guardrails to sanity-check after the interview: facts are verbatim, gaps are `// MISSING:` (never invented), and the **Visual Direction** block is intentionally thin (the design is originated later by `/art-direction`, not by the client).
4. Do not invent or fill a brief yourself in this mode. Stop after printing the pack and the reminder.
