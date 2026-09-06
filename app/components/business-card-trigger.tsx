"use client";

import { useEffect, useRef, useState } from "react";

export default function BusinessCardTrigger() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "opened") setIsOpen(true);
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
        // When closed: clip to right ~260px — only the peeking card shows,
        // and clip-path also restricts pointer-events to that area so the
        // rest of the website stays fully interactive.
        clipPath: isOpen ? "none" : "inset(0 0 0 calc(100% - 260px))",
      }}
    />
  );
}
