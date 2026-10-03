/** Inline "→" / "←" for link labels. Unicode arrows don't mirror in
 *  right-to-left text, so the glyph is flipped under dir="rtl" instead. */
export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <span aria-hidden className="inline-block rtl:-scale-x-100">
      {back ? "←" : "→"}
    </span>
  );
}
