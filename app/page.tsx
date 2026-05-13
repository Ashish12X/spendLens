'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingDown, BarChart3, CheckCircle } from 'lucide-react';

const TOOLS = [
  { name: 'Cursor', logo: '⚡' },
  { name: 'GitHub Copilot', logo: '🐙' },
  { name: 'Claude', logo: '🤖' },
  { name: 'ChatGPT', logo: '💬' },
  { name: 'Anthropic API', logo: '🔷' },
  { name: 'OpenAI API', logo: '🟢' },
  { name: 'Gemini', logo: '✨' },
  { name: 'Windsurf', logo: '🌊' },
];

const FEATURES = [
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    title: 'Instant spend analysis',
    desc: 'Input your tools and plans. Get a full breakdown in seconds — no signup required.',
  },
  {
    icon: <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    title: 'Defensible recommendations',
    desc: 'Plan-fit logic built by engineers. A finance person reads it and agrees.',
  },
  {
    icon: <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    title: 'Honest results',
    desc: "If you're spending well, we'll tell you. We don't manufacture fake savings.",
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    title: 'Shareable audit URL',
    desc: 'Every audit gets a unique link. Share with your team or investors.',
  },
];

const SOCIAL_PROOF = [
  { quote: 'Found $380/month we were wasting on ChatGPT Enterprise for 2 users.', name: 'Ashish', role: 'CTO, B2B SaaS startup' },
  { quote: 'Realized we had 15 Cursor Business seats for a 9-person eng team.', name: 'Manish', role: 'Engineering Manager' },
  { quote: 'Switched from Copilot Business to Cursor Pro, same price, way better.', name: 'Ananya', role: 'Founder, dev tools startup' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Nav */}
      <header className="border-b border-gray-200/60 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-zinc-900 dark:text-zinc-50 text-xl font-semibold tracking-tight">SpendLens</span>
          </div>
          <Link href="/audit" className="btn-primary font-medium">
            Free audit <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative px-6 py-24 sm:py-32 lg:py-40 flex flex-col items-center text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-8 shadow-sm">
              Free for founders and engineering managers
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-zinc-950 dark:text-white mb-6 leading-tight">
              Stop overpaying <br className="hidden sm:block" />
              for AI tools.
            </h1>

            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Most startups have no idea they&apos;re on the wrong plan. SpendLens audits your Cursor, Claude,
              ChatGPT, and GitHub Copilot spend &mdash; and tells you exactly where the money is going.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/audit" className="btn-primary text-base px-8 py-3.5">
                Start free audit <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">2 minutes · no signup · results on screen</span>
            </div>

            {/* Tool logos */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-lg">{tool.logo}</span>
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '8', label: 'Tools audited' },
              { value: '$0', label: 'Cost to audit' },
              { value: '2 min', label: 'Average time' },
              { value: '100%', label: 'Honest results' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Three steps to knowing exactly what you&apos;re overspending.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {[
                {
                  step: '1',
                  title: 'Input your stack',
                  desc: 'Tell us which AI tools you pay for, which plan, how many seats, and your team size.',
                },
                {
                  step: '2',
                  title: 'Get your audit',
                  desc: 'Our engine checks every tool for plan fit, seat waste, and cheaper alternatives. No AI fluff — just math.',
                },
                {
                  step: '3',
                  title: 'Share or act',
                  desc: 'See your savings on screen. Capture a shareable link. Book a call if you want to go further.',
                },
              ].map((item) => (
                <div key={item.step} className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all duration-200 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg flex items-center justify-center font-bold text-lg mb-6 border border-zinc-200 dark:border-zinc-700">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for engineering managers and founders</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center gap-4">
                  <div className="bg-white dark:bg-zinc-900 w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-2">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-3">{f.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-16">What people found</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SOCIAL_PROOF.map((item) => (
                <div key={item.name} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center text-center transition-all duration-200 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
                  <div className="flex text-amber-400 mb-6 text-lg">
                    ★★★★★
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-8 max-w-sm mx-auto">&quot;{item.quote}&quot;</p>
                  <div className="mt-auto">
                    <div className="font-semibold text-zinc-950 dark:text-white text-base">{item.name}</div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-sm">{item.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Find out what you&apos;re actually spending
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Takes 2 minutes. No account. No credit card. Just answers.
            </p>
            <Link href="/audit" className="btn-primary text-lg px-10 py-4">
              Start your free audit <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> No signup required</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Results shown on screen</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Actually free</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="font-bold text-gray-900 dark:text-white text-lg">
            SpendLens
          </div>
          <div className="flex gap-6">
            <Link href="/audit" className="hover:text-gray-900 dark:hover:text-white transition-colors">Start Audit</Link>
            <span className="opacity-50">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

