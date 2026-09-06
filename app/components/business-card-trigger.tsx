"use client";

import { useEffect, useRef, useState } from "react";

// closed  → clipped to a strip on the right, card peeks out, site interactive
// open    → full viewport, card interactive, site behind the scrim
// closing → full viewport so the card can fly home, but the site is already
//           visible and clickable again (the card is an artifact, not a modal)
type Phase = "closed" | "open" | "closing";

export default function BusinessCardTrigger() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "opening") setPhase("open");
      if (e.data.type === "closing") setPhase("closing");
      if (e.data.type === "closed") setPhase("closed");
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        // Clipped to a strip when closed; full-width while open *and* closing
        // so the card has room to animate back to the edge.
        // Full-bleed only while open; during "closing" it animates back to the
        // strip, which is what performs the wipe.
        width: phase === "open" ? "100vw" : "300px",
        height: "100dvh",
        overflow: "hidden",
        zIndex: phase === "open" ? 50 : 30,
        // The instant the card starts leaving, the page is clickable again.
        pointerEvents: phase === "open" ? "auto" : "none",
        // On close the wrapper shrinks back to the strip, wiping the page into
        // view left-to-right while the card flies home inside it. Front-loaded
        // easing means the text column is readable within ~150ms.
        transition:
          phase === "closing"
            ? "width 620ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
      }}
    >
      <iframe
        ref={iframeRef}
        src="/card.html?embed=1"
        title="Business Card"
        allow="gyroscope"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          // Always full-viewport so vw/vh inside card.html stay correct.
          width: "100vw",
          height: "100dvh",
          border: "none",
          background: "transparent",
          // The card itself must stay clickable in closed + open phases; during
          // closing nothing inside should swallow clicks meant for the page.
          pointerEvents: phase === "closing" ? "none" : "auto",
        }}
      />
    </div>
  );
}
