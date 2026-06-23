"use client";

import Link from "next/link";
import type { Experiment } from "./data";
import Footer from "../footer";

type Perspective = { slug: string; title: string; description: string };

const NAV_COUNT = 6;

export default function PortfolioClient({
  perspectives,
  experiments,
}: {
  perspectives: Perspective[];
  experiments: Experiment[];
}) {
  const expStartIndex = NAV_COUNT + 2 + perspectives.length + 1;

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      {/* Page heading */}
      <h1
        className="fade-up mb-10 text-[19px] font-semibold dark:text-white"
        style={{ animationDelay: `${NAV_COUNT * 0.05}s` }}
      >
        Portfolio
      </h1>

      {/* Combined section */}
      <section>
        {/* Product Perspectives */}
        <p
          className="fade-up mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400"
          style={{ animationDelay: `${(NAV_COUNT + 1) * 0.05}s` }}
        >
          Product Perspectives
        </p>
        <div className="mb-8">
          {perspectives.map((item, i) => (
            <Link
              key={item.slug}
              href={`/portfolio/${item.slug}`}
              className="fade-up group flex items-start justify-between gap-4 border-b border-neutral-100 py-4 px-3 -mx-3 rounded-lg hover:bg-amber-50 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-colors"
              style={{ animationDelay: `${(NAV_COUNT + 2 + i) * 0.05}s` }}
            >
              <div>
                <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{item.title}</p>
                <p className="mt-0.5 text-sm text-neutral-400">{item.description}</p>
              </div>
              <span className="mt-1 shrink-0 text-neutral-300 group-hover:text-neutral-500 transition-colors">→</span>
            </Link>
          ))}
        </div>

        {/* Experiments */}
        <p
          className="fade-up mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-400"
          style={{ animationDelay: `${(expStartIndex - 1) * 0.05}s` }}
        >
          Experiments, Prototypes &amp; Proofs of Concept
        </p>
        <div>
          {experiments.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up group flex items-start justify-between gap-4 border-b border-neutral-100 py-4 px-3 -mx-3 rounded-lg hover:bg-amber-50 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-colors"
              style={{ animationDelay: `${(expStartIndex + i) * 0.05}s` }}
            >
              <div>
                <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{item.title}</p>
                <p className="mt-0.5 text-sm text-neutral-400">{item.description}</p>
              </div>
              <span className="mt-1 shrink-0 text-neutral-300 group-hover:text-neutral-500 transition-colors">↗</span>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
