"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const nav = [
  { label: "Home",        href: "/"            },
  { label: "Portfolio",   href: "/portfolio"   },
  { label: "Bookshelf",   href: "/bookshelf"   },
  { label: "Principles",  href: "/principles"  },
  { label: "Photography", href: "/photography" },
  { label: "Vault",       href: "/vault"       },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-4 w-4" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="mt-8 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v1M7.5 13v1M1 7.5H0M14 7.5h1M2.9 2.9l-.7-.7M12.8 12.8l-.7-.7M2.9 12.1l-.7.7M12.8 2.2l-.7.7M7.5 4.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2.5 7.5a5 5 0 0 0 9.3 2.6A5 5 0 0 1 5 4.2a5 5 0 0 0-2.5 3.3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-[72px] left-[140px] flex flex-col gap-5 z-10">
      {nav.map((item, i) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`fade-up flex items-center gap-2 text-[15px] transition-colors ${
              active
                ? "font-bold text-black dark:text-white"
                : "text-[#6b7280] hover:text-black dark:text-neutral-500 dark:hover:text-white"
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {active && <span className="h-[7px] w-[7px] shrink-0 bg-[#1a1a1a] dark:bg-white" />}
            {item.label}
          </Link>
        );
      })}
      <ThemeToggle />
    </nav>
  );
}
