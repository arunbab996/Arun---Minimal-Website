"use client";

import { useEffect, useRef, useState } from "react";

export default function BusinessCardTrigger() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      // 'opening' fires before the card animation starts — expand clip immediately
      if (e.data.type === "opening") setIsOpen(true);
      // 'closed' fires after the 650ms tuck animation — then apply clip
      if (e.data.type === "closed") setIsOpen(false);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/card.html?embed=1"
      title="Business Card"
      allow="gyroscope"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        border: "none",
        background: "transparent",
        zIndex: isOpen ? 50 : 30,
        // clip-path shows only the right ~300px when closed (accommodates hover nudge).
        // clip-path also restricts pointer-events to that strip, so the rest of the
        // site stays fully interactive while the card is tucked.
        clipPath: isOpen ? "none" : "inset(0 0 0 calc(100% - 300px))",
      }}
    />
  );
}
