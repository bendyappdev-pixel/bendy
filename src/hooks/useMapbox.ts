import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapboxOptions {
  center?: [number, number];
  zoom?: number;
}

const DEFAULT_CENTER: [number, number] = [-121.3153, 44.0582];
const DEFAULT_ZOOM = 12;

export function useMapbox(options: UseMapboxOptions = {}) {
  const center = options.center ?? DEFAULT_CENTER;
  const zoom = options.zoom ?? DEFAULT_ZOOM;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

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
        center,
        zoom,
      });

      mapInstance.current = map;

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
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return { mapContainer, map: mapInstance.current, isLoaded, error };
}
