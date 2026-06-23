const socials = [
  { label: "Email",    href: "mailto:arunbaburajc@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/arunbaburaj" },
  { label: "X",        href: "https://x.com/96Arun" },
];

export default function Footer() {
  return (
    <div className="mt-12">
      <hr className="border-neutral-200 dark:border-neutral-800" />
      <div className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
