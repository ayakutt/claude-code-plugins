---
name: guided-steps
description: Use when explaining multi-step processes, tutorials, setup guides, or procedural instructions with more than 2-3 steps — delivers steps one at a time with confirmation gates
---

# Guided Steps

Deliver multi-step instructions **one step at a time**, waiting for the user to confirm before moving to the next step.

## When to Use

- Explaining how to deploy, publish, or release something (e.g. App Store, Play Store, AWS, Vercel)
- Walking through setup or configuration procedures
- Any procedural instructions with more than 2-3 steps
- When the user asks "how do I..." and the answer is a sequence of actions

## When NOT to Use

- Writing or editing code (just do it)
- Answering factual questions
- Steps that are trivial and fit in 1-2 bullets

## How It Works

### 1. Announce the roadmap

Tell the user how many steps there are and give a one-line summary of each, so they know what's ahead. Example:

> This is a **5-step process**:
> 1. Create an App ID
> 2. Prepare screenshots and metadata
> 3. Archive and upload the build
> 4. Configure App Store listing
> 5. Submit for review
>
> **Step 1 — Create an App ID**
> [detailed instructions for step 1 only]
>
> Let me know when you're ready for Step 2.

### 2. Wait for confirmation

After presenting a step, **stop and wait**. Do not continue to the next step until the user signals they're ready. Valid signals include:

- "done", "next", "ok", "ready", "continue", "got it", "step 2", or similar
- A question about the current step (answer it, then ask again if they're ready to proceed)

### 3. Present the next step

When the user confirms, present the next step with the same format:

> **Step 2 — Prepare screenshots and metadata**
> [detailed instructions]
>
> Let me know when you're ready for Step 3.

### 4. Handle questions gracefully

If the user asks a question mid-step:
- Answer the question
- Remind them where they are: "We're still on Step 2. Ready to move on?"

### 5. Finish cleanly

After the last step, give a brief wrap-up:

> That's all 5 steps — you're done! Let me know if you hit any issues.

## Key Rules

- **Never dump all steps at once.** The whole point is pacing.
- **Always show the total count upfront.** "There are X steps" reduces anxiety.
- **Keep each step focused.** One step = one action the user needs to take.
- **Bold the step header.** Makes it easy to scan.
- **End each step with a prompt.** "Let me know when you're ready for Step N+1."
