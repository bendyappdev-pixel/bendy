/**
 * SequenceCard — a guide rendered as a cinematic title card.
 *
 * Used full-bleed on the homepage's Scene 03 and down the Guides index. The
 * bottom letterbox is a call sheet: each of the guide's stops as a time plus
 * a name, so the shape of the day is legible before you open it.
 */

import { Link } from 'react-router-dom';
import { Guide } from '../../types/guide';
import Reel from '../ui/Reel';

/** Difficulty drives the accent on the numeral and the first call-sheet rule. */
const difficultyAccent: Record<Guide['difficulty'], string> = {
  easy: 'var(--pine)',
  moderate: 'var(--ember)',
  challenging: 'var(--gold)',
};

interface SequenceCardProps {
  guide: Guide;
  /** 1-based sequence number. */
  index: number;
  total: number;
  leak?: boolean;
  priority?: boolean;
}

export default function SequenceCard({
  guide,
  index,
  total,
  leak = false,
  priority = false,
}: SequenceCardProps) {
  const numeral = String(index).padStart(2, '0');
  const accent = difficultyAccent[guide.difficulty] ?? 'var(--ember)';
  const firstStop = guide.stops[0];
  // Six slots read as a call sheet; more turns into a wall of type.
  const callSheet = guide.stops.slice(0, 6);

  return (
    <article className="relative">
      <Reel
        src={guide.heroImage}
        alt=""
        hoverable
        leak={leak}
        priority={priority}
        scrim="both"
        label={`SEQ${numeral}_${guide.slug.toUpperCase()}.MOV`}
        timecode={`SCENE ${numeral} OF ${String(total).padStart(2, '0')} · ${guide.duration.toUpperCase()}`}
        className="flex"
        /* min-height, not height: real guide titles run longer than the
           design reference's and a fixed frame clipped the stencil off the
           top. The frame keeps its cinematic proportions and grows only when
           the content genuinely needs it. */
        style={{ minHeight: 'min(82vh, 760px)' }}
      >
        {/* Top slate */}
        <div className="letterbox small-caps absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-3 lg:px-10">
          <span className="rec">Sequence {numeral}</span>
          {firstStop && (
            <span className="hidden text-whisper md:inline">
              {firstStop.location} · {firstStop.time}
            </span>
          )}
          <span className="hidden text-ember md:inline">
            Difficulty · {guide.difficulty}
          </span>
        </div>

        {/* Title block. In flow rather than absolutely positioned so the
            frame can grow around it; pt/pb clear the two letterbox slates. */}
        <div className="relative z-10 flex w-full min-w-0 flex-col justify-end px-6 pb-40 pt-20 md:pb-44 lg:px-16">
          <div className="max-w-3xl">
            <div
              className="stencil text-[clamp(56px,13vw,180px)] leading-none opacity-70"
              style={{ color: accent }}
              aria-hidden="true"
            >
              №{numeral}
            </div>
            <h3 className="film-display mt-5 text-[clamp(32px,6vw,80px)] leading-[0.95] text-film-white">
              {guide.title}
            </h3>
            <p className="serif-i mt-6 max-w-2xl text-[clamp(18px,2vw,26px)] leading-snug text-mist">
              {guide.tagline}
            </p>
            <Link to={`/guides/${guide.slug}`} className="btn-primary mt-7">
              <span aria-hidden="true">▶</span>
              <span>Roll the sequence</span>
            </Link>
          </div>
        </div>

        {/* Call sheet */}
        {callSheet.length > 0 && (
          <div className="letterbox absolute bottom-0 left-0 right-0 z-20">
            <ol className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hair px-6 py-4 font-mono text-[10px] text-mist md:grid-cols-6 lg:px-10">
              {callSheet.map((stop, i) => (
                <li
                  key={stop.id}
                  className="pl-3"
                  style={i === 0 ? { borderLeft: `2px solid ${accent}` } : undefined}
                >
                  <div className="text-whisper">{stop.time}</div>
                  <div className="film-display-thin mt-0.5 text-[16px] text-film-white">
                    {stop.title}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Reel>
    </article>
  );
}

/** The compact 2-up variant used below the full-bleed sequences. */
export function SequenceCardCompact({
  guide,
  index,
  leak = false,
}: {
  guide: Guide;
  index: number;
  leak?: boolean;
}) {
  const numeral = String(index).padStart(2, '0');

  return (
    <article className="col-span-12 md:col-span-6">
      <Link to={`/guides/${guide.slug}`} className="group block">
        <Reel
          src={guide.heroImage}
          alt=""
          hoverable
          leak={leak}
          scrim="bottom"
          label={`SEQ${numeral}_${guide.slug.toUpperCase()}.MOV`}
          timecode={guide.duration.toUpperCase()}
          style={{ aspectRatio: '16 / 10' }}
        >
          {/* Sits above the film-slate row rather than on top of it — at
              bottom-3 this caption collided with .label and .tc. */}
          <div className="absolute bottom-9 left-4 right-4 z-10 hidden md:block">
            <div className="small-caps text-whisper">
              Sequence {numeral} · {guide.bestFor[0] ?? 'All comers'} · {guide.difficulty}
            </div>
          </div>
        </Reel>
        {/* text-film-white is explicit: the base stylesheet colours every <a>
            ember, which this heading would otherwise inherit. */}
        <h3 className="film-display mt-4 text-[36px] text-film-white transition-colors group-hover:text-ember">
          {guide.title}
        </h3>
        <p className="serif-i mt-2 text-[18px] text-mist">{guide.tagline}</p>
        <span className="small-caps mt-3 inline-block text-ember">Roll →</span>
      </Link>
    </article>
  );
}
