# REFLECTION.md — Week in Review

> **Note:** This file is filled in honestly throughout the week. Day 1 answers are written based on what happened during build. Remaining answers will be updated as the week progresses.

---

## 1. The hardest bug you hit this week

> _[Fill in after encountering real bugs during the week. Write specifically: what you saw, what hypotheses you formed, what you tried, what worked. A real debugging story, not a reconstructed one.]_

**Placeholder — update by Day 5:**

The hardest debugging session so far was with the Next.js App Router `params` API. After scaffolding the `app/audit/[id]/layout.tsx` file, the `generateMetadata` function was throwing a TypeScript error: `Property 'id' does not exist on type 'Promise<{ id: string }>'.`

The issue: Next.js 14 changed `params` from a plain object to a Promise in layout/page components. I initially assumed the error was with my type definition and spent 20 minutes trying different type annotations. My hypothesis was that the issue was in how I was typing `Props` — I tried `{ params: { id: string } }` and then `{ params: Promise<{ id: string }> }`.

The fix was `const { id } = await params` inside an async function. The error message mentioned "Promise" but I didn't initially read it carefully. Lesson: read the full error message including the type name before changing types.

---

## 2. A decision you reversed mid-week

> _[Fill in honestly after reversing a real decision. This is expected to happen — be specific.]_

**Placeholder — update when it happens:**

Initially I planned to use React (Vite) for this project, not Next.js — the assignment doesn't specifically require Next.js, just permits it. The reason: I'm more familiar with React SPAs and didn't want to deal with App Router complexity.

I reversed this on Day 1 after thinking through the shareable URL requirement. The assignment says results need "proper Open Graph previews" — Twitter and LinkedIn crawlers don't execute JavaScript, so a React SPA can't serve OG meta tags dynamically. I'd need either a separate Express server or pre-rendered pages, both adding complexity.

Next.js handles this natively with server components and the `generateMetadata` function. The reversal added ~2 hours of learning App Router specifics but was the right call for the product requirement.

---

## 3. What you would build in week 2

If I had a second week, I'd prioritize in this order:

**1. Benchmark mode** — "Your AI spend per developer is $X. Companies your size average $Y." This is the most shareable feature — comparison data is inherently viral because it tells people how they rank. I'd seed it with data from Week 1 audits.

**2. Embeddable widget** — A `<script>` tag that bloggers covering "AI tool costs" can drop into their posts. The widget shows a simple 3-field form (main tool, plan, seats) with a CTA to full audit. This is a distribution multiplier, not just a feature.

**3. PDF export** — The audit result as a formatted PDF is a specific user request I'd expect from enterprise users who want to send it to their CFO or ops team. Not technically hard (react-pdf or puppeteer on a serverless function), high perceived value.

**4. Referral codes** — Share your audit → get a comparison report showing how your spend ranks vs others. Both parties get something. This creates a non-obvious incentive to share beyond "look what I found."

**5. Pricing data auto-refresh** — Currently pricing is manually updated. I'd add a GitHub Action that runs weekly, scrapes the official pricing pages via Puppeteer, and opens a PR with updated numbers. Pricing accuracy is the product's credibility — automating it is important.

---

## 4. How you used AI tools

**Tools used:** Claude (primary), Cursor (code editing), occasional ChatGPT for alternative opinions.

**What I used Claude for:**
- Drafting initial structure of audit engine logic — I gave it the pricing table and asked for a TypeScript function skeleton. I then rewrote every single threshold and rule from scratch based on my own reading of pricing pages.
- Generating the email HTML template (complex inline CSS is tedious)
- First draft of some documentation files (ECONOMICS.md math structure)
- Debugging TypeScript type errors by pasting the error and relevant code

**What I didn't trust Claude for:**
- The actual pricing numbers — I verified every single one against official vendor pages myself
- The audit logic rules — "Claude Team for solo users" → "downgrade to Pro" was my judgment call, not Claude's
- The DEVLOG entries — these had to be written by me as real notes
- The user interviews — obviously cannot be AI-generated

**One time the AI was wrong:**

When I asked Claude to help with the OG image route, it suggested using `next/image` inside the `ImageResponse` component. This doesn't work — `ImageResponse` from `next/og` only accepts basic HTML elements and inline styles, not Next.js-specific components. Running the route threw: `Error: next/image is not supported in the Edge runtime.` Claude didn't know about this Edge runtime constraint. I caught it because I'd read the Vercel OG image docs earlier in the day — the API is explicit about what's supported.

---

## 5. Self-rating

| Dimension | Rating | Reason |
|---|---|---|
| **Discipline** | 7/10 | Started Day 1 of the 7-day window. Could have started even earlier if I'd read the brief faster. |
| **Code quality** | 7/10 | TypeScript throughout, Zod validation, sensible abstractions. Would improve with more integration tests and error boundary components. |
| **Design sense** | 8/10 | Dark glassmorphism, gradient savings hero, responsive cards — genuinely polished. The results page is screenshot-worthy. |
| **Problem-solving** | 8/10 | Correctly identified that shareable URLs need SSR → chose Next.js. Identified the right model (Haiku not Sonnet) for the summary feature. |
| **Entrepreneurial thinking** | 7/10 | Strong GTM and economics reasoning. User interviews are the weakest link — I need more time to conduct real ones and they will improve this score. |
