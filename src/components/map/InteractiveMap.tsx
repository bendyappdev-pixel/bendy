import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { locations } from '../../data/locations';
import { Location } from '../../types';
import { AlertCircle } from 'lucide-react';

const typeConfig: Record<Location['type'], { emoji: string; color: string; label: string }> = {
  park: { emoji: '🌲', color: '#2D5016', label: 'Parks' },
  'dog-park': { emoji: '🐕', color: '#F59E0B', label: 'Dog Parks' },
  trailhead: { emoji: '🥾', color: '#8B7355', label: 'Trailheads' },
  ski: { emoji: '⛷️', color: '#4A6FA5', label: 'Ski Areas' },
  brewery: { emoji: '🍺', color: '#D97706', label: 'Breweries' },
  restaurant: { emoji: '🍽️', color: '#DC2626', label: 'Restaurants' },
  venue: { emoji: '🎵', color: '#7C3AED', label: 'Venues' },
  recreation: { emoji: '🏊', color: '#0891B2', label: 'Recreation' },
  family: { emoji: '👨‍👩‍👧‍👦', color: '#A855F7', label: 'Family Fun' },
  museum: { emoji: '🏛️', color: '#6366F1', label: 'Museums' },
};

const DEFAULT_CENTER: [number, number] = [-121.3153, 44.0582];
const DEFAULT_ZOOM = 12;

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<Location['type']>>(
    new Set(['park', 'dog-park', 'trailhead', 'ski', 'brewery', 'venue', 'recreation', 'family', 'museum'])
  );

  const toggleFilter = (type: Location['type']) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
      setError('Mapbox token not found. Please add VITE_MAPBOX_TOKEN to your .env file.');
      return;
    }

    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
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

      map.on('load', () => {
        setIsLoaded(true);
      });

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

  // Update markers when filters change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for filtered locations
    const newMarkers = locations
      .filter((location) => activeFilters.has(location.type))
      .map((location) => {
        const config = typeConfig[location.type];

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = `
          <div style="
            background: ${config.color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            border: 2px solid white;
          ">
            ${config.emoji}
          </div>
        `;

        // Create popup content
        const popupContent = `
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${location.name}</h3>
            <p style="color: #666; font-size: 13px; margin-bottom: 8px;">${location.description}</p>
            ${location.amenities ? `
              <div style="margin-top: 8px;">
                <p style="font-size: 12px; color: #888; margin-bottom: 4px;">Amenities:</p>
                <p style="font-size: 12px; color: #666;">${location.amenities.join(', ')}</p>
              </div>
            ` : ''}
            ${location.website ? `
              <a href="${location.website}" target="_blank" rel="noopener noreferrer"
                 style="display: inline-block; margin-top: 8px; color: #4A6FA5; font-size: 13px; text-decoration: none;">
                Visit Website →
              </a>
            ` : ''}
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          maxWidth: '280px',
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map);

        return marker;
      });

    markersRef.current = newMarkers;
  }, [isLoaded, activeFilters]);

  if (error) {
    return (
      <div className="h-[600px] bg-sand rounded-2xl flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Map Unavailable</h3>
        <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700 font-mono">
          <p>1. Create a free account at mapbox.com</p>
          <p>2. Copy your public access token</p>
          <p>3. Create a .env file with:</p>
          <p className="text-forest">VITE_MAPBOX_TOKEN=your_token_here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Filter Toggles */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-lg p-3 max-w-[calc(100%-2rem)] overflow-x-auto">
        <div className="flex gap-2">
          {Object.entries(typeConfig).map(([type, config]) => (
            <button
              key={type}
              onClick={() => toggleFilter(type as Location['type'])}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilters.has(type as Location['type'])
                  ? 'bg-forest text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{config.emoji}</span>
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="h-[600px] rounded-2xl overflow-hidden"
        style={{ minHeight: '400px' }}
      />

      {/* Loading State */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-sand rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
