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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Audit not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">This audit may have expired or the link is incorrect.</p>
          <button className="btn-primary w-full" onClick={() => router.push('/audit')}>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Nav */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-zinc-950 dark:text-white font-semibold tracking-tight text-xl">SpendLens</Link>
          <div className="flex items-center gap-3">
            <button onClick={copyShareUrl} className="btn-secondary">
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={() => setShowLeadModal(true)} className="btn-primary">
              <Mail className="w-4 h-4" /> Email report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Hero savings */}
        <div ref={heroRef} className="animate-fade-in-up text-center mb-16">
          {isOptimal ? (
            <>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-6">
                <CheckCircle className="w-4 h-4" /> Well optimized
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6">
                You&apos;re spending well.
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Your AI stack is appropriately configured for your team size and use case.
                No meaningful optimizations found.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-6">
                <TrendingDown className="w-4 h-4" /> Savings found
              </div>
              <h1 className="text-7xl sm:text-8xl font-bold text-zinc-950 dark:text-white mb-4 tracking-tighter">
                {formatCurrency(report.totalMonthlySavings)}
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-2 font-medium">per month in AI overspend</p>
              <p className="text-zinc-400 dark:text-zinc-500 text-base">
                {formatCurrency(report.totalAnnualSavings)} annually ·{' '}
                <span className="text-zinc-900 dark:text-zinc-300 font-semibold">
                  {report.savingsPercentage}% of your current spend
                </span>
              </p>
              <div className="flex items-center justify-center gap-5 mt-8 text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 py-2.5 px-6 rounded-full border border-zinc-200/80 dark:border-zinc-800 w-max mx-auto shadow-sm">
                <span>Current: <strong className="text-zinc-950 dark:text-white">{formatCurrency(report.totalMonthlySpend)}/mo</strong></span>
                <span className="text-zinc-300 dark:text-zinc-700">→</span>
                <span>Optimized: <strong className="text-zinc-950 dark:text-white">{formatCurrency(report.totalProjectedSpend)}/mo</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Notify CTA for optimal spenders */}
        {isOptimal && !leadDone && (
          <div className="mb-12 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Stay ahead as prices change</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We&apos;ll notify you when new optimizations apply to your stack.
            </p>
            <button onClick={() => setShowLeadModal(true)} className="btn-primary">
              <Mail className="w-4 h-4" /> Notify me
            </button>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-white dark:bg-zinc-950 rounded-xl p-8 mb-14 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-zinc-950 dark:bg-white" />
            <span className="text-xs font-semibold text-zinc-950 dark:text-white uppercase tracking-widest">AI Analysis</span>
          </div>
          {summaryLoading ? (
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating personalized analysis...
            </div>
          ) : aiSummary ? (
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">{aiSummary}</p>
          ) : (
            <p className="text-zinc-400 dark:text-zinc-500 italic text-sm">Analysis unavailable</p>
          )}
        </div>

        {/* Per-tool breakdown */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-6">Tool-by-tool breakdown</h2>
          <div className="space-y-6">
            {report.results.map((result, idx) => (
              <ToolCard key={`${result.toolId}-${idx}`} result={result} />
            ))}
          </div>
        </div>

        {/* Share section */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-10 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">Share your audit</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-lg mx-auto text-sm">
            Know someone who might be overpaying? This link shows the audit without your personal details.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="input-field flex-1 text-sm bg-zinc-50 dark:bg-zinc-900"
            />
            <button onClick={copyShareUrl} className="btn-secondary shrink-0">
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
          <div className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
            Your email and company name are not included.
          </div>
          {/* Twitter share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Share on X
          </a>
        </div>

        {/* Start new audit */}
        <div className="text-center mt-12">
          <Link href="/audit" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors inline-flex items-center gap-2 font-medium text-sm">
            <RefreshCw className="w-4 h-4" /> Run a new audit
          </Link>
        </div>
      </main>

      {/* Lead capture modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-8 border border-gray-200 dark:border-gray-800 relative animate-fade-in-up shadow-xl">
            <button
              onClick={() => setShowLeadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {leadDone ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Report sent!</h3>
                <p className="text-gray-600 dark:text-gray-400">Check your email for the full audit breakdown.</p>
                <button className="btn-primary mt-8 w-full py-3" onClick={() => setShowLeadModal(false)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {isHighSavings ? 'Get your full report' : 'Save your audit'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Work email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="input-field py-2.5"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Company <span className="font-normal text-gray-400">(optional)</span></label>
                      <input
                        type="text"
                        placeholder="Acme Inc"
                        className="input-field py-2.5"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm((f) => ({ ...f, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Role <span className="font-normal text-gray-400">(optional)</span></label>
                      <input
                        type="text"
                        placeholder="CTO, EM..."
                        className="input-field py-2.5"
                        value={leadForm.role}
                        onChange={(e) => setLeadForm((f) => ({ ...f, role: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary w-full py-3 mt-8 text-base"
                  onClick={submitLead}
                  disabled={!leadForm.email || leadSubmitting}
                >
                  {leadSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...</>
                  ) : (
                    <><Mail className="w-5 h-5 mr-2" /> {isHighSavings ? 'Send my report' : 'Save audit'}</>
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
                  No spam. Unsubscribe anytime.
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

  // Customize badge rendering for light/dark standard colors instead of arbitrary classes
  // We'll rely on our standard tailwind classes or map them
  
  return (
    <div className={cn(
      'bg-white dark:bg-zinc-950 rounded-xl p-6 md:p-8 border transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
      isOptimal ? 'border-zinc-200/80 dark:border-zinc-800' : result.severity === 'high' ? 'border-red-200 dark:border-red-900/30' : 'border-amber-200 dark:border-amber-900/30'
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="font-semibold text-lg text-zinc-950 dark:text-white">{result.toolName}</h3>
            {/* Standard badge implementation */}
            <span className={cn(
              'px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border',
              result.severity === 'high' ? 'bg-red-50 text-red-700 border-red-200/60 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' :
              result.severity === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' :
              'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50'
            )}>
              {badge.label}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {result.currentPlan} · {result.currentSeats} seat{result.currentSeats > 1 ? 's' : ''}
          </p>
        </div>

        {!isOptimal && result.monthlySavings > 0 && (
          <div className="sm:text-right shrink-0">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mb-1">Savings</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none mb-1">
              {formatCurrency(result.monthlySavings)}<span className="text-sm font-medium text-emerald-600/70 dark:text-emerald-500/70">/mo</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{formatCurrency(result.annualSavings)}/yr</div>
          </div>
        )}
      </div>

      {/* Spend flow */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2">
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider block mb-0.5">Current</span>
          <span className="font-semibold text-sm text-zinc-950 dark:text-white">{formatCurrency(result.currentMonthlySpend)}/mo</span>
        </div>
        {!isOptimal && (
          <>
            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2">
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold uppercase tracking-wider block mb-0.5">Optimized</span>
              <span className="font-semibold text-sm text-zinc-950 dark:text-white">{formatCurrency(result.projectedMonthlySpend)}/mo</span>
            </div>
          </>
        )}

        <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0">
          <span className={cn(
            'px-2.5 py-1 rounded-md text-[13px] font-semibold border block text-center sm:inline-block',
            result.action === 'switch_tool' ? 'bg-zinc-50 text-zinc-700 border-zinc-200/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800' :
            result.action === 'downgrade_plan' ? 'bg-zinc-50 text-zinc-700 border-zinc-200/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800' :
            result.action === 'use_credits' ? 'bg-zinc-50 text-zinc-700 border-zinc-200/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800' :
            result.action === 'reduce_seats' ? 'bg-zinc-50 text-zinc-700 border-zinc-200/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800' :
            result.action === 'review_api_spend' ? 'bg-zinc-50 text-zinc-700 border-zinc-200/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:border-zinc-800' :
            'bg-zinc-50 text-zinc-600 border-zinc-200/50 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800/50'
          )}>
            {actionLabel}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      {result.recommendedTool && (
        <div className="text-[13px] font-medium text-zinc-800 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-md px-3 py-2.5 mb-3">
          <span className="text-zinc-400 dark:text-zinc-600 mr-2">↳</span> Switch to <strong className="text-zinc-950 dark:text-white font-semibold">{result.recommendedToolName}</strong> {result.recommendedPlan && <span className="text-zinc-500 font-normal">({result.recommendedPlan})</span>}
        </div>
      )}
      {result.recommendedPlan && !result.recommendedTool && (
        <div className="text-[13px] font-medium text-zinc-800 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-md px-3 py-2.5 mb-3">
          <span className="text-zinc-400 dark:text-zinc-600 mr-2">↳</span> Downgrade to <strong className="text-zinc-950 dark:text-white font-semibold">{result.recommendedPlan}</strong> plan
        </div>
      )}

      {/* Reason */}
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{result.reason}</p>


    </div>
  );
}
