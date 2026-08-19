/**
 * ConditionsPage — the almanac language taken all the way. Eight scenes, one
 * per live data source, each a numbered SceneHeader over a hairline-divided
 * grid of mono/display readouts. No cards, no filled backgrounds, no emoji —
 * every status is read off the shared crowd-token palette via `conditionMeta`
 * below, the same way `crowdMeta` does it for CrowdBadge.
 *
 *   —   Masthead              quick-glance readout (unnumbered, like Hero)
 *   01  Mt. Bachelor           mountain snow report
 *   02  Hoodoo Ski Area        mountain snow report
 *   03  Air Quality            Open-Meteo AQI
 *   04  Fire                   NIFC/WFIGS wildfire incidents
 *   05  River Flows            USGS gauges
 *   06  Sun & Light            sunrise / sunset / golden hour
 *   07  Road Conditions        mountain pass status
 *   08  Downtown Parking       where to look (no live count)
 */

import { ReactNode, useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, Minus, RefreshCw, Flame } from 'lucide-react';

import { calculateSunTimes } from '../data/conditions';
import {
  AirQuality,
  ConditionStatus,
  FireIncident,
  MountainConditions,
  RiverConditions,
  RoadCondition,
} from '../types/conditions';
import {
  useRiverConditions,
  useAirQuality,
  useFireIncidents,
  useMountainConditions,
  useHoodooConditions,
  useRoadConditions,
} from '../hooks/useConditions';
import SceneHeader from '../components/ui/SceneHeader';
import { cn } from '../lib/utils';

/* ═══════════════════════════════════════════════════════════════════
   SHARED HELPERS — the single source of truth for status colour +
   plain-language wording. Never colour a status ad hoc; go through
   conditionMeta, the same pattern CrowdBadge uses for crowd levels.
   ═══════════════════════════════════════════════════════════════════ */

interface ConditionMeta {
  label: string;
  color: string;
}

const CONDITION_META: Record<ConditionStatus, ConditionMeta> = {
  good: { label: 'Good', color: 'var(--crowd-empty)' },
  moderate: { label: 'Moderate', color: 'var(--crowd-mod)' },
  poor: { label: 'Poor', color: 'var(--crowd-packed)' },
  closed: { label: 'Closed', color: 'var(--crowd-packed)' },
};

function conditionMeta(status: ConditionStatus): ConditionMeta {
  return CONDITION_META[status] ?? CONDITION_META.moderate;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Status dot + plain-language label. The condition-status counterpart to CrowdBadge. */
function ConditionDot({
  status,
  label,
  className,
}: {
  status: ConditionStatus;
  label?: string;
  className?: string;
}) {
  const meta = conditionMeta(status);
  return (
    <span className={cn('inline-flex items-center gap-2 font-mono text-[11px]', className)}>
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
      />
      <span style={{ color: meta.color }}>{label ?? meta.label}</span>
    </span>
  );
}

/** A big film-display numeral with a small mono unit label — the readout unit of this page. */
function DataCell({
  label,
  value,
  unit,
  valueColor,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  valueColor?: string;
  className?: string;
}) {
  return (
    <div className="p-6">
      <div className="small-caps text-whisper">{label}</div>
      <div
        className={cn('film-display mt-3 text-[clamp(30px,4vw,52px)]', className)}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
        {unit && <span className="ml-1.5 font-mono text-[11px] normal-case text-whisper">{unit}</span>}
      </div>
    </div>
  );
}

/** One hairline row: mono label left, film-display-thin value right. */
function StatRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hair py-3 last:border-b-0">
      <span className="small-caps shrink-0 text-whisper">{label}</span>
      <span
        className="film-display-thin text-right text-[19px] text-film-white"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

/** Rising/filling reads as ember (change worth noticing); falling/emptying and stable stay neutral. */
function TrendIcon({ trend }: { trend: 'rising' | 'falling' | 'stable' | 'filling' | 'emptying' }) {
  if (trend === 'rising' || trend === 'filling') {
    return <TrendingUp className="h-3.5 w-3.5 text-ember" aria-hidden="true" />;
  }
  if (trend === 'falling' || trend === 'emptying') {
    return <TrendingDown className="h-3.5 w-3.5 text-whisper" aria-hidden="true" />;
  }
  return <Minus className="h-3.5 w-3.5 text-whisper" aria-hidden="true" />;
}

/** Pulsing ember dot marking a scene as pulled live, not mocked. */
function LiveTag() {
  return (
    <span className="small-caps inline-flex items-center gap-2 text-whisper">
      <span className="live-caret" aria-hidden="true" /> Live
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function ConditionsPage() {
  const [sunTimes, setSunTimes] = useState(calculateSunTimes());

  const { rivers, loading: riversLoading, refresh: refreshRivers } = useRiverConditions();
  const { airQuality, loading: aqLoading, refresh: refreshAQ } = useAirQuality();
  const { conditions: mountain, loading: mtLoading, error: mtError } = useMountainConditions();
  const { conditions: hoodoo, loading: hoodooLoading, error: hoodooError } = useHoodooConditions();
  const { roads, loading: roadsLoading } = useRoadConditions();
  const { active: activeFires, significant: significantFires, loading: firesLoading, error: firesError } = useFireIncidents();

  useEffect(() => {
    // Recalculate sun times at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setSunTimes(calculateSunTimes());
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    refreshRivers();
    refreshAQ();
  };

  return (
    <div className="min-h-[100dvh]">
      <Masthead
        mountain={mountain}
        mtLoading={mtLoading}
        airQuality={airQuality}
        aqLoading={aqLoading}
        rivers={rivers}
        riversLoading={riversLoading}
        sunTimes={sunTimes}
        onRefresh={handleRefresh}
      />

      <MountainScene
        scene="01"
        kicker="Mt. Bachelor"
        href="https://www.mtbachelor.com/"
        bg="bg-black"
        conditions={mountain}
        loading={mtLoading}
        notice={mtError}
      />

      <MountainScene
        scene="02"
        kicker="Hoodoo Ski Area"
        href="https://www.skihoodoo.com/"
        bg="bg-film-deep"
        conditions={hoodoo}
        loading={hoodooLoading}
        notice={hoodooError}
      />

      <AirQualityScene airQuality={airQuality} loading={aqLoading} />

      <FireScene active={activeFires} significant={significantFires} loading={firesLoading} error={firesError} />

      <RiversScene rivers={rivers} loading={riversLoading} />

      <SunScene sunTimes={sunTimes} />

      <RoadsScene roads={roads} loading={roadsLoading} />

      <ParkingScene />

      <FooterNote />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MASTHEAD — unnumbered, like Hero on the homepage.
   ═══════════════════════════════════════════════════════════════════ */

function Masthead({
  mountain,
  mtLoading,
  airQuality,
  aqLoading,
  rivers,
  riversLoading,
  sunTimes,
  onRefresh,
}: {
  mountain: MountainConditions | null;
  mtLoading: boolean;
  airQuality: AirQuality | null;
  aqLoading: boolean;
  rivers: RiverConditions[];
  riversLoading: boolean;
  sunTimes: ReturnType<typeof calculateSunTimes>;
  onRefresh: () => void;
}) {
  const aqMeta = airQuality ? conditionMeta(airQuality.status) : null;

  return (
    <section className="border-b border-hair bg-film-deep">
      <div className="container-app py-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="small-caps text-ember">Live Conditions</div>
            <h1 className="film-display mt-3 text-[clamp(40px,9vw,140px)] text-balance">
              Bend, Right Now.
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-mist">
              Snowpack, rivers, air and roads — pulled straight from the sources the locals
              check before they commit to a day.
            </p>
          </div>
          <button onClick={onRefresh} className="btn-secondary">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Refresh
          </button>
        </div>

        {/* Flex, not a narrow 12-col grid: the quick-glance numerals need room
            a col-span-3 track doesn't reliably give them at 390px. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hair pt-10 md:grid-cols-4">
          <div className="min-w-0">
            <dd className="film-display text-[clamp(32px,4vw,56px)] text-film-white">
              {mtLoading ? '—' : mountain ? `${mountain.liftsOpen}/${mountain.liftsTotal}` : '--'}
            </dd>
            <dt className="small-caps mt-2 text-whisper">Bachelor lifts open</dt>
          </div>
          <div className="min-w-0">
            <dd
              className="film-display text-[clamp(32px,4vw,56px)]"
              style={{ color: aqMeta ? aqMeta.color : 'var(--film-white)' }}
            >
              {aqLoading ? '—' : (airQuality?.aqi ?? '--')}
            </dd>
            <dt className="small-caps mt-2 text-whisper">Air quality index</dt>
          </div>
          <div className="min-w-0">
            <dd className="film-display text-[clamp(32px,4vw,56px)] text-film-white">
              {riversLoading ? '—' : (rivers[0]?.flowRate.toLocaleString() ?? '--')}
            </dd>
            <dt className="small-caps mt-2 text-whisper">{rivers[0]?.name ?? 'Deschutes'} · cfs</dt>
          </div>
          <div className="min-w-0">
            <dd className="film-display text-[clamp(32px,4vw,56px)] text-film-white">{sunTimes.sunset}</dd>
            <dt className="small-caps mt-2 text-whisper">Sunset tonight</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 01 / 02 · MT. BACHELOR / HOODOO SKI AREA
   ═══════════════════════════════════════════════════════════════════ */

function MountainScene({
  scene,
  kicker,
  href,
  bg,
  conditions,
  loading,
  notice,
}: {
  scene: string;
  kicker: string;
  href: string;
  bg: string;
  conditions: MountainConditions | null;
  loading: boolean;
  notice?: string | null;
}) {
  return (
    <section className={cn('border-b border-hair', bg)}>
      <div className="container-app pt-16">
        <SceneHeader
          scene={scene}
          kicker={kicker}
          title={
            loading ? (
              'Reading The Mountain.'
            ) : conditions ? (
              <>
                {conditions.snowDepthBase}&quot; Base.
                <br />
                {conditions.conditions}.
              </>
            ) : (
              'No Live Report.'
            )
          }
          meta={
            <>
              {conditions && (
                <>
                  Updated {getTimeAgo(conditions.lastUpdated)}
                  <br />
                </>
              )}
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-ember">
                {conditions ? 'Full report ↗' : 'Visit their website ↗'}
              </a>
            </>
          }
        />
      </div>

      <div className="container-app py-10">
        {loading ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Reading the mountain…
          </p>
        ) : conditions ? (
          <div className="grid grid-cols-2 divide-x divide-y divide-hair border border-hair md:grid-cols-4">
            <DataCell label="Base depth" value={conditions.snowDepthBase} unit="in" />
            <DataCell label="Summit depth" value={conditions.snowDepthSummit} unit="in" />
            <DataCell label="New snow · 24h" value={conditions.newSnow24h} unit="in" />
            <DataCell label="New snow · 48h" value={conditions.newSnow48h} unit="in" />
            <DataCell label="Lifts open" value={`${conditions.liftsOpen}/${conditions.liftsTotal}`} />
            <DataCell label="Terrain open" value={conditions.terrainOpen} unit="%" />
            <DataCell
              label="Conditions"
              value={conditions.conditions}
              className="text-[22px] text-ember"
            />
          </div>
        ) : (
          <div className="border-t border-hair py-10">
            <p className="font-mono text-[12px] text-whisper">
              {notice || 'No live conditions feed is available right now.'}
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-6 inline-flex"
            >
              Visit {new URL(href).hostname.replace(/^www\./, '')}{' '}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 03 · AIR QUALITY
   ═══════════════════════════════════════════════════════════════════ */

function AirQualityScene({ airQuality, loading }: { airQuality: AirQuality | null; loading: boolean }) {
  const meta = airQuality ? conditionMeta(airQuality.status) : conditionMeta('good');

  return (
    <section className="border-b border-hair bg-black">
      <div className="container-app pt-16">
        <SceneHeader
          scene="03"
          kicker="Air Quality"
          title={
            loading ? (
              'Reading The Air.'
            ) : airQuality ? (
              <>
                AQI {airQuality.aqi}.
                <br />
                {airQuality.category}.
              </>
            ) : (
              'Off The Air.'
            )
          }
          meta={
            airQuality && (
              <>
                <LiveTag />
                <br />
                Updated {getTimeAgo(airQuality.lastUpdated)}
                <br />
                Open-Meteo Air Quality API
              </>
            )
          }
        />
      </div>

      <div className="container-app py-10">
        {loading ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Reading the air…
          </p>
        ) : airQuality ? (
          <div className="grid grid-cols-12 gap-6 border-t border-hair pt-10 lg:gap-12">
            <div className="col-span-12 lg:col-span-4">
              <DataCell
                label="Air quality index"
                value={airQuality.aqi}
                valueColor={meta.color}
                className="text-[clamp(56px,7vw,96px)]"
              />
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-8">
              <StatRow label="Category" value={airQuality.category} valueColor={meta.color} />
              <StatRow label="Primary pollutant" value={airQuality.primaryPollutant} />
              <StatRow label="Forecast" value={airQuality.forecast} />
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mist">
                {airQuality.healthMessage}
              </p>
            </div>
          </div>
        ) : (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Unable to load air quality data.
          </p>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 04 · FIRE
   ═══════════════════════════════════════════════════════════════════ */

/** Wildfire incidents within 100 km of Bend, from the NIFC/WFIGS interagency
    feed. Incidents only — never restrictions status, which has no reliable
    machine-readable source; the meta links out for that instead. */
function FireScene({
  active,
  significant,
  loading,
  error,
}: {
  active: FireIncident[];
  significant: FireIncident[];
  loading: boolean;
  error: string | null;
}) {
  const shown = significant.slice(0, 5);
  const newest = active.reduce<Date | null>(
    (acc, f) => (acc === null || f.lastUpdated > acc ? f.lastUpdated : acc),
    null
  );
  const smallStarts = active.length - significant.length;

  return (
    <section className="border-b border-hair bg-film-deep">
      <div className="container-app pt-16">
        <SceneHeader
          scene="04"
          kicker="Fire"
          title={
            loading
              ? 'Reading The Smoke.'
              : error
              ? 'Feed Unavailable.'
              : significant.length > 0
              ? `${significant.length} ${significant.length === 1 ? 'Fire' : 'Fires'} Burning Nearby.`
              : 'No Active Fires Nearby.'
          }
          meta={
            !error && (
              <>
                <LiveTag />
                {newest && (
                  <>
                    <br />
                    Updated {getTimeAgo(newest)}
                  </>
                )}
                <br />
                NIFC · WFIGS · 60 mi radius
                <br />
                <a
                  href="https://centraloregonfire.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember"
                >
                  Restrictions &amp; closures ↗
                </a>
              </>
            )
          }
        />
      </div>

      <div className="container-app py-10">
        {loading ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Reading the smoke…
          </p>
        ) : error ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Wildfire data is unavailable right now — check centraloregonfire.org.
          </p>
        ) : shown.length > 0 ? (
          <div className="border-t border-hair">
            {shown.map((fire) => (
              <div
                key={fire.name + fire.county}
                className="flex flex-col gap-3 border-b border-hair py-6 md:flex-row md:items-center md:justify-between md:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="film-display-thin flex items-center gap-2.5 text-[20px] text-film-white">
                      <Flame className="h-4 w-4 text-ember" aria-hidden="true" />
                      {fire.name}
                    </span>
                    <span className="font-mono text-[11px] text-whisper">{fire.county} County</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase text-whisper">
                    Discovered {fire.discovered.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex shrink-0 items-baseline gap-6">
                  <span className="film-display-thin text-[22px] text-film-white">
                    {fire.acres !== null ? `${fire.acres.toLocaleString()} ac` : '— ac'}
                  </span>
                  <span
                    className="font-mono text-[11px]"
                    style={{
                      color:
                        (fire.percentContained ?? 0) >= 90 ? 'var(--crowd-empty)' : 'var(--crowd-packed)',
                    }}
                  >
                    {fire.percentContained !== null
                      ? `${fire.percentContained}% contained`
                      : 'containment unreported'}
                  </span>
                </div>
              </div>
            ))}
            {smallStarts > 0 && (
              <p className="py-4 font-mono text-[10px] uppercase text-whisper">
                + {smallStarts} small {smallStarts === 1 ? 'start' : 'starts'} under 100 acres being tracked
              </p>
            )}
          </div>
        ) : (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            No active wildfires within 60 miles of Bend.
            {smallStarts > 0 &&
              ` ${smallStarts} small ${smallStarts === 1 ? 'start' : 'starts'} under 100 acres being tracked.`}
          </p>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 05 · RIVER FLOWS
   ═══════════════════════════════════════════════════════════════════ */

function RiversScene({ rivers, loading }: { rivers: RiverConditions[]; loading: boolean }) {
  const sorted = [...rivers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="border-b border-hair bg-black">
      <div className="container-app pt-16">
        <SceneHeader
          scene="05"
          kicker="River Flows"
          title={
            loading
              ? 'Reading The Gauges.'
              : sorted.length > 0
              ? `${sorted.length} Gauges, Live.`
              : 'Gauges Offline.'
          }
          meta={
            sorted[0] && (
              <>
                <LiveTag />
                <br />
                Updated {getTimeAgo(sorted[0].lastUpdated)}
                <br />
                USGS Water Services
              </>
            )
          }
        />
      </div>

      <div className="container-app py-10">
        {loading ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Reading the water gauges…
          </p>
        ) : sorted.length > 0 ? (
          <div className="border-t border-hair">
            {sorted.map((river, idx) => {
              const regsText = river.regulations
                ? [
                    river.regulations.barblesRequired && 'Barbless',
                    river.regulations.fliesOnly && 'Flies only',
                    river.regulations.catchAndRelease && 'Catch & release',
                  ]
                    .filter(Boolean)
                    .join(' · ')
                : '';

              return (
                // Flex, not a 12-col grid: at this width a col-span-2 track
                // is far too narrow to hold a flow-rate numeral on mobile.
                <div
                  key={idx}
                  className="flex flex-col gap-6 border-b border-hair py-8 md:flex-row md:items-start"
                >
                  <div className="md:w-56 md:shrink-0">
                    <div className="film-display-thin text-[22px] text-film-white">{river.name}</div>
                    <div className="mt-1 font-mono text-[11px] uppercase text-whisper">
                      {river.location}
                    </div>
                    <ConditionDot status={river.status} className="mt-3" />
                  </div>

                  <div className="flex flex-wrap gap-x-10 gap-y-4 md:w-64 md:shrink-0">
                    <div>
                      <div className="film-display text-[clamp(28px,4vw,44px)] text-film-white">
                        {river.flowRate.toLocaleString()}
                        <span className="ml-1.5 align-middle font-mono text-[11px] normal-case text-whisper">
                          cfs
                        </span>
                      </div>
                      <div className="small-caps mt-1 flex items-center gap-1.5 text-whisper">
                        <TrendIcon trend={river.flowTrend} />
                        {river.flowTrend}
                      </div>
                    </div>
                    <div>
                      <div className="film-display text-[clamp(28px,4vw,44px)] text-film-white">
                        {river.temperature ?? '—'}
                        {river.temperature !== null && (
                          <span className="ml-1.5 align-middle font-mono text-[11px] normal-case text-whisper">
                            °f
                          </span>
                        )}
                      </div>
                      <div className="small-caps mt-1 text-whisper">
                        {river.temperature !== null ? 'Water temp' : 'No temp sensor'}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 md:max-w-sm">
                    <div className="font-mono text-[11px] uppercase leading-relaxed text-mist">
                      Fishing — {river.fishingRating}
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] uppercase leading-relaxed text-mist">
                      Paddling — {river.paddlingRating}
                    </div>
                    {regsText && (
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-wide text-whisper">
                        {regsText}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Unable to load river data.
          </p>
        )}

        <p className="mt-6 font-mono text-[10px] uppercase text-whisper">
          Data from USGS National Water Information System
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 06 · SUN & LIGHT
   ═══════════════════════════════════════════════════════════════════ */

function SunScene({ sunTimes }: { sunTimes: ReturnType<typeof calculateSunTimes> }) {
  return (
    <section className="border-b border-hair bg-film-deep">
      <div className="container-app pt-16">
        <SceneHeader
          scene="06"
          kicker="Sun & Light"
          title={`${sunTimes.dayLength} Of Daylight.`}
          meta={
            <>
              Bend, Oregon
              <br />
              44.06°N · 121.32°W
            </>
          }
        />
      </div>

      <div className="container-app py-10">
        <div className="grid grid-cols-2 divide-x divide-y divide-hair border border-hair md:grid-cols-4 md:divide-y-0">
          <DataCell label="Sunrise" value={sunTimes.sunrise} className="text-[clamp(26px,3.5vw,44px)]" />
          <DataCell label="Sunset" value={sunTimes.sunset} className="text-[clamp(26px,3.5vw,44px)]" />
          <DataCell
            label="Golden hour · AM"
            value={sunTimes.goldenHourMorning}
            className="text-[clamp(26px,3.5vw,44px)]"
          />
          <DataCell
            label="Golden hour · PM"
            value={sunTimes.goldenHourEvening}
            className="text-[clamp(26px,3.5vw,44px)]"
          />
        </div>

        <div className="mt-6 border-t border-hair pt-6">
          <StatRow label="Day length" value={sunTimes.dayLength} />
          <StatRow label="Civil twilight ends" value={sunTimes.civilTwilightEnd} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 07 · ROAD CONDITIONS
   ═══════════════════════════════════════════════════════════════════ */

function roadConditionStatus(status: RoadCondition['status']): ConditionStatus {
  if (status === 'open') return 'good';
  if (status === 'chains-required') return 'moderate';
  return 'closed';
}

const roadStatusLabel: Record<RoadCondition['status'], string> = {
  open: 'Open',
  'chains-required': 'Chains required',
  closed: 'Closed',
};

function RoadsScene({ roads, loading }: { roads: RoadCondition[]; loading: boolean }) {
  return (
    <section className="border-b border-hair bg-black">
      <div className="container-app pt-16">
        <SceneHeader
          scene="07"
          kicker="Road Conditions"
          title={loading ? 'Reading The Passes.' : `${roads.length} Passes Tracked.`}
          meta={
            roads[0] && (
              <>
                Seasonal schedule — not live
                <br />
                <a
                  href="https://tripcheck.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember"
                >
                  Verify on TripCheck ↗
                </a>
              </>
            )
          }
        />
      </div>

      <div className="container-app py-10">
        {loading ? (
          <p className="border-t border-hair py-10 font-mono text-[12px] text-whisper">
            Reading the passes…
          </p>
        ) : (
          <div className="border-t border-hair">
            {roads.map((road, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 border-b border-hair py-6 md:flex-row md:items-center md:justify-between md:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="film-display-thin text-[20px] text-film-white">{road.name}</span>
                    <span className="font-mono text-[11px] text-whisper">{road.route}</span>
                  </div>
                  <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-mist">{road.conditions}</p>
                  <div className="mt-1 font-mono text-[10px] uppercase text-whisper">
                    {road.elevation.toLocaleString()} ft
                  </div>
                </div>
                <ConditionDot
                  status={roadConditionStatus(road.status)}
                  label={roadStatusLabel[road.status]}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 08 · DOWNTOWN PARKING
   ═══════════════════════════════════════════════════════════════════ */

/** Real zones, described in terms we can stand behind without a sensor. */
const PARKING_ZONES = [
  { name: 'Downtown Core', note: 'Metered · 2hr limit' },
  { name: 'Old Mill District', note: 'Free lots · large' },
  { name: 'Box Factory', note: 'Free · fills early on weekends' },
];

function ParkingScene() {
  return (
    <section className="border-b border-hair bg-film-coal">
      <div className="container-app pt-16">
        <SceneHeader
          scene="08"
          kicker="Downtown Parking"
          title="Where To Look."
          meta={
            <>
              No live count
              <br />
              Zones and their habits
            </>
          }
        />
      </div>

      <div className="container-app py-10">
        {/* This scene used to render "108 / 120 open" per zone, with a fill
            bar and a trend arrow, off a hardcoded fixture. The header said
            "typical patterns", but a precise count next to a fill bar reads
            as a measurement no matter what the header says — and nothing was
            measured. Bend publishes no parking-occupancy feed.

            The zones are real and knowing where to aim is genuinely useful,
            so they stay, described in the terms we can actually stand
            behind. */}
        <div className="border-t border-hair">
          {PARKING_ZONES.map((zone) => (
            <div
              key={zone.name}
              className="flex flex-col gap-2 border-b border-hair py-6 md:flex-row md:items-baseline md:justify-between md:gap-6"
            >
              <span className="film-display-thin text-[20px] text-film-white">{zone.name}</span>
              <span className="font-mono text-[11px] normal-case text-whisper md:text-right">
                {zone.note}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-xl font-mono text-[11px] text-whisper">
          There is no live count for these lots. If the city ever publishes
          one, it belongs here — until then this is just where to look.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER NOTE
   ═══════════════════════════════════════════════════════════════════ */

function FooterNote() {
  return (
    <div className="container-app py-14 text-center">
      <p className="font-mono text-[11px] uppercase tracking-wide text-whisper">
        Data sources — USGS Water Services · Open-Meteo Air Quality API · NIFC WFIGS · Mt.
        Bachelor · TripCheck
      </p>
      <p className="mt-2 font-mono text-[10px] text-whisper">
        River and air quality data updates automatically. Always verify conditions before heading
        out.
      </p>
    </div>
  );
}
