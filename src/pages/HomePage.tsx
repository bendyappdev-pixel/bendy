/**
 * HomePage — seven scenes.
 *
 *   01  Title Card Hero        (components/home/Hero)
 *   02  Today's Almanac        weather / on the ground / this week
 *   03  Sequences              guides as cinematic title cards
 *   04  Locations              categories as chapter bands
 *   05  Live from the Field    map + field transmission
 *   06  The Marquee            events as a table
 *   07  End Slate              stats + geo strip
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

import Hero from '../components/home/Hero';
import CategoryCard from '../components/home/CategoryCard';
import SequenceCard, { SequenceCardCompact } from '../components/guides/SequenceCard';
import SceneHeader from '../components/ui/SceneHeader';
import CrowdBadge, { CrowdLegend, crowdMeta } from '../components/ui/CrowdBadge';
import { PartnerBanner } from '../components/ads';
import { CrowdReportForm } from '../components/crowd';
import InteractiveMap from '../components/map/InteractiveMap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/ui/dialog';

import { categories } from '../data/categories';
import { upcomingEvents } from '../data/events';
import { guides } from '../data/guides';
import { trails } from '../data/trails';
import { campgrounds } from '../data/campgrounds';
import { useWeather, getWeatherInfo, formatDay } from '../hooks/useWeather';
import { useCrowdReports, formatTimeAgo } from '../hooks/useCrowdReports';
import { useMountainConditions, useRiverConditions, useRoadConditions } from '../hooks/useConditions';
import { CrowdLevel, Event as EventType } from '../types';

/* Chapter band photography, keyed by category id. */
const chapterImages: Record<string, string | undefined> = {
  events: undefined,
  outdoor: '/images/trails/broken-top.jpg',
  food: undefined,
  kids: '/images/family-fun-day.jpg',
};

const chapterCtas: Record<string, string> = {
  events: 'Open the calendar',
  outdoor: 'Get outside',
  food: 'Eat & drink',
  kids: 'Take the kids',
};

/* Chapter titles are set at up to 90px — the long-form category names wrap
   and crowd the blurb, so bands use a short form. */
const chapterNames: Record<string, string> = {
  events: 'Events',
  outdoor: 'Outdoor',
  food: 'Food & Drink',
  kids: 'Bendy Kids',
};

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Los_Angeles',
  });
}

export default function HomePage() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div>
      {/* ── Scene 01 ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Scene 02 ─────────────────────────────────────────────── */}
      <AlmanacScene onFileReport={() => setShowReportModal(true)} />

      {/* ── Scene 03 ─────────────────────────────────────────────── */}
      <SequencesScene />

      {/* ── Scene 04 ─────────────────────────────────────────────── */}
      <LocationsScene />

      {/* ── Scene 05 ─────────────────────────────────────────────── */}
      <FieldScene />

      {/* ── Scene 06 ─────────────────────────────────────────────── */}
      <MarqueeScene />

      {/* ── Scene 07 ─────────────────────────────────────────────── */}
      <EndSlateScene />

      <PartnerBanner />

      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File a Report</DialogTitle>
            <DialogClose className="p-2 transition-colors hover:bg-white/10">
              <X className="h-5 w-5 text-mist" />
            </DialogClose>
          </DialogHeader>
          <div className="p-6">
            <DialogDescription className="mb-6">
              Tell everyone else how busy it is out there right now.
            </DialogDescription>
            <CrowdReportForm onSuccess={() => setShowReportModal(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 02 · TODAY'S ALMANAC
   ═══════════════════════════════════════════════════════════════════ */

function AlmanacScene({ onFileReport }: { onFileReport: () => void }) {
  const { weather, loading: weatherLoading } = useWeather();
  const { reports } = useCrowdReports();

  const upcoming = useMemo(() => upcomingEvents().slice(0, 4), []);

  const condition = weather
    ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay).description
    : null;

  return (
    <section id="almanac" className="border-b border-hair bg-film-deep">
      <div className="container-app pt-14">
        <SceneHeader
          scene="02"
          kicker="Today's Almanac"
          title="The Day, In One Frame."
          meta={
            <>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              <br />
              Open-Meteo + community reports
            </>
          }
        />
      </div>

      <div className="container-app py-10">
        <div className="grid grid-cols-12 gap-0 border-y border-hair">
          {/* 01 — Weather */}
          <div className="col-span-12 p-8 lg:col-span-4 lg:border-r lg:border-hair">
            <h3 className="small-caps text-whisper">Weather</h3>

            {weatherLoading && !weather ? (
              <p className="mt-5 font-mono text-[12px] text-whisper">Reading the sky…</p>
            ) : weather ? (
              <>
                <div className="mt-5 flex items-end gap-5">
                  {/* .film-display already sets line-height 0.85 — do not stack
                      extra negative leading here, glyphs will collide. */}
                  <div className="film-display text-[128px] text-film-white">
                    {Math.round(weather.current.temperature)}°
                  </div>
                  <div className="pb-2">
                    <div className="serif-i text-[26px] leading-tight text-film-white">
                      {condition}
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] leading-relaxed text-whisper">
                      Feels {Math.round(weather.current.feelsLike)}° · Wind{' '}
                      {Math.round(weather.current.windSpeed)} mph
                      <br />
                      Humidity {Math.round(weather.current.humidity)}%
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-5 gap-2 font-mono text-[10px]">
                  {weather.daily.slice(0, 5).map((day) => (
                    <div key={day.date.toISOString()} className="border border-hair py-3 text-center">
                      <div className="text-whisper">{formatDay(day.date).toUpperCase()}</div>
                      <div className="film-display-thin mt-1.5 text-[22px] text-film-white">
                        {Math.round(day.tempMax)}°
                      </div>
                      <div className="mt-1 text-whisper">{Math.round(day.tempMin)}°</div>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-hair pt-4 font-mono text-[10px] text-whisper">
                  <div>
                    Sunrise <span className="ml-1 text-film-white">{formatClock(weather.sunrise)}</span>
                  </div>
                  <div>
                    Sunset <span className="ml-1 text-film-white">{formatClock(weather.sunset)}</span>
                  </div>
                  <div>
                    Wind{' '}
                    <span className="ml-1 text-film-white">
                      {Math.round(weather.current.windSpeed)} mph
                    </span>
                  </div>
                  <div>
                    Rain{' '}
                    <span className="ml-1 text-film-white">
                      {Math.round(weather.daily[0]?.precipProbability ?? 0)}%
                    </span>
                  </div>
                </dl>
              </>
            ) : (
              <p className="mt-5 font-mono text-[12px] text-whisper">
                Weather is off the air right now.
              </p>
            )}
          </div>

          {/* 02 — On the Ground */}
          <div className="col-span-12 border-t border-hair p-8 lg:col-span-4 lg:border-t-0 lg:border-r">
            <div className="flex items-center justify-between">
              <h3 className="small-caps text-whisper">On the Ground</h3>
              <button
                onClick={onFileReport}
                className="small-caps text-ember transition-colors hover:text-film-white"
              >
                + File a report
              </button>
            </div>

            {reports.length === 0 ? (
              <p className="mt-6 font-mono text-[12px] text-whisper">
                No reports in the last few hours. Be the first to file one.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-white/10">
                {reports.slice(0, 4).map((report, i) => {
                  const meta = crowdMeta(report.crowdLevel as CrowdLevel);
                  return (
                    <li key={report.id ?? i} className="flex items-center gap-3 py-4">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="film-display-thin text-[22px] text-film-white">
                          {report.locationName}
                        </div>
                        {report.comment && (
                          <div className="mt-0.5 font-mono text-[11px] text-whisper">
                            “{report.comment}”
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right font-mono text-[10px]">
                        <div style={{ color: meta.color }}>{meta.label}</div>
                        <div className="text-whisper">{formatTimeAgo(report.timestamp)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 03 — This Week */}
          <div className="col-span-12 border-t border-hair p-8 lg:col-span-4 lg:border-t-0">
            <div className="flex items-center justify-between">
              <h3 className="small-caps text-whisper">This Week</h3>
              <Link
                to="/events"
                className="small-caps text-ember transition-colors hover:text-film-white"
              >
                All events →
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="mt-6 font-mono text-[12px] text-whisper">Nothing on the books.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {upcoming.map((event, i) => (
                  /* Flex, not a 12-col grid: at this width a col-span-2 track
                     is 36px and the 34px date numeral overflowed it. */
                  <li
                    key={event.id}
                    className={`flex gap-4 ${
                      i < upcoming.length - 1 ? 'border-b border-hair pb-4' : ''
                    }`}
                  >
                    <div className="w-12 shrink-0">
                      <div className="film-display text-[34px] leading-none text-film-white">
                        {event.date.getUTCDate()}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase text-whisper">
                        {event.date.toLocaleDateString('en-US', {
                          month: 'short',
                          weekday: 'short',
                          timeZone: 'UTC',
                        })}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/events"
                        className="film-display-thin text-[22px] leading-tight text-film-white hover:text-ember"
                      >
                        {event.title}
                      </Link>
                      <div className="mt-1.5 font-mono text-[10px] uppercase text-whisper">
                        {event.location} · {event.category}
                        {event.price ? ` · ${event.price}` : ''}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 03 · SEQUENCES
   ═══════════════════════════════════════════════════════════════════ */

function SequencesScene() {
  const featured = guides.slice(0, 2);
  const rest = guides.slice(2, 4);

  return (
    <section id="sequences" className="border-b border-hair bg-black">
      <div className="container-app pb-10 pt-20">
        <SceneHeader
          scene="03"
          kicker="Sequences"
          title={
            <>
              Day-Long Itineraries.
              <br />
              Shot Lists Included.
            </>
          }
        >
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Each sequence is a real day in Bend — written and shot by people who live the
            route. Skip the listicles. Open the call sheet.
          </p>
          <Link to="/guides" className="small-caps mt-4 inline-block text-ember">
            All {guides.length} sequences →
          </Link>
        </SceneHeader>
      </div>

      {featured.map((guide, i) => (
        <SequenceCard
          key={guide.id}
          guide={guide}
          index={i + 1}
          total={guides.length}
          leak={i % 2 === 1}
        />
      ))}

      {rest.length > 0 && (
        <div className="container-app grid grid-cols-12 gap-6 py-12">
          {rest.map((guide, i) => (
            <SequenceCardCompact
              key={guide.id}
              guide={guide}
              index={featured.length + i + 1}
              leak={i % 2 === 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 04 · LOCATIONS
   ═══════════════════════════════════════════════════════════════════ */

function LocationsScene() {
  const chapterMeta: Record<string, string> = {
    events: `${upcomingEvents().length} upcoming · Bend & Central Oregon`,
    outdoor: `${trails.length} trails · ${campgrounds.length} sites · 4 seasons`,
    food: '30+ breweries · 80+ kitchens',
    kids: 'All ages · stroller-friendly',
  };

  return (
    <section className="border-b border-hair bg-film-deep">
      <div className="container-app pb-12 pt-20">
        <SceneHeader scene="04" kicker="Locations" title="Four Front Doors.">
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Skiing in winter. Trails in summer. Kids menu sorted. Beer always. Pick a chapter.
          </p>
        </SceneHeader>
      </div>

      <ul className="border-y border-hair">
        {categories.map((category, i) => (
          <CategoryCard
            key={category.id}
            category={category}
            displayName={chapterNames[category.id]}
            index={i + 1}
            total={categories.length}
            image={chapterImages[category.id]}
            cta={chapterCtas[category.id]}
            meta={chapterMeta[category.id]}
            leak={i % 2 === 1}
            last={i === categories.length - 1}
          />
        ))}
      </ul>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 05 · LIVE FROM THE FIELD
   ═══════════════════════════════════════════════════════════════════ */

function FieldScene() {
  const { conditions: mountain } = useMountainConditions();
  const { rivers } = useRiverConditions();
  const { roads } = useRoadConditions();
  const { reports } = useCrowdReports();

  const deschutes = rivers.find((r) => /deschutes/i.test(r.name)) ?? rivers[0];
  const notableRoad = roads.find((r) => r.status !== 'open') ?? roads[0];

  const transmissions: { label: string; value: string; status: string; ember?: boolean }[] = [];

  if (mountain) {
    transmissions.push({
      label: 'Snow · Bachelor',
      value: `${mountain.snowDepthBase}" base · ${mountain.conditions}`,
      status: `${mountain.liftsOpen}/${mountain.liftsTotal} lifts`,
      ember: mountain.liftsOpen > 0,
    });
  }
  if (deschutes) {
    const temp = deschutes.temperature !== null ? `${Math.round(deschutes.temperature)}° · ` : '';
    transmissions.push({
      label: `River · ${deschutes.name}`,
      value: `${temp}${deschutes.flowRate.toLocaleString()} cfs · ${deschutes.flowTrend}`,
      status: deschutes.paddlingRating,
      ember: deschutes.status === 'good',
    });
  }
  if (notableRoad) {
    transmissions.push({
      label: `Road · ${notableRoad.name}`,
      value: notableRoad.conditions,
      status: notableRoad.status.replace('-', ' '),
      ember: notableRoad.status === 'open',
    });
  }

  const latest = reports[0];

  return (
    <section className="border-b border-hair bg-black">
      <div className="container-app grid grid-cols-12 gap-6 py-20 lg:gap-10">
        <div className="col-span-12 lg:col-span-7">
          <div className="small-caps text-ember">Scene 05 · Live from the Field</div>
          <h2 className="film-display mt-3 text-[clamp(48px,7vw,110px)]">
            The Map
            <br />
            Is Live.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-mist">
            Real-time crowd, weather and trail conditions, layered onto the geography that
            shapes Bend. Click a peak. Drop a pin. File a report.
          </p>

          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="film-display-thin text-[26px] text-film-white">
                  How busy is it right now?
                </div>
                <div className="mt-1 font-mono text-[11px] text-whisper">
                  {latest
                    ? `Reported by locals · latest ${formatTimeAgo(latest.timestamp)}`
                    : 'Reported by locals · Bend & Central Oregon'}
                </div>
              </div>
              <CrowdLegend />
            </div>

            <div className="border border-hair">
              <InteractiveMap height="aspect-[4/3]" showCrowdPins />
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-5">
          <div className="small-caps flex items-center gap-3 text-whisper">
            <span className="live-caret" aria-hidden="true" /> Field Transmission
          </div>
          <h3 className="film-display mt-3 text-[clamp(34px,4.5vw,60px)] leading-[0.9]">
            {mountain
              ? `Bachelor Holds ${mountain.snowDepthBase}".`
              : 'The Cascades Are Still Spinning.'}
          </h3>
          <p className="mt-4 text-[16px] leading-relaxed text-mist">
            Live river gauges, mountain reports in season, and the pass schedules — the
            same sources the locals check before they commit to a day.
          </p>

          {transmissions.length > 0 && (
            <ul className="mt-7 border-t border-hair">
              {transmissions.map((t) => (
                <li
                  key={t.label}
                  className="grid grid-cols-12 items-center gap-4 border-b border-hair py-4"
                >
                  <div className="col-span-4 font-mono text-[10px] uppercase text-whisper md:col-span-3">
                    {t.label}
                  </div>
                  <div className="film-display-thin col-span-5 text-[22px] text-film-white md:col-span-7">
                    {t.value}
                  </div>
                  <div
                    className={`col-span-3 text-right font-mono text-[11px] md:col-span-2 ${
                      t.ember ? 'text-ember' : 'text-whisper'
                    }`}
                  >
                    {t.status}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {reports.length > 0 && (
            <ul className="mt-6 space-y-3">
              {reports.slice(0, 3).map((r, i) => (
                <li key={r.id ?? i} className="flex items-center justify-between gap-4">
                  <span className="film-display-thin text-[20px] text-film-white">
                    {r.locationName}
                  </span>
                  <CrowdBadge level={r.crowdLevel as CrowdLevel} verbose />
                </li>
              ))}
            </ul>
          )}

          <Link to="/map" className="btn-primary mt-8">
            Open the full map <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 06 · THE MARQUEE
   ═══════════════════════════════════════════════════════════════════ */

function MarqueeScene() {
  const all = useMemo(() => upcomingEvents(), []);
  const upcoming = all.slice(0, 8);
  const upcomingCount = all.length;

  return (
    <section id="programme" className="border-b border-hair bg-film-coal">
      <div className="container-app py-20">
        {/* A 12-col grid, not flex-wrap: the headline is wide enough to force
            a wrap, which dropped the blurb to the left edge instead of
            keeping it right-aligned in its own column. */}
        <SceneHeader scene="06" kicker="Now Showing" title="The Marquee.">
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            {upcomingCount} events still to come. Tower Theatre. Hayden Homes. Drake
            Park. Sisters. The Old Mill. Pick your weekend.
          </p>
          <Link to="/events" className="small-caps mt-3 inline-block text-ember">
            Full programme →
          </Link>
        </SceneHeader>

        <div className="mt-10 border-t border-hair">
          <div className="small-caps grid grid-cols-12 gap-3 border-b border-hair py-3 text-whisper">
            <div className="col-span-3 md:col-span-2">Date</div>
            <div className="col-span-7 md:col-span-4">Title</div>
            <div className="col-span-3 hidden md:block">Venue</div>
            <div className="col-span-1 hidden md:block">Cat.</div>
            <div className="col-span-1 hidden md:block">Price</div>
            <div className="col-span-2 text-right md:col-span-1">Status</div>
          </div>

          {upcoming.map((event) => (
            <MarqueeRow key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between font-mono text-[11px] text-whisper">
          <span>
            Showing {upcoming.length} of {upcomingCount} upcoming events
          </span>
          <Link to="/events" className="text-ember">
            Open the full programme →
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * One marquee row. Events with a ticket link go out to the vendor; the rest
 * go to the events page. Splitting this out avoids a union-typed element that
 * neither <a> nor <Link> props typecheck cleanly against.
 */
function MarqueeRow({ event }: { event: EventType }) {
  const rowClass =
    'row-hover grid grid-cols-12 items-center gap-3 border-b border-hair py-5';

  const body = (
    <>
      <div className="col-span-3 flex items-baseline gap-2 md:col-span-2">
        <span className="film-display text-[40px] leading-none text-film-white">
          {String(event.date.getUTCDate()).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] uppercase text-whisper">
          {event.date.toLocaleDateString('en-US', {
            month: 'short',
            weekday: 'short',
            timeZone: 'UTC',
          })}
        </span>
      </div>
      <div className="film-display-thin col-span-7 text-[22px] text-film-white md:col-span-4">
        {event.title}
      </div>
      <div className="col-span-3 hidden font-mono text-[11px] text-mist md:block">
        {event.location}
      </div>
      <div className="col-span-1 hidden font-mono text-[11px] capitalize text-whisper md:block">
        {event.category}
      </div>
      <div className="col-span-1 hidden font-mono text-[11px] text-mist md:block">
        {event.price ?? '—'}
      </div>
      <div className="col-span-2 text-right font-mono text-[11px] text-ember md:col-span-1">
        {event.ticketUrl ? 'Buy →' : 'Info →'}
      </div>
    </>
  );

  if (event.ticketUrl) {
    return (
      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={rowClass}>
        {body}
      </a>
    );
  }

  return (
    <Link to="/events" className={rowClass}>
      {body}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 07 · END SLATE
   ═══════════════════════════════════════════════════════════════════ */

const stats: { value: string; suffix?: string; label: string }[] = [
  { value: '300', suffix: '+', label: 'Days of sun' },
  { value: '500', suffix: '+', label: 'Mi. of trail' },
  { value: '30', suffix: '+', label: 'Breweries' },
  { value: '3,623', label: 'Ft. elevation' },
  { value: '22', label: 'Mi. to Bachelor' },
  { value: '≈100k', label: 'Population' },
];

const geoData = [
  'BEND, OR · 44.0582° N · 121.3153° W',
  'EST. 1905 · DESCHUTES COUNTY',
  'HIGH DESERT · CASCADE RANGE',
  'USDA ZONE 6B · ANNUAL PRECIP 11"',
  'MEAN ANNUAL TEMP 47°F',
];

function EndSlateScene() {
  return (
    <section className="horizon border-b border-hair bg-black">
      <div className="container-app py-24">
        <SceneHeader scene="07" kicker="End Slate" title="Bend, By the Numbers.">
          <p className="max-w-md leading-relaxed text-mist md:ml-auto">
            Population, peaks, breweries, sun. The math behind why people keep moving here —
            and why the locals never leave.
          </p>
        </SceneHeader>

        {/* The handoff asks for six columns at clamp(64px,8vw,120px). A sixth
            of the container is ~207px and "≈100k" needs 265px at that size,
            so the numerals collided with their neighbours and pushed the page
            into h-scroll. Two rows of three keeps the type genuinely large —
            which is the point of the end slate — and fits. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-hair pt-12 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dd className="film-display text-[clamp(40px,6vw,104px)] leading-none text-film-white">
                {stat.value}
                {stat.suffix && <span className="text-ember">{stat.suffix}</span>}
              </dd>
              <dt className="small-caps mt-3 text-whisper">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-hair pt-6 font-mono text-[11px] text-whisper">
          {geoData.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
