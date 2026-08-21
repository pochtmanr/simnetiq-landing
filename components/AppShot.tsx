import Image from "next/image";

/**
 * One app screen, exported from the store assets without a background so the
 * device floats on whatever panel it lands on. Nothing is cropped here — the
 * PNGs carry alpha and no baked-in headline, which is what lets the same file
 * serve both locales.
 */
export function AppShot({
  src,
  caption,
  priority = false,
}: {
  src: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="flex h-full flex-col">
      {/* The exports differ by a few pixels in height; bottom-aligning the
          devices keeps the caption row level across the grid. */}
      <div className="flex flex-1 items-end">
        <Image
          src={src}
          alt=""
          width={503}
          height={900}
          priority={priority}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
          className="h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-[16px] text-label text-white/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
