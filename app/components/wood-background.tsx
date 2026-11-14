import Image from "next/image";

/**
 * A wood-grain desk as the page's backdrop — static, not animated. The
 * point is for the page to read as something sitting on (or projected
 * onto) a physical surface, so anything that drifts or glows would break
 * that: real wood doesn't move. The business card's own fixed position
 * already sits toward the right edge, which is what sells it as resting
 * on the board rather than floating over it.
 *
 * The texture itself (public/images/wood-bg.jpg) is procedurally
 * generated, not a photo — see the generation script referenced in the
 * commit that added it.
 */
export default function WoodBackground() {
  return (
    <div className="wood-bg" aria-hidden>
      <Image
        src="/images/wood-bg.jpg"
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="wood-bg__image"
      />
      <div className="wood-bg__scrim" />
    </div>
  );
}
