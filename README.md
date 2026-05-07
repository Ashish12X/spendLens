# SpendLens — AI Spend Audit for Startups

**SpendLens** is a free web tool that audits AI tool spend for startup founders and engineering managers — surfacing overspend, recommending cheaper alternatives, and generating a shareable savings report. It's a lead-generation asset for [Credex](https://credex.rocks), which sources discounted AI infrastructure credits.

**Live URL:** https://spendlens.credex.rocks  
**Built with:** Next.js 14 · TypeScript · Tailwind CSS · Supabase · Anthropic API · Resend

---

## Screenshots

> _[Insert 3 screenshots or a 30-second Loom/YouTube recording here after deployment]_

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- Supabase project (free tier)
- Anthropic API key (free credits available at console.anthropic.com)
- Resend account (free tier — 3k emails/month)

### Install & run locally

```bash
git clone https://github.com/YOUR_USERNAME/spendlens.git
cd spendlens
cp .env.example .env.local
# Edit .env.local with your actual keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

### Supabase Schema

Run the following in your Supabase SQL editor:

```sql
create table audits (
  id uuid primary key,
  form_data jsonb not null,
  results jsonb[] not null default '{}',
  total_monthly_spend numeric not null default 0,
  total_monthly_savings numeric not null default 0,
  total_annual_savings numeric not null default 0,
  savings_percentage int not null default 0,
  use_case text not null,
  team_size int not null,
  ai_summary text,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key,
  audit_id uuid references audits(id),
  email text not null,
  company text,
  role text,
  team_size int,
  created_at timestamptz not null default now()
);

-- Row-level security (public read for audit, write via service role only)
alter table audits enable row level security;
alter table leads enable row level security;
create policy "Public can read audits" on audits for select using (true);
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add all `.env.example` keys as environment variables in the Vercel dashboard.

---

## Decisions

Here are 5 key trade-offs I made and why:

1. **Hardcoded audit rules instead of AI for the audit engine**  
   The assignment explicitly says "hardcoded rules are correct" for the audit math — knowing when not to use AI is part of the test. Hardcoded rules also make the logic auditable by a finance person, debuggable, and testable. AI-generated audit logic would be unpredictable and non-deterministic.

2. **Next.js App Router over React SPA**  
   The shareable result URL requires server-side OG meta tags for Twitter/LinkedIn previews. A pure React SPA can't do this without a separate backend. Next.js handles SSR, API routes, and edge OG image generation in one codebase at zero extra cost on Vercel.

3. **Supabase over Firebase**  
   Supabase uses real Postgres, which means I can query leads with SQL joins if needed. Firebase's Firestore has querying limitations that would complicate lead analytics. Supabase also has a generous free tier and a TypeScript client with good type inference.

4. **Honeypot over hCaptcha for abuse protection**  
   hCaptcha adds friction (accessibility problems, UX disruption) for a tool where conversion is the goal. A honeypot field (invisible input that bots fill in) stops most bot submissions with zero user impact. Server-side rate limiting by email covers repeat submissions. This is proportionate protection for the threat level.

5. **claude-3-haiku for AI summaries over GPT-4o-mini**  
   The assignment prefers Anthropic. Haiku is Anthropic's cheapest model — ~$0.0008 per summary (100 tokens). It's fast enough for real-time generation and produces fluent, useful 100-word summaries at a cost of less than $1 per thousand audits.
