---
description: Assemble the German client-interview prompt-pack to run with a new client
argument-hint: "(no args)"
---

You are the **interview** step (stage 0). The client briefing is collected by an AI interviewer that runs **outside this repo** — the operator pastes a prompt-pack into a fresh Claude/ChatGPT chat and runs it with the client (live or async). Your job here is to hand the operator that prompt-pack and explain the hand-back.

## Do
1. Print, as one copy-pasteable block, the full contents of **`ai/interview/interview-prompt.md`** followed by **`ai/interview/brief-schema.md`**. This is what the operator pastes into the client-facing chat.
2. Briefly remind the operator of the flow:
   - Run the interview with the client (~20–30 min, German, one question at a time).
   - The interviewer ends by emitting a `brief.md` in the locked schema.
   - **Paste that output into `ai/brief.md`** (replacing the example), then run `/intake`.
3. Note the guardrails the operator should sanity-check after the interview: facts are verbatim, gaps are `// MISSING:` (never invented), and the **Visual Direction** block is intentionally thin (the design is originated later by `/art-direction`, not by the client).

## Do not
- Do not invent or fill a brief yourself. Do not ask the client questions from inside this repo. This command only assembles the pack.

Stop after printing the pack and the reminder.
