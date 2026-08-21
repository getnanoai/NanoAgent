"use client";

import { gatewayPricingPlans } from "@/lib/data";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

function PricingCheck({ included }: { included: boolean }) {
  return (
    <span
      className={`w-[18px] h-[18px] inline-flex items-center justify-center flex-none rounded-full text-[11px] font-bold ${
        included
          ? "bg-[rgba(232,166,87,0.2)] text-[#f4c489]"
          : "bg-white/5 text-[var(--color-text-dim)]"
      }`}
    >
      {included ? "✓" : "–"}
    </span>
  );
}

export default function GatewayPricing() {
  return (
    <section className="section featcat pt-20 pb-0" id="pricing">
      <Container>
        {/* Header with explicit Gateway identity */}
        <div className="text-center max-w-[760px] mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[rgba(232,166,87,0.3)] bg-[rgba(232,166,87,0.1)] text-[#f4c489] text-[12px] font-mono font-semibold uppercase tracking-wider mb-3.5">
            ⇄ Gateway · Enterprise AI Control Plane
          </div>
          <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-tight text-[#f3f6fb] m-0 mb-3.5">
            Transparent Pricing for Engineering Teams
          </h2>
          <p className="text-[16px] text-[var(--color-text-mut)] leading-relaxed m-0">
            Start evaluating with a free workspace. Scale into cross-team spend attribution, model routing policies, and audit logs as your AI adoption grows.
          </p>
        </div>


        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] max-w-[1060px] mx-auto">
          {gatewayPricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-gradient-to-b from-[rgba(15,18,24,0.95)] to-[rgba(10,12,16,0.95)] p-7 sm:p-8 transition-all duration-200 hover:-translate-y-1 ${
                plan.featured
                  ? "border-[#e8a657] shadow-[0_0_35px_-10px_rgba(232,166,87,0.3)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-2)]"
              }`}
            >
              {plan.featured && (
                <span className="absolute top-[-12px] left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#e8a657] text-[#041017] text-[10.5px] font-mono font-extrabold tracking-[0.06em] uppercase whitespace-nowrap shadow-md">
                  Most Popular · Teams
                </span>
              )}

              {/* Plan name + description */}
              <div className="mb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="m-0 text-[20px] font-bold text-white tracking-[-0.02em]">
                    {plan.name}
                  </h3>
                  {plan.name === "Free" && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--color-text-dim)] font-semibold">
                      Evaluation
                    </span>
                  )}
                  {plan.name === "Enterprise" && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[rgba(232,166,87,0.15)] text-[#f4c489] font-semibold">
                      Custom Limits
                    </span>
                  )}
                </div>
                <p className="m-0 text-[var(--color-text-mut)] text-[13px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="py-2 border-y border-[rgba(255,255,255,0.06)] my-2">
                <p className="m-0 text-[34px] font-extrabold tracking-[-0.03em] leading-none text-white">
                  {plan.monthlyPrice}
                  {plan.monthlyPrice !== "Custom" && (
                    <span className="text-sm font-normal text-[var(--color-text-mut)] ml-1">/mo</span>
                  )}
                </p>
                {plan.annualPrice !== plan.monthlyPrice && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(40,200,100,0.15)] border border-[rgba(40,200,100,0.35)] text-[#28c864] text-[12px] font-semibold">
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {plan.annualPrice}/mo billed annually
                    </span>
                    <span className="text-[11px] text-[#28c864] font-semibold opacity-80">Save 21%</span>
                  </div>
                )}
              </div>

              {/* Feature checklist */}
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5 flex-1 mt-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-center gap-2.5 text-[13px] ${
                      feature.included
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-mut)] opacity-40"
                    }`}
                  >
                    <PricingCheck included={feature.included} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <Button
                  variant={plan.featured ? "primary" : "ghost"}
                  href={plan.ctaHref}
                  className={`w-full justify-center ${
                    plan.featured
                      ? "!bg-[#e8a657] !text-black hover:!bg-[#f4c489]"
                      : ""
                  }`}
                >
                  {plan.ctaLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
