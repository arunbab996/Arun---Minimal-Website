"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * A Monet painting as the page's backdrop — experimental swap-in for
 * DitherBackground (see app/layout.tsx).
 *
 * The image itself drifts in a slow, near-imperceptible zoom so it never
 * reads as a frozen photo, and a lightweight canvas lays an occasional soft
 * glint of light over it, as if the paint were still catching the light.
 * The canvas only runs its rAF loop while a glint is actually fading;
 * between glints it sits idle on a setTimeout instead of animating forever.
 */

const GLINT_MIN_GAP_MS = 5000;
const GLINT_MAX_GAP_MS = 10000;
const GLINT_FADE_MS = 2600;

export default function MonetBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let raf: number | null = null;
    let spawnTimer: ReturnType<typeof setTimeout> | null = null;
    let glintStart = 0;
    let glintX = 0, glintY = 0, glintR = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const scheduleNext = () => {
      const delay = GLINT_MIN_GAP_MS + Math.random() * (GLINT_MAX_GAP_MS - GLINT_MIN_GAP_MS);
      spawnTimer = setTimeout(spawn, delay);
    };

    const drawGlint = (now: number) => {
      const t = (now - glintStart) / GLINT_FADE_MS;
      ctx.clearRect(0, 0, w, h);
      if (t >= 1) {
        scheduleNext();
        return;
      }
      // Fades in, holds, fades out — a sine over the whole span does both.
      const alpha = Math.sin(Math.PI * t) * 0.12;
      const grad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, glintR);
      grad.addColorStop(0, `rgba(255, 244, 222, ${alpha})`);
      grad.addColorStop(1, "rgba(255, 244, 222, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(glintX - glintR, glintY - glintR, glintR * 2, glintR * 2);
      raf = requestAnimationFrame(drawGlint);
    };

    const spawn = () => {
      glintX = Math.random() * w;
      glintY = Math.random() * h;
      glintR = Math.min(w, h) * (0.1 + Math.random() * 0.12);
      glintStart = performance.now();
      raf = requestAnimationFrame(drawGlint);
    };

    resize();
    window.addEventListener("resize", resize);
    scheduleNext();

    return () => {
      window.removeEventListener("resize", resize);
      if (raf !== null) cancelAnimationFrame(raf);
      if (spawnTimer !== null) clearTimeout(spawnTimer);
    };
  }, []);

  return (
    <div className="monet-bg" aria-hidden>
      <Image
        src="/images/monet-bg.jpg"
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="monet-bg__image"
      />
      <div className="monet-bg__scrim" />
      <canvas ref={canvasRef} className="monet-bg__glints" />
    </div>
  );
}
