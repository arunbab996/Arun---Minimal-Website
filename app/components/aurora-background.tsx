/**
 * Aurora borealis, approximated: three tall, soft-edged curtains of light
 * (green, teal, violet — the classic auroral palette) swaying sideways at
 * independent speeds over a black sky. `mix-blend-mode: screen` is what
 * sells it — where curtains overlap, the colours add into brighter,
 * paler light instead of just stacking opacity, the way real auroral
 * light does against a dark sky.
 *
 * Pure CSS: every curtain only ever animates `transform`, so it
 * composites on the GPU with no repaint, unlike the canvas approach
 * DitherBackground uses. `prefers-reduced-motion` freezes the sway.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden>
      <div className="aurora-bg__curtain aurora-bg__curtain--a" />
      <div className="aurora-bg__curtain aurora-bg__curtain--b" />
      <div className="aurora-bg__curtain aurora-bg__curtain--c" />
    </div>
  );
}
