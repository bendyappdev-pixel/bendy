/**
 * BulletinTicker — the live-data bar that sits above the masthead.
 *
 * A static "REC · Field Bulletin" slug with a pulsing ember dot, then a mono
 * ticker of real conditions scrolling right-to-left. The content is rendered
 * twice inside the scrolling element and the animation translates -50%, which
 * is what makes the loop seamless.
 */

import { useMemo } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useMountainConditions, useRiverConditions, useFireIncidents } from '../../hooks/useConditions';
import { useCrowdReports } from '../../hooks/useCrowdReports';
import { crowdMeta } from '../ui/CrowdBadge';
import { CrowdLevel } from '../../types';

interface TickerItem {
  key: string;
  text: string;
  /** Optional leading glyph, coloured. */
  glyph?: string;
  glyphColor?: string;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Los_Angeles',
  });
}

export default function BulletinTicker() {
  const { weather } = useWeather();
  const { conditions: mountain } = useMountainConditions();
  const { rivers } = useRiverConditions();
  const { significant: fires } = useFireIncidents();
  const { reports } = useCrowdReports();

  const items = useMemo<TickerItem[]>(() => {
    const out: TickerItem[] = [
      { key: 'coords', text: '44.0582°N · 121.3153°W', glyph: '▲', glyphColor: 'var(--ember)' },
      {
        key: 'date',
        text: new Date()
          .toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase(),
      },
    ];

    if (weather) {
      out.push({
        key: 'sun',
        text: `SUNRISE ${formatClock(weather.sunrise)} · SUNSET ${formatClock(weather.sunset)}`,
      });
      out.push({
        key: 'temp',
        text: `BEND · ${Math.round(weather.current.temperature)}°F · WIND ${Math.round(
          weather.current.windSpeed
        )} MPH`,
      });
    }

    if (mountain) {
      out.push({
        key: 'bachelor',
        text: `MT BACHELOR · BASE ${mountain.snowDepthBase}" · ${mountain.liftsOpen}/${mountain.liftsTotal} LIFTS`,
      });
    }

    // Largest active fire, when one is significant — real WFIGS data only.
    const fire = fires[0];
    if (fire && fire.acres !== null) {
      out.push({
        key: 'fire',
        text: `FIRE · ${fire.name.toUpperCase()} · ${fire.acres.toLocaleString()} AC${
          fire.percentContained !== null ? ` · ${fire.percentContained}% CONTAINED` : ''
        }`,
        glyph: '●',
        glyphColor: 'var(--flame)',
      });
    }

    const deschutes = rivers.find((r) => /deschutes/i.test(r.name)) ?? rivers[0];
    if (deschutes) {
      const temp = deschutes.temperature !== null ? ` · ${Math.round(deschutes.temperature)}°F` : '';
      out.push({
        key: 'river',
        text: `${deschutes.name.toUpperCase()} (${deschutes.location.toUpperCase()})${temp} · ${deschutes.flowRate.toLocaleString()} CFS`,
      });
    }

    // Most recent community reports, freshest first.
    reports.slice(0, 4).forEach((report, i) => {
      const meta = crowdMeta(report.crowdLevel as CrowdLevel);
      out.push({
        key: `crowd-${report.id ?? i}`,
        text: `${report.locationName.toUpperCase()} · ${meta.label.toUpperCase()}`,
        glyph: '●',
        glyphColor: meta.color,
      });
    });

    out.push({ key: 'tune', text: '▲ TUNE IN ▲', glyphColor: 'var(--ember)' });
    return out;
  }, [weather, mountain, rivers, fires, reports]);

  // Rendered twice — the -50% translate in the `ticker` keyframes assumes it.
  const run = (pass: string) =>
    items.map((item) => (
      <span key={`${pass}-${item.key}`}>
        {item.glyph && <span style={{ color: item.glyphColor }}>{item.glyph} </span>}
        <span style={item.key === 'tune' ? { color: 'var(--ember)' } : undefined}>
          {item.text}
        </span>
      </span>
    ));

  return (
    <div className="relative z-50 overflow-hidden border-b border-hair bg-black">
      <div className="flex items-center">
        <div className="rec small-caps shrink-0 border-r border-hair px-4 py-2.5 text-mist">
          REC · Field Bulletin
        </div>
        {/* min-w-0 is load-bearing: a flex item defaults to min-width:auto,
            so without it this refuses to shrink below the ticker's (very
            wide) content and pushes the whole document into h-scroll. */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="ticker inline-flex gap-10 py-2.5 pl-6 font-mono text-[11px] tracking-[0.18em] text-mist"
            aria-hidden="true"
          >
            {run('a')}
            {run('b')}
          </div>
        </div>
      </div>
    </div>
  );
}
