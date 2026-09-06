"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Home",        href: "/"            },
  { label: "Portfolio",   href: "/portfolio"   },
  { label: "Bookshelf",   href: "/bookshelf"   },
  { label: "Principles",  href: "/principles"  },
  { label: "Photography", href: "/photography" },
];

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
                ? "font-bold text-white"
                : "text-neutral-500 hover:text-white"
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {active && <span className="h-[7px] w-[7px] shrink-0 bg-white" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
