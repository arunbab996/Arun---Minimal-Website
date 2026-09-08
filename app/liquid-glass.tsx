"use client";

import { useCallback, useId, useState } from "react";

/**
 * Refractive "liquid glass".
 *
 * A blur alone reads as frosted plastic. Real glass also *bends* what is behind
 * it, most strongly at the rim, and splits the colours slightly as it does —
 * so this pushes the backdrop through an SVG displacement map: /glass-map.png
 * encodes an inward-pointing bend in its red (x) and green (y) channels, easing
 * to flat in the middle like a lens bevel. Three feDisplacementMaps run at
 * slightly different strengths and are recombined one channel each, which is
 * what produces the faint colour fringing along the edge.
 *
 * The filter region has to be given in real pixels (filterUnits="userSpaceOnUse"),
 * so it cannot be written once in CSS — it is generated per element from its
 * measured size, which is what this hook is for.
 *
 * Support: SVG filters inside backdrop-filter are Chromium-only today. Safari
 * and Firefox ignore the whole declaration, so `.liquid-glass` in globals.css
 * declares a plain blur/saturate first and this one second; browsers that
 * cannot parse the second keep the first and still get good glass.
 */
export function useLiquidGlass<T extends HTMLElement>() {
  const rawId = useId();
  const id = `lg${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [size, setSize] = useState({ w: 0, h: 0 });
  // A callback ref rather than useRef + useEffect: the ref is attached to
  // whichever item is currently active, and that element changes on
  // navigation, so an effect that captured the node once would keep observing
  // the unmounted pill. Returning a cleanup (React 19) ties the disconnect to
  // this specific node — sharing one observer across the swap meant the
  // outgoing element's detach tore down the incoming element's observer,
  // because React attaches the new ref before cleaning up the old one.
  const ref = useCallback((node: T | null) => {
    if (!node || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      // borderBoxSize, not contentRect: contentRect excludes padding and
      // border, so the filter region came out narrower than the pill and the
      // refraction sat inside its edges instead of on them.
      const box = entry.borderBoxSize?.[0];
      const w = Math.round(box ? box.inlineSize : entry.contentRect.width);
      const h = Math.round(box ? box.blockSize : entry.contentRect.height);
      // Round, or sub-pixel jitter rebuilds the filter on every scroll.
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const ready = size.w > 0 && size.h > 0;

  return {
    ref,
    id,
    size,
    ready,
    /** Spread onto the element. Falls back to the CSS class until measured. */
    style: ready
      ? ({
          backdropFilter: `url(#${id}) blur(2px) saturate(1.7)`,
          WebkitBackdropFilter: `blur(12px) saturate(1.7)`,
        } as const)
      : undefined,
  };
}

/** The generated filter. Render once alongside the element it belongs to. */
export function LiquidGlassFilter({
  id,
  w,
  h,
  strength = 14,
}: {
  id: string;
  w: number;
  h: number;
  strength?: number;
}) {
  if (!w || !h) return null;
  // Red bends most, blue least — the same ordering as dispersion in real glass.
  const scales = [strength, strength * 0.82, strength * 0.64];
  const channel = (i: number) =>
    [
      "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
      "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
    ][i];

  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <filter
        id={id}
        x="0"
        y="0"
        width={w}
        height={h}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          href="/glass-map.png"
          x="0"
          y="0"
          width={w}
          height={h}
          preserveAspectRatio="none"
          result="map"
        />
        {scales.map((s, i) => (
          <feDisplacementMap
            key={i}
            in="SourceGraphic"
            in2="map"
            scale={s}
            xChannelSelector="R"
            yChannelSelector="G"
            result={`d${i}`}
          />
        ))}
        {scales.map((_, i) => (
          <feColorMatrix key={i} in={`d${i}`} type="matrix" values={channel(i)} result={`c${i}`} />
        ))}
        <feComposite in="c0" in2="c1" operator="arithmetic" k2="1" k3="1" result="rg" />
        <feComposite in="rg" in2="c2" operator="arithmetic" k2="1" k3="1" />
      </filter>
    </svg>
  );
}
