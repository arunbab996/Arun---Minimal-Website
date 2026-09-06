"use client";

import { useEffect, useRef, useState } from "react";

export default function BusinessCardTrigger() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "opening") setIsOpen(true);
      if (e.data.type === "closed") setIsOpen(false);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    // Wrapper clips the iframe via overflow:hidden at the layout level,
    // avoiding the clip-path compositing/DPR-reduction issue that caused blur.
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        // When closed: only the right 300px is visible (card peeks through).
        // When open: expands to full viewport.
        width: isOpen ? "100vw" : "300px",
        height: "100dvh",
        zIndex: isOpen ? 50 : 30,
        overflow: "hidden",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <iframe
        ref={iframeRef}
        src="/card.html?embed=1"
        title="Business Card"
        allow="gyroscope"
        style={{
          // Always full-viewport size so vw/vh units inside card.html are correct.
          position: "absolute",
          top: 0,
          right: 0,
          width: "100vw",
          height: "100dvh",
          border: "none",
          background: "transparent",
          // Re-enable pointer events on the iframe itself (parent div controls
          // the visible/interactive area via overflow + width).
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
