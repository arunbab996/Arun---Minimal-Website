/**
 * A slow drift of soft, blurred colour behind the page — a few large blobs
 * (the site's own indigo/violet accent) easing across a pure black ground
 * on independent, looping paths.
 *
 * Pure CSS: each blob only ever animates `transform`, so the browser can
 * composite the motion on the GPU without re-painting, unlike the canvas
 * approach DitherBackground uses. `prefers-reduced-motion` freezes every
 * blob at its resting position instead of hiding them outright, so the
 * colour stays but the movement doesn't.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden>
      <div className="aurora-bg__blob aurora-bg__blob--a" />
      <div className="aurora-bg__blob aurora-bg__blob--b" />
      <div className="aurora-bg__blob aurora-bg__blob--c" />
    </div>
  );
}
