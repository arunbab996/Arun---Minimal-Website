import Footer from "../footer";

export const metadata = { title: "Principles — Arun Baburaj" };

const principles = [
  {
    title: "Bias toward shipping.",
    body: "If something can be shared in a week, don't let it sit for a month. Small shipped projects beat big unfinished ideas.",
  },
  {
    title: "Start from the user, not the feature.",
    body: "Understand the person — their pain, workflow, and constraints — before designing product or recommending investments.",
  },
  {
    title: "Write to think.",
    body: "When confused, write. Clear writing forces clearer thinking and better decisions.",
  },
  {
    title: "Long-term games, long-term people.",
    body: "Careers compound. Prefer collaborators you can imagine working with for a decade.",
  },
  {
    title: "Data-informed, not data-paralysed.",
    body: "Numbers should sharpen judgement, not replace it; use qualitative feedback when sample sizes are small.",
  },
];

const NAV_COUNT = 6;

export default function PrinciplesPage() {
  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      <h1
        className="fade-up mb-10 text-[19px] font-semibold"
        style={{ animationDelay: `${NAV_COUNT * 0.05}s` }}
      >
        Principles
      </h1>

      <ol className="space-y-8">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="fade-up flex gap-6"
            style={{ animationDelay: `${(NAV_COUNT + 1 + i) * 0.05}s` }}
          >
            <span className="mt-0.5 w-5 shrink-0 text-sm text-neutral-300">{i + 1}.</span>
            <div>
              <p className="text-[15px] font-semibold text-[#1a1a1a]">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <Footer />
    </main>
  );
}
