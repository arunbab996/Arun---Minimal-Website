// Monochrome, 1.5px strokes, currentColor — they inherit the link's colour so
// the icon and label light up together on hover rather than drifting apart.
const icons = {
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 8.4 5.6a1.5 1.5 0 0 0 1.7 0L21.5 7" strokeLinecap="round" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11ZM9.5 9.5h3.8v1.5a4.2 4.2 0 0 1 3.7-1.9c3 0 4 1.9 4 4.9v6.5h-4v-5.8c0-1.4-.5-2.3-1.8-2.3-1 0-1.6.7-1.8 1.4-.1.2-.1.6-.1.9v5.8h-4s.1-10 0-11Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.7 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.7 3Zm-1.1 16.1h1.7L7.5 4.8H5.7l10.9 14.3Z" />
    </svg>
  ),
};

const socials = [
  { label: "Email",    href: "mailto:arunbaburajc@gmail.com",     icon: icons.email    },
  { label: "LinkedIn", href: "https://linkedin.com/in/arunbaburaj", icon: icons.linkedin },
  { label: "X",        href: "https://x.com/96Arun",               icon: icons.x        },
];

export default function Footer() {
  return (
    <div className="mt-12">
      <hr className="border-neutral-200 dark:border-neutral-800" />
      {/* -ml-2.5 pulls the first item's padding back so the row still optically
          aligns with the body copy above it, despite the larger hit area. */}
      <div className="mt-4 -ml-2.5 flex flex-wrap items-center gap-x-1 gap-y-1">
        {socials.map((s) => {
          const external = !s.href.startsWith("mailto");
          return (
            <a
              key={s.label}
              href={s.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              // min-h-11 = 44px: these were ~30px tall, under a comfortable tap
              // target on touch, where there is no hover to confirm the aim.
              className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-[15px] text-neutral-600 transition-colors duration-150 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-neutral-500"
            >
              {/* Icon rests dimmer than the label and catches up on hover — it
                  reads as interactive without shouting at rest. */}
              <span className="h-4 w-4 shrink-0 text-neutral-400 transition-colors duration-150 group-hover:text-current dark:text-neutral-500">
                {s.icon}
              </span>
              {s.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
