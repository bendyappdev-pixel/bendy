/**
 * Scene 01 · Title Card Hero
 *
 * A centred title card over the panorama carousel: wordmark, coordinates,
 * serif-italic tagline, one primary and one secondary CTA. The bottom
 * letterbox carries the lower-thirds (live temperature, title slate, runtime
 * and cast counts) and a scrubber marking daylight elapsed.
 *
 * There is deliberately no top letterbox bar — it was removed in review as
 * too busy against the bulletin ticker already sitting above the masthead.
 */

import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';
import { heroFrames, formatCoordinates } from '../../data/heroImages';
import { useWeather, getWeatherInfo } from '../../hooks/useWeather';
import { upcomingEvents } from '../../data/events';
import { trails } from '../../data/trails';
import { guides } from '../../data/guides';

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Los_Angeles',
  });
}

/** Hours of daylight as "10:14", plus the fraction of it already elapsed. */
function daylight(sunrise: Date, sunset: Date) {
  const totalMs = sunset.getTime() - sunrise.getTime();
  if (!Number.isFinite(totalMs) || totalMs <= 0) return null;

  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const elapsed = (Date.now() - sunrise.getTime()) / totalMs;

  return {
    length: `${hours}:${String(minutes).padStart(2, '0')}`,
    // Clamped so the playhead stays on the bar before dawn and after dusk.
    progress: Math.min(1, Math.max(0, elapsed)),
    marks: [0, 1, 2, 3].map((i) =>
      formatClock(new Date(sunrise.getTime() + (totalMs * i) / 3))
    ),
    end: formatClock(sunset),
  };
}

export default function Hero() {
  const { weather } = useWeather();
  // Count what is still to come, not the whole archive.
  const upcomingCount = useMemo(() => upcomingEvents().length, []);

  // Which panorama is on screen, so its caption tells the truth.
  const [frameIndex, setFrameIndex] = useState(0);
  const handleFrameChange = useCallback((i: number) => setFrameIndex(i), []);
  const frame = heroFrames[frameIndex];

  const conditionText = weather
    ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay).description
    : null;
  const light = weather ? daylight(weather.sunrise, weather.sunset) : null;

  return (
    <HeroCarousel
      label="PANORAMA.MOV — CENTRAL OREGON · CASCADE RANGE"
      timecode="REEL №07 · SPRING 2026"
      onFrameChange={handleFrameChange}
    >
      {/* Centre title. Bottom padding keeps it clear of the lower-thirds. */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pb-40">
        <div className="text-center">
          {/* The design reference set this as "BEND", reading it as a title
              card for the city. That is wrong for this brand: the Y is the
              point. BENDY covers Central Oregon out to roughly a 30-mile
              radius, not the city limits — the three hero panoramas were shot
              at Smith Rock, Broken Top and Sparks Lake, 19 to 23 miles out.
              So the wordmark stays BENDY.

              The scale is tuned to five letters, not four: at the reference's
              22vw the extra character ran off the side of wide screens. */}
          <h1
            className="film-display text-[clamp(88px,17.5vw,272px)] tracking-[-0.02em] text-film-white"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
          >
            BENDY
          </h1>
          {/* Captions the frame actually on screen. Pinning Bend's own
              coordinates here was wrong twice over: none of these panoramas
              were shot in Bend, and the brand covers the region rather than
              the city. Full white, not /80 — at 10.5px over a sunlit
              photograph the dimmed version disappeared. */}
          <p
            className="small-caps mt-8 text-film-white"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}
          >
            {frame
              ? `${frame.location} · ${formatCoordinates(frame)} · ${frame.milesFromBend} mi from Bend`
              : 'Central Oregon · 44.0582° N · 121.3153° W'}
          </p>
          <p
            className="serif-i mx-auto mt-6 max-w-2xl text-[24px] leading-snug text-film-white md:text-[34px]"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            Everything worth doing in Central Oregon —{' '}
            <span className="text-[#f0d9c4]">curated by people who actually live here.</span>
          </p>
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3">
            <Link to="/conditions" className="btn-primary">
              <span aria-hidden="true">▶</span>
              <span>Roll the almanac</span>
            </Link>
            <Link to="/guides" className="btn-secondary">
              Browse sequences
            </Link>
          </div>
        </div>
      </div>

      {/* Lower-thirds */}
      <div className="letterbox absolute bottom-0 left-0 right-0 z-20">
        <div className="grid grid-cols-12 items-center gap-6 px-6 py-5 lg:px-10">
          <div className="col-span-12 flex items-center gap-5 md:col-span-4">
            {weather && (
              <div className="film-display text-[64px] leading-none text-film-white">
                {Math.round(weather.current.temperature)}°
              </div>
            )}
            <div className="text-mist">
              <div className="small-caps text-ember">Now in Bend</div>
              <div className="serif-i mt-1 text-[20px] leading-tight text-film-white">
                {conditionText ?? 'Reading the sky…'}
              </div>
              {weather && (
                <div className="mt-1 font-mono text-[11px] text-whisper">
                  SUNRISE {formatClock(weather.sunrise)} · SUNSET {formatClock(weather.sunset)}{' '}
                  · WIND {Math.round(weather.current.windSpeed)} MPH
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 hidden text-center md:col-span-4 md:block">
            <div className="small-caps text-whisper">Title Slate</div>
            <div className="film-display-thin mt-1 text-[28px] text-film-white">
              A Field Guide to Central Oregon
            </div>
            <div className="small-caps mt-1 text-whisper">Reel №07 · Spring 2026</div>
          </div>

          <div className="col-span-12 flex flex-col gap-4 text-mist sm:flex-row sm:gap-8 md:col-span-4 md:justify-end">
            <div>
              <div className="small-caps text-whisper">Runtime</div>
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                {light ? `${light.length} hrs of light` : '—'}
              </div>
            </div>
            <div>
              <div className="small-caps text-whisper">Cast</div>
              {/* The cast counts double as navigation — the numbers people
                  already read are the fastest route to each section. */}
              <div className="film-display-thin mt-1 text-[22px] text-film-white">
                <Link to="/events" className="text-film-white transition-colors hover:text-ember">
                  {upcomingCount} events
                </Link>
                {' · '}
                <Link to="/trails" className="text-film-white transition-colors hover:text-ember">
                  {trails.length} trails
                </Link>
                {' · '}
                <Link to="/guides" className="text-film-white transition-colors hover:text-ember">
                  {guides.length} guides
                </Link>
              </div>
            </div>
          </div>
        </div>

        {light && (
          <div className="px-6 pb-3 lg:px-10">
            <div className="scrubber">
              <i style={{ left: `${(light.progress * 100).toFixed(1)}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-whisper">
              {light.marks.map((m) => (
                <span key={m}>{m}</span>
              ))}
              <span>{light.end}</span>
            </div>
          </div>
        )}
      </div>
    </HeroCarousel>
  );
}
