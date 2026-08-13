/**
 * ViewfinderMark — the brand mark for the cinematic system.
 *
 * A square with cross-hairs at each edge midpoint and a centre dot: a camera
 * viewfinder reticle. Replaces the old pine-tree glyph, which read as generic
 * outdoor clip-art and fought the film language.
 */

interface ViewfinderMarkProps {
  className?: string;
}

export default function ViewfinderMark({ className = 'w-6 h-6' }: ViewfinderMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="26" height="26" />
      <path d="M3 16 H10 M22 16 H29 M16 3 V10 M16 22 V29" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
