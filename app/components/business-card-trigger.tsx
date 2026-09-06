"use client";

import { useEffect } from "react";

/**
 * The business card, rendered inline in the page — not in an iframe.
 *
 * An iframe was the source of every problem we hit: it can't composite a
 * transparent background over the page (it paints white), and its separate
 * compositing context rasterizes the canvas to a lower-resolution texture,
 * which is what blurred the card on every 3D tilt. Inline, the scrim is a
 * real translucent overlay and the canvas renders at full device resolution.
 */
export default function BusinessCardTrigger() {
  useEffect(() => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/card.css";
    document.head.appendChild(css);

    // Into <head>, not <body> — React reconciles body's children and warns
    // about script nodes it didn't render. The script re-runs on each mount so
    // it rebinds to the fresh DOM nodes React just gave us.
    const js = document.createElement("script");
    js.src = "/card.js";
    js.defer = true;
    document.head.appendChild(js);

    return () => {
      css.remove();
      js.remove();
    };
  }, []);

  return (
    <div className="stage closed" id="stage">
      <div className="card-scene" id="cardScene">
        <div className="card" id="card">
          <div className="card-face front">
            <canvas id="frontCanvas" />
            <div className="sheen" />
            <div className="grain" />
          </div>
          <div className="card-face back">
            <canvas id="backCanvas" />
            <div className="sheen" />
            <div className="grain" />
          </div>
          <div className="card-edge left" />
          <div className="card-edge right" />
        </div>
      </div>

      <button className="tool flip-btn" id="btnFlip" title="Flip the card">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
          <path d="M17 3v4a2 2 0 0 1-2 2H4" />
          <path d="M7 21v-4a2 2 0 0 1 2-2h11" />
          <path d="M7 7 4 4l3-3" transform="translate(0 3)" />
          <path d="M17 17l3 3-3 3" transform="translate(0 -3)" />
        </svg>
        <span className="tool-label">Flip</span>
      </button>

      <button className="close-btn" id="btnClose" title="Tuck the card away">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="toolbar" id="toolbar">
        <button className="tool" id="btnPaint" title="Drag to splatter paint">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <path d="M12 2c3 3 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-7 6-10Z" />
          </svg>
          <span className="tool-label">Paint</span>
        </button>
        <button className="tool" id="btnBurn" title="Press and hold to burn">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <path d="M12 22c4 0 6-2.5 6-6 0-3-2-4.5-2.5-7-1.5 1.5-2.5 2.5-2.5 4.5C13 10 11 8 11 5c-3 2-6 6-6 10 0 4 3 6 7 7Z" />
          </svg>
          <span className="tool-label">Burn</span>
        </button>
        <button className="tool" id="btnShred" title="Shred the card">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <path d="M6 3h12M9 3v6M12 3v10M15 3v6M9 13l-3 8M12 13v8M15 13l3 8" />
          </svg>
          <span className="tool-label">Shred</span>
        </button>
        <button className="tool" id="btnReset" title="Restore the card">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 3v5h5" />
          </svg>
          <span className="tool-label">Reset</span>
        </button>
      </div>
    </div>
  );
}
