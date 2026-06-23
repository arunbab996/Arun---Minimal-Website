"use client";

import { useState, useMemo } from "react";
import Footer from "../footer";
import type { Book } from "./page";

const NAV_COUNT = 6;

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="13" height="1.5" rx="0.75" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.1" />
      <rect x="1" y="6.75" width="13" height="1.5" rx="0.75" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.1" />
      <rect x="1" y="11.5" width="13" height="1.5" rx="0.75" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function BookGridCard({ book }: { book: Book }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative w-[88px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-[132px] w-[88px] overflow-hidden rounded-sm shadow-sm transition-shadow group-hover:shadow-md">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {book.banger && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
        )}
      </div>
      <div className="mt-1.5">
        <p className="text-[11px] font-medium leading-tight text-[#1a1a1a] dark:text-[#e5e5e5] line-clamp-2">{book.title}</p>
        <p className="mt-0.5 text-[10px] leading-tight text-neutral-400 line-clamp-1">{book.author}</p>
      </div>

      {/* Hover popup with note */}
      {hovered && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[200px] rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl p-3">
          <p className="text-[12px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5] leading-snug mb-0.5">{book.title}</p>
          <p className="text-[11px] text-neutral-400 mb-2">{book.author}</p>
          {book.note ? (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic">"{book.note}"</p>
          ) : (
            <p className="text-[11px] text-neutral-300 dark:text-neutral-600 italic">No note yet.</p>
          )}
          {book.status && (
            <span className="mt-2 inline-block text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-full px-2 py-0.5">
              {book.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function BookListRow({ book }: { book: Book }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 group">
      <div className="relative shrink-0 w-8 h-12 overflow-hidden rounded-[2px] shadow-sm">
        <img src={book.cover} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5] truncate">{book.title}</p>
          {book.banger && (
            <span className="shrink-0 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-full px-1.5 py-0.5">Banger</span>
          )}
          {book.status && (
            <span className="shrink-0 text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full px-1.5 py-0.5">{book.status}</span>
          )}
        </div>
        <p className="text-[11px] text-neutral-400 truncate">{book.author}</p>
        {book.note && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic truncate mt-0.5">"{book.note}"</p>
        )}
      </div>
    </div>
  );
}

export default function BookshelfClient({ books }: { books: Book[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [books, query]);

  const currentlyReading = filtered.filter((b) => b.status === "Currently Reading");
  const bangers = filtered.filter((b) => b.banger && b.status !== "Currently Reading");
  const rest = filtered.filter((b) => !b.banger && !b.status);
  const isSearching = query.trim().length > 0;

  const toggleClass = (active: boolean) =>
    `p-1.5 rounded-md transition-colors ${
      active
        ? "text-[#1a1a1a] dark:text-[#e5e5e5] bg-neutral-100 dark:bg-neutral-800"
        : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
    }`;

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      {/* Header row */}
      <div
        className="fade-up flex items-center justify-between mb-6"
        style={{ animationDelay: `${NAV_COUNT * 0.05}s` }}
      >
        <h1 className="text-[19px] font-semibold dark:text-white">Bookshelf</h1>
        <div className="flex items-center gap-1">
          <button className={toggleClass(view === "grid")} onClick={() => setView("grid")} aria-label="Grid view">
            <GridIcon active={view === "grid"} />
          </button>
          <button className={toggleClass(view === "list")} onClick={() => setView("list")} aria-label="List view">
            <ListIcon active={view === "list"} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div
        className="fade-up mb-8"
        style={{ animationDelay: `${(NAV_COUNT + 1) * 0.05}s` }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-[13px] text-[#1a1a1a] dark:text-[#e5e5e5] placeholder:text-neutral-400 outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
        />
      </div>

      {/* Search results */}
      {isSearching ? (
        <section
          className="fade-up"
          style={{ animationDelay: `${(NAV_COUNT + 2) * 0.05}s` }}
        >
          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">No books found.</p>
          ) : view === "grid" ? (
            <div className="flex flex-wrap gap-4">
              {filtered.map((book) => <BookGridCard key={book.title} book={book} />)}
            </div>
          ) : (
            <div>
              {filtered.map((book) => <BookListRow key={book.title} book={book} />)}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Currently Reading */}
          {currentlyReading.length > 0 && (
            <section className="mb-10">
              <h2
                className="fade-up mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400"
                style={{ animationDelay: `${(NAV_COUNT + 2) * 0.05}s` }}
              >
                Currently Reading
              </h2>
              <div
                className="fade-up"
                style={{ animationDelay: `${(NAV_COUNT + 3) * 0.05}s` }}
              >
                {view === "grid" ? (
                  <div className="flex flex-wrap gap-4">
                    {currentlyReading.map((book) => <BookGridCard key={book.title} book={book} />)}
                  </div>
                ) : (
                  <div>{currentlyReading.map((book) => <BookListRow key={book.title} book={book} />)}</div>
                )}
              </div>
            </section>
          )}

          {/* Absolute Bangers */}
          {bangers.length > 0 && (
            <section className="mb-10">
              <h2
                className="fade-up mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400"
                style={{ animationDelay: `${(NAV_COUNT + 4) * 0.05}s` }}
              >
                Absolute Bangers
              </h2>
              <div
                className="fade-up"
                style={{ animationDelay: `${(NAV_COUNT + 5) * 0.05}s` }}
              >
                {view === "grid" ? (
                  <div className="flex flex-wrap gap-4">
                    {bangers.map((book) => <BookGridCard key={book.title} book={book} />)}
                  </div>
                ) : (
                  <div>{bangers.map((book) => <BookListRow key={book.title} book={book} />)}</div>
                )}
              </div>
            </section>
          )}

          {/* All Books */}
          {rest.length > 0 && (
            <section>
              <h2
                className="fade-up mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400"
                style={{ animationDelay: `${(NAV_COUNT + 6) * 0.05}s` }}
              >
                All Books
              </h2>
              <div
                className="fade-up"
                style={{ animationDelay: `${(NAV_COUNT + 7) * 0.05}s` }}
              >
                {view === "grid" ? (
                  <div className="flex flex-wrap gap-4">
                    {rest.map((book) => <BookGridCard key={book.title} book={book} />)}
                  </div>
                ) : (
                  <div>{rest.map((book) => <BookListRow key={book.title} book={book} />)}</div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}
