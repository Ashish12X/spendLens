'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingDown, BarChart3, CheckCircle, ExternalLink } from 'lucide-react';

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
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Instant spend analysis',
    desc: 'Input your tools and plans. Get a full breakdown in seconds — no signup required.',
  },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    title: 'Defensible recommendations',
    desc: 'Plan-fit logic built by engineers. A finance person reads it and agrees.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Honest results',
    desc: "If you're spending well, we'll tell you. We don't manufacture fake savings.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Shareable audit URL',
    desc: 'Every audit gets a unique link. Share with your team or investors.',
  },
];

const SOCIAL_PROOF = [
  { quote: 'Found $380/month we were wasting on ChatGPT Enterprise for 2 users.', name: 'A.K.', role: 'CTO, B2B SaaS startup' },
  { quote: 'Realized we had 15 Cursor Business seats for a 9-person eng team.', name: 'P.M.', role: 'Engineering Manager' },
  { quote: 'Switched from Copilot Business to Cursor Pro, same price, way better.', name: 'S.R.', role: 'Founder, dev tools startup' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 text-xl font-black tracking-tight">SpendLens</span>
            <span className="text-slate-600 text-sm hidden sm:block">by Credex</span>
          </div>
          <Link href="/audit" className="btn-primary text-sm py-2 px-4">
            Free audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center grid-bg pt-14">
        {/* Glow blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Free for founders and engineering managers
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="gradient-text">Stop overpaying</span>
            <br />
            <span className="text-slate-100">for AI tools.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Most startups have no idea they're on the wrong plan. SpendLens audits your Cursor, Claude, 
            ChatGPT, and GitHub Copilot spend — and tells you exactly where the money is going.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/audit" className="btn-primary text-base px-8 py-3.5">
              Start free audit <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-slate-500 text-sm">2 minutes · no signup · results on screen</span>
          </div>

          {/* Tool logos */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-400"
              >
                <span>{tool.logo}</span>
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '8', label: 'Tools audited' },
            { value: '$0', label: 'Cost to audit' },
            { value: '2 min', label: 'Average time' },
            { value: '100%', label: 'Honest results' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-indigo-400 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400 text-lg">Three steps to knowing exactly what you're overspending.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Input your stack',
                desc: 'Tell us which AI tools you pay for, which plan, how many seats, and your team size.',
              },
              {
                step: '02',
                title: 'Get your audit',
                desc: 'Our engine checks every tool for plan fit, seat waste, and cheaper alternatives. No AI fluff — just math.',
              },
              {
                step: '03',
                title: 'Share or act',
                desc: 'See your savings on screen. Capture a shareable link. Book a call if you want to go further.',
              },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-xl p-8 relative">
                <div className="text-6xl font-black text-indigo-500/20 absolute top-6 right-6">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Built for engineering managers and founders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-indigo-400 mt-0.5 shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">What people found</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.name} className="glass-card rounded-xl p-6">
                <div className="text-yellow-400 text-sm mb-4">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-slate-500 text-xs">{item.role}</div>
                  <div className="text-xs text-slate-600 mt-1 italic">Mocked — indicate to readers</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Find out what you're <span className="gradient-text">actually spending</span>
              </h2>
              <p className="text-slate-400 mb-8">
                Takes 2 minutes. No account. No credit card. Just answers.
              </p>
              <Link href="/audit" className="btn-primary text-base px-10 py-4">
                Start your free audit <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> No signup required</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Results shown on screen</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Actually free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-400">SpendLens</span>
            <span>by</span>
            <a href="https://credex.rocks" className="text-slate-400 hover:text-indigo-400 flex items-center gap-1" target="_blank" rel="noopener noreferrer">
              Credex <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-6">
            <a href="https://credex.rocks" className="hover:text-slate-300 transition-colors" target="_blank" rel="noopener noreferrer">About Credex</a>
            <Link href="/audit" className="hover:text-slate-300 transition-colors">Start Audit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
