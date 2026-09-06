"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { label: "Home",        href: "/"            },
  { label: "Portfolio",   href: "/portfolio"   },
  { label: "Bookshelf",   href: "/bookshelf"   },
  { label: "Principles",  href: "/principles"  },
  { label: "Photography", href: "/photography" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const glassStyle = {
    background: "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderTopColor: "rgba(255,255,255,0.4)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.35)",
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-[72px] left-[140px] flex-col gap-2 z-10 items-start">
        {nav.map((item, i) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="fade-up relative px-3 py-1 rounded-full text-[17px] transition-colors"
              style={{ animationDelay: `${i * 0.05}s`, ...(active ? glassStyle : {}) }}
            >
              <span className={active ? "font-medium text-white" : "font-normal text-neutral-500 hover:text-neutral-300"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-end px-5 h-14"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button onClick={() => setOpen(!open)} className="text-neutral-400 hover:text-white transition-colors p-1" aria-label="Menu">
          {open ? (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 pt-14"
          style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          <nav className="flex flex-col px-6 pt-4">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-4 text-[22px] transition-colors border-b border-white/5 ${
                    active ? "text-white font-medium" : "text-neutral-500"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
