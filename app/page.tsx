import Link from "next/link";
import Footer from "./footer";

// Content blocks — each one gets a staggered delay
const blocks = [
  {
    type: "bio",
    content: (
      <>
        I&apos;m a Product Manager, Researcher, and Generalist. Building
        software at the intersection of{" "}
        <a href="#" className="text-blue-600 hover:underline">AI</a>
        , Venture Capital, and Human Behavior.
      </>
    ),
  },
  {
    type: "bio",
    content: (
      <>
        I&apos;ve spent time across early-stage startups and research
        institutions, obsessing over how technology shapes the way people think
        and decide. I believe the best products are the ones that feel
        inevitable in hindsight.
      </>
    ),
  },
  {
    type: "bio",
    content: (
      <>
        Before that, I&apos;ve worked at the intersection of{" "}
        <a href="#" className="text-blue-600 hover:underline">behavioral science</a>{" "}
        and product strategy, trying to understand why people do what they do,
        and building things that meet them there.
      </>
    ),
  },
  {
    type: "bio",
    content: (
      <>
        I also{" "}
        <a href="#" className="text-blue-600 hover:underline">write</a>{" "}
        about ideas at the edges of AI, cognition, and the future of work.
        Occasionally I make things that have no business plan.
      </>
    ),
  },
  {
    type: "bio",
    content: <>I care about taste, compounding, and the quiet thrill of figuring something out.</>,
  },
  {
    type: "sig",
    content: <>~/A</>,
  },
];

export default function Home() {
  // Nav has 6 items (0–5), so content starts staggering from index 6
  const navCount = 6;

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      {/* Name + tagline */}
      <div
        className="fade-up mb-8"
        style={{ animationDelay: `${navCount * 0.05}s` }}
      >
        <h1 className="text-[18px] font-medium leading-snug text-[#111111] dark:text-[#e5e5e5]">Arun Baburaj</h1>
        <p className="mt-0.5 text-[15px] text-[#6b7280] dark:text-neutral-500">Chronically curious.</p>
      </div>

      {/* Bio blocks */}
      <div className="space-y-5 text-[15px] leading-[1.75] text-[#111111] dark:text-[#d4d4d4]">
        {blocks.map((block, i) => (
          <p
            key={i}
            className="fade-up"
            style={{ animationDelay: `${(navCount + 1 + i) * 0.05}s` }}
          >
            {block.content}
          </p>
        ))}
      </div>

      <div
        className="fade-up"
        style={{ animationDelay: `${(navCount + 1 + blocks.length) * 0.05}s` }}
      >
        <Footer />
      </div>
    </main>
  );
}
