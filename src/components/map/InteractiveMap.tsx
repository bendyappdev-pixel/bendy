import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { locations } from '../../data/locations';
import { Location, CrowdLevel, CrowdReport } from '../../types';
import { useCrowdReports } from '../../hooks/useCrowdReports';
import { crowdMeta } from '../ui/CrowdBadge';
import { coordinatesForSpot } from '../../utils/spotCoordinates';
import { AlertCircle } from 'lucide-react';

/**
 * Location categories. The emoji glyphs the old markers used are gone — the
 * design system bans emoji in UI — so each type is now a colour drawn from
 * the film palette's functional secondaries plus a plain text label.
 */
const typeConfig: Record<Location['type'], { color: string; label: string }> = {
  park: { color: 'var(--pine)', label: 'Parks' },
  'dog-park': { color: 'var(--gold)', label: 'Dog Parks' },
  trailhead: { color: 'var(--ember)', label: 'Trailheads' },
  ski: { color: 'var(--lake)', label: 'Ski Areas' },
  brewery: { color: 'var(--gold)', label: 'Breweries' },
  restaurant: { color: 'var(--flame)', label: 'Restaurants' },
  venue: { color: 'var(--ember)', label: 'Venues' },
  recreation: { color: 'var(--lake)', label: 'Recreation' },
  family: { color: 'var(--lake)', label: 'Family Fun' },
  museum: { color: 'var(--pine)', label: 'Museums' },
};

const DEFAULT_CENTER: [number, number] = [-121.3153, 44.0582];
const DEFAULT_ZOOM = 12;

/** Escapes interpolated data before it goes into marker/popup innerHTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface InteractiveMapProps {
  /** Tailwind height or aspect class for the canvas. */
  height?: string;
  /** Overlay live crowd reports as plain-language pins. */
  showCrowdPins?: boolean;
  /** Show the location-type filter chips. */
  showFilters?: boolean;
  /** Called when a crowd pin is clicked (the field-map drawer hooks in here). */
  onCrowdPinClick?: (report: CrowdReport) => void;
  className?: string;
}

export default function InteractiveMap({
  height = 'h-[600px]',
  showCrowdPins = false,
  showFilters = true,
  onCrowdPinClick,
  className,
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const crowdMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<Location['type']>>(
    new Set([
      'park',
      'dog-park',
      'trailhead',
      'ski',
      'brewery',
      'venue',
      'recreation',
      'family',
      'museum',
    ])
  );

  const { reports } = useCrowdReports();

  const toggleFilter = (type: Location['type']) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setError('Mapbox token not found. Add VITE_MAPBOX_TOKEN to your .env file.');
      return;
    }

    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        // Dark style — the outdoors style fought the film palette badly.
        style: 'mapbox://styles/mapbox/dark-v11',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        // One-finger pan trapped page scroll on touch — a swipe landing on
        // the canvas moved the map, not the page. Cooperative mode requires
        // two fingers on touch (Ctrl/⌘+scroll on desktop) and overlays its
        // own hint when a single finger tries.
        cooperativeGestures: true,
      });

      mapRef.current = map;

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        'top-right'
      );

      map.on('load', () => setIsLoaded(true));
      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(e.error?.message || 'Map failed to load');
      });
    } catch (err) {
      console.error('Map initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Location markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    markersRef.current = locations
      .filter((location) => activeFilters.has(location.type))
      .map((location) => {
        const config = typeConfig[location.type];

        // The dot stays 12px; the 28px wrapper is the tap target — a bare
        // 12px span was nearly impossible to hit on a phone.
        const el = document.createElement('div');
        el.style.cssText =
          'width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;';
        el.innerHTML = `
          <span style="
            display:block;
            width:12px;
            height:12px;
            border-radius:9999px;
            background:${config.color};
            box-shadow:0 0 10px ${config.color};
            border:1px solid rgba(7,6,5,0.8);
          "></span>
        `;

        const popup = new mapboxgl.Popup({
          offset: 16,
          closeButton: true,
          maxWidth: '280px',
        }).setHTML(`
          <div style="padding:14px; min-width:200px; font-family:'JetBrains Mono', monospace;">
            <div style="
              font-family:Archivo, system-ui, sans-serif;
              font-weight:500; line-height:1.05; letter-spacing:-0.01em;
              font-size:20px; color:#f2ede1; margin-bottom:6px;
            ">${esc(location.name)}</div>
            <div style="
              font-size:10px; letter-spacing:0.22em; text-transform:uppercase;
              color:${config.color}; margin-bottom:8px;
            ">${esc(config.label)}</div>
            <p style="font-size:12px; line-height:1.5; color:rgba(242,237,225,0.65); margin:0;">
              ${esc(location.description)}
            </p>
            ${
              location.amenities?.length
                ? `<p style="font-size:11px; color:rgba(242,237,225,0.40); margin:10px 0 0;">
                     ${esc(location.amenities.join(' · '))}
                   </p>`
                : ''
            }
            ${
              location.website
                ? `<a href="${esc(location.website)}" target="_blank" rel="noopener noreferrer"
                     style="display:inline-block; margin-top:10px; color:#c9a06b;
                            font-size:11px; letter-spacing:0.18em; text-transform:uppercase;">
                     Visit site →
                   </a>`
                : ''
            }
          </div>
        `);

        return new mapboxgl.Marker(el).setLngLat(location.coordinates).setPopup(popup).addTo(map);
      });
  }, [isLoaded, activeFilters]);

  // Crowd pins — dot plus a plain-language status card
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    crowdMarkersRef.current.forEach((marker) => marker.remove());
    crowdMarkersRef.current = [];

    if (!showCrowdPins) return;

    // One pin per place: the freshest report wins.
    const freshest = new Map<string, (typeof reports)[number]>();
    reports.forEach((report) => {
      const existing = freshest.get(report.locationId);
      if (!existing || report.timestamp > existing.timestamp) {
        freshest.set(report.locationId, report);
      }
    });

    crowdMarkersRef.current = [...freshest.values()]
      .map((report) => {
        const coords = coordinatesForSpot(report.locationId);
        if (!coords) return null;

        const meta = crowdMeta(report.crowdLevel as CrowdLevel);
        const el = document.createElement('div');
        el.style.cursor = 'pointer';
        el.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="
              flex:none; width:12px; height:12px; border-radius:9999px;
              background:${meta.color}; box-shadow:0 0 12px ${meta.color};
            "></span>
            <div style="
              background:rgba(0,0,0,0.75);
              border:1px solid rgba(242,237,225,0.15);
              padding:6px 10px; line-height:1.15;
            ">
              <div style="
                font-family:Archivo, system-ui, sans-serif; font-weight:500;
                font-size:14px; letter-spacing:-0.01em; color:#f2ede1;
              ">${esc(report.locationName)}</div>
              <div style="
                font-family:'JetBrains Mono', monospace; font-size:9px; color:${meta.color};
              ">${esc(meta.full)}</div>
            </div>
          </div>
        `;

        if (onCrowdPinClick) {
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onCrowdPinClick(report);
          });
        }

        return new mapboxgl.Marker({ element: el, anchor: 'left' })
          .setLngLat(coords)
          .addTo(map);
      })
      .filter((m): m is mapboxgl.Marker => m !== null);
  }, [isLoaded, showCrowdPins, reports, onCrowdPinClick]);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-hair bg-film-deep p-8 ${height} ${
          className ?? ''
        }`}
      >
        <AlertCircle className="mb-4 h-8 w-8 text-ember" aria-hidden="true" />
        <h3 className="film-display-thin mb-2 text-[28px] text-film-white">Map Unavailable</h3>
        <p className="mb-4 max-w-md text-center font-mono text-[12px] text-mist">{error}</p>
        <div className="border border-hair p-4 font-mono text-[11px] text-whisper">
          <p>1. Create a free account at mapbox.com</p>
          <p>2. Copy your public access token</p>
          <p>3. Create a .env file with:</p>
          <p className="text-ember">VITE_MAPBOX_TOKEN=your_token_here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Filter rail: part of the map's frame, never floating over the
          photography/canvas. Text chips carry no individual boxes — the rail's
          single hairline does the work, and labels stay visible at every width
          (the row wraps rather than hiding meaning behind bare dots). */}
      {showFilters && (
        <div className="flex flex-wrap gap-x-1 border-b border-hair bg-black px-2">
          {Object.entries(typeConfig).map(([type, config]) => {
            const active = activeFilters.has(type as Location['type']);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type as Location['type'])}
                aria-pressed={active}
                className={`small-caps flex items-center gap-2 whitespace-nowrap px-2.5 py-2.5 min-h-[44px] transition-colors ${
                  active ? 'text-ember' : 'text-whisper hover:text-film-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: config.color, opacity: active ? 1 : 0.4 }}
                />
                {config.label}
              </button>
            );
          })}
        </div>
      )}

      <div ref={mapContainer} className={`${height} overflow-hidden`} />

      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-film-deep">
          <p className="small-caps text-whisper">Loading map…</p>
        </div>
      )}
    </div>
  );
}
