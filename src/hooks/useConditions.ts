import { useState, useEffect, useCallback } from 'react';
import {
  MountainConditions,
  RiverConditions,
  AirQuality,
  RoadCondition,
  ConditionStatus,
} from '../types/conditions';
import {
  mockMountainConditions,
  mockRoadConditions,
} from '../data/conditions';

// USGS Site IDs for Central Oregon rivers
const USGS_SITES = {
  deschutesAtBend: '14064500',
  deschutesBelowWickiup: '14056500',
  metolius: '14091500',
};

// Bend, OR coordinates for weather APIs
const BEND_COORDS = { lat: 44.0582, lng: -121.3153 };

interface USGSResponse {
  value: {
    timeSeries: Array<{
      sourceInfo: {
        siteName: string;
        geoLocation: {
          geogLocation: { latitude: number; longitude: number };
        };
      };
      variable: {
        variableName: string;
        unit: { unitCode: string };
      };
      values: Array<{
        value: Array<{
          value: string;
          dateTime: string;
        }>;
      }>;
    }>;
  };
}

interface OpenMeteoAirQualityResponse {
  current: {
    time: string;
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
  };
}

// Fetch river data from USGS
export function useRiverConditions() {
  const [rivers, setRivers] = useState<RiverConditions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRiverData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch discharge (cfs) and temperature for multiple sites
      const siteIds = Object.values(USGS_SITES).join(',');
      const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteIds}&parameterCd=00060,00010&siteStatus=active`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch USGS data');

      const data: USGSResponse = await response.json();

      // Parse the response
      const riverData: Map<string, Partial<RiverConditions>> = new Map();

      data.value.timeSeries.forEach((series) => {
        const siteName = series.sourceInfo.siteName;
        const variableName = series.variable.variableName;
        const latestValue = series.values[0]?.value[0];

        if (!latestValue) return;

        // Get or create river entry
        let river = riverData.get(siteName);
        if (!river) {
          river = {
            name: getShortenedName(siteName),
            location: getLocationFromSiteName(siteName),
            lastUpdated: new Date(latestValue.dateTime),
            status: 'good' as ConditionStatus,
            fishingRating: '',
            paddlingRating: '',
            flowTrend: 'stable',
          };
          riverData.set(siteName, river);
        }

        // Parse discharge (streamflow)
        if (variableName.toLowerCase().includes('discharge') || variableName.toLowerCase().includes('streamflow')) {
          const flowRate = parseFloat(latestValue.value);
          river.flowRate = Math.round(flowRate);
          river.status = getFlowStatus(flowRate, siteName);
          river.fishingRating = getFishingRating(flowRate, siteName);
          river.paddlingRating = getPaddlingRating(flowRate, siteName);
        }

        // Parse temperature
        if (variableName.toLowerCase().includes('temperature')) {
          // USGS reports in Celsius, convert to Fahrenheit
          const tempC = parseFloat(latestValue.value);
          river.temperature = Math.round(tempC * 9/5 + 32);
        }
      });

      // Convert to array and filter out incomplete entries
      const riversArray = Array.from(riverData.values())
        .filter((r): r is RiverConditions =>
          r.flowRate !== undefined && r.name !== undefined
        )
        .map(r => ({
          ...r,
          temperature: r.temperature || 50, // Default if no temp sensor
          flowTrend: 'stable' as const, // Would need historical data for trend
        }));

      setRivers(riversArray.length > 0 ? riversArray : getFallbackRiverData());
    } catch (err) {
      console.error('Error fetching river data:', err);
      setError('Unable to fetch live river data');
      setRivers(getFallbackRiverData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiverData();
    // Refresh every 15 minutes
    const interval = setInterval(fetchRiverData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRiverData]);

  return { rivers, loading, error, refresh: fetchRiverData };
}

// Fetch air quality from Open-Meteo (free, no API key)
export function useAirQuality() {
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAirQuality = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${BEND_COORDS.lat}&longitude=${BEND_COORDS.lng}&current=us_aqi,pm2_5,pm10,ozone&timezone=America/Los_Angeles`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch air quality data');

      const data: OpenMeteoAirQualityResponse = await response.json();

      const aqi = data.current.us_aqi;
      const { category, status, healthMessage } = getAQIInfo(aqi);

      setAirQuality({
        aqi,
        category,
        primaryPollutant: data.current.pm2_5 > data.current.ozone ? 'PM2.5' : 'Ozone',
        healthMessage,
        status,
        forecast: getForecastMessage(aqi),
        lastUpdated: new Date(data.current.time),
      });
    } catch (err) {
      console.error('Error fetching air quality:', err);
      setError('Unable to fetch live air quality data');
      setAirQuality(getFallbackAirQuality());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirQuality();
    // Refresh every hour
    const interval = setInterval(fetchAirQuality, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAirQuality]);

  return { airQuality, loading, error, refresh: fetchAirQuality };
}

// Mt. Bachelor - fetches from our Firebase Function proxy
export function useMountainConditions() {
  const [conditions, setConditions] = useState<MountainConditions>(mockMountainConditions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConditions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/mt-bachelor');
      if (!response.ok) throw new Error('Failed to fetch Mt. Bachelor conditions');

      const data = await response.json();

      setConditions({
        snowDepthBase: data.snowDepthBase,
        snowDepthSummit: data.snowDepthSummit,
        newSnow24h: data.newSnow24h,
        newSnow48h: data.newSnow48h,
        liftsOpen: data.liftsOpen,
        liftsTotal: data.liftsTotal,
        terrainOpen: data.terrainOpen,
        conditions: data.conditions,
        lastUpdated: new Date(data.lastUpdated),
      });
    } catch (err) {
      console.error('Error fetching Mt. Bachelor conditions:', err);
      setError('Unable to fetch live conditions');
      // Keep mock data as fallback
      setConditions({
        ...mockMountainConditions,
        lastUpdated: new Date(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConditions();
    // Refresh every hour
    const interval = setInterval(fetchConditions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchConditions]);

  return { conditions, loading, error, refresh: fetchConditions };
}

// Road conditions - fetches from our Firebase Function proxy
export function useRoadConditions() {
  const [roads, setRoads] = useState<RoadCondition[]>(mockRoadConditions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/roads');
      if (!response.ok) throw new Error('Failed to fetch road conditions');

      const data = await response.json();

      if (data.roads && Array.isArray(data.roads)) {
        setRoads(data.roads.map((road: RoadCondition & { lastUpdated: string }) => ({
          ...road,
          lastUpdated: new Date(road.lastUpdated),
        })));
      }
    } catch (err) {
      console.error('Error fetching road conditions:', err);
      setError('Unable to fetch live road conditions');
      // Keep mock data as fallback
      setRoads(mockRoadConditions.map(road => ({
        ...road,
        lastUpdated: new Date(),
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoads();
    // Refresh every 30 minutes
    const interval = setInterval(fetchRoads, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRoads]);

  return { roads, loading, error, refresh: fetchRoads };
}

// Helper functions
function getShortenedName(siteName: string): string {
  if (siteName.toLowerCase().includes('metolius')) return 'Metolius River';
  if (siteName.toLowerCase().includes('deschutes')) return 'Deschutes River';
  return siteName.split(' ').slice(0, 2).join(' ');
}

function getLocationFromSiteName(siteName: string): string {
  // Extract location from USGS site name
  const parts = siteName.split(',')[0];
  if (parts.toLowerCase().includes('at bend')) return 'At Bend';
  if (parts.toLowerCase().includes('below wickiup')) return 'Below Wickiup Dam';
  if (parts.toLowerCase().includes('near grandview')) return 'Near Camp Sherman';
  // Return last part of name before comma
  const match = siteName.match(/(?:at|near|below|above)\s+([^,]+)/i);
  return match ? match[0] : 'Central Oregon';
}

function getFlowStatus(flowRate: number, siteName: string): ConditionStatus {
  // Optimal ranges vary by river section
  if (siteName.toLowerCase().includes('bend')) {
    if (flowRate >= 800 && flowRate <= 2000) return 'good';
    if (flowRate >= 500 && flowRate <= 3000) return 'moderate';
    return 'poor';
  }
  // Default ranges
  if (flowRate >= 500 && flowRate <= 2500) return 'good';
  if (flowRate >= 200 && flowRate <= 4000) return 'moderate';
  return 'poor';
}

function getFishingRating(flowRate: number, _siteName: string): string {
  if (flowRate < 400) return 'Low flows - fish stressed';
  if (flowRate > 3000) return 'High flows - difficult wading';
  if (flowRate >= 800 && flowRate <= 1800) return 'Excellent - optimal flows';
  return 'Good - fishable conditions';
}

function getPaddlingRating(flowRate: number, riverName: string): string {
  if (riverName.toLowerCase().includes('metolius')) {
    return 'Not recommended - cold, swift';
  }
  if (flowRate < 600) return 'Low - watch for rocks';
  if (flowRate > 2500) return 'High - experienced only';
  if (flowRate >= 1000 && flowRate <= 2000) return 'Ideal for all levels';
  return 'Good conditions';
}

function getAQIInfo(aqi: number): { category: string; status: ConditionStatus; healthMessage: string } {
  if (aqi <= 50) {
    return {
      category: 'Good',
      status: 'good',
      healthMessage: 'Air quality is satisfactory. Enjoy outdoor activities!',
    };
  }
  if (aqi <= 100) {
    return {
      category: 'Moderate',
      status: 'moderate',
      healthMessage: 'Acceptable air quality. Unusually sensitive people should limit prolonged outdoor exertion.',
    };
  }
  if (aqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      status: 'moderate',
      healthMessage: 'Sensitive groups should reduce prolonged outdoor exertion.',
    };
  }
  if (aqi <= 200) {
    return {
      category: 'Unhealthy',
      status: 'poor',
      healthMessage: 'Everyone should reduce prolonged outdoor exertion.',
    };
  }
  return {
    category: 'Very Unhealthy',
    status: 'poor',
    healthMessage: 'Avoid prolonged outdoor exertion. Stay indoors if possible.',
  };
}

function getForecastMessage(currentAqi: number): string {
  if (currentAqi <= 50) return 'Good air quality expected to continue';
  if (currentAqi <= 100) return 'Moderate conditions, monitor for changes';
  return 'Check local advisories for updates';
}

function getFallbackRiverData(): RiverConditions[] {
  return [
    {
      name: 'Deschutes River',
      location: 'At Bend',
      flowRate: 1200,
      flowTrend: 'stable',
      temperature: 50,
      status: 'good',
      fishingRating: 'Data unavailable',
      paddlingRating: 'Data unavailable',
      lastUpdated: new Date(),
    },
  ];
}

function getFallbackAirQuality(): AirQuality {
  return {
    aqi: 35,
    category: 'Good',
    primaryPollutant: 'PM2.5',
    healthMessage: 'Live data temporarily unavailable',
    status: 'good',
    forecast: 'Check airnow.gov for current conditions',
    lastUpdated: new Date(),
  };
}
