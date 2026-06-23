"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -500, y: -500 });
  const current = useRef({ x: -500, y: -500 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const isDark = () => document.documentElement.classList.contains("dark");

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      // Lerp towards the real cursor position
      current.current.x += (pos.current.x - current.current.x) * 0.08;
      current.current.y += (pos.current.y - current.current.y) * 0.08;

      if (glowRef.current) {
        const color = isDark()
          ? "rgba(99,102,241,0.18)"
          : "rgba(99,102,241,0.07)";
        glowRef.current.style.background = `radial-gradient(500px circle at ${current.current.x}px ${current.current.y}px, ${color}, transparent 65%)`;
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
