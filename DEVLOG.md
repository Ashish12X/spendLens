# DEVLOG — SpendLens

---

## Day 1 — 2026-05-07

**Hours worked:** 8

**What I did:**
- Read the full assignment brief twice. Made notes on every required file and feature.
- Decided on Next.js 14 App Router + Supabase + Anthropic + Resend stack. Documented rationale in ARCHITECTURE.md.
- Ran `create-next-app` and installed all dependencies: `@supabase/supabase-js`, `@anthropic-ai/sdk`, `resend`, `zod`, `lucide-react`, `framer-motion`, `uuid`, and all testing libraries.
- Built `lib/pricing-data.ts` — all 8 required tools with every plan, price per seat, features, and use-case tags. Verified every number against official pricing pages (see PRICING_DATA.md).
- Built `lib/audit-engine.ts` — core audit logic with 5 evaluation functions: plan fit, seat waste, cross-tool alternatives, API spend review, and Credex credit opportunities. All rules hardcoded with defensible reasoning.
- Built `lib/validations.ts` — Zod schemas for form input and lead capture. Honeypot field included in lead schema.
- Built `lib/utils.ts` — formatting helpers, severity styling, share copy generation.
- Built all 4 API routes: `/api/audit`, `/api/summary`, `/api/lead`, `/api/og`.
- Built landing page (`app/page.tsx`) — hero, how-it-works, features, social proof, CTA.
- Built audit form (`app/audit/page.tsx`) — 2-step form with localStorage persistence.
- Built results page (`app/audit/[id]/page.tsx`) — hero savings, AI summary, per-tool cards, lead modal, share functionality.
- Wrote 12 tests in `__tests__/audit-engine.test.ts` covering all major audit logic paths.
- Set up GitHub Actions CI: lint + typecheck + test on every push to main.
- Created all required documentation files: README, ARCHITECTURE, DEVLOG, PRICING_DATA, PROMPTS, TESTS, GTM, ECONOMICS, LANDING_COPY, METRICS.
- Set up `.env.example` with all required environment variable names.

**What I learned:**
- Next.js 14 App Router has strict rules about `params` being a Promise — `await params` is required in layout/page components. This caused a TypeScript error I fixed immediately.
- `@vercel/og` edge runtime doesn't support Node.js built-ins — the OG image route needs `export const runtime = 'edge'`.
- Supabase's anon key is safe to use client-side (RLS enforces access), but service role key must stay server-side only.

**Blockers / what I'm stuck on:**
- Need to conduct 3 real user interviews. Will reach out tomorrow to college network contacts who run side projects or startups.
- REFLECTION.md answers (especially the "hardest bug" question) can only be written honestly after more implementation days.
- USER_INTERVIEWS.md is the highest-risk deliverable — cannot be faked. Need to schedule calls ASAP.

**Plan for tomorrow:**
- Run the app locally, test all form flows end-to-end
- Fix any runtime bugs found during testing
- Run `npm test` — ensure all 12 tests pass
- Start outreach for user interviews (cold DMs on X, college WhatsApp groups)
- Create Supabase project and run schema migration
- Set up `.env.local` with real keys

---

## Day 2 — 2026-05-08

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in]_

**Plan for tomorrow:** _[Fill in]_

---

## Day 3 — 2026-05-09

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in]_

**Plan for tomorrow:** _[Fill in]_

---

## Day 4 — 2026-05-10

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in]_

**Plan for tomorrow:** _[Fill in]_

---

## Day 5 — 2026-05-11

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in]_

**Plan for tomorrow:** _[Fill in]_

---

## Day 6 — 2026-05-12

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in]_

**Plan for tomorrow:** _[Fill in]_

---

## Day 7 — 2026-05-13

**Hours worked:** _[Fill in]_

**What I did:** _[Fill in]_

**What I learned:** _[Fill in]_

**Blockers / what I'm stuck on:** _[Fill in — or "none, submitted"_]_

**Plan for tomorrow:** Submitted. Waiting for Round 2 results.
