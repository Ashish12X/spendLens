'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as Partial<AuditFormData & { step: FormStep }>;
        if (data.useCase) setUseCase(data.useCase);
        if (data.teamSize) setTeamSize(data.teamSize);
        if (data.tools && data.tools.length > 0) setSelectedTools(data.tools);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Nav */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-zinc-950 dark:text-white font-semibold tracking-tight text-xl">SpendLens</Link>
          {/* Step indicator */}
          <div className="flex items-center gap-3 text-sm font-medium">
            {(['use-case', 'tools', 'review'] as FormStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    step === s
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : (step === 'tools' && s === 'use-case') || step === 'review'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800'
                        : 'bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 border border-transparent'
                  )}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 md:py-24">
        {/* Step 1: Use case + team size */}
        {step === 'use-case' && (
          <div className="animate-fade-in-up max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-white mb-3 tracking-tight">Tell us about your team</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">This helps us give use-case-relevant recommendations.</p>
            </div>

            {/* Team size */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl p-8 mb-8 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
              <label className="block text-lg font-semibold text-zinc-950 dark:text-white mb-1">Team size</label>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Total people using AI tools</p>
              <div className="flex items-center gap-8">
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="flex-1 accent-blue-600 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="w-32 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value)))}
                    className="input-field text-center text-xl font-bold py-3"
                  />
                </div>
              </div>
              <div className="flex justify-between text-base text-gray-500 dark:text-gray-400 mt-6 font-medium">
                <span>1 (solo)</span>
                <span className="text-gray-900 dark:text-white font-bold">{teamSize} people</span>
                <span>200+</span>
              </div>
            </div>

            {/* Use case */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl p-8 mb-10 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
              <label className="block text-lg font-semibold text-zinc-950 dark:text-white mb-1">Primary use case</label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed font-medium">What does your team use AI tools for most?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.value}
                    type="button"
                    onClick={() => setUseCase(uc.value)}
                    className={cn(
                      'text-left p-5 rounded-lg border transition-all duration-200',
                      useCase === uc.value
                        ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-[0_0_0_1px_rgba(9,9,11,1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,1)]'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    )}
                  >
                    <div className="font-semibold text-base mb-1 text-zinc-950 dark:text-white">{uc.label}</div>
                    <div className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{uc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button className="btn-primary w-full sm:w-auto" onClick={() => setStep('tools')}>
                Choose tools <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tool selection */}
        {step === 'tools' && (
          <div className="animate-fade-in-up">
            <div className="mb-14 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Which tools do you pay for?</h1>
              <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed">
                Select each tool, choose the plan, and enter your actual monthly spend.
              </p>
            </div>

            {error && (
              <div className="mb-10 p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 text-base font-medium flex items-center justify-center">
                {error}
              </div>
            )}

            <div className="space-y-6 mb-16">
              {ALL_TOOLS.map((tool) => {
                const selected = selectedTools.find((t) => t.toolId === tool.id);
                const isSelected = Boolean(selected);

                return (
                  <div
                    key={tool.id}
                    className={cn(
                      'bg-white dark:bg-zinc-950 rounded-xl border transition-all duration-200 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
                      isSelected
                        ? 'border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white z-10 relative'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    )}
                  >
                    {/* Tool header */}
                    <button
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold transition-colors border',
                            isSelected
                              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
                              : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                          )}
                        >
                          {isSelected ? '✓' : '+'}
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-zinc-950 dark:text-white leading-tight mb-0.5">{tool.name}</div>
                          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {tool.vendor} · {tool.category}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">Selected</span>
                      )}
                    </button>

                    {/* Expanded config */}
                    {isSelected && selected && (
                      <div className="px-6 sm:px-8 pb-8 border-t border-gray-100 dark:border-gray-800 pt-8 bg-gray-50 dark:bg-gray-900/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                          {/* Plan */}
                          <div>
                            <label className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">Plan</label>
                            <select
                              className="input-field py-3"
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
                            <label className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">
                              Seats / users
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={10000}
                              className="input-field py-3"
                              value={selected.seats}
                              onChange={(e) =>
                                updateTool(tool.id, { seats: Math.max(1, Number(e.target.value)) })
                              }
                            />
                          </div>

                          {/* Monthly spend */}
                          <div>
                            <label className="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">
                              Actual monthly spend
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">$</span>
                              <input
                                type="number"
                                min={0}
                                className="input-field pl-10 font-bold text-lg py-3"
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
                            <div className="mt-8 flex flex-wrap gap-3">
                              {plan.features.slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-full font-medium shadow-sm"
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
            <div className="sticky bottom-6 z-10">
              <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                  {selectedTools.length === 0 ? (
                    'Select at least one tool to continue'
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-950 dark:text-white font-semibold">{selectedTools.length} tool{selectedTools.length > 1 ? 's' : ''}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">|</span>
                      <span className="text-zinc-950 dark:text-white font-semibold text-base">
                        ${selectedTools.reduce((s, t) => s + t.monthlySpend, 0).toLocaleString()}/mo
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    className="btn-secondary"
                    onClick={() => setStep('use-case')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={selectedTools.length === 0 || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Run audit <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
