"use client";

import Container from "@/components/ui/Container";
import { supportedProviders } from "./providerIcons";

export default function GatewayConnectivity() {
  return (
    <section className="py-20 md:py-24 border-t border-[var(--color-border)] relative" id="connectivity">
      <Container>
        <div className="text-center max-w-[760px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(232,166,87,0.3)] bg-[rgba(232,166,87,0.1)] text-[#f4c489] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3.5">
            04 · CONNECTIVITY &amp; ENDPOINTS
          </div>
          <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3.5">
            Connect to Any Model. Zero Client Rewrites.
          </h2>
          <p className="text-[16px] text-[var(--color-text-mut)] leading-relaxed m-0">
            Route traffic seamlessly across all frontier LLMs, open-source weights, and self-hosted GPU clusters behind one unified OpenAI-compatible URL.
          </p>
        </div>

        {/* 6 Provider Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {supportedProviders.map((provider) => (
            <div
              key={provider.name}
              className="p-5 rounded-2xl border border-[rgba(232,166,87,0.15)] bg-[rgba(10,12,16,0.7)] hover:border-[rgba(232,166,87,0.4)] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden="true">{provider.icon}</span>
                    <strong className="text-white text-[15px]">{provider.name}</strong>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(232,166,87,0.12)] text-[#f4c489] font-semibold">
                    {provider.badge}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-text-mut)] font-mono m-0 leading-relaxed">
                  {provider.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Core Routing Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              01 · Virtual API Keys
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Protect Provider Credentials</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Developers query the Gateway with scoped user tokens. Master API keys never leave your encrypted vault.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              02 · Automated Failovers
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Zero Downtime Resilience</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Configure secondary fallback providers and automatic retries if upstream rate limits or outages occur.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#f4c489] uppercase tracking-wider block mb-1.5">
              03 · Live Policy Routing
            </span>
            <h4 className="text-sm font-semibold text-white mb-1 m-0">Hot-Swap Behind One URL</h4>
            <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">
              Redirect traffic to new model releases or cheaper tier endpoints instantly without pushing client application code.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
