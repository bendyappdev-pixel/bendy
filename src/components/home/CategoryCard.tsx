/**
 * CategoryCard — Scene 04's chapter band.
 *
 * Was a gradient-header card in a 4-up grid. Now a 280px-tall full-bleed
 * `.reel` with a 200px stencil numeral in the chapter's own accent, the
 * category name in condensed display, and a serif-italic blurb. The whole
 * band is the link.
 */

import { Link } from 'react-router-dom';
import { Category } from '../../types';
import Reel from '../ui/Reel';

/**
 * Chapter accents. The old map keyed off Tailwind class names carried in
 * `category.color`; this keys off the same field but resolves to the film
 * palette's chapter colours instead of gradients.
 */
const categoryColorMap: Record<string, string> = {
  'bg-mountain': 'var(--ember)', // Events
  'bg-forest': 'var(--pine)', // Outdoor
  'bg-earth': 'var(--gold)', // Food & Drink
  'bg-purple-500': 'var(--lake)', // Bendy Kids
};

interface CategoryCardProps {
  category: Category;
  /**
   * Short chapter title. Category names like "Outdoor Activities" wrap to two
   * lines at the chapter scale and collide with the blurb, so bands take a
   * one-word title where the full name is long.
   */
  displayName?: string;
  /** 1-based chapter index, rendered as the stencil numeral. */
  index: number;
  /** Total chapters, for the "CHAPTER 01 / 04" timecode. */
  total: number;
  /** Photo for the band, when one exists. */
  image?: string;
  /** Right-hand call to action wording. */
  cta?: string;
  /** Mono kicker above the name, e.g. "116 listings · updated weekly". */
  meta?: string;
  /** Alternate the warm light leak across sequential bands. */
  leak?: boolean;
  /** Suppress the bottom hairline on the final band. */
  last?: boolean;
}

export default function CategoryCard({
  category,
  displayName,
  index,
  total,
  image,
  cta = 'Open the chapter',
  meta,
  leak = false,
  last = false,
}: CategoryCardProps) {
  const accent = categoryColorMap[category.color] ?? 'var(--ember)';
  const numeral = String(index).padStart(2, '0');

  return (
    <li className="group relative">
      <Link to={category.href} className="block">
        <Reel
          src={image}
          leak={leak}
          scrim="left"
          label={`CH${numeral}_${category.name.replace(/\W+/g, '-').toUpperCase()}_BROLL.MOV`}
          timecode={`CHAPTER ${numeral} / ${String(total).padStart(2, '0')}`}
          className="flex"
          /* min-height so a long blurb lengthens the band instead of
             spilling past its own hairline. */
          style={{
            minHeight: 280,
            borderBottom: last ? undefined : '1px solid var(--hair)',
          }}
        >
          <div className="relative z-10 flex w-full min-w-0 items-center gap-6 px-6 py-8 lg:gap-8 lg:px-10">
            <div
              className="stencil hidden shrink-0 text-[140px] leading-none sm:block md:text-[200px]"
              style={{ color: accent }}
              aria-hidden="true"
            >
              {numeral}
            </div>
            <div className="min-w-0 flex-1">
              {meta && <div className="small-caps text-whisper">{meta}</div>}
              <h3 className="film-display mt-1 text-[clamp(36px,6vw,90px)] text-film-white">
                {displayName ?? category.name}
              </h3>
              <p className="serif-i mt-2 max-w-xl text-[18px] text-mist">
                {category.description}
              </p>
            </div>
            <span className="small-caps hidden items-center gap-3 text-film-white transition-colors group-hover:text-ember md:inline-flex">
              {cta}
              <span
                className="film-display text-[40px] leading-none transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </div>
        </Reel>
      </Link>
    </li>
  );
}
