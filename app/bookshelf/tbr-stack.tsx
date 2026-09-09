"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book } from "./page";

/**
 * The TBR pile: real books stacked on a table, in CSS 3D.
 *
 * Each book is a box built from five faces (cover, back, spine, fore-edge,
 * head) rather than a flat image, so the stack has genuine depth — you can see
 * the spines and the page edges, and the pile keeps its shape as you orbit it.
 *
 * Drag to turn the pile, hover to slide a book out, click to pull it clear and
 * read the details. The orbit eases toward its target in a rAF loop for the
 * same reason the card tilt does: writing the pointer position straight to a
 * transform that also carries a CSS transition smears, and writing it with no
 * transition tracks rigidly with no weight to it.
 */

const BOOK_W = 190;   // cover width, px
const BOOK_D = 260;   // cover height (depth once lying flat)
const MIN_T = 15;     // thinnest spine
const MAX_T = 32;     // thickest spine
const STAGE_H = 460;  // scene height, px
const FIT_H = 300;    // pile is scaled down past this, so it cannot overflow

// Deterministic per-title jitter, so the pile looks hand-stacked but does not
// reshuffle on every render.
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PAPER = ["#e8e2d6", "#e3dccd", "#efe9dc", "#ded7c7"];
// Cloth-board colours for books with no cover image.
const BOARD = ["#3b4a5a", "#4a3b47", "#3f4a3b", "#4a453b", "#39434f"];

export default function TbrStack({ books }: { books: Book[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  // Orbit: current chases target, eased per frame.
  const target = useRef({ x: -58, y: -28 });
  const current = useRef({ x: -58, y: -28 });
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const dragging = useRef<{ px: number; py: number } | null>(null);
  const fit = useRef(1);

  const frame = useCallback((now: number) => {
    const el = sceneRef.current;
    if (!el) { raf.current = null; return; }
    const dt = last.current ? Math.min(now - last.current, 64) : 16.667;
    last.current = now;
    const k = 1 - Math.pow(1 - 0.16, dt / 16.667);

    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;
    el.style.transform = `scale(${fit.current}) rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`;

    const settled =
      Math.abs(target.current.x - current.current.x) < 0.05 &&
      Math.abs(target.current.y - current.current.y) < 0.05;
    raf.current = settled ? null : requestAnimationFrame(frame);
  }, []);

  const run = useCallback(() => {
    if (raf.current === null) {
      last.current = 0;
      raf.current = requestAnimationFrame(frame);
    }
  }, [frame]);

  useEffect(() => { run(); }, [run]);
  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);

  // Drag anywhere to orbit. Pointer capture keeps the gesture alive if the
  // cursor leaves the scene mid-drag.
  const onDown = (e: React.PointerEvent) => {
    dragging.current = { px: e.clientX, py: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragging.current;
    if (!d) return;
    target.current.y += (e.clientX - d.px) * 0.4;
    // Clamp pitch so the pile never flips past edge-on or fully overhead.
    target.current.x = Math.max(-85, Math.min(-15, target.current.x - (e.clientY - d.py) * 0.3));
    dragging.current = { px: e.clientX, py: e.clientY };
    run();
  };
  const endDrag = (e: React.PointerEvent) => {
    dragging.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  if (!books.length) return null;

  // Bottom of the pile first, so later books sit on top.
  const stack = [...books].reverse();
  let y = 0;
  const placed = stack.map((book) => {
    const h = hash(book.title);
    const thickness = MIN_T + (h % (MAX_T - MIN_T));
    const item = {
      book,
      thickness,
      y,
      skew: ((h >> 3) % 9) - 4,        // a few degrees of yaw, as if dropped
      nudge: ((h >> 6) % 13) - 6,      // small lateral offset
      paper: PAPER[h % PAPER.length],
      board: BOARD[h % BOARD.length],
    };
    y += thickness;
    return item;
  });
  const pileHeight = y;
  // A 21-book pile is ~500px tall and was overflowing the stage onto the page
  // above it. Scale the whole scene rather than compressing the books, so the
  // covers keep their proportions.
  fit.current = Math.min(1, FIT_H / pileHeight);

  return (
    <div className="select-none">
      <div
        className="relative mx-auto flex touch-none items-center justify-center"
        style={{ height: STAGE_H, perspective: 1400, cursor: dragging.current ? "grabbing" : "grab" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={sceneRef}
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${fit.current}) rotateX(-58deg) rotateY(-28deg)`,
            width: BOOK_W,
            height: BOOK_D,
          }}
        >
          {placed.map((p, i) => {
            const idx = books.indexOf(p.book);
            const isActive = active === idx;
            const isHover = hovered === idx && !isActive;
            // Lift the pile so it sits centred rather than growing downward.
            const lift = p.y - pileHeight / 2;
            const slide = isActive ? 150 : isHover ? 46 : 0;

            return (
              <div
                key={`${p.book.title}-${i}`}
                onPointerEnter={() => setHovered(idx)}
                onPointerLeave={() => setHovered((h) => (h === idx ? null : h))}
                onClick={(e) => { e.stopPropagation(); setActive(isActive ? null : idx); }}
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  // rotateX(90) lays the book flat, cover upward. CSS +Y points
                  // down the screen, so rotateX(-90) sent the cover's +Z face
                  // downward and left the black back board on top.  Because the
                  // transforms compose left to right, everything after it works
                  // in that laid-down frame: translateZ now runs vertically, so
                  // it stacks the pile, and rotateZ becomes yaw on the table.
                  // Without this the covers faced the camera and the books
                  // stacked toward the viewer like a deck of cards.
                  transform: `rotateX(90deg) translateZ(${lift}px) translateX(${slide + p.nudge}px) rotateZ(${p.skew}deg)`,
                  transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1)",
                  cursor: "pointer",
                }}
              >
                {/* cover — or a typeset one, for the few with no edition on
                    OpenLibrary. Better than the blank slab a broken image
                    leaves behind. */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    transform: `translateZ(${p.thickness / 2}px)`,
                    backgroundImage: p.book.cover ? `url(${p.book.cover})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    background: p.book.cover
                      ? undefined
                      : `linear-gradient(150deg, ${p.board} 0%, rgba(0,0,0,0.45) 140%)`,
                    backgroundColor: p.book.cover ? "#2a2a2a" : undefined,
                    borderRadius: 3,
                    boxShadow: isActive || isHover
                      ? "0 18px 40px rgba(0,0,0,0.55)"
                      : "0 6px 18px rgba(0,0,0,0.4)",
                    display: p.book.cover ? undefined : "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 18px",
                    overflow: "hidden",
                  }}
                >
                  {!p.book.cover && (
                    <>
                      <span style={{
                        fontSize: 15, lineHeight: 1.25, fontWeight: 500,
                        color: "rgba(255,255,255,0.94)",
                      }}>{p.book.title}</span>
                      <span style={{
                        marginTop: 8, fontSize: 11, letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.55)",
                      }}>{p.book.author}</span>
                    </>
                  )}
                </div>
                {/* back board */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    transform: `translateZ(-${p.thickness / 2}px) rotateY(180deg)`,
                    background: "#1d1b18",
                    borderRadius: 3,
                  }}
                />
                {/* spine */}
                <div
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: p.thickness, height: BOOK_D,
                    transformOrigin: "left center",
                    transform: `rotateY(-90deg) translateX(-${p.thickness / 2}px)`,
                    background: "linear-gradient(90deg,#141312,#242220 35%,#141312)",
                    borderRadius: "3px 0 0 3px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      fontSize: 10, letterSpacing: "0.06em",
                      color: "rgba(255,255,255,0.72)",
                      whiteSpace: "nowrap", padding: "0 6px",
                      maxHeight: BOOK_D - 16, overflow: "hidden",
                    }}
                  >
                    {p.book.title}
                  </span>
                </div>
                {/* fore-edge: the visible block of pages */}
                <div
                  style={{
                    position: "absolute", top: 0, right: 0,
                    width: p.thickness, height: BOOK_D,
                    transformOrigin: "right center",
                    transform: `rotateY(90deg) translateX(${p.thickness / 2}px)`,
                    background: `repeating-linear-gradient(90deg, ${p.paper} 0 1px, rgba(0,0,0,0.10) 1px 2px)`,
                    borderRadius: "0 3px 3px 0",
                  }}
                />
                {/* head (top edge), also pages */}
                <div
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: BOOK_W, height: p.thickness,
                    transformOrigin: "center top",
                    transform: `rotateX(-90deg) translateY(-${p.thickness / 2}px)`,
                    background: `repeating-linear-gradient(90deg, ${p.paper} 0 2px, rgba(0,0,0,0.08) 2px 3px)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Details for the pulled-out book, and the hint when nothing is picked. */}
      <div className="mt-2 min-h-[46px] text-center">
        {active !== null && books[active] ? (
          <div className="fade-up">
            <p className="text-[15px] font-medium text-[#1a1a1a] dark:text-[#e5e5e5]">
              {books[active].title}
            </p>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
              {books[active].author}
            </p>
          </div>
        ) : (
          <p className="text-[12px] text-neutral-500 dark:text-neutral-500">
            Drag to turn the pile · click a book to pull it out
          </p>
        )}
      </div>
    </div>
  );
}
