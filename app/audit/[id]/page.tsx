'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Mail,
  X,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import type { AuditReport, ToolAuditResult } from '@/lib/audit-engine';
import { formatCurrency, getSeverityBadge, getActionLabel, generateShareText, cn } from '@/lib/utils';

interface LeadForm {
  email: string;
  company: string;
  role: string;
}

export default function AuditResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<AuditReport & { id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ email: '', company: '', role: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const fetchAiSummary = useCallback(async (reportData: AuditReport & { id: string }) => {
    setSummaryLoading(true);
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reportData }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
    } catch {
      setAiSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Load report from session storage or API
  useEffect(() => {
    const sessionData = sessionStorage.getItem('spendlens_result');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (parsed.id === id) {
          setReport(parsed);
          setLoading(false);
          fetchAiSummary(parsed);
          if (parsed.totalMonthlySavings > 100) {
            setTimeout(() => setShowLeadModal(true), 4000);
          }
          return;
        }
      } catch {
        // Fall through to API fetch
      }
    }

    // Fetch from API (for direct URL access / sharing)
    fetch(`/api/audit?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
        if (data.aiSummary) {
          setAiSummary(data.aiSummary);
        } else {
          fetchAiSummary(data);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id, fetchAiSummary]);

  async function submitLead() {
    if (!leadForm.email || !report) return;
    setLeadSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          auditId: id,
          honeypot,
        }),
      });
      setLeadDone(true);
    } catch {
      // Non-fatal
      setLeadDone(true);
    } finally {
      setLeadSubmitting(false);
    }
  }

  async function copyShareUrl() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Audit not found</h2>
          <p className="text-slate-400 mb-6">This audit may have expired or the link is incorrect.</p>
          <button className="btn-primary" onClick={() => router.push('/audit')}>
            Start a new audit
          </button>
        </div>
      </div>
    );
  }

  const isHighSavings = report.totalMonthlySavings > 500;
  const isOptimal = report.totalMonthlySavings < 100 && report.results.every((r) => r.action === 'optimal');
  const shareText = generateShareText(report.totalMonthlySavings, report.results.length);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-indigo-400 font-black tracking-tight text-lg">SpendLens</Link>
          <div className="flex items-center gap-3">
            <button onClick={copyShareUrl} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={() => setShowLeadModal(true)} className="btn-primary text-sm py-2 px-4">
              <Mail className="w-4 h-4" /> Email report
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero savings */}
        <div ref={heroRef} className="savings-hero text-center mb-16">
          {isOptimal ? (
            <>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 text-emerald-300 text-sm font-semibold mb-6">
                <CheckCircle className="w-4 h-4" /> Well optimized
              </div>
              <h1 className="text-5xl sm:text-6xl font-black mb-4">
                <span className="gradient-text-green">You&apos;re spending well.</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                Your AI stack is appropriately configured for your team size and use case.
                No meaningful optimizations found.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-5 py-2 text-indigo-300 text-sm font-semibold mb-6">
                <TrendingDown className="w-4 h-4" /> Savings found
              </div>
              <h1 className="text-6xl sm:text-8xl font-black mb-4 leading-none">
                <span className="gradient-text">
                  {formatCurrency(report.totalMonthlySavings)}
                </span>
              </h1>
              <p className="text-2xl text-slate-400 mb-2">per month in AI overspend</p>
              <p className="text-slate-500">
                {formatCurrency(report.totalAnnualSavings)} annually ·{' '}
                <span className="text-indigo-400 font-semibold">
                  {report.savingsPercentage}% of your current spend
                </span>
              </p>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
                <span>Current: <strong className="text-slate-300">{formatCurrency(report.totalMonthlySpend)}/mo</strong></span>
                <span>→</span>
                <span>Optimized: <strong className="text-emerald-400">{formatCurrency(report.totalProjectedSpend)}/mo</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <div className="mb-10 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-amber-300 font-bold text-lg mb-1">
                💡 Unlock even more with Credex
              </div>
              <p className="text-slate-400 text-sm">
                Credex sources discounted AI credits from companies that overforecast. At your spend level, 
                you could save an additional 15–25% on top of these plan recommendations.
              </p>
            </div>
            <a
              href="https://credex.rocks?utm_source=spendlens&utm_medium=result"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0 text-sm"
            >
              Book free consultation <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Notify CTA for optimal spenders */}
        {isOptimal && !leadDone && (
          <div className="mb-10 p-6 rounded-2xl border border-slate-700 bg-slate-900/50 text-center">
            <h3 className="font-semibold mb-2">Stay ahead as prices change</h3>
            <p className="text-slate-400 text-sm mb-4">
              We&apos;ll notify you when new optimizations apply to your stack.
            </p>
            <button onClick={() => setShowLeadModal(true)} className="btn-primary text-sm">
              <Mail className="w-4 h-4" /> Notify me
            </button>
          </div>
        )}

        {/* AI Summary */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">AI Analysis</span>
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating personalized analysis...
            </div>
          ) : aiSummary ? (
            <p className="text-slate-300 leading-relaxed">{aiSummary}</p>
          ) : (
            <p className="text-slate-400 text-sm italic">Analysis unavailable</p>
          )}
        </div>

        {/* Per-tool breakdown */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6">Tool-by-tool breakdown</h2>
          <div className="space-y-4">
            {report.results.map((result, idx) => (
              <ToolCard key={`${result.toolId}-${idx}`} result={result} />
            ))}
          </div>
        </div>

        {/* Share section */}
        <div className="glass-card rounded-xl p-8 text-center">
          <h3 className="text-lg font-bold mb-2">Share your audit</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Know someone who might be overpaying? This link shows the audit without your personal details.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="input-field text-sm flex-1"
            />
            <button onClick={copyShareUrl} className="btn-primary text-sm shrink-0">
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy link</>}
            </button>
          </div>
          <div className="mt-4 text-xs text-slate-600">
            Your email and company name are not included in the shared link.
          </div>
          {/* Twitter share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" /> Share on X (Twitter)
          </a>
        </div>

        {/* Start new audit */}
        <div className="text-center mt-10">
          <Link href="/audit" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Run a new audit
          </Link>
        </div>
      </div>

      {/* Lead capture modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl w-full max-w-md p-8 border border-slate-700 relative animate-fade-in-up">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            {leadDone ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Report sent!</h3>
                <p className="text-slate-400 text-sm">Check your email for the full audit breakdown.</p>
                <button className="btn-primary mt-6 w-full justify-center" onClick={() => setShowLeadModal(false)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">
                  {isHighSavings ? 'Get your full report' : 'Save your audit'}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {isHighSavings
                    ? `We\'ll email you the complete breakdown — and how to capture that $${formatCurrency(report.totalMonthlySavings)}/mo.`
                    : 'Get the audit link in your inbox to revisit later.'}
                </p>

                {/* Honeypot field (invisible to humans) */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Work email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="input-field"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Company (optional)</label>
                      <input
                        type="text"
                        placeholder="Acme Inc"
                        className="input-field"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm((f) => ({ ...f, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Role (optional)</label>
                      <input
                        type="text"
                        placeholder="CTO, EM..."
                        className="input-field"
                        value={leadForm.role}
                        onChange={(e) => setLeadForm((f) => ({ ...f, role: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary w-full justify-center mt-6"
                  onClick={submitLead}
                  disabled={!leadForm.email || leadSubmitting}
                >
                  {leadSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-4 h-4" /> {isHighSavings ? 'Send my report' : 'Save audit'}</>
                  )}
                </button>

                <p className="text-xs text-slate-600 text-center mt-4">
                  No spam. Unsubscribe anytime. Credex may reach out for high-savings cases.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolCard({ result }: { result: ToolAuditResult }) {
  const badge = getSeverityBadge(result.severity);
  const actionLabel = getActionLabel(result.action);
  const isOptimal = result.action === 'optimal';

  return (
    <div className={cn(
      'glass-card rounded-xl p-6 border transition-all',
      isOptimal ? 'border-slate-800' : result.severity === 'high' ? 'border-red-500/20' : 'border-amber-500/10'
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg">{result.toolName}</h3>
            <span className={cn('badge', badge.classes)}>{badge.label}</span>
          </div>
          <p className="text-xs text-slate-500">
            {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? 's' : ''}
          </p>
        </div>

        {!isOptimal && result.monthlySavings > 0 && (
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-emerald-400">
              {formatCurrency(result.monthlySavings)}/mo
            </div>
            <div className="text-xs text-slate-500">{formatCurrency(result.annualSavings)}/yr</div>
          </div>
        )}
      </div>

      {/* Spend flow */}
      <div className="flex items-center gap-3 mb-4 text-sm">
        <div className="bg-slate-800/60 rounded-lg px-3 py-1.5">
          <span className="text-slate-400 text-xs block">Current</span>
          <span className="font-semibold">{formatCurrency(result.currentMonthlySpend)}/mo</span>
        </div>
        {!isOptimal && (
          <>
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <div className={cn(
              'rounded-lg px-3 py-1.5',
              result.action !== 'optimal'
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-slate-800/60'
            )}>
              <span className="text-slate-400 text-xs block">Optimized</span>
              <span className="font-semibold text-emerald-400">{formatCurrency(result.projectedMonthlySpend)}/mo</span>
            </div>
          </>
        )}

        <div className="ml-auto">
          <span className={cn(
            'badge',
            result.action === 'switch_tool' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
            result.action === 'downgrade_plan' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            result.action === 'use_credits' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
            result.action === 'reduce_seats' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
            result.action === 'review_api_spend' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          )}>
            {actionLabel}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {result.recommendedTool && (
        <div className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/15 rounded-lg px-3 py-2 mb-3">
          → Switch to <strong>{result.recommendedToolName}</strong> {result.recommendedPlan && `(${result.recommendedPlan})`}
        </div>
      )}
      {result.recommendedPlan && !result.recommendedTool && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/15 rounded-lg px-3 py-2 mb-3">
          → Downgrade to <strong>{result.recommendedPlan}</strong> plan
        </div>
      )}

      {/* Reason */}
      <p className="text-sm text-slate-400 leading-relaxed">{result.reason}</p>

      {/* Credex opportunity */}
      {result.credexOpportunity && result.action === 'use_credits' && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <a
            href="https://credex.rocks?utm_source=spendlens&utm_medium=tool-card"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors"
          >
            Get discounted credits via Credex <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
