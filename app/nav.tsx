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
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-5 w-9" />;

  const dark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`mt-8 relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        dark ? "bg-neutral-600" : "bg-neutral-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          dark ? "translate-x-4" : "translate-x-0"
        }`}
      />
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
