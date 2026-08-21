"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Brand from "@/components/ui/Brand";
import { siteConfig } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productRef.current && !productRef.current.contains(event.target as Node)) {
        setProductOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProductOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setProductOpen(false);
    document.getElementById("burger")?.setAttribute("aria-expanded", "false");
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.getElementById("burger")?.setAttribute("aria-expanded", String(next));
      return next;
    });
  }, []);

  const openApp = useCallback(() => {
    window.open(siteConfig.appUrl, "_blank");
  }, []);

  const openRegister = useCallback(() => {
    window.open(siteConfig.signupUrl, "_blank");
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-[14px] transition-all duration-250 border-b border-transparent ${
        scrolled ? "bg-[rgba(0,0,0,0.85)] border-[var(--color-border)]" : "bg-[rgba(0,0,0,0.55)]"
      }`}
      id="nav"
    >
      <div className="w-full max-w-[1160px] mx-auto px-6 flex items-center gap-7 h-[68px] relative">
        <Brand />

        {/* Desktop nav links - centered */}
        <nav
          className={`nav__links items-center gap-[26px] ${
            menuOpen
              ? "is-open flex flex-col absolute top-full right-6 left-auto w-[260px] z-[100] bg-[rgba(10,12,18,0.98)] backdrop-blur-[16px] border border-[var(--color-border-2)] rounded-[var(--radius)] p-4 gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              : "hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
          aria-label="Primary"
        >
          <Link
            href="/"
            className={`text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/" ? "text-[var(--color-text)] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>

          {/* Desktop Product Dropdown */}
          <div
            ref={productRef}
            className="relative hidden md:block"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 text-[14px] font-medium transition-colors duration-150 cursor-pointer py-2 bg-transparent border-0 font-sans ${
                productOpen || pathname === "/agent" || pathname === "/gateway" || pathname === "/nanoforge"
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
              }`}
              onClick={() => setProductOpen((prev) => !prev)}
              aria-expanded={productOpen}
            >
              <span>Products</span>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-150 ${productOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Panel */}
            {productOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[520px] max-w-[calc(100vw-32px)]"
                role="menu"
              >
                <div className="bg-[rgba(8,9,13,0.98)] backdrop-blur-[16px] border border-[var(--color-border-2)] rounded-[var(--radius)] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.7)] grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* NanoAgent Col */}
                  <div className="flex flex-col gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                    <Link
                      href="/agent"
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                      onClick={closeMenu}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-acc-1)] text-black font-bold text-sm shrink-0">
                        ⌘
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm text-[var(--color-text)]">NanoAgent</strong>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[rgba(110,231,255,0.15)] text-[var(--color-acc-1)] font-semibold">
                            Free
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-text-mut)] leading-tight block mt-0.5">
                          Local-first AI coding agent
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-col gap-1 pl-11 text-xs text-[var(--color-text-mut)]">
                      <Link href="/agent" className="hover:text-[var(--color-text)] py-0.5" onClick={closeMenu}>
                        Overview &amp; Surfaces
                      </Link>
                      <a href="/docs#desktop" className="hover:text-[var(--color-text)] py-0.5" onClick={closeMenu}>
                        Desktop &amp; CLI
                      </a>
                      <a href="/docs#vscode" className="hover:text-[var(--color-text)] py-0.5" onClick={closeMenu}>
                        VS Code &amp; Visual Studio
                      </a>
                      <a href="/docs#review" className="hover:text-[var(--color-text)] py-0.5" onClick={closeMenu}>
                        CI Code Review
                      </a>
                    </div>
                  </div>

                  {/* Gateway & NanoForge Col */}
                  <div className="flex flex-col gap-2">
                    {/* Gateway (Paid) */}
                    <Link
                      href="/gateway"
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-[rgba(232,166,87,0.06)] border border-[rgba(232,166,87,0.15)] hover:bg-[rgba(232,166,87,0.12)] transition-colors"
                      onClick={closeMenu}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#e8a657] text-black font-bold text-sm shrink-0">
                        ⇄
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm text-[var(--color-text)]">Gateway</strong>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[rgba(232,166,87,0.25)] text-[#f4c489] font-semibold">
                            Paid · Teams
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-text-mut)] leading-tight block mt-0.5">
                          Enterprise spend &amp; model control
                        </span>
                      </div>
                    </Link>

                    {/* NanoForge (Free) */}
                    <Link
                      href="/nanoforge"
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                      onClick={closeMenu}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-acc-1)] text-black font-bold text-sm shrink-0">
                        ▤
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm text-[var(--color-text)]">NanoForge</strong>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[rgba(110,231,255,0.15)] text-[var(--color-acc-1)] font-semibold">
                            Free
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-text-mut)] leading-tight block mt-0.5">
                          Full-stack app builder
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile direct product links */}
          <Link
            href="/agent"
            className={`md:hidden text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/agent" ? "text-[var(--color-acc-1)] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            ⌘ NanoAgent <span className="text-[10px] font-mono text-[var(--color-acc-1)] ml-1">Free</span>
          </Link>

          <Link
            href="/nanoforge"
            className={`md:hidden text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/nanoforge" ? "text-[#b07cff] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            ▤ NanoForge <span className="text-[10px] font-mono text-[#b07cff] ml-1">Free</span>
          </Link>

          <Link
            href="/gateway"
            className={`md:hidden text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/gateway" ? "text-[#f4c489] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            ⇄ Gateway <span className="text-[10px] font-mono text-[#f4c489] ml-1">Paid</span>
          </Link>

          <Link
            href="/features"
            className={`text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/features" ? "text-[var(--color-text)] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            Features
          </Link>

          <Link
            href="/docs"
            className={`text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/docs" ? "text-[var(--color-text)] font-semibold" : "text-[var(--color-text-mut)] hover:text-[var(--color-text)]"
            }`}
            onClick={closeMenu}
          >
            Docs
          </Link>

          <Link
            href="/gateway#pricing"
            className={`text-[14px] font-medium transition-colors duration-150 ${
              pathname === "/gateway" ? "text-[#f4c489] font-semibold" : "text-[var(--color-text-mut)] hover:text-[#f4c489]"
            }`}
            onClick={closeMenu}
          >
            Pricing
          </Link>

          {/* Mobile auth buttons */}
          <button
            className="md:hidden inline-flex items-center justify-center font-semibold text-[13.5px] leading-none px-4 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text-mut)] bg-transparent hover:text-[var(--color-text)] transition-all duration-200 mt-2 w-full cursor-pointer"
            onClick={() => {
              closeMenu();
              openApp();
            }}
          >
            Login
          </button>
          <button
            className="md:hidden inline-flex items-center justify-center font-semibold text-[13.5px] leading-none px-4 py-3 rounded-full border border-transparent text-[#06121a] bg-[var(--color-acc-2)] shadow-[0_4px_15px_-5px_rgba(110,231,255,0.4)] hover:-translate-y-0.5 transition-all duration-200 w-full cursor-pointer"
            onClick={() => {
              closeMenu();
              openRegister();
            }}
          >
            Register
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[7px] text-[var(--color-text-mut)] text-[13px] font-semibold px-3 py-2 rounded-full border border-[var(--color-border)] transition-all duration-150 hover:text-[var(--color-text)] hover:border-[var(--color-border-2)]"
            aria-label="NanoAgent stars on GitHub"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span className="gh-stars hidden md:inline">Star</span>
          </a>

          <button
            className="hidden md:inline-flex items-center justify-center font-semibold text-[13.5px] leading-none px-4 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text-mut)] bg-transparent hover:text-[var(--color-text)] transition-all duration-200 cursor-pointer"
            onClick={openApp}
          >
            Login
          </button>
          <button
            className="hidden md:inline-flex items-center justify-center font-semibold text-[13.5px] leading-none px-4 py-3 rounded-full border border-transparent text-[#06121a] bg-[var(--color-acc-2)] shadow-[0_4px_15px_-5px_rgba(110,231,255,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            onClick={openRegister}
          >
            Register
          </button>

          {/* Burger */}
          <button
            className="flex md:hidden flex-col gap-[5px] bg-none border-0 cursor-pointer p-2"
            id="burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="w-[22px] h-[2px] bg-[var(--color-text)] rounded-[2px] transition-all duration-250" />
            <span className="w-[22px] h-[2px] bg-[var(--color-text)] rounded-[2px] transition-all duration-250" />
            <span className="w-[22px] h-[2px] bg-[var(--color-text)] rounded-[2px] transition-all duration-250" />
          </button>
        </div>
      </div>
    </header>
  );
}
