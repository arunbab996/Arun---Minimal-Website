"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Home",        href: "/"            },
  { label: "Portfolio",   href: "/portfolio"   },
  { label: "Bookshelf",   href: "/bookshelf"   },
  { label: "Principles",  href: "/principles"  },
  { label: "Photography", href: "/photography" },
  { label: "Vault",       href: "/vault"       },
];

export default function Nav() {
  const pathname = usePathname();
  const dark = pathname === "/photography";

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
                ? `font-bold ${dark ? "text-white" : "text-black"}`
                : dark
                ? "text-white/40 hover:text-white"
                : "text-[#6b7280] hover:text-black"
            }`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {active && <span className={`h-[7px] w-[7px] shrink-0 ${dark ? "bg-white" : "bg-[#1a1a1a]"}`} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
