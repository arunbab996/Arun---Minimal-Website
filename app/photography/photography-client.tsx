"use client";

import { useState, useEffect, useCallback } from "react";

type Photo = { url: string; loc: string; date: string };

function thumbUrl(url: string) {
  return url.replace("/upload/", "/upload/c_scale,w_800/");
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

  // Group photos by trip (derived from date)
  const paris = photos.filter((p) => p.date.includes("2025"));
  const japan = photos.filter((p) => p.date.includes("2024"));

  const groups = [
    { label: "Paris", sub: "March 2025", photos: paris },
    { label: "Japan", sub: "September 2024", photos: japan },
  ];

  return (
    <main className="mx-auto max-w-[620px] px-6 pt-[72px] pb-20">
      {groups.map((group) => (
        <section key={group.label} className="mb-16">
          <div className="mb-6">
            <h2 className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">{group.label}</h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">{group.sub}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {group.photos.map((photo) => {
              const globalIndex = photos.indexOf(photo);
              return (
                <button
                  key={photo.url}
                  onClick={() => setLightbox(globalIndex)}
                  className="group relative overflow-hidden rounded-sm text-left"
                >
                  <img
                    src={thumbUrl(photo.url)}
                    alt={photo.loc}
                    loading={globalIndex < 4 ? "eager" : "lazy"}
                    className="block w-full object-cover transition-opacity duration-300 group-hover:opacity-85"
                  />
                  <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">{photo.loc}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(null)}
        >
          <div
            className="absolute left-0 top-0 h-full w-1/2 cursor-w-resize z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2 cursor-e-resize z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          />

          <img
            src={photos[lightbox].url}
            alt={photos[lightbox].loc}
            className="relative z-0 max-h-[90vh] max-w-[90vw] object-contain"
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
            <p className="text-sm text-white/80">{photos[lightbox].loc}</p>
            <p className="text-xs text-white/40">{photos[lightbox].date}</p>
          </div>

          <button
            className="absolute top-5 right-6 text-white/50 hover:text-white text-xl z-20"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
