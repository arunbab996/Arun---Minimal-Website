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
    <nav className="fixed top-[72px] left-[140px] flex flex-col gap-2 z-10 items-start">
      {nav.map((item, i) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className="fade-up relative px-3 py-1 rounded-full text-[16px] transition-colors"
            style={{
              animationDelay: `${i * 0.05}s`,
              ...(active ? {
                background: "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderTopColor: "rgba(255,255,255,0.4)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.35)",
              } : {})
            }}
          >
            <span className={active ? "font-medium text-white" : "font-normal text-neutral-500 hover:text-neutral-300"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
