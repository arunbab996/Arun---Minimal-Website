import Footer from "../footer";
import { isUnlocked } from "./auth";
import { lock } from "./actions";
import UnlockForm from "./unlock-form";

// Locked page: keep it out of search indexes. `title` is deliberately not set
// here so the tab keeps inheriting "Arun Baburaj" from the root layout.
export const metadata = { robots: { index: false, follow: false } };

// The cookie check has to run per request — never cache this page.
export const dynamic = "force-dynamic";

const NAV_COUNT = 6;

const writings: { title: string; date: string; note: string }[] = [
  // Add pieces here as { title, date, note }.
];

export default async function WritingsPage() {
  const unlocked = await isUnlocked();

  return (
    <main className="mx-auto max-w-[620px] px-5 pt-[80px] min-[940px]:pt-[72px] pb-20">
      <div
        className="fade-up mb-8 flex items-end justify-between"
        style={{ animationDelay: `${NAV_COUNT * 0.05}s` }}
      >
        <h1 className="text-[19px] font-semibold dark:text-white">Writings</h1>
        {unlocked && (
          <form action={lock}>
            <button
              type="submit"
              className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Lock
            </button>
          </form>
        )}
      </div>

      {!unlocked ? (
        <UnlockForm />
      ) : writings.length === 0 ? (
        <p
          className="fade-up text-[17px] text-neutral-500"
          style={{ animationDelay: `${(NAV_COUNT + 1) * 0.05}s` }}
        >
          Nothing here yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {writings.map((w, i) => (
            <article
              key={w.title}
              className="fade-up border-b border-neutral-800 py-4"
              style={{ animationDelay: `${(NAV_COUNT + 1 + i) * 0.05}s` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[16px] font-medium text-[#e5e5e5]">{w.title}</h2>
                <span className="shrink-0 text-[12px] text-neutral-500">{w.date}</span>
              </div>
              <p className="mt-1 text-[15px] text-neutral-400">{w.note}</p>
            </article>
          ))}
        </div>
      )}

      {unlocked && (
        <div className="fade-up" style={{ animationDelay: `${(NAV_COUNT + 2) * 0.05}s` }}>
          <Footer />
        </div>
      )}
    </main>
  );
}
