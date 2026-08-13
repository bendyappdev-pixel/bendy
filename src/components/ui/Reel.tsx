/**
 * Reel — the core film-frame primitive of the cinematic design system.
 *
 * Every photo container in the product is a Reel: the hero, sequence title
 * cards, chapter bands, trail cards, campsite slots. The visual treatment
 * (scratch texture, vignette, optional warm light leak, viewfinder brackets,
 * mono slate metadata) lives in `.reel` and friends in src/index.css.
 *
 * Implementation note: the design reference paints photography as a CSS
 * `background-image`. Here it is a real <picture>/<img> layered at z-index -1
 * inside the reel's own stacking context (`.reel` sets `isolation: isolate`).
 * That renders identically — the ::before scratch and ::after vignette still
 * paint over it — while buying lazy loading, async decoding, alt text and
 * WebP negotiation, none of which a background-image can do.
 */

import { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { webpFor } from '../../utils/imageUtils';

export interface ReelProps {
  /** Photo path, e.g. "/images/trails/tumalo-falls.jpg". Omit for the dark placeholder. */
  src?: string;
  /** Accessible description. Empty string marks the photo decorative (the default). */
  alt?: string;
  /** Bottom-left mono slate, e.g. "SEQ01_GOLDEN-HOUR.MOV". Hidden below md. */
  label?: string;
  /** Bottom-right mono timecode, e.g. "01:00:00:00". Hidden below md. */
  timecode?: string;
  /** Top-left / top-right viewfinder corner brackets. */
  brackets?: boolean;
  /** Warm light-leak variant. Alternate across sequential reels. */
  leak?: boolean;
  /** Subtle scale on hover, for reels that are links. */
  hoverable?: boolean;
  /** Load eagerly — set on the first above-the-fold reel only. */
  priority?: boolean;
  /**
   * Darkening scrim between the photo and the overlaid content. The vignette
   * only darkens the frame's edges, so any reel carrying display type over a
   * bright photograph needs one of these to stay legible.
   */
  scrim?: 'bottom' | 'left' | 'both';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Reel({
  src,
  alt = '',
  label,
  timecode,
  brackets = false,
  leak = false,
  hoverable = false,
  priority = false,
  scrim,
  className,
  style,
  children,
}: ReelProps) {
  return (
    <div
      className={cn(
        'reel',
        src && 'has-photo',
        leak && 'leak',
        hoverable && 'hoverable',
        className
      )}
      style={style}
    >
      {src && (
        <picture>
          <source srcSet={webpFor(src)} type="image/webp" />
          <img
            src={src}
            alt={alt}
            aria-hidden={alt === '' ? true : undefined}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : undefined}
          />
        </picture>
      )}

      {src && scrim && (
        <>
          {(scrim === 'left' || scrim === 'both') && (
            <div className="scrim-l pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
          )}
          {(scrim === 'bottom' || scrim === 'both') && (
            <div className="scrim-b pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
          )}
        </>
      )}

      {brackets && (
        <div className="brackets" aria-hidden="true">
          <i className="tl" />
          <i className="tr" />
        </div>
      )}

      {/* Film-slate metadata is decorative and crowds small screens. */}
      {label && (
        <span className="label hidden md:block" aria-hidden="true">
          {label}
        </span>
      )}
      {timecode && (
        <span className="tc hidden md:block" aria-hidden="true">
          {timecode}
        </span>
      )}

      {children}
    </div>
  );
}
