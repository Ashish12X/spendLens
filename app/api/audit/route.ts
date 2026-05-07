import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { auditFormSchema } from '@/lib/validations';
import { runAudit } from '@/lib/audit-engine';
import { getSupabaseAdmin } from '@/lib/supabase';

// Rate limiting store (in-memory for MVP; use Upstash Redis for production)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 10) return false; // Max 10 audits per minute per IP

  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json();

    // Validate input
    const parseResult = auditFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const formData = parseResult.data;
    const report = runAudit(formData);

    // Save to Supabase
    const id = uuidv4();
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('audits').insert({
        id,
        form_data: formData as unknown as Record<string, unknown>,
        results: report.results as unknown as Record<string, unknown>[],
        total_monthly_spend: report.totalMonthlySpend,
        total_monthly_savings: report.totalMonthlySavings,
        total_annual_savings: report.totalAnnualSavings,
        savings_percentage: report.savingsPercentage,
        use_case: formData.useCase,
        team_size: formData.teamSize,
        ai_summary: null,
      });
    } catch (dbError) {
      console.error('DB save failed (non-fatal):', dbError);
      // Don't fail the request if DB is unavailable
    }

    return NextResponse.json({ ...report, id });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json({ error: 'Failed to process audit' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing audit ID' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('audits').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    // Strip PII from public response
    const publicData = {
      id: data.id,
      results: data.results,
      totalMonthlySpend: data.total_monthly_spend,
      totalMonthlySavings: data.total_monthly_savings,
      totalAnnualSavings: data.total_annual_savings,
      savingsPercentage: data.savings_percentage,
      useCase: data.use_case,
      teamSize: data.team_size,
      aiSummary: data.ai_summary,
      createdAt: data.created_at,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Audit fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit' }, { status: 500 });
  }
}
