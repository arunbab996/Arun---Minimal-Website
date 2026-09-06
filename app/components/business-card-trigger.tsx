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

  function openCard() {
    iframeRef.current?.contentWindow?.postMessage({ type: "open" }, "*");
    setIsOpen(true);
  }

  return (
    <>
      {/* Full-screen iframe — transparent when card is closed */}
      <iframe
        ref={iframeRef}
        src="/card.html?embed=1"
        title="Business Card"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          border: "none",
          background: "transparent",
          zIndex: isOpen ? 50 : 30,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        allow="gyroscope"
      />

      {/* Clickable overlay on the right edge — triggers card open when closed */}
      {!isOpen && (
        <div
          onClick={openCard}
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "180px",
            height: "100dvh",
            zIndex: 31,
            cursor: "pointer",
          }}
        />
      )}
    </>
  );
}
