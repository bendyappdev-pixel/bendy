import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RoadCondition {
  name: string;
  route: string;
  status: 'open' | 'chains-required' | 'closed';
  conditions: string;
  elevation: number;
  lastUpdated: string;
}

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function parseRoadStatus(status: string): 'open' | 'chains-required' | 'closed' {
  const lower = status.toLowerCase();
  if (lower.includes('closed')) return 'closed';
  if (lower.includes('chain') || lower.includes('traction')) return 'chains-required';
  return 'open';
}

function getRouteElevation(name: string): number {
  const elevations: Record<string, number> = {
    'Santiam Pass': 4817,
    'McKenzie Pass': 5325,
    'Cascade Lakes Highway': 6300,
    'Newberry Crater': 6400,
  };
  return elevations[name] || 4000;
}

async function fetchTripCheckRoute(routeId: string, name: string): Promise<RoadCondition | null> {
  try {
    const response = await fetch('https://tripcheck.com/Scripts/map/data/roadConditions.json', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BendyApp/1.0)' },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as Record<string, unknown>[];

    const route = data.find(
      (r: Record<string, unknown>) =>
        String(r.routeId || '').includes(routeId) ||
        String(r.name || '').toLowerCase().includes(name.toLowerCase())
    );

    if (route) {
      return {
        name,
        route: routeId.replace(/([A-Z]+)(\d+)/, '$1-$2'),
        status: parseRoadStatus(String(route.status || '')),
        conditions: String(route.conditions || route.description || 'No current alerts'),
        elevation: getRouteElevation(name),
        lastUpdated: new Date().toISOString(),
      };
    }

    return null;
  } catch {
    return null;
  }
}

const FALLBACK_ROADS: RoadCondition[] = [
  {
    name: 'Santiam Pass',
    route: 'US-20',
    status: 'open',
    conditions: 'Check tripcheck.com for current conditions',
    elevation: 4817,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: 'McKenzie Pass',
    route: 'OR-242',
    status: 'closed',
    conditions: 'Closed for winter season (Nov-June)',
    elevation: 5325,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: 'Cascade Lakes Highway',
    route: 'OR-46',
    status: 'open',
    conditions: 'Check tripcheck.com for current conditions',
    elevation: 6300,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: 'Newberry Crater',
    route: 'FR-21',
    status: 'chains-required',
    conditions: 'Snow covered, chains or 4WD required',
    elevation: 6400,
    lastUpdated: new Date().toISOString(),
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  try {
    const roads: RoadCondition[] = [];

    const santiamCondition = await fetchTripCheckRoute('US20', 'Santiam Pass');
    if (santiamCondition) roads.push(santiamCondition);

    const cascadeCondition = await fetchTripCheckRoute('OR46', 'Cascade Lakes Highway');
    if (cascadeCondition) roads.push(cascadeCondition);

    roads.push({
      name: 'McKenzie Pass',
      route: 'OR-242',
      status: 'closed',
      conditions: 'Closed for winter season (Nov-June)',
      elevation: 5325,
      lastUpdated: new Date().toISOString(),
    });

    roads.push({
      name: 'Newberry Crater',
      route: 'FR-21',
      status: 'chains-required',
      conditions: 'Snow covered, chains or 4WD required',
      elevation: 6400,
      lastUpdated: new Date().toISOString(),
    });

    return res.status(200).json({
      roads,
      lastUpdated: new Date().toISOString(),
      source: 'tripcheck.com',
    });
  } catch (error) {
    console.error('Error fetching road conditions:', error);
    return res.status(200).json({
      roads: FALLBACK_ROADS.map((r) => ({ ...r, lastUpdated: new Date().toISOString() })),
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Live data temporarily unavailable',
    });
  }
}
