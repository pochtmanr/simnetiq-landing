import Image from "next/image";

/*
 * A painted background for a card: one of the site's Midjourney plates,
 * drifting slowly, with a soft glow wandering across it and a navy scrim on
 * the side the text sits, so white type keeps its contrast whatever part of
 * the picture ends up behind it.
 *
 * The parent carries .media-card (relative, clipped, isolated); this fills
 * it from behind. Motion runs only while an ancestor has [data-play] — see
 * PlayWhenVisible — and never under reduced motion.
 */

export type Scrim = "top" | "left" | "bottom" | "none";

export function AmbientBg({
  src,
  scrim = "top",
  focus,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  src: string;
  scrim?: Scrim;
  /* object-position, to pick which part of the plate a small card shows. */
  focus?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <span className="ambient" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="ambient__img"
        style={focus ? { objectPosition: focus } : undefined}
      />
      <span className="ambient__glow" />
      {scrim !== "none" && <span className={`ambient__scrim ambient__scrim--${scrim}`} />}
    </span>
  );
}
