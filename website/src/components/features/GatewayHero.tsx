"use client";

import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";
import { supportedProviders } from "./providerIcons";

const tools = [
  { label: "AI Coding Agents", hint: "NanoAgent · Cursor · Claude Code" },
  { label: "IDE Extensions", hint: "VS Code · JetBrains · Visual Studio" },
  { label: "Python / Node Apps", hint: "Any OpenAI-compatible SDK" },
  { label: "curl / REST", hint: "Direct API calls" },
  { label: "CI/CD Pipelines", hint: "GitHub Actions · GitLab CI" },
];

// Use first 4 providers in the hero diagram to keep it compact
const heroProviders = supportedProviders.slice(0, 4);

export default function GatewayHero() {
  return (
    <section className="px-[158px] max-lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-14 pb-5 max-lg:gap-8 max-lg:pt-8">

        {/* ── Copy ── */}
        <div className="flex flex-col gap-[18px]">
          <span className="inline-block text-[13px] font-bold tracking-[0.08em] uppercase text-[var(--color-acc-1)]">
            Enterprise Gateway
          </span>
          <h1 className="text-[clamp(36px,4.8vw,54px)] leading-[1.12] tracking-[-0.02em] font-extrabold m-0">
            One gateway for security, finance, and platform teams{" "}
            <span className="block mt-[0.08em] bg-gradient-to-r from-[#2fd4ff] via-[#5c9cff] to-[#6c54ff] bg-clip-text text-transparent">
              to see and control AI spend.
            </span>
          </h1>
          <p className="m-0 max-w-[520px] text-[16.5px] leading-relaxed text-[var(--color-text-mut)]">
            NanoAgent Gateway is the control plane for AI-powered development. Built to scale from your first pilot to your entire engineering org. One endpoint in front of every model (Claude, OpenAI, Google, and more) gives your teams the visibility and operational control they need.
          </p>
          <div className="flex gap-[14px] flex-wrap items-center mt-2">
            <Button variant="primary" size="lg" href="mailto:abdullah@alfain.tech?subject=NanoAgent%20Gateway%20-%20Enterprise%20enquiry">
              Talk to sales
            </Button>
            <Button variant="ghost" size="lg" href={siteConfig.signupUrl}>
              Start for Free &rarr;
            </Button>
          </div>
        </div>

        {/* ── Diagram ── */}
        <div className="relative rounded-2xl border border-[rgba(232,166,87,0.2)] bg-gradient-to-b from-[rgba(15,18,24,0.98)] to-[rgba(10,12,16,0.98)] p-5 sm:p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-40 h-40 rounded-full bg-[rgba(232,166,87,0.07)] blur-3xl" />
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-[1fr_80px_1fr] mb-4 text-center">
            <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-dim)]">Any Client</p>
            <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#f4c489]">Gateway</p>
            <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--color-text-dim)]">LLM Providers</p>
          </div>

          {/* Three-column flow */}
          <div className="grid grid-cols-[1fr_80px_1fr] gap-x-2 items-center">

            {/* Left: clients */}
            <div className="flex flex-col gap-1.5">
              {tools.map((t) => (
                <div key={t.label} className="px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)]">
                  <p className="text-[11px] font-semibold text-[var(--color-text)] m-0 leading-tight">{t.label}</p>
                  <p className="text-[9.5px] text-[var(--color-text-dim)] font-mono m-0 leading-tight mt-0.5 hidden sm:block">{t.hint}</p>
                </div>
              ))}
            </div>

            {/* Center: gateway node */}
            <div className="flex flex-col items-center gap-1 relative">
              {/* Lines in */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around w-1/2 pointer-events-none">
                {tools.map((_, i) => (
                  <div key={i} className="border-t border-dashed border-[rgba(110,231,255,0.15)] w-full" />
                ))}
              </div>
              {/* Lines out */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around w-1/2 pointer-events-none">
                {heroProviders.map((_, i) => (
                  <div key={i} className="border-t border-dashed border-[rgba(232,166,87,0.2)] w-full" />
                ))}
              </div>

              {/* Node */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 py-2">
                <div className="w-12 h-12 rounded-xl bg-[rgba(232,166,87,0.12)] border-2 border-[#e8a657] flex items-center justify-center shadow-[0_0_24px_-4px_rgba(232,166,87,0.5)] text-[#f4c489]">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#f4c489] uppercase tracking-widest whitespace-nowrap">1 Endpoint</span>
              </div>
            </div>

            {/* Right: providers */}
            <div className="flex flex-col gap-1.5">
              {heroProviders.map((p) => (
                <div key={p.name} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                  <span className="shrink-0 w-5 flex items-center justify-center">{p.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-white m-0 leading-tight truncate">{p.name}</p>
                    <p className="text-[9.5px] text-[var(--color-text-dim)] font-mono m-0 leading-tight mt-0.5 truncate hidden sm:block">{p.sub}</p>
                  </div>
                </div>
              ))}
              <p className="text-[9.5px] text-[var(--color-text-dim)] font-mono text-center mt-0.5">+ Groq · Ollama · more</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3.5 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c864] animate-pulse shrink-0" />
            <span className="text-[10px] font-mono text-[var(--color-text-dim)] text-center">
              OpenAI-compatible · Zero client rewrites · Switch providers instantly
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
