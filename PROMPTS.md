# PROMPTS.md — LLM Prompts Used in SpendLens

---

## AI Summary Prompt (Production)

Used in: `app/api/summary/route.ts`

```
You are a sharp, direct financial analyst writing a 90-110 word personalized summary 
for a startup founder who just audited their AI tool spend.

Context:
- Team size: {teamSize} people
- Primary use case: {useCase}
- Total monthly AI spend: ${totalMonthlySpend}
- Monthly savings found: ${totalMonthlySavings}
- Annual savings found: ${totalAnnualSavings}

Tool-by-tool findings:
{toolsSummary — bullet list of tool name, action, savings, and reason}

Write a concise, confident summary paragraph (90-110 words). Rules:
1. Open with the most important finding — the dollar number
2. Name 1-2 specific tools and what to do with them
3. Give one sentence of context explaining WHY (not just WHAT)
4. End with a forward-looking statement about their stack
5. Tone: direct, analytical, like a CFO who respects their time
6. No filler phrases like "Great news!" or "It looks like..."
7. No bullet points — prose only
8. Do NOT mention Credex by name
```

### Why I wrote it this way

**Opening with the dollar number**: Users who just ran an audit are outcome-focused. The first sentence of the summary should confirm or expand on the hero number they're looking at. Tests showed GPT/Claude naturally wanted to open with "Your AI stack analysis reveals..." — I added rule 1 to override this.

**Naming specific tools**: A generic "you're overspending on chat AI" is useless. Rule 2 forces the model to make the summary feel personalized to this user's actual stack, not a template.

**CFO tone**: Initial tests produced summaries that were too gentle ("You might consider..."). Adding "like a CFO who respects their time" consistently produces more direct, confident language. Founders respond better to direct assessments.

**No filler phrases**: Claude's default is to open with affirmations. Rule 6 eliminates these. "Great news! We found savings" is the opposite of the credibility we want.

**No Credex mention**: The summary should feel like independent analysis. Credex mentions in the summary would undermine trust. The CTA is handled separately in the UI.

### What I tried that didn't work

1. **Asking for bullet points in the summary**: The result felt like a report, not an analysis. The prose version reads more like expert advice and screenshots better for sharing.

2. **Injecting word count as a range ("80-120 words")**: The model would sometimes hit 80 words and stop mid-thought, or ramble to 140. "90-110 words" with "concise, confident" in the role description performed better.

3. **Asking Claude to rate the portfolio**: Outputs like "B+" ratings felt gamey and undermined analytical credibility.

4. **Using claude-3-sonnet**: Noticeably slower for a 100-word task (1.5s vs 0.4s for Haiku) with marginal quality improvement. Haiku is the right model for this task.

---

## Fallback Template (No API key or API failure)

Also in `app/api/summary/route.ts` — `generateFallbackSummary()` function.

This template uses string interpolation to produce a readable result even when the Anthropic API is unavailable. It branches on savings magnitude:
- `> $500/mo`: Leads with savings number, names "top flagged tool", ends with action orientation
- `> $0`: Acknowledges modest savings, frames as "incremental refinement"  
- `= $0`: Validates optimal spending ("This isn't a common finding")

The fallback is intentionally direct — it mimics the AI tone rather than sounding like a system message.

---

## Development Prompts (Used with Claude/Cursor to write this codebase)

I used Claude and Cursor throughout development. Specific prompts used for code generation:

- *"Write a TypeScript audit engine function that takes tool name, plan, seats, and team size and returns a recommendation with a savings amount and 1-sentence reason. All rules must be hardcoded — no LLM calls."* (Used to bootstrap the audit engine structure, then heavily modified the logic)

- *"Generate Zod validation schemas for a multi-tool audit form where each tool has toolId, planId, seats, monthlySpend. Include a honeypot field for bot detection."* (Used verbatim, minor tweaks)

- *"Write a Resend email template for a spend audit confirmation. Dark theme HTML email. Include conditional Credex CTA for high-savings cases."* (Scaffolded, then rewrote for design)

The audit logic rules themselves were **not AI-generated** — every threshold (`≤3 seats for Cursor Pro vs Business`, `≤5 for Copilot Enterprise`, etc.) was reasoned from the actual pricing data and validated against real pricing pages.
