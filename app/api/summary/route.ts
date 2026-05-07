import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { AuditReport } from '@/lib/audit-engine';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateFallbackSummary(report: Partial<AuditReport>): string {
  const savings = report.totalMonthlySavings ?? 0;
  const annual = report.totalAnnualSavings ?? 0;
  const useCase = report.formData?.useCase ?? 'mixed';
  const toolCount = report.results?.length ?? 0;

  if (savings > 500) {
    return `Your AI spend audit reveals significant optimization potential. Across your ${toolCount} tools, we identified $${Math.round(savings)}/month ($${Math.round(annual)}/year) in actionable savings — primarily through plan right-sizing and switching to equivalent tools at lower price points. For a ${useCase}-focused team, these recommendations maintain or improve capability while materially reducing your monthly burn. The highest-impact change is your top flagged tool — implementing that single recommendation captures the majority of your savings opportunity.`;
  }

  if (savings > 0) {
    return `Your AI tool stack is mostly well-configured for a ${useCase} workflow. We found $${Math.round(savings)}/month in optimization opportunities — modest, but real. The recommendations focus on right-sizing plans to your actual seat count and usage patterns. Implementing these changes requires minimal disruption and no capability trade-offs. Your overall spend discipline is solid; these are incremental refinements rather than structural overhauls.`;
  }

  return `Your AI tool stack is genuinely well-optimized for a ${useCase} team. Each tool is on the right plan for your seat count and use case. This isn't a common finding — most teams have at least one over-provisioned tool. Your spend is defensible as-is. If your team size or use case evolves, revisit this audit to catch new optimization opportunities.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = body as Partial<AuditReport>;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ summary: generateFallbackSummary(report) });
    }

    const toolsSummary = report.results
      ?.map((r) => `- ${r.toolName} (${r.currentPlan}): ${r.action} → saves $${Math.round(r.monthlySavings)}/mo. Reason: ${r.reason}`)
      .join('\n') ?? '';

    // Full prompt documented in PROMPTS.md
    const prompt = `You are a sharp, direct financial analyst writing a 90-110 word personalized summary for a startup founder who just audited their AI tool spend.

Context:
- Team size: ${report.formData?.teamSize ?? 'unknown'} people
- Primary use case: ${report.formData?.useCase ?? 'mixed'}
- Total monthly AI spend: $${Math.round(report.totalMonthlySpend ?? 0)}
- Monthly savings found: $${Math.round(report.totalMonthlySavings ?? 0)}
- Annual savings found: $${Math.round(report.totalAnnualSavings ?? 0)}

Tool-by-tool findings:
${toolsSummary}

Write a concise, confident summary paragraph (90-110 words). Rules:
1. Open with the most important finding — the dollar number
2. Name 1-2 specific tools and what to do with them
3. Give one sentence of context explaining WHY (not just WHAT)
4. End with a forward-looking statement about their stack
5. Tone: direct, analytical, like a CFO who respects their time
6. No filler phrases like "Great news!" or "It looks like..."
7. No bullet points — prose only
8. Do NOT mention Credex by name`;

    try {
      const message = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      const summary =
        content.type === 'text' ? content.text.trim() : generateFallbackSummary(report);

      // Update the audit record with the AI summary
      if (body.id) {
        try {
          const { getSupabaseAdmin } = await import('@/lib/supabase');
          const supabase = getSupabaseAdmin();
          await supabase.from('audits').update({ ai_summary: summary }).eq('id', body.id);
        } catch {
          // Non-fatal
        }
      }

      return NextResponse.json({ summary });
    } catch (anthropicError) {
      console.error('Anthropic API error:', anthropicError);
      return NextResponse.json({ summary: generateFallbackSummary(report) });
    }
  } catch (error) {
    console.error('Summary route error:', error);
    return NextResponse.json(
      { summary: 'Unable to generate summary at this time.' },
      { status: 200 } // Return 200 so UI still works
    );
  }
}
