"use client";

import { useState, useEffect, useCallback } from "react";

type Photo = { url: string; loc: string; date: string };

function thumbUrl(url: string) {
  return url.replace("/upload/", "/upload/c_scale,w_600/");
}

function PhotoCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative mb-3 cursor-pointer overflow-hidden rounded-sm break-inside-avoid"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-800" />
      )}
      <img
        src={thumbUrl(photo.url)}
        alt={photo.loc}
        loading={index < 4 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className="block w-full transition-all duration-300"
        style={{ filter: loaded ? "grayscale(15%)" : "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(15%)")}
      />
    </div>
  );
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 pt-[72px] pb-20">
      {/* Masonry grid */}
      <div
        style={{
          columnCount: 3,
          columnGap: "12px",
        }}
        className="max-w-[900px] mx-auto [column-count:3] md:[column-count:3] sm:[column-count:2]"
      >
        {photos.map((photo, i) => (
          <PhotoCard key={photo.url} photo={photo} index={i} onClick={() => setLightbox(i)} />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(null)}
        >
          {/* Left half — prev */}
          <div
            className="absolute left-0 top-0 h-full w-1/2 cursor-w-resize z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          />
          {/* Right half — next */}
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
    </div>
  );
}
