/**
 * SceneHeader — the numbered section header used on every page.
 *
 * Sections in this system are "scenes": a mono small-caps kicker in ember
 * ("Scene 02 · Today's Almanac"), a very large condensed display headline,
 * and optional right-aligned metadata.
 */

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useReveal } from '../../hooks/useReveal';

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
  /**
   * Section-identity color for the kicker and its leader rule. Takes any of
   * the functional palette tokens (var(--gold), var(--pine), var(--lake),
   * var(--flame)); defaults to ember. Identity only — ember remains the sole
   * *interactive* accent.
   */
  accent?: string;
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
  accent = 'var(--ember)',
}: SceneHeaderProps) {
  // Every scene header cuts in on first view — the one reveal wiring that
  // covers all eleven pages.
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn('reveal grid grid-cols-12 items-end gap-6', revealed && 'is-revealed', className)}
    >
      <div className="col-span-12 md:col-span-8">
        {/* Film-leader mark: a short accent rule that gives each section an
            identity landmark — the one wayfinding cue that survives mobile,
            where the meta column is hidden. */}
        <div aria-hidden="true" className="mb-3 h-[2px] w-10" style={{ background: accent }} />
        <div className="small-caps" style={{ color: accent }}>
          {scene ? `Scene ${scene} · ${kicker}` : kicker}
        </div>
        {/* Both ends of the handoff's scale had to move for real content.
            The floors (56px / 48px) overflowed a 390px phone on words like
            "Itineraries."; the ceilings (140px / 110px) overflowed this
            8-column track on words like "Programme." and bled into the
            supporting copy beside it — measured at up to 102px of overlap.
            These values are the largest that keep the longest headline in
            the product inside its own column. */}
        <Heading
          className={cn(
            'film-display mt-3 text-balance',
            size === 'scene'
              ? 'text-[clamp(40px,7.5vw,112px)]'
              : 'text-[clamp(36px,6vw,92px)]'
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
