"use client";

import { useEffect, useRef } from "react";

const PETAL_COUNT = 18;

const PETALS = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id: i,
  left: `${5 + Math.floor((i * 97) % 90)}%`,
  size: 6 + (i % 5),
  delay: `${(i * 0.6) % 8}s`,
  duration: `${7 + (i % 6)}s`,
  rotate: (i * 37) % 360,
  drift: -30 + (i % 5) * 15,
  opacity: 0.55 + (i % 4) * 0.1,
}));

export default function CherryBlossoms() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 h-[340px] overflow-hidden z-0">
      {PETALS.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            animation: `petalFall ${p.duration} ${p.delay} ease-in infinite`,
            "--drift": `${p.drift}px`,
          } as React.CSSProperties}
        >
          <svg
            width={p.size}
            height={p.size * 1.1}
            viewBox="0 0 10 11"
            fill="none"
            style={{
              transform: `rotate(${p.rotate}deg)`,
              opacity: p.opacity,
            }}
          >
            <ellipse cx="5" cy="5.5" rx="3.2" ry="4.5" fill="#f9a8c9" />
            <ellipse cx="5" cy="5.5" rx="3.2" ry="4.5" fill="#fbcfe8" fillOpacity="0.5" transform="rotate(40 5 5.5)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
