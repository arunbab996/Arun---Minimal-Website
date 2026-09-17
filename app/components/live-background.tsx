/**
 * A slowly breathing colour field behind the page.
 *
 * Three large soft blobs drift across the ground on very long cycles (70–110s),
 * out of phase with each other, so the colour under any given spot is always
 * shifting but never fast enough to notice a step. The opacities are kept low:
 * the point is that the ground feels alive, not that it becomes a gradient.
 *
 * It sits at z-index -1, which is behind in-flow content but in front of the
 * body's own background, so it never interferes with the type. Blobs are moved
 * with transform only — no animated gradients, no filter — so the browser can
 * composite them without repainting. Reduced-motion users get the static field.
 */
export default function LiveBackground() {
  return (
    <div aria-hidden className="live-bg"><i /></div>
  );
}
