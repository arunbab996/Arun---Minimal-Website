"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A single preview panel that follows the cursor, shared by every row.
 *
 * Two things matter here. The panel eases toward the pointer inside a rAF loop
 * rather than being written straight to `style` on every mousemove — a direct
 * write pinned to a CSS transition re-interpolates from each new value and
 * smears, and writing without a transition tracks the cursor rigidly with no
 * glide at all. Easing per frame gives the drift, and it is frame-rate
 * independent so a 120Hz display feels the same as 60Hz.
 *
 * And it is one panel for the whole list, not one per row: moving between rows
 * slides the existing panel across instead of unmounting one and popping
 * another in somewhere else.
 */

const EASE = 0.18;      // approach per 60Hz frame
const OFFSET_X = 24;    // clear of the cursor so it never sits under it
const PANEL_W = 380;
const PANEL_H = 260;    // approximate; only used to keep the panel on-screen

export function usePreview() {
  const [src, setSrc] = useState<string | null>(null);
  const [href, setHref] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Target follows the pointer; current chases the target.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const placed = useRef(false);

  const frame = useCallback((now: number) => {
    const el = panelRef.current;
    if (!el) { raf.current = null; return; }

    const dt = last.current ? Math.min(now - last.current, 64) : 16.667;
    last.current = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.667);

    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;

    el.style.transform = `translate3d(${Math.round(current.current.x)}px, ${Math.round(current.current.y)}px, 0)`;

    const done =
      Math.abs(target.current.x - current.current.x) < 0.5 &&
      Math.abs(target.current.y - current.current.y) < 0.5;
    raf.current = done ? null : requestAnimationFrame(frame);
  }, []);

  const run = useCallback(() => {
    if (raf.current === null) {
      last.current = 0;
      raf.current = requestAnimationFrame(frame);
    }
  }, [frame]);

  const move = useCallback((e: { clientX: number; clientY: number }) => {
    // Flip to the cursor's left near the right edge, and keep it in view
    // vertically, so the panel is never clipped by the viewport.
    const flip = e.clientX + OFFSET_X + PANEL_W > window.innerWidth - 8;
    const x = flip ? e.clientX - OFFSET_X - PANEL_W : e.clientX + OFFSET_X;
    // On a window shorter than the panel the upper bound falls below the lower
    // one and the clamp inverts, throwing the panel off the top of the screen.
    const maxY = Math.max(8, window.innerHeight - PANEL_H - 8);
    const y = Math.min(Math.max(e.clientY - PANEL_H / 2, 8), maxY);
    target.current = { x, y };

    // First appearance should not glide in from wherever the last one ended.
    if (!placed.current) {
      placed.current = true;
      current.current = { x, y };
      const el = panelRef.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    run();
  }, [run]);

  const show = useCallback((imgSrc: string, linkHref: string, e: { clientX: number; clientY: number }) => {
    placed.current = false;   // jump to the cursor rather than sliding from stale coords
    setSrc(imgSrc);
    setHref(linkHref);
    move(e);
  }, [move]);

  const hide = useCallback(() => setSrc(null), []);

  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);

  return { src, href, panelRef, show, hide, move, panelW: PANEL_W };
}

/** Warm the browser cache so the first hover paints immediately. */
export function usePreloadPreviews(urls: string[]) {
  useEffect(() => {
    // After paint, and only when the browser is idle, so this never competes
    // with rendering the list itself.
    const load = () => urls.forEach((u) => { new Image().src = u; });
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(load, { timeout: 2000 });
    else setTimeout(load, 300);
  }, [urls]);
}
