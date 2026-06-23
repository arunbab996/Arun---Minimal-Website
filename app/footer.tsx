const socials = [
  { label: "Email",    href: "mailto:abcthestar@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/arunbaburaj" },
  { label: "X",        href: "https://x.com/heyabc_" },
];

export default function Footer() {
  return (
    <div className="mt-12">
      <hr className="border-neutral-200" />
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
