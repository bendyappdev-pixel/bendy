/**
 * SceneHeader — the numbered section header used on every page.
 *
 * Sections in this system are "scenes": a mono small-caps kicker in ember
 * ("Scene 02 · Today's Almanac"), a very large condensed display headline,
 * and optional right-aligned metadata.
 */

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SceneHeaderProps {
  /** Scene number, e.g. "02". Rendered as "Scene 02 · {kicker}". */
  scene?: string;
  /** Kicker text after the scene number. */
  kicker: string;
  /** The display headline. */
  title: ReactNode;
  /** Right-aligned mono metadata block. Hidden below md. */
  meta?: ReactNode;
  /** Optional supporting copy under / beside the headline. */
  children?: ReactNode;
  /** Heading level for the document outline. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Headline size. `hero` is the full clamp(56px,9vw,140px) scene scale. */
  size?: 'scene' | 'sub';
}

export default function SceneHeader({
  scene,
  kicker,
  title,
  meta,
  children,
  as: Heading = 'h2',
  className,
  size = 'scene',
}: SceneHeaderProps) {
  return (
    <div className={cn('grid grid-cols-12 items-end gap-6', className)}>
      <div className="col-span-12 md:col-span-8">
        <div className="small-caps text-ember">
          {scene ? `Scene ${scene} · ${kicker}` : kicker}
        </div>
        {/* The handoff's scale floors (56px / 48px) are wider than a 390px
            phone for words like "Itineraries." and push the document into
            h-scroll. Floors lowered; the upper end of the scale is unchanged,
            so nothing about the desktop composition moves. */}
        <Heading
          className={cn(
            'film-display mt-3 text-balance',
            size === 'scene'
              ? 'text-[clamp(40px,9vw,140px)]'
              : 'text-[clamp(36px,7vw,110px)]'
          )}
        >
          {title}
        </Heading>
      </div>

      {(meta || children) && (
        <div className="col-span-12 md:col-span-4 md:text-right">
          {children}
          {meta && (
            <div className="small-caps mt-2 hidden text-whisper md:block">{meta}</div>
          )}
        </div>
      )}
    </div>
  );
}
