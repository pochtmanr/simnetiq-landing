/** Eight-pointed star — the single icon of the brand (nav + footer). */
export function StarGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0l2.1 7.05L21 4.5l-4.55 6L24 12l-7.55 1.5L21 19.5l-6.9-2.55L12 24l-2.1-7.05L3 19.5l4.55-6L0 12l7.55-1.5L3 4.5l6.9 2.55L12 0z" />
    </svg>
  );
}
