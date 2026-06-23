"use client";

import { useState, useEffect, useCallback } from "react";

type Photo = { url: string; loc: string; date: string };

const NAV_COUNT = 5;

function thumbUrl(url: string) {
  return url.replace("/upload/", "/upload/c_scale,w_900/");
}

export default function PhotographyClient({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  const paris = photos.filter((p) => p.date.includes("2025"));
  const japan = photos.filter((p) => p.date.includes("2024"));
  const groups = [
    { label: "Paris", sub: "March 2025", photos: paris },
    { label: "Japan", sub: "September 2024", photos: japan },
  ];

  let animIndex = NAV_COUNT;

  return (
    <main className="mx-auto max-w-[820px] px-6 pt-[72px] pb-20">
      {groups.map((group) => {
        const headerDelay = animIndex++;
        const colStartDelay = animIndex;
        animIndex += group.photos.length;

        // Split into 3 columns for masonry
        const cols: typeof group.photos[] = [[], [], []];
        group.photos.forEach((p, i) => cols[i % 3].push(p));

        return (
          <section key={group.label} className="mb-20">
            <div
              className="fade-up mb-6"
              style={{ animationDelay: `${headerDelay * 0.05}s` }}
            >
              <div className="flex items-end justify-between mb-2">
                <h2 className="text-[28px] font-semibold tracking-tight text-[#1a1a1a] dark:text-[#e5e5e5]">{group.label}</h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">{group.photos.length} photos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400 dark:text-neutral-500 italic">{group.sub}</span>
                <span className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-start">
              {cols.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-2">
                  {col.map((photo, pi) => {
                    const globalIndex = photos.indexOf(photo);
                    const delay = colStartDelay + ci + pi * 3;
                    return (
                      <button
                        key={photo.url}
                        onClick={() => setLightbox(globalIndex)}
                        className="fade-up group relative overflow-hidden rounded-md"
                        style={{ animationDelay: `${delay * 0.05}s` }}
                      >
                        <img
                          src={thumbUrl(photo.url)}
                          alt={photo.loc}
                          loading={globalIndex < 6 ? "eager" : "lazy"}
                          className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                        <p className="absolute bottom-2 left-3 text-[11px] font-medium text-white/0 group-hover:text-white/90 transition-all duration-300">
                          {photo.loc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/96"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute left-0 top-0 h-full w-1/2 cursor-w-resize z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }} />
          <div className="absolute right-0 top-0 h-full w-1/2 cursor-e-resize z-10"
            onClick={(e) => { e.stopPropagation(); next(); }} />

          <img
            src={photos[lightbox].url}
            alt={photos[lightbox].loc}
            className="relative z-0 max-h-[92vh] max-w-[92vw] object-contain rounded-sm"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
            <p className="text-sm font-medium text-white/90">{photos[lightbox].loc}</p>
            <p className="text-xs text-white/40 mt-0.5">{photos[lightbox].date}</p>
          </div>

          <button className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white text-2xl transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white text-2xl transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <button className="absolute top-5 right-6 text-white/40 hover:text-white text-lg z-20 transition-colors"
            onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </main>
  );
}
