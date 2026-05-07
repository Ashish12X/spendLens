import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { leadCaptureSchema } from '@/lib/validations';
import { getSupabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting for lead capture
const leadRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkLeadRateLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const limit = leadRateLimit.get(key);

  if (!limit || now > limit.resetAt) {
    leadRateLimit.set(key, { count: 1, resetAt: now + 3_600_000 }); // 1 hour window
    return true;
  }

  return limit.count < 3; // Max 3 submissions per email per hour
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate (includes honeypot check)
    const parseResult = leadCaptureSchema.safeParse(body);
    if (!parseResult.success) {
      // Silently reject bots (honeypot triggered)
      if (parseResult.error.issues.some((i) => i.path[0] === 'honeypot')) {
        return NextResponse.json({ success: true }); // Fake success for bots
      }
      return NextResponse.json({ error: 'Invalid data', details: parseResult.error.flatten() }, { status: 400 });
    }

    const { email, company, role, teamSize, auditId } = parseResult.data;

    // Rate limit by email
    if (!checkLeadRateLimit(email)) {
      return NextResponse.json({ error: 'Too many submissions. Please wait before trying again.' }, { status: 429 });
    }

    // Get audit details for email
    let auditData: {
      total_monthly_savings: number;
      total_annual_savings: number;
      high_savings?: boolean;
    } | null = null;
    
    try {
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from('audits')
        .select('total_monthly_savings, total_annual_savings')
        .eq('id', auditId)
        .single();
      auditData = data;
    } catch {
      // Non-fatal
    }

    const monthlySavings = auditData?.total_monthly_savings ?? 0;
    const annualSavings = auditData?.total_annual_savings ?? 0;
    const highSavings = monthlySavings > 500;

    // Save lead to Supabase
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('leads').insert({
        id: uuidv4(),
        audit_id: auditId,
        email,
        company: company ?? null,
        role: role ?? null,
        team_size: teamSize ?? null,
      });
    } catch (dbError) {
      console.error('Lead DB save failed:', dbError);
    }

    // Send confirmation email
    try {
      if (process.env.RESEND_API_KEY) {
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`;

        await resend.emails.send({
          from: 'SpendLens <noreply@spendlens.credex.rocks>',
          to: email,
          subject: highSavings
            ? `Your AI spend audit: $${Math.round(monthlySavings)}/mo savings found`
            : 'Your SpendLens AI Spend Audit',
          html: generateEmailHtml({
            email,
            company,
            monthlySavings,
            annualSavings,
            highSavings,
            shareUrl,
          }),
        });
      }
    } catch (emailError) {
      console.error('Email send failed (non-fatal):', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}

function generateEmailHtml(data: {
  email: string;
  company?: string;
  monthlySavings: number;
  annualSavings: number;
  highSavings: boolean;
  shareUrl: string;
}): string {
  const { company, monthlySavings, annualSavings, highSavings, shareUrl } = data;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f0f; color: #e5e5e5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #2d2d5e; border-radius: 16px; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">SpendLens</h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">AI Spend Audit</p>
      </div>

      ${monthlySavings > 0 ? `
      <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px;">Potential monthly savings</p>
        <p style="font-size: 48px; font-weight: 800; color: #6366f1; margin: 0;">$${Math.round(monthlySavings).toLocaleString()}</p>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">$${Math.round(annualSavings).toLocaleString()}/year</p>
      </div>
      ` : `
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <p style="color: #10b981; font-size: 18px; font-weight: 600; margin: 0;">You're spending well ✓</p>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Your AI stack is already optimized.</p>
      </div>
      `}

      <p style="color: #cbd5e1; line-height: 1.6;">
        ${company ? `Hi ${company} team,` : 'Hi,'}<br><br>
        Your SpendLens audit is ready. ${monthlySavings > 0 ? `We found <strong style="color: #6366f1;">$${Math.round(monthlySavings)}/month</strong> in potential savings across your AI tool stack.` : 'Your AI spend is well-optimized.'}
      </p>

      <a href="${shareUrl}" style="display: block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; margin: 24px 0;">
        View Your Full Audit →
      </a>

      ${highSavings ? `
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 24px; margin-top: 24px;">
        <h3 style="color: #f59e0b; margin: 0 0 12px; font-size: 16px;">💡 Unlock more savings with Credex</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Credex sources discounted AI credits from companies that over-forecast. Teams with your spend profile typically save an additional 15–25% on top of our plan recommendations.
        </p>
        <a href="https://credex.rocks?utm_source=spendlens&utm_medium=email" style="color: #f59e0b; text-decoration: none; font-weight: 600; font-size: 14px;">
          Book a free Credex consultation →
        </a>
      </div>
      ` : ''}

      <p style="color: #475569; font-size: 12px; text-align: center; margin-top: 32px;">
        SpendLens by Credex · <a href="https://credex.rocks" style="color: #6366f1;">credex.rocks</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
