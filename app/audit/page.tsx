'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Plus, Trash2, Info, ChevronDown, Loader2 } from 'lucide-react';
import { ALL_TOOLS, type ToolId, type UseCase } from '@/lib/pricing-data';
import type { AuditFormData, UserToolInput } from '@/lib/audit-engine';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'spendlens_form_v1';

const USE_CASES: { value: UseCase; label: string; desc: string }[] = [
  { value: 'coding', label: '💻 Coding', desc: 'Software development, code review, debugging' },
  { value: 'writing', label: '✍️ Writing', desc: 'Content, docs, emails, marketing copy' },
  { value: 'data', label: '📊 Data', desc: 'Analysis, SQL, research automation' },
  { value: 'research', label: '🔬 Research', desc: 'Literature review, summarization, Q&A' },
  { value: 'mixed', label: '🔀 Mixed', desc: 'Multiple use cases across the team' },
];

type FormStep = 'use-case' | 'tools' | 'review';

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>('use-case');
  const [useCase, setUseCase] = useState<UseCase>('mixed');
  const [teamSize, setTeamSize] = useState(5);
  const [selectedTools, setSelectedTools] = useState<UserToolInput[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as Partial<AuditFormData & { step: FormStep }>;
        if (data.useCase) setUseCase(data.useCase);
        if (data.teamSize) setTeamSize(data.teamSize);
        if (data.tools && data.tools.length > 0) setSelectedTools(data.tools);
        // Don't restore step — start fresh from step 1
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist state on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ useCase, teamSize, tools: selectedTools, step })
      );
    } catch {
      // Ignore storage errors
    }
  }, [useCase, teamSize, selectedTools, step]);

  const toggleTool = useCallback(
    (toolId: ToolId) => {
      setSelectedTools((prev) => {
        const exists = prev.find((t) => t.toolId === toolId);
        if (exists) {
          return prev.filter((t) => t.toolId !== toolId);
        }
        const tool = ALL_TOOLS.find((t) => t.id === toolId)!;
        const defaultPlan = tool.plans[1] ?? tool.plans[0]; // Skip free plan
        const pricePerSeat = defaultPlan.monthlyPricePerSeat;
        return [
          ...prev,
          {
            toolId,
            planId: defaultPlan.id,
            seats: teamSize,
            monthlySpend: pricePerSeat > 0 ? pricePerSeat * Math.min(teamSize, 5) : 50,
          },
        ];
      });
    },
    [teamSize]
  );

  const updateTool = useCallback((toolId: ToolId, updates: Partial<UserToolInput>) => {
    setSelectedTools((prev) =>
      prev.map((t) => (t.toolId === toolId ? { ...t, ...updates } : t))
    );
  }, []);

  const handleSubmit = async () => {
    if (selectedTools.length === 0) {
      setError('Add at least one tool to audit.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: AuditFormData = { tools: selectedTools, teamSize, useCase };

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Audit failed');
      }

      const result = await res.json();

      // Store result for results page
      sessionStorage.setItem('spendlens_result', JSON.stringify(result));

      router.push(`/audit/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-indigo-400 font-black tracking-tight text-lg">SpendLens</a>
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm">
            {(['use-case', 'tools', 'review'] as FormStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    step === s
                      ? 'bg-indigo-600 text-white'
                      : (step === 'tools' && s === 'use-case') || step === 'review'
                        ? 'bg-indigo-900/50 text-indigo-400'
                        : 'bg-slate-800 text-slate-600'
                  )}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-slate-800" />}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Step 1: Use case + team size */}
        {step === 'use-case' && (
          <div className="animate-fade-in-up">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">Tell us about your team</h1>
              <p className="text-slate-400">This helps us give use-case-relevant recommendations.</p>
            </div>

            {/* Team size */}
            <div className="glass-card rounded-xl p-6 mb-6">
              <label className="block text-sm font-semibold mb-1">Team size</label>
              <p className="text-xs text-slate-500 mb-4">Total people using AI tools</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <div className="w-20">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value)))}
                    className="input-field text-center"
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-2">
                <span>1 (solo)</span>
                <span>{teamSize} people</span>
                <span>200+</span>
              </div>
            </div>

            {/* Use case */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <label className="block text-sm font-semibold mb-1">Primary use case</label>
              <p className="text-xs text-slate-500 mb-4">What does your team use AI tools for most?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.value}
                    type="button"
                    onClick={() => setUseCase(uc.value)}
                    className={cn(
                      'text-left p-4 rounded-xl border transition-all duration-200',
                      useCase === uc.value
                        ? 'border-indigo-500 bg-indigo-600/10 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    )}
                  >
                    <div className="font-semibold text-sm mb-0.5">{uc.label}</div>
                    <div className="text-xs opacity-70">{uc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary w-full justify-center" onClick={() => setStep('tools')}>
              Choose tools <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Tool selection */}
        {step === 'tools' && (
          <div className="animate-fade-in-up">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">Which tools do you pay for?</h1>
              <p className="text-slate-400">
                Select each tool, choose the plan, and enter your actual monthly spend.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {ALL_TOOLS.map((tool) => {
                const selected = selectedTools.find((t) => t.toolId === tool.id);
                const isSelected = Boolean(selected);

                return (
                  <div
                    key={tool.id}
                    className={cn(
                      'glass-card rounded-xl border transition-all duration-200',
                      isSelected
                        ? 'border-indigo-500/40 bg-indigo-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    )}
                  >
                    {/* Tool header */}
                    <button
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold border',
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          )}
                        >
                          {isSelected ? '✓' : '+'}
                        </div>
                        <div>
                          <div className="font-semibold">{tool.name}</div>
                          <div className="text-xs text-slate-500">
                            {tool.vendor} · {tool.category}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-emerald-400 font-semibold">Selected</span>
                      )}
                    </button>

                    {/* Expanded config */}
                    {isSelected && selected && (
                      <div className="px-5 pb-5 border-t border-slate-800/50 pt-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Plan */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plan</label>
                            <select
                              className="input-field"
                              value={selected.planId}
                              onChange={(e) => updateTool(tool.id, { planId: e.target.value })}
                            >
                              {tool.plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name}
                                  {plan.monthlyPricePerSeat > 0
                                    ? ` — $${plan.monthlyPricePerSeat}/user/mo`
                                    : plan.id === 'pay_as_you_go' ? ' — usage-based' : ' — Free'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Seats */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                              Seats / users
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={10000}
                              className="input-field"
                              value={selected.seats}
                              onChange={(e) =>
                                updateTool(tool.id, { seats: Math.max(1, Number(e.target.value)) })
                              }
                            />
                          </div>

                          {/* Monthly spend */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                              Actual monthly spend ($)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                              <input
                                type="number"
                                min={0}
                                className="input-field pl-7"
                                value={selected.monthlySpend}
                                onChange={(e) =>
                                  updateTool(tool.id, { monthlySpend: Math.max(0, Number(e.target.value)) })
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* Plan details */}
                        {(() => {
                          const plan = tool.plans.find((p) => p.id === selected.planId);
                          if (!plan) return null;
                          return (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {plan.features.slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="text-xs bg-slate-800/60 text-slate-400 px-2 py-1 rounded-md"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary footer */}
            <div className="sticky bottom-6">
              <div className="glass-card rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400">
                  {selectedTools.length === 0 ? (
                    'Select at least one tool to continue'
                  ) : (
                    <>
                      <span className="text-white font-semibold">{selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''}</span>
                      {' · '}
                      <span className="text-indigo-400 font-semibold">
                        ${selectedTools.reduce((s, t) => s + t.monthlySpend, 0).toLocaleString()}/month
                      </span>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    className="btn-secondary text-sm py-2 px-4"
                    onClick={() => setStep('use-case')}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    className="btn-primary text-sm py-2 px-5"
                    onClick={handleSubmit}
                    disabled={selectedTools.length === 0 || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Run audit <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
