import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
  Lightbulb,
  Car,
  Ticket,
  Backpack,
  Accessibility,
  DollarSign,
} from 'lucide-react';
import { guides } from '../data/guides';
import { Season, Difficulty, GuideStop } from '../types/guide';
import Reel from '../components/ui/Reel';
import SceneHeader from '../components/ui/SceneHeader';

const seasonIcons: Record<Season, typeof Sun> = {
  spring: Flower2,
  summer: Sun,
  fall: Leaf,
  winter: Snowflake,
};

const seasonLabels: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

/** Same accent map as SequenceCard: pine/ember/gold for easy/moderate/challenging. */
const difficultyAccent: Record<Difficulty, string> = {
  easy: 'var(--pine)',
  moderate: 'var(--ember)',
  challenging: 'var(--gold)',
};

/** One row of the call sheet: a stop, its tips, and its alternatives. */
function CallSheetRow({ stop, index }: { stop: GuideStop; index: number }) {
  const numeral = String(index + 1).padStart(2, '0');

  return (
    <li className="border-b border-hair py-8 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
        <span className="stencil text-[22px] leading-none text-whisper">{numeral}</span>
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-ember">
          {stop.time}
        </span>
        {stop.duration && (
          <span className="font-mono text-[11px] text-whisper">{stop.duration}</span>
        )}
        {stop.isOptional && (
          <span className="small-caps border border-hair px-2 py-0.5 text-whisper">
            Optional
          </span>
        )}
      </div>

      <h3 className="film-display-thin mt-3 text-[clamp(24px,3.4vw,34px)] text-film-white">
        {stop.title}
      </h3>

      <div className="mt-1.5 flex items-center gap-2 font-mono text-[12px] text-whisper">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
        {stop.location}
      </div>

      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist">{stop.description}</p>

      {stop.tips && stop.tips.length > 0 && (
        <ul className="mt-5 max-w-2xl divide-y divide-hair border-y border-hair">
          {stop.tips.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-3 py-2.5 font-mono text-[12px] leading-relaxed text-whisper"
            >
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      )}

      {stop.alternatives && stop.alternatives.length > 0 && (
        <div className="mt-5 max-w-2xl border-l border-hair pl-4">
          <div className="small-caps text-whisper">Alternatives</div>
          <div className="mt-2 space-y-2">
            {stop.alternatives.map((alt, i) => (
              <p key={i} className="text-[14px] leading-relaxed">
                <span className="film-display-thin text-film-white">{alt.title}</span>
                <span className="text-mist"> — {alt.description}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const accent = difficultyAccent[guide.difficulty] ?? 'var(--ember)';

  // Scene kickers stay contiguous even though Seasonal Notes is conditional.
  let sceneCount = 1; // About is always scene 01.
  const nextScene = () => String(++sceneCount).padStart(2, '0');

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Reel
        src={guide.heroImage}
        alt={guide.title}
        priority
        scrim="bottom"
        className="flex border-b border-hair"
        style={{ minHeight: 'min(72vh, 680px)' }}
      >
        <div className="absolute left-4 top-4 z-20 md:left-8 md:top-8">
          <Link
            to="/guides"
            className="small-caps flex items-center gap-2 border border-hair bg-film-black/60 px-4 py-2 text-film-white transition-colors hover:border-film-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All Sequences
          </Link>
        </div>

        <div className="relative z-10 flex w-full flex-col justify-end px-6 pb-32 pt-24 md:pb-36 lg:px-10">
          <div className="small-caps text-ember">
            {guide.difficulty} · {guide.duration}
          </div>
          <h1 className="film-display mt-3 max-w-4xl text-[clamp(44px,8vw,120px)] text-film-white">
            {guide.title}
          </h1>
          <p className="serif-i mt-4 max-w-2xl text-[20px] leading-snug text-mist md:text-[26px]">
            {guide.tagline}
          </p>
          <div className="small-caps mt-5 flex flex-wrap gap-x-6 gap-y-2 text-whisper">
            {guide.seasons.map((season) => {
              const Icon = seasonIcons[season];
              return (
                <span key={season} className="inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-ember" aria-hidden="true" />
                  {seasonLabels[season]}
                </span>
              );
            })}
          </div>
        </div>

        {/* Letterboxed lower-third: the stat block */}
        <div className="letterbox absolute bottom-0 left-0 right-0 z-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-hair px-6 py-6 md:grid-cols-4 lg:px-10">
            <div>
              <div className="small-caps text-whisper">Duration</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {guide.duration}
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Difficulty</div>
              <div
                className="film-display-thin mt-1 text-[22px] capitalize"
                style={{ color: accent }}
              >
                {guide.difficulty}
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Stops</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {guide.stops.length}
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">First Stop</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {guide.stops[0]?.time ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </Reel>

      {/* Main Content */}
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Main column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Scene 01 · About */}
            <section>
              <SceneHeader scene="01" kicker="About This Sequence" title="The Brief." size="sub" />
              <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-mist">
                {guide.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {guide.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="small-caps border border-hair px-3 py-2 text-mist"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Seasonal Notes */}
            {guide.seasonalNotes.length > 0 && (
              <section className="mt-14 border-t border-hair pt-10">
                <SceneHeader
                  scene={nextScene()}
                  kicker="Seasonal Notes"
                  title="Plan Around The Weather."
                  size="sub"
                />
                <div className="mt-6 divide-y divide-hair border-t border-hair">
                  {guide.seasonalNotes.map((note, i) => (
                    <div key={i} className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                      <span className="small-caps shrink-0 text-whisper">
                        {note.seasons.map((season) => seasonLabels[season]).join(' · ')}
                      </span>
                      <p className="text-[14px] leading-relaxed text-mist">{note.note}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Call Sheet — the centrepiece: every stop, timed and mapped. */}
            <section className="mt-14 border-t border-hair pt-10">
              <SceneHeader
                scene={nextScene()}
                kicker="The Call Sheet"
                title="Your Itinerary."
                size="sub"
                meta={`${guide.stops.length} stops`}
              />
              <ol className="mt-6 border-t border-hair">
                {guide.stops.map((stop, index) => (
                  <CallSheetRow key={stop.id} stop={stop} index={index} />
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:space-y-10">
              {/* Quick Start */}
              <div className="border-t border-hair pt-6 lg:border-t-0 lg:pt-0">
                <h3 className="small-caps text-whisper">Quick Start</h3>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between gap-4 border-b border-hair py-3">
                    <span className="small-caps text-whisper">First Stop</span>
                    <span className="film-display-thin text-[19px] text-film-white">
                      {guide.stops[0]?.time ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-hair py-3">
                    <span className="small-caps text-whisper">Total Duration</span>
                    <span className="film-display-thin text-[19px] text-film-white">
                      {guide.duration}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <span className="small-caps text-whisper">Difficulty</span>
                    <span
                      className="film-display-thin capitalize text-[19px]"
                      style={{ color: accent }}
                    >
                      {guide.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Practical Info */}
              <div className="mt-10 border-t border-hair pt-6">
                <h3 className="small-caps text-whisper">Practical Info</h3>
                <div className="mt-4 space-y-6">
                  {guide.practicalInfo.permits && guide.practicalInfo.permits.length > 0 && (
                    <div>
                      <div className="small-caps flex items-center gap-2 text-ember">
                        <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                        Permits & Passes
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {guide.practicalInfo.permits.map((permit, i) => (
                          <li
                            key={i}
                            className="font-mono text-[12px] leading-relaxed text-whisper"
                          >
                            {permit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guide.practicalInfo.parking && guide.practicalInfo.parking.length > 0 && (
                    <div className="border-t border-hair pt-6">
                      <div className="small-caps flex items-center gap-2 text-ember">
                        <Car className="h-3.5 w-3.5" aria-hidden="true" />
                        Parking
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {guide.practicalInfo.parking.map((info, i) => (
                          <li
                            key={i}
                            className="font-mono text-[12px] leading-relaxed text-whisper"
                          >
                            {info}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guide.practicalInfo.gear && guide.practicalInfo.gear.length > 0 && (
                    <div className="border-t border-hair pt-6">
                      <div className="small-caps flex items-center gap-2 text-ember">
                        <Backpack className="h-3.5 w-3.5" aria-hidden="true" />
                        Recommended Gear
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {guide.practicalInfo.gear.map((item, i) => (
                          <li
                            key={i}
                            className="font-mono text-[12px] leading-relaxed text-whisper"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guide.practicalInfo.accessibility && (
                    <div className="border-t border-hair pt-6">
                      <div className="small-caps flex items-center gap-2 text-ember">
                        <Accessibility className="h-3.5 w-3.5" aria-hidden="true" />
                        Accessibility
                      </div>
                      <p className="mt-2 font-mono text-[12px] leading-relaxed text-whisper">
                        {guide.practicalInfo.accessibility}
                      </p>
                    </div>
                  )}

                  {guide.practicalInfo.budgetEstimate && (
                    <div className="border-t border-hair pt-6">
                      <div className="small-caps flex items-center gap-2 text-ember">
                        <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                        Budget Estimate
                      </div>
                      <p className="mt-2 font-mono text-[12px] leading-relaxed text-whisper">
                        {guide.practicalInfo.budgetEstimate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share/Save */}
              <div className="mt-10 border-t border-hair pt-6">
                <h3 className="small-caps text-whisper">Share This Sequence</h3>
                <div className="mt-4 flex gap-3">
                  <button className="btn-primary flex-1 justify-center text-[10px]">
                    Copy Link
                  </button>
                  <button className="btn-secondary flex-1 justify-center text-[10px]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
