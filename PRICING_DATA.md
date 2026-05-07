# PRICING_DATA.md — Verified Pricing Sources

All numbers in the audit engine (`lib/audit-engine.ts`) trace to this file.
Every URL is an official vendor pricing page. Prices in USD/user/month unless noted.

---

## Cursor

Source: https://cursor.com/pricing — verified 2026-05-07

- Hobby: $0/month (free)
- Pro: $20/user/month (monthly) · $16/user/month (annual)
- Business: $40/user/month
- Enterprise: Contact sales (estimated ~$100/user/month for audit logic; flagged as estimate in code)

Notes: "Business" adds admin dashboard, SSO, and usage analytics. Pro vs Business decision point is ≤3 seats — admin features have zero utility for solo/micro teams.

---

## GitHub Copilot

Source: https://github.com/features/copilot#pricing — verified 2026-05-07

- Individual: $10/user/month · $100/user/year ($8.33/mo equivalent)
- Business: $19/user/month
- Enterprise: $39/user/month

Notes: Enterprise adds fine-tuned models on your codebase and Bing search integration. Upgrade only justifiable for teams > 10 with established model training workflows.

---

## Claude (Anthropic)

Source: https://www.anthropic.com/pricing — verified 2026-05-07

- Free: $0 (limited Claude Haiku access)
- Pro: $20/user/month
- Max: $100/user/month (20x usage vs Pro)
- Team: $30/user/month (minimum 2 users)
- Enterprise: Contact sales (estimated ~$60/user/month floor for audit logic)
- API Direct: Pay-per-token (see Anthropic API section)

Notes: Team plan minimum is 2 seats — solo users on Team plan pay $10/month premium for admin features with no benefit. Claude Max is for power users needing extended context / Opus priority — not warranted for typical writing/coding workflows.

---

## ChatGPT (OpenAI)

Source: https://openai.com/chatgpt/pricing — verified 2026-05-07

- Free: $0 (limited GPT-4o)
- Plus: $20/user/month
- Team: $30/user/month (minimum 2 users) · $25/user/month (annual)
- Enterprise: Contact sales (estimated ~$60/user/month for audit logic)
- API Direct: Pay-per-token (see OpenAI API section)

Notes: Team plan excludes training data from OpenAI models and adds workspace controls — meaningful for companies with data sensitivity requirements. Enterprise adds SSO, custom data retention, and analytics.

---

## Anthropic API

Source: https://www.anthropic.com/pricing — verified 2026-05-07

Token pricing (input / output per million tokens):
- Claude 3.5 Haiku: $0.80 in / $4 out
- Claude Sonnet 4: $3 in / $15 out
- Claude Opus 4: $15 in / $75 out

Notes: API spend audit logic flags accounts spending >$200/month and recommends model tiering — routing routine calls to Haiku while reserving Sonnet/Opus for complex tasks. This typically cuts API bills 25–40%.

---

## OpenAI API

Source: https://openai.com/api/pricing — verified 2026-05-07

Token pricing (input / output per million tokens):
- GPT-4o mini: $0.15 in / $0.60 out
- GPT-4o: $2.50 in / $10 out
- o3 mini: $1.10 in / $4.40 out
- o3: $10 in / $40 out

Notes: GPT-4o mini is remarkably capable for classification, extraction, and simple Q&A tasks at 17x cheaper than GPT-4o. Model tiering is the highest-leverage optimization for API-heavy workloads.

---

## Gemini (Google)

Source: https://one.google.com/about/ai-premium · https://workspace.google.com/products/gemini/ — verified 2026-05-07

- Free: $0 (Gemini 2.0 Flash)
- Google One AI Premium: $19.99/user/month (Gemini Advanced + 2TB storage)
- Gemini for Workspace: $30/user/month (Gemini in Gmail/Docs/Sheets/Meet)
- API (Google AI Studio): Free tier for Flash; Pro models pay-per-token

Notes: Gemini for Workspace is only justified if the team is deeply embedded in Google Workspace apps. AI Premium delivers identical model capability at 33% less per seat for teams that just want Gemini Advanced.

---

## Windsurf (Codeium)

Source: https://windsurf.com/pricing — verified 2026-05-07

- Free: $0 (limited AI flows)
- Pro: $15/user/month
- Teams: $35/user/month (minimum 3 seats)

Notes: Windsurf Teams vs Cursor Business ($40/user) are near price parity. Cursor has a significantly larger model marketplace — GPT-4o, Claude 3.5, Gemini, custom models — giving more flexibility for teams optimizing model cost over time.

---

## Credex Discount Estimates

Credex does not publish specific discount rates publicly (sourcing varies by deal). The audit engine uses a **conservative 20% estimate** for the `use_credits` recommendation, with explanation that typical discounts are 15–25%. This estimate is deliberately conservative to be defensible — real discounts may be higher.

Source: https://credex.rocks — product positioning and conversations with Credex team.
