"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import CodeBlock from "@/components/ui/CodeBlock";
import CTA from "@/components/features/CTA";
import { siteConfig } from "@/lib/data";

type ProductId = "agent" | "forge" | "gateway";
type Platform = "terminal" | "vscode" | "vs" | "desktop" | "cicd";

const platformImages: Record<Platform, string> = {
  vscode: "/assets/vscode.png",
  vs: "/assets/vs.png",
  terminal: "/assets/cli.png",
  desktop: "/assets/desktop.png",
  cicd: "/assets/nano.gif",
};

const platformBadge: Record<Platform, string> = {
  vscode: "NanoAgent — VS Code Extension",
  vs: "NanoAgent — Visual Studio 2022+",
  terminal: "nanoai — Local Terminal CLI",
  desktop: "NanoAgent — Native Desktop App",
  cicd: "NanoAgent — CI/CD PR Reviewer",
};

const aisdkCode = `import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const nano = createOpenAI({
  baseURL: 'https://app.getnanoai.com/v1',
  apiKey: process.env.NANOAGENT_API_KEY,
})

const result = streamText({
  model: nano.chat('anthropic/claude-opus-4-8'),
  prompt: 'Why is the sky blue?',
})`;

const pythonCode = `import os
from openai import OpenAI

client = OpenAI(
    base_url="https://app.getnanoai.com/v1",
    api_key=os.environ["NANOAGENT_API_KEY"],
)

stream = client.chat.completions.create(
    model="anthropic/claude-opus-4-8",
    messages=[{"role": "user", "content": "Why is the sky blue?"}],
    stream=True,
)`;

const curlCode = `# point any OpenAI-compatible client at the Gateway
curl https://app.getnanoai.com/v1/chat/completions \\
  -H "Authorization: Bearer $NANOAGENT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "anthropic/claude-opus-4-8",
    "messages": [{"role": "user", "content": "Why is the sky blue?"}],
    "stream": true
  }'`;

const gwSnippets = [
  { id: "aisdk", label: "AI SDK", code: aisdkCode, language: "typescript" as const },
  { id: "python", label: "Python", code: pythonCode, language: "python" as const },
  { id: "curl", label: "curl", code: curlCode, language: "bash" as const },
];

const whyCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Your code never leaves your machine",
    description: "NanoAgent runs locally, indexes locally, and stores embeddings locally. No uploading repositories to third-party servers.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "It shows its work",
    description: "Every plan, edit, and validation step is visible before it touches your files. You approve the path forward.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: "You stay in control",
    description: "Destructive actions require explicit approval. NanoAgent asks before running shells, writing files, or committing changes.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
    title: "Fits your existing workflow",
    description: "Works in the terminal, on the desktop, inside VS Code and Visual Studio, and as a CI reviewer for pull requests.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
    title: "Built for real codebases",
    description: "LSP-powered semantic understanding, graph-aware indexing, and diff-based edits make it precise in large projects.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 .6.1 1.2.3 1.7C5.7 8.8 4 10.7 4 13c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5 0-2.3-1.7-4.2-3.8-4.8.2-.5.3-1.1.3-1.7A4.5 4.5 0 0 0 12 2Z" />
      </svg>
    ),
    title: "Repo memory",
    description: "Team knowledge lives in version-controlled .nanoagent/memory files you can read, review, and edit — not hidden agent notes.",
  },
];

const comparisonData = [
  { feature: "Local-first execution", nano: "✓", codex: "◐", claude: "◐", copilot: "–", aider: "✓" },
  { feature: "Repo memory in git", nano: "✓", codex: "◐", claude: "✓", copilot: "◐", aider: "–" },
  { feature: "Sandboxed commands", nano: "✓", codex: "✓", claude: "✓", copilot: "–", aider: "–" },
  { feature: "15+ AI model providers", nano: "✓", codex: "–", claude: "–", copilot: "–", aider: "✓" },
  { feature: "Open source (Apache-2.0)", nano: "✓", codex: "✓", claude: "–", copilot: "–", aider: "✓" },
];

const cliInstallSnippets: Record<string, string> = {
  curl: "curl -fsSL https://raw.githubusercontent.com/getnanoai/NanoAgent/master/scripts/install.sh | bash",
  npm: "npm install -g nanoai-cli",
  pw: "irm https://raw.githubusercontent.com/getnanoai/NanoAgent/master/scripts/install.ps1 | iex",
  pnpm: "pnpm add -g nanoai-cli",
};

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>("agent");
  const [activePlatform, setActivePlatform] = useState<Platform>("terminal");
  const [activeInstallTab, setActiveInstallTab] = useState<string>("curl");
  const [copied, setCopied] = useState(false);
  const [activeGwTab, setActiveGwTab] = useState("aisdk");
  const visualRef = useRef<HTMLDivElement>(null);

  const currentInstallCmd = cliInstallSnippets[activeInstallTab] || cliInstallSnippets.curl;

  const handleCopy = useCallback(async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(".reveal-target");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ─────────────────────────────────────────────
          1. HERO SECTION & 3-PRODUCT ECOSYSTEM HUB
          ───────────────────────────────────────────── */}
      <section className="relative text-center max-w-[1160px] mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-16 reveal-target">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(110,231,255,0.25)] bg-[rgba(110,231,255,0.06)] text-[var(--color-acc-1)] text-[12px] sm:text-[12.5px] font-mono font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[var(--color-acc-1)] animate-pulse" />
          The Local-First AI Engineering Ecosystem
        </div>

        {/* Main Headline */}
        <h1 className="text-[clamp(34px,5.8vw,68px)] leading-[1.04] tracking-[-0.04em] font-extrabold m-0 text-[#f3f6fb] [text-wrap:balance]">
          Code faster without{" "}
          <span className="text-gradient-nano">giving up control.</span>
        </h1>

        {/* Unified Ecosystem Subtitle */}
        <p className="mt-5 mx-auto max-w-[760px] text-[16px] sm:text-[17.5px] leading-[1.65] text-[var(--color-text-mut)] [text-wrap:balance]">
          Run <strong className="text-white">NanoAgent</strong> locally for free. Build full-stack apps with <strong className="text-white">NanoForge</strong>. Keep AI spend under control with the <strong className="text-[#f4c489]">Gateway</strong>.
        </p>

        {/* ── 3-PRODUCT INTERACTIVE SELECTOR CARDS (FIXED DIMENSIONS, ZERO JERK) ── */}
        <div className="mt-10 max-w-[1040px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
          {/* 1. NanoAgent (Flagship - Free) */}
          <div
            onClick={() => setSelectedProduct("agent")}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-colors duration-200 cursor-pointer relative flex flex-col justify-between min-h-[175px] ${
              selectedProduct === "agent"
                ? "bg-[rgba(110,231,255,0.08)] border-[var(--color-acc-1)] shadow-[0_0_30px_-10px_rgba(110,231,255,0.35)]"
                : "bg-[rgba(255,255,255,0.02)] border-[var(--color-border)] hover:border-[var(--color-border-2)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--color-acc-1)] text-black font-bold text-xs shrink-0">
                    ⌘
                  </span>
                  <span className="font-bold text-[15px] sm:text-[16px] text-white">NanoAgent</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-[rgba(110,231,255,0.2)] text-[var(--color-acc-1)] border border-[rgba(110,231,255,0.3)] shrink-0">
                  Free · Open Source
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--color-text-mut)] m-0">
                Local-first AI coding agent for CLI, VS Code, Visual Studio &amp; Desktop. No code telemetry. Ever.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={siteConfig.signupUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--color-acc-1)] text-black hover:bg-white transition-colors"
              >
                Code for Free →
              </a>
              <div
                className={`h-[2.5px] w-12 rounded-full transition-all duration-300 ${
                  selectedProduct === "agent" ? "bg-[var(--color-acc-1)] opacity-100" : "bg-transparent opacity-0"
                }`}
              />
            </div>
          </div>

          {/* 2. NanoForge (App Builder - Free) */}
          <div
            onClick={() => setSelectedProduct("forge")}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-colors duration-200 cursor-pointer relative flex flex-col justify-between min-h-[175px] ${
              selectedProduct === "forge"
                ? "bg-[rgba(176,124,255,0.08)] border-[#b07cff] shadow-[0_0_30px_-10px_rgba(176,124,255,0.35)]"
                : "bg-[rgba(255,255,255,0.02)] border-[var(--color-border)] hover:border-[var(--color-border-2)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#b07cff] text-black font-bold text-xs shrink-0">
                    ▤
                  </span>
                  <span className="font-bold text-[15px] sm:text-[16px] text-white">NanoForge</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-[rgba(176,124,255,0.2)] text-[#cbb0ff] border border-[rgba(176,124,255,0.3)] shrink-0">
                  Free · Builder
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--color-text-mut)] m-0">
                Describe your app. Get a working full-stack app, live in preview.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={siteConfig.signupUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#b07cff] text-black hover:bg-white transition-colors"
              >
                Build for Free →
              </a>
              <div
                className={`h-[2.5px] w-12 rounded-full transition-all duration-300 ${
                  selectedProduct === "forge" ? "bg-[#b07cff] opacity-100" : "bg-transparent opacity-0"
                }`}
              />
            </div>
          </div>

          {/* 3. Gateway (Paid / Enterprise) */}
          <div
            onClick={() => setSelectedProduct("gateway")}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-colors duration-200 cursor-pointer relative flex flex-col justify-between min-h-[175px] ${
              selectedProduct === "gateway"
                ? "bg-[rgba(232,166,87,0.1)] border-[#e8a657] shadow-[0_0_30px_-10px_rgba(232,166,87,0.35)]"
                : "bg-[rgba(255,255,255,0.02)] border-[var(--color-border)] hover:border-[var(--color-border-2)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#e8a657] text-black font-bold text-xs shrink-0">
                    ⇄
                  </span>
                  <span className="font-bold text-[15px] sm:text-[16px] text-white">Gateway</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-[rgba(232,166,87,0.2)] text-[#f4c489] border border-[rgba(232,166,87,0.4)] shrink-0">
                  Paid · Teams
                </span>
              </div>
              <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--color-text-mut)] m-0">
                One endpoint for every model. Visibility into spend, control over access, and audit-ready logs. Built for teams.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={siteConfig.signupUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#e8a657] text-black hover:bg-white transition-colors"
              >
                Start for Free →
              </a>
              <div
                className={`h-[2.5px] w-12 rounded-full transition-all duration-300 ${
                  selectedProduct === "gateway" ? "bg-[#e8a657] opacity-100" : "bg-transparent opacity-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* ── DYNAMIC INTERACTIVE SHOWCASE STAGE (FULLY RESPONSIVE & SPACIOUS) ── */}
        <div className="mt-8 max-w-[1040px] mx-auto rounded-3xl border border-[var(--color-border-2)] bg-[rgba(8,10,15,0.95)] p-5 sm:p-8 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] text-left">
          
          {/* TAB 1: NANOAGENT */}
          {selectedProduct === "agent" && (
            <div key="agent-stage" className="animate-tab-fade space-y-6">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-white m-0">NanoAgent</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(110,231,255,0.15)] text-[var(--color-acc-1)]">
                      Apache-2.0 Open Source
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-mut)] m-0 leading-relaxed max-w-[620px]">
                    Runs locally on your machine. Understands repository context, plans edits, runs validation and reviews diffs.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={siteConfig.signupUrl}
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-5 py-2.5 rounded-full text-[#06121a] bg-[var(--color-acc-2)] hover:bg-[#93a0ff] transition-all shadow-[0_4px_20px_-5px_rgba(110,231,255,0.5)]"
                  >
                    Code for Free →
                  </a>
                  <Link
                    href="/agent"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-4 py-2.5 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
                  >
                    Explore
                  </Link>
                </div>
              </div>

              {/* Install Row */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
                    {(["curl", "npm", "pw", "pnpm"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveInstallTab(tab)}
                        className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          activeInstallTab === tab
                            ? "bg-[rgba(110,231,255,0.2)] text-[var(--color-acc-1)]"
                            : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                        }`}
                      >
                        {tab === "pw" ? "PowerShell" : tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[var(--color-text-dim)] hidden sm:inline">
                    Works on macOS, Linux &amp; Windows
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 p-3 px-3.5 rounded-xl border border-[var(--color-border)] bg-[#050608] font-mono text-[12.5px]">
                  <div className="flex items-center gap-2 min-w-0 overflow-x-auto scrollbar-hide">
                    <span className="text-[var(--color-acc-1)] select-none font-bold">
                      {activeInstallTab === "pw" ? "PS>" : "$"}
                    </span>
                    <code className="text-[#a6c2e6] whitespace-nowrap">{currentInstallCmd}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(currentInstallCmd)}
                    className="shrink-0 px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[rgba(255,255,255,0.06)] text-[var(--color-text-mut)] text-[11.5px] font-sans font-medium hover:text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.12)] transition-colors cursor-pointer"
                  >
                    {copied ? <span className="text-[#28c840]">Copied!</span> : <span>Copy</span>}
                  </button>
                </div>
              </div>

              {/* Surface Switcher & Window */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                    Surface Preview
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: "terminal", label: "Terminal" },
                        { id: "vscode", label: "VS Code" },
                        { id: "vs", label: "VS 2022" },
                        { id: "desktop", label: "Desktop" },
                        { id: "cicd", label: "CI/CD" },
                      ] as const
                    ).map((surf) => (
                      <button
                        key={surf.id}
                        onClick={() => setActivePlatform(surf.id)}
                        className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                          activePlatform === surf.id
                            ? "bg-[rgba(124,140,255,0.25)] text-white border border-[rgba(124,140,255,0.4)] shadow-[0_0_15px_-3px_rgba(124,140,255,0.3)]"
                            : "bg-[rgba(255,255,255,0.03)] text-[var(--color-text-mut)] border border-transparent hover:border-[var(--color-border)]"
                        }`}
                      >
                        {surf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Window - Crisp, full aspect preview */}
                <div className="border border-[var(--color-border-2)] rounded-xl bg-[#050505] overflow-hidden shadow-2xl" ref={visualRef}>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 font-mono text-xs text-[var(--color-text-dim)] truncate">
                      {platformBadge[activePlatform]}
                    </span>
                  </div>
                  <div className="bg-black w-full overflow-hidden">
                    <img
                      src={platformImages[activePlatform]}
                      alt={`NanoAgent preview on ${activePlatform}`}
                      className="w-full h-auto max-h-[420px] object-contain object-top block"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NANOFORGE */}
          {selectedProduct === "forge" && (
            <div key="forge-stage" className="animate-tab-fade space-y-6">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-white m-0">NanoForge</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(176,124,255,0.15)] text-[#cbb0ff]">
                      Full-Stack App Builder · Free
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-mut)] m-0 leading-relaxed max-w-[620px]">
                    From idea to working app — no code required. Describe what you want, and NanoForge builds it: a working app with a live preview, free to use.
                  </p>
                  <p className="text-xs text-[var(--color-text-dim)] m-0 mt-1.5 leading-relaxed max-w-[620px]">
                    Under the hood: React + Express and a real PostgreSQL database, running in an isolated container with a GitHub repo you can inspect.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={siteConfig.signupUrl}
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-5 py-2.5 rounded-full text-black bg-[#b07cff] hover:bg-[#cbb0ff] transition-all shadow-[0_4px_20px_-5px_rgba(176,124,255,0.5)]"
                  >
                    Build for Free →
                  </a>
                  <Link
                    href="/nanoforge"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-4 py-2.5 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
                  >
                    Explore
                  </Link>
                </div>
              </div>

              {/* Prompt Engine Simulation Window */}
              <div className="border border-[rgba(176,124,255,0.3)] bg-[#050508] rounded-xl overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] font-mono text-xs text-[var(--color-text-dim)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b07cff] animate-pulse" />
                    <span className="text-[#b07cff] font-bold">NanoForge Builder</span>
                    <span className="hidden sm:inline text-[var(--color-text-dim)]">/ acme-dashboard</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[rgba(176,124,255,0.15)] text-[#b07cff]">
                    PostgreSQL Provisioned
                  </span>
                </div>
                <div className="p-5 font-mono text-sm leading-relaxed text-white">
                  <span className="text-[#b07cff] font-bold mr-2">&gt;</span>
                  Build a team project management dashboard with JWT auth, Postgres tasks schema, realtime activity feed, and dark mode UI.
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[rgba(0,0,0,0.4)] border-t border-[rgba(255,255,255,0.06)] text-xs text-[var(--color-text-dim)] font-mono">
                  <span>Branch: <code className="text-white">feature/dashboard</code></span>
                  <span className="text-[#28c840]">● Isolated Container Live Preview</span>
                </div>
              </div>

              {/* 3 Architecture Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                  <strong className="text-sm text-white block mb-1">💻 React + Express Stack</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">Single typed repo compiled into a deployable Docker process.</p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                  <strong className="text-sm text-white block mb-1">🐘 Dedicated PostgreSQL</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">A real Postgres database provisioned and seeded from the first prompt.</p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                  <strong className="text-sm text-white block mb-1">🔍 Real Git Diffs</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">Every change commits to GitHub. You review every diff before merging.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GATEWAY */}
          {selectedProduct === "gateway" && (
            <div key="gateway-stage" className="animate-tab-fade space-y-6">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-white m-0">NanoAgent Gateway</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[rgba(232,166,87,0.2)] text-[#f4c489]">
                      Free Single User · Paid Teams
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-mut)] m-0 leading-relaxed max-w-[620px]">
                    The control plane for AI-powered development, built to scale from your first pilot to your entire engineering org. One endpoint, every model (Anthropic, OpenAI, Google, and more) with the spend visibility, access policy, and audit trail that scale requires.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={siteConfig.signupUrl}
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-5 py-2.5 rounded-full text-black bg-[#e8a657] hover:bg-[#f4c489] transition-all shadow-[0_4px_20px_-5px_rgba(232,166,87,0.5)]"
                  >
                    Start for Free →
                  </a>
                  <Link
                    href="/gateway"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-[13.5px] px-4 py-2.5 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all"
                  >
                    Explore
                  </Link>
                </div>
              </div>

              {/* 3 Value Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                  <strong className="text-sm text-[#f4c489] block mb-1">💰 Spend Tracking</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">Track usage by team, project, user &amp; enforce budget caps.</p>
                </div>
                <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                  <strong className="text-sm text-[#f4c489] block mb-1">🛡️ Policy Guardrails</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">Define model permissions, rate limits &amp; detect anomaly spikes.</p>
                </div>
                <div className="p-4 rounded-xl border border-[rgba(232,166,87,0.15)] bg-[rgba(232,166,87,0.03)]">
                  <strong className="text-sm text-[#f4c489] block mb-1">⚡ Zero Client Disruption</strong>
                  <p className="text-xs text-[var(--color-text-mut)] m-0 leading-relaxed">Switch providers and fallback models behind 1 static base URL.</p>
                </div>
              </div>

              {/* Code Snippet Window */}
              <div className="border border-[rgba(232,166,87,0.25)] rounded-xl bg-[#08090b] overflow-hidden shadow-xl">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.5)] px-3">
                  <div className="flex">
                    {gwSnippets.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveGwTab(tab.id)}
                        className={`px-3 py-2 text-xs font-mono transition-colors cursor-pointer border-b-2 ${
                          activeGwTab === tab.id
                            ? "text-[#e8a657] border-[#e8a657] bg-[rgba(232,166,87,0.08)]"
                            : "text-[var(--color-text-dim)] border-transparent hover:text-[var(--color-text)]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-dim)] font-mono hidden sm:inline">
                    100% OpenAI-compatible
                  </span>
                </div>
                <div className="p-4 text-xs leading-relaxed font-mono overflow-x-auto text-[#ECEAE4]">
                  <CodeBlock
                    code={gwSnippets.find((t) => t.id === activeGwTab)?.code ?? ""}
                    language={gwSnippets.find((t) => t.id === activeGwTab)?.language ?? "typescript"}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          CHAPTER 01: NANOAGENT (FLAGSHIP CODING AGENT)
          ───────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-t border-[var(--color-border)] relative reveal-target" id="agent-section">
        <Container>
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(110,231,255,0.25)] bg-[rgba(110,231,255,0.06)] text-[var(--color-acc-1)] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3">
              01 · NANOAGENT · FREE &amp; OPEN SOURCE
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3">
              The AI coding agent built for real codebases.
            </h2>
            <p className="text-[16px] text-[var(--color-text-mut)] m-0">
              Transparent, LSP-enabled, and local-first. NanoAgent shows its reasoning, drafts plans, and respects your permissions before touching a line of code.
            </p>
          </div>

          {/* 6 Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-border-2)] hover:shadow-[0_20px_40px_-20px_rgba(110,231,255,0.15)] flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(110,231,255,0.1)] text-[var(--color-acc-1)] mb-4">
                  {card.icon}
                </div>
                <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">{card.title}</h3>
                <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison Sub-block */}
          <div className="mt-16 pt-12 border-t border-[rgba(255,255,255,0.06)]">
            <div className="text-center max-w-[580px] mx-auto mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">How NanoAgent compares</h3>
              <p className="text-sm text-[var(--color-text-mut)]">A transparent comparison against leading AI coding assistants.</p>
            </div>

            <div className="max-w-[860px] mx-auto overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[rgba(10,12,18,0.7)] p-2">
              <table className="w-full border-collapse text-[14px] text-center">
                <thead>
                  <tr className="border-b border-[var(--color-border)] font-mono text-[12.5px] text-[var(--color-text-dim)]">
                    <th className="text-left py-3.5 px-4 font-medium">Feature</th>
                    <th className="py-3.5 px-4 font-semibold text-[var(--color-acc-1)]">NanoAgent</th>
                    <th className="py-3.5 px-4 font-medium">Codex</th>
                    <th className="py-3.5 px-4 font-medium">Claude Code</th>
                    <th className="py-3.5 px-4 font-medium">Copilot</th>
                    <th className="py-3.5 px-4 font-medium">Aider</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                      <td className="text-left py-3 px-4 text-[#f3f6fb] font-medium">{row.feature}</td>
                      <td className="py-3 px-4 text-[var(--color-acc-1)] font-bold">{row.nano}</td>
                      <td className="py-3 px-4 text-[var(--color-text-dim)]">{row.codex}</td>
                      <td className="py-3 px-4 text-[var(--color-text-dim)]">{row.claude}</td>
                      <td className="py-3 px-4 text-[var(--color-text-dim)]">{row.copilot}</td>
                      <td className="py-3 px-4 text-[var(--color-text-dim)]">{row.aider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/agent"
                className="inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] px-6 py-3 rounded-full text-[#06121a] bg-[var(--color-acc-2)] hover:bg-[#93a0ff] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_6px_25px_-8px_rgba(110,231,255,0.6)]"
              >
                Deep-dive into NanoAgent
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] px-6 py-3 rounded-full border border-[var(--color-border-2)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text)] hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200"
              >
                See all 16+ features
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          CHAPTER 02: NANOFORGE (FULL-STACK APP BUILDER)
          ───────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-t border-[var(--color-border)] relative reveal-target" id="forge-section">
        <Container>
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(176,124,255,0.3)] bg-[rgba(176,124,255,0.08)] text-[#cbb0ff] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3">
              02 · NANOFORGE · FULL-STACK APP BUILDER · FREE
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3">
              From a single prompt to a production app.
            </h2>
            <p className="text-[16px] text-[var(--color-text-mut)] m-0">
              Describe what you want to build. NanoForge creates a complete React frontend, Express API, and provisioned PostgreSQL database inside an isolated preview container with Git review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(176,124,255,0.4)] transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,124,255,0.12)] text-[#b07cff] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Full-stack generation</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">
                React frontend, Express API, and PostgreSQL schema generated together from one natural language description.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(176,124,255,0.4)] transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,124,255,0.12)] text-[#b07cff] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" x2="12" y1="22.08" y2="12" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Isolated preview container</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">
                Each app runs in its own sealed container with a live URL and hot reload before it touches your machine.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(176,124,255,0.4)] transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(176,124,255,0.12)] text-[#b07cff] mb-4">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="18" r="3" />
                  <circle cx="6" cy="6" r="3" />
                  <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                  <line x1="6" x2="6" y1="9" y2="21" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#f3f6fb] mb-2">Review every diff</h3>
              <p className="text-[14px] leading-relaxed text-[var(--color-text-mut)] m-0">
                Changes are committed to a dedicated GitHub repo so you can inspect, approve, or edit before merging.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/nanoforge"
              className="inline-flex items-center justify-center gap-2 font-semibold text-[14.5px] px-6 py-3 rounded-full text-black bg-[#b07cff] hover:bg-[#cbb0ff] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_6px_25px_-8px_rgba(176,124,255,0.6)]"
            >
              Build an app with NanoForge
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          CHAPTER 03: GATEWAY (PAID ENTERPRISE TIER)
          ───────────────────────────────────────────── */}
      <section className="py-20 md:py-24 border-t border-[var(--color-border)] relative reveal-target" id="gateway-section">
        <Container>
          <div className="rounded-3xl p-6 sm:p-12 border border-[rgba(232,166,87,0.3)] bg-gradient-to-br from-[rgba(15,22,32,0.95)] via-[rgba(19,21,25,0.95)] to-[rgba(33,23,8,0.95)] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.8)]">
            <div className="text-center max-w-[720px] mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(232,166,87,0.3)] bg-[rgba(232,166,87,0.1)] text-[#f4c489] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3">
                03 · NANOAGENT GATEWAY · PAID ENTERPRISE TIER
              </div>
              <h2 className="text-[clamp(28px,4.5vw,46px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-4">
                One endpoint to govern, secure, and scale team AI.
              </h2>
              <p className="text-[16.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                When more than one developer runs AI coding agents, costs spike and visibility vanishes. Put one OpenAI-compatible endpoint in front of your traffic to attribute spend, enforce policies, and audit usage.
              </p>
            </div>

            {/* 5 Governance Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-[860px] mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(25,28,33,0.8)] text-[12.5px] text-[var(--color-text-mut)]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e8a657" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span><strong>Manage $ Spend:</strong> Attribute usage by team, project, person</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(25,28,33,0.8)] text-[12.5px] text-[var(--color-text-mut)]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e8a657" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span><strong>Add Controls:</strong> Set policy and spend limits</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(25,28,33,0.8)] text-[12.5px] text-[var(--color-text-mut)]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e8a657" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span><strong>Govern:</strong> Watch for anomalies as adoption grows</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(25,28,33,0.8)] text-[12.5px] text-[var(--color-text-mut)]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e8a657" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <span><strong>Platform:</strong> Single endpoint without client disruption</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[rgba(25,28,33,0.8)] text-[12.5px] text-[var(--color-text-mut)]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e8a657" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span><strong>Security:</strong> Secure access &amp; review usage</span>
              </div>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              <div className="p-6 rounded-2xl border border-[rgba(232,166,87,0.15)] bg-[rgba(10,11,13,0.7)]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(232,166,87,0.1)] text-[#e8a657] mb-3.5">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-[16.5px] font-semibold text-[#f4c489] mb-2">Security</h3>
                <p className="text-[13.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                  Track how teams use models and watch for anomalies as adoption grows. Complete audit logs and policy guardrails.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[rgba(232,166,87,0.15)] bg-[rgba(10,11,13,0.7)]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(232,166,87,0.1)] text-[#e8a657] mb-3.5">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-[16.5px] font-semibold text-[#f4c489] mb-2">Finance</h3>
                <p className="text-[13.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                  Attribute usage by team, app, project, and user so budgets stop being guesswork. Set granular spending limits.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[rgba(232,166,87,0.15)] bg-[rgba(10,11,13,0.7)]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(232,166,87,0.1)] text-[#e8a657] mb-3.5">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4 5 7.5 12 11l7-3.5L12 4Z" />
                    <path d="M5 12.5 12 16l7-3.5" />
                    <path d="M5 17.5 12 21l7-3.5" />
                  </svg>
                </div>
                <h3 className="text-[16.5px] font-semibold text-[#f4c489] mb-2">Platform</h3>
                <p className="text-[13.5px] leading-relaxed text-[var(--color-text-mut)] m-0">
                  Keep clients pointed at one endpoint while your team manages provider changes, fallback models, and keys behind the scenes.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/gateway"
                className="inline-flex items-center justify-center gap-2 font-semibold text-[15px] px-7 py-3.5 rounded-full border border-[rgba(232,166,87,0.5)] text-[#f4c489] bg-[rgba(232,166,87,0.12)] hover:bg-[rgba(232,166,87,0.22)] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_6px_25px_-8px_rgba(232,166,87,0.5)]"
              >
                Explore Gateway pricing &amp; architecture
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────
          4. OPEN SOURCE & ECOSYSTEM FINALE
          ───────────────────────────────────────────── */}
      <section className="pt-16 pb-0 reveal-target">
        <Container>
          <CTA
            badge={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="24" height="24" fill="white" aria-hidden="true">
                <path d="M280.5 426.5C214.5 418.5 168 371 168 309.5C168 284.5 177 257.5 192 239.5C185.5 223 186.5 188 194 173.5C214 171 241 181.5 257 196C276 190 296 187 320.5 187C345 187 365 190 383 195.5C398.5 181.5 426 171 446 173.5C453 187 454 222 447.5 239C463.5 258 472 283.5 472 309.5C472 371 425.5 417.5 358.5 426C375.5 437 387 461 387 488.5L387 540.5C387 555.5 399.5 564 414.5 558C505 523.5 576 433 576 321C576 179.5 461 64 319.5 64C178 64 64 179.5 64 321C64 432 134.5 524 229.5 558.5C243 563.5 256 554.5 256 541L256 501C249 504 240 506 232 506C199 506 179.5 488 165.5 454.5C160 441 154 433 142.5 431.5C136.5 431 134.5 428.5 134.5 425.5C134.5 419.5 144.5 415 154.5 415C169 415 181.5 424 194.5 442.5C204.5 457 215 463.5 227.5 463.5C240 463.5 248 459 259.5 447.5C268 439 274.5 431.5 280.5 426.5z" />
              </svg>
            }
            title="Proudly Open Source."
            description="Released under the permissive Apache-2.0 License. Contribute, fork, and build upon NanoAgent without restrictions."
            primaryLabel="View on GitHub"
            primaryHref={siteConfig.github}
            secondaryLabel="Apache-2.0 License"
            secondaryHref={`${siteConfig.github}/blob/master/LICENSE.txt`}
            whitePrimary
          />
        </Container>
      </section>

      <div className="pb-16" />
    </>
  );
}
