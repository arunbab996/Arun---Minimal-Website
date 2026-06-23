"use client";

import Link from "next/link";
import { useState } from "react";
import type { Experiment } from "./data";
import Footer from "../footer";

type Perspective = { slug: string; title: string; description: string };

const NAV_COUNT = 5;

const TAGS: Record<string, { label: string; color: string }> = {
  // Perspectives
  "specter-talent":              { label: "Talent Tech",  color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "intent-driven-rental-search": { label: "PropTech",     color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "homehunter":                  { label: "PropTech",     color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "mymind":                      { label: "Productivity", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
  "dunzo-aov-optimization":      { label: "Commerce",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "jupiter-app-gamification":    { label: "Fintech",      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "swiggy-bulk-delivery":        { label: "Logistics",    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  // Experiments
  "Magic Internet Money":          { label: "Finance",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "xPay":                          { label: "Finance",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "ScopeX":                        { label: "Finance",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "EquiParser":                    { label: "Finance",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "discovery/OS":                  { label: "AI",          color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Strategic Risk Intelligence":   { label: "AI",          color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Draper":                        { label: "AI",          color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Reflow":                        { label: "AI",          color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Mint & Lily CS Agent":          { label: "AI",          color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Voyager":                       { label: "Travel",      color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "Pokédex":                       { label: "Lifestyle",   color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "Polaroid":                      { label: "Lifestyle",   color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  "Y Combinator Bot":              { label: "Venture",     color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "Mission Control v2.0":          { label: "Venture",     color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "Helium Supply Intel Dashboard": { label: "PropTech",    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  "Helium Renter Flow":            { label: "PropTech",    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  "Cybrilla (KYC Debugger)":       { label: "Dev Tools",   color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  "Uniblox SOC 2 Tracker":         { label: "Dev Tools",   color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
};

const SCREENSHOTS: Record<string, string> = {
  "Magic Internet Money":          "/images/experiments/magic-internet-money.png",
  "discovery/OS":                  "/images/experiments/discovery-os.png",
  "Y Combinator Bot":              "/images/experiments/y-combinator-bot.png",
  "Voyager":                       "/images/experiments/voyager.png",
  "Pokédex":                       "/images/experiments/pokedex.png",
  "xPay":                          "/images/experiments/xpay.png",
  "Cybrilla (KYC Debugger)":       "/images/experiments/cybrilla-kyc-debugger.png",
  "Reflow":                        "/images/experiments/reflow.png",
  "Strategic Risk Intelligence":   "/images/experiments/strategic-risk-intelligence.png",
  "Draper":                        "/images/experiments/draper.png",
  "ScopeX":                        "/images/experiments/scopex.png",
  "Polaroid":                      "/images/experiments/polaroid.png",
  "Mission Control v2.0":          "/images/experiments/mission-control.png",
  "Helium Supply Intel Dashboard": "/images/experiments/helium-supply-intel.png",
  "Helium Renter Flow":            "/images/experiments/helium-renter-flow.png",
  "Uniblox SOC 2 Tracker":         "/images/experiments/uniblox-soc2.png",
  "Mint & Lily CS Agent":          "/images/experiments/mint-lily-cs-agent.png",
  "EquiParser":                    "/images/experiments/equiparser.png",
};

function ExperimentRow({
  item,
  delay,
  tag,
  grid = false,
}: {
  item: Experiment;
  delay: number;
  tag?: { label: string; color: string };
  grid?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const screenshotUrl = SCREENSHOTS[item.title];

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ animationDelay: `${delay}s` }}
        className={`fade-up group transition-colors ${
          grid
            ? "flex flex-col justify-between gap-3 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            : "flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 py-3.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 -mx-3 rounded-lg"
        }`}
      >
        <div className="flex-1">
          {grid ? (
            <>
              {tag && (
                <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium mb-2 ${tag.color}`}>
                  {tag.label}
                </span>
              )}
              <p className="text-[14px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5] leading-snug">{item.title}</p>
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">{item.description}</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{item.title}</p>
                {tag && (
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${tag.color}`}>
                    {tag.label}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-neutral-400 dark:text-neutral-500">{item.description}</p>
            </>
          )}
        </div>
        <span className={`shrink-0 text-neutral-300 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors ${grid ? "text-sm" : "mt-1"}`}>↗</span>
      </a>

      {/* Preview popup */}
      {hovered && screenshotUrl && (
        <div className="pointer-events-none absolute left-[105%] top-1/2 -translate-y-1/2 z-50 w-[380px] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl">
          <img src={screenshotUrl} alt={item.title} className="block w-full" />
          <p className="px-3 py-2 text-xs text-neutral-400 truncate">{item.href.replace(/^https?:\/\//, "")}</p>
        </div>
      )}
    </div>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={active ? "text-[#1a1a1a] dark:text-white" : "text-neutral-400"}>
      <rect x="1" y="3" width="13" height="1.5" rx="0.75" fill="currentColor"/>
      <rect x="1" y="7" width="13" height="1.5" rx="0.75" fill="currentColor"/>
      <rect x="1" y="11" width="13" height="1.5" rx="0.75" fill="currentColor"/>
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={active ? "text-[#1a1a1a] dark:text-white" : "text-neutral-400"}>
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/>
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="currentColor"/>
    </svg>
  );
}

export default function PortfolioClient({
  perspectives,
  experiments,
}: {
  perspectives: Perspective[];
  experiments: Experiment[];
}) {
  const expStartIndex = NAV_COUNT + 2 + perspectives.length + 1;
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      <div
        className="fade-up mb-10 flex items-center justify-between"
        style={{ animationDelay: `${NAV_COUNT * 0.05}s` }}
      >
        <h1 className="text-[19px] font-semibold dark:text-white">Portfolio</h1>
        <div className="flex items-center gap-1 rounded-md border border-neutral-200 dark:border-neutral-700 p-0.5">
          <button
            onClick={() => setView("list")}
            className={`rounded p-1.5 transition-colors ${view === "list" ? "bg-neutral-100 dark:bg-neutral-700" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
            aria-label="List view"
          >
            <ListIcon active={view === "list"} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded p-1.5 transition-colors ${view === "grid" ? "bg-neutral-100 dark:bg-neutral-700" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}
            aria-label="Grid view"
          >
            <GridIcon active={view === "grid"} />
          </button>
        </div>
      </div>

      {/* Product Perspectives */}
      <section className="mb-12">
        <div
          className="fade-up mb-4 flex items-center gap-3"
          style={{ animationDelay: `${(NAV_COUNT + 1) * 0.05}s` }}
        >
          <span className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200">Product Perspectives</span>
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-400">{perspectives.length}</span>
        </div>

        {view === "list" ? (
          <div className="flex flex-col">
            {perspectives.map((item, i) => {
              const tag = TAGS[item.slug];
              return (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="fade-up group flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 py-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 -mx-3 rounded-lg transition-colors"
                  style={{ animationDelay: `${(NAV_COUNT + 2 + i) * 0.05}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{item.title}</p>
                      {tag && (
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${tag.color}`}>
                          {tag.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
                  </div>
                  <span className="mt-1 shrink-0 text-neutral-300 group-hover:text-neutral-600 dark:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {perspectives.map((item, i) => {
              const tag = TAGS[item.slug];
              return (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="fade-up group flex flex-col gap-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                  style={{ animationDelay: `${(NAV_COUNT + 2 + i) * 0.05}s` }}
                >
                  {tag && (
                    <span className={`inline-block self-start rounded-full px-1.5 py-0.5 text-[10px] font-medium ${tag.color}`}>
                      {tag.label}
                    </span>
                  )}
                  <p className="text-[13px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5] leading-snug">{item.title}</p>
                  <p className="text-[12px] text-neutral-400 dark:text-neutral-500 leading-snug">{item.description}</p>
                  <span className="mt-auto text-[11px] text-neutral-300 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Experiments */}
      <section>
        <div
          className="fade-up mb-4 flex items-center gap-3"
          style={{ animationDelay: `${(expStartIndex - 1) * 0.05}s` }}
        >
          <span className="text-[15px] font-semibold text-[#1a1a1a] dark:text-neutral-200">Experiments &amp; Prototypes</span>
          <span className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-400">{experiments.length}</span>
        </div>

        {view === "list" ? (
          <div className="flex flex-col">
            {experiments.map((item, i) => (
              <ExperimentRow
                key={item.title}
                item={item}
                delay={(expStartIndex + i) * 0.05}
                tag={TAGS[item.title]}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {experiments.map((item, i) => (
              <ExperimentRow
                key={item.title}
                item={item}
                delay={(expStartIndex + i) * 0.05}
                tag={TAGS[item.title]}
                grid
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
