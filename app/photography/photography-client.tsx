"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type Photo = { url: string; loc: string; date: string; w?: number; h?: number };

const NAV_COUNT = 5;
const COLS = 3;

/**
 * Cloudinary transform helper. The source assets are ~4000-5700px HEICs; asking
 * for the right width is the difference between a 70KB thumbnail and a 1MB one.
 * c_limit never enlarges, and f_auto/q_auto already sit in the base URL so the
 * browser is served WebP or AVIF.
 */
function sized(url: string, width: number) {
  return url.replace("/upload/", `/upload/c_limit,w_${width}/`);
}

/** Thumbnails at several widths so the browser can pick for its own DPR. */
function thumbSrcSet(url: string) {
  return [280, 420, 560, 840].map((w) => `${sized(url, w)} ${w}w`).join(", ");
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

  // The business card is a fixed overlay above the lightbox's z-index, so it
  // would float over the photo. Flag it on <html> and let the card's stylesheet
  // take itself out of the way, the same way the mobile menu does.
  useEffect(() => {
    document.documentElement.classList.toggle("overlay-open", lightbox !== null);
    return () => document.documentElement.classList.remove("overlay-open");
  }, [lightbox]);

  // Arrow-keying through the set should not wait on a download each time.
  useEffect(() => {
    if (lightbox === null) return;
    [(lightbox + 1) % photos.length, (lightbox - 1 + photos.length) % photos.length]
      .forEach((i) => { new Image().src = sized(photos[i].url, 1800); });
  }, [lightbox, photos]);

  const paris = photos.filter((p) => p.date.includes("2025"));
  const japan = photos.filter((p) => p.date.includes("2024"));
  const groups = useMemo(() => ([
    { label: "Paris", sub: "March 2025", photos: paris },
    { label: "Japan", sub: "September 2024", photos: japan },
  ]), [paris, japan]);

  let animIndex = NAV_COUNT;

  return (
    <main className="mx-auto wide-col w-full px-5 pt-[80px] min-[940px]:pt-[72px] pb-20">
      {groups.map((group) => {
        const headerDelay = animIndex++;
        const colStartDelay = animIndex;
        animIndex += group.photos.length;

        // Pack into the shortest column rather than round-robin. Round-robin
        // ignores how tall each photo is, so a column of portraits ran far
        // past a column of landscapes and the grid ended ragged.
        const cols: Photo[][] = Array.from({ length: COLS }, () => []);
        const heights = new Array(COLS).fill(0);
        group.photos.forEach((p) => {
          const shortest = heights.indexOf(Math.min(...heights));
          cols[shortest].push(p);
          heights[shortest] += (p.w && p.h) ? p.h / p.w : 1.33; // relative height
        });

        return (
          <section key={group.label} className="mb-20">
            <div className="fade-up mb-6" style={{ animationDelay: `${headerDelay * 0.05}s` }}>
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
                    const delay = colStartDelay + ci + pi * COLS;
                    return (
                      <button
                        key={photo.url}
                        onClick={() => setLightbox(globalIndex)}
                        aria-label={`Open ${photo.loc}`}
                        className="fade-up group relative block w-full overflow-hidden rounded-md bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        style={{ animationDelay: `${delay * 0.05}s` }}
                      >
                        <img
                          src={sized(photo.url, 560)}
                          srcSet={thumbSrcSet(photo.url)}
                          // Three columns inside an 820px cap, one-third of the
                          // viewport below that.
                          sizes="(min-width: 940px) 268px, 33vw"
                          alt={photo.loc}
                          width={photo.w}
                          height={photo.h}
                          loading={globalIndex < 6 ? "eager" : "lazy"}
                          decoding="async"
                          // width/height reserve the box from the aspect ratio, so
                          // the grid no longer reflows as each photo arrives.
                          className="block h-auto w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                        />
                        {/* Caption sits on its own gradient rather than dimming
                            the whole photo, so hovering reveals text without
                            washing the image out. */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <p className="pointer-events-none absolute bottom-2 left-3 right-3 truncate text-left text-[11px] font-medium text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
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

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={photos[lightbox].loc}
        >
          <div className="absolute left-0 top-0 h-full w-1/2 cursor-w-resize z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }} />
          <div className="absolute right-0 top-0 h-full w-1/2 cursor-e-resize z-10"
            onClick={(e) => { e.stopPropagation(); next(); }} />

          <img
            key={photos[lightbox].url}
            src={sized(photos[lightbox].url, 1800)}
            alt={photos[lightbox].loc}
            width={photos[lightbox].w}
            height={photos[lightbox].h}
            className="lightbox-img relative z-0 max-h-[88vh] max-w-[92vw] object-contain rounded-sm shadow-2xl"
          />

          {/* Caption: one glass pill, matching the nav's treatment, rather than
              bare text floating on the backdrop. */}
          <div
            className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-none flex items-center gap-3 rounded-full px-4 py-2"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderTopColor: "rgba(255,255,255,0.4)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.45)",
            }}
          >
            <span className="text-[13px] font-medium text-white whitespace-nowrap">{photos[lightbox].loc}</span>
            <span className="h-3 w-px bg-white/25" />
            <span className="text-[12px] text-white/60 whitespace-nowrap">{photos[lightbox].date}</span>
            <span className="h-3 w-px bg-white/25" />
            <span className="text-[12px] tabular-nums text-white/50 whitespace-nowrap">
              {lightbox + 1} / {photos.length}
            </span>
          </div>

          <button className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <button className="absolute top-5 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full text-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
            onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </main>
  );
}
