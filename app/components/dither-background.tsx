"use client";

import { useEffect, useRef } from "react";

/**
 * A slowly breathing dithered field behind the page.
 *
 * The canvas is drawn at a quarter of the viewport and scaled up with
 * image-rendering: pixelated, so every dot is a crisp 4px block. A drifting
 * field (sums of sines over x, y and time, with a soft radial glow toward the
 * centre) is quantised through a 4x4 Bayer threshold matrix — ordered
 * dithering — so instead of a smooth gradient you get the classic dot
 * pattern, with density carrying the brightness. Lit dots are faint light grey
 * at low alpha; unlit dots are transparent, so the ground shows through.
 *
 * Sits at z-index -1: behind in-flow content, in front of the body ground,
 * no pointer events. Reduced-motion users get a single static frame.
 */

const PIXEL = 4;          // CSS px per dot
const SPEED = 0.02;       // time step per frame
const DOT = 220;          // lit dot grey
const ALPHA = 18;         // lit dot alpha (0-255); ~7%

// Bayer 4x4, normalised to 0..1
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => v / 16));

export default function DitherBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    let image: ImageData | null = null;
    let raf: number | null = null;
    let time = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      // A hidden or embedded viewport can report 0x0; createImageData throws
      // on a zero dimension, so never go below a single dot.
      w = Math.max(1, Math.ceil(window.innerWidth / PIXEL));
      h = Math.max(1, Math.ceil(window.innerHeight / PIXEL));
      canvas.width = w;
      canvas.height = h;
      // One buffer, reused every frame — allocating per frame is the easy way
      // to make this stutter on a big display.
      image = ctx.createImageData(w, h);
    };

    const draw = () => {
      if (!image) return;
      const data = image.data;
      const cx = w / 2, cy = h / 2;
      const maxDist = Math.hypot(cx, cy);

      for (let y = 0; y < h; y++) {
        const row = BAYER[y & 3];
        for (let x = 0; x < w; x++) {
          const dist = Math.hypot(x - cx, y - cy) / maxDist;

          // Two slow waves at different scales, drifting against each other,
          // so the field never settles into a visible repeat.
          const n =
            Math.sin(x * 0.08 + time * 0.4) * Math.cos(y * 0.06 - time * 0.3) * 0.15 +
            Math.sin((x + y) * 0.04 + time * 0.2) * 0.1;

          // Radial glow: strongest at the centre, fading toward the edges.
          const intensity = Math.max(0, Math.min(1, (1 - dist * 0.9) * 0.2 + n));

          const i = (y * w + x) * 4;
          if (intensity > row[x & 3]) {
            data[i] = DOT; data[i + 1] = DOT; data[i + 2] = DOT; data[i + 3] = ALPHA;
          } else {
            data[i + 3] = 0;
          }
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const loop = () => {
      draw();
      time += SPEED;
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    // First frame synchronously, so the field is there on the very first
    // paint rather than one frame late.
    draw();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="dither-bg" />;
}
