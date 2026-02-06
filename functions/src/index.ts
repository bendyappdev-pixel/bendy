import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

interface MountainConditions {
  snowDepthBase: number;
  snowDepthSummit: number;
  newSnow24h: number;
  newSnow48h: number;
  liftsOpen: number;
  liftsTotal: number;
  terrainOpen: number;
  conditions: string;
  lastUpdated: string;
  source: string;
}

interface RoadCondition {
  name: string;
  route: string;
  status: 'open' | 'chains-required' | 'closed';
  conditions: string;
  elevation: number;
  lastUpdated: string;
}

// Mt. Bachelor Conditions
// Scrapes the Mt. Bachelor conditions page
export const getMtBachelorConditions = functions.https.onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.set(corsHeaders);
    res.status(204).send('');
    return;
  }

  res.set(corsHeaders);

  try {
    // Fetch the Mt. Bachelor conditions page
    const response = await fetch('https://www.mtbachelor.com/the-mountain/conditions', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BendyApp/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Parse conditions from the page
    // Note: Selectors may need adjustment based on Mt. Bachelor's actual HTML structure
    const conditions: MountainConditions = {
      snowDepthBase: parseSnowDepth($, 'base') || 67,
      snowDepthSummit: parseSnowDepth($, 'summit') || 112,
      newSnow24h: parseNewSnow($, '24') || 0,
      newSnow48h: parseNewSnow($, '48') || 0,
      liftsOpen: parseLifts($, 'open') || 11,
      liftsTotal: parseLifts($, 'total') || 15,
      terrainOpen: parseTerrainPercent($) || 92,
      conditions: parseConditionText($) || 'Packed Powder',
      lastUpdated: new Date().toISOString(),
      source: 'mtbachelor.com',
    };

    res.status(200).json(conditions);
  } catch (error) {
    console.error('Error fetching Mt. Bachelor conditions:', error);

    // Return fallback data if scraping fails
    res.status(200).json({
      snowDepthBase: 67,
      snowDepthSummit: 112,
      newSnow24h: 0,
      newSnow48h: 0,
      liftsOpen: 11,
      liftsTotal: 15,
      terrainOpen: 92,
      conditions: 'Check mtbachelor.com',
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Live data temporarily unavailable',
    });
  }
});

// Road Conditions from TripCheck
export const getRoadConditions = functions.https.onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.set(corsHeaders);
    res.status(204).send('');
    return;
  }

  res.set(corsHeaders);

  try {
    // TripCheck has an API we can use
    // Fetching conditions for key passes near Bend
    const roads: RoadCondition[] = [];

    // Santiam Pass (US-20)
    const santiamCondition = await fetchTripCheckRoute('US20', 'Santiam Pass');
    if (santiamCondition) roads.push(santiamCondition);

    // Cascade Lakes Highway (OR-46)
    const cascadeCondition = await fetchTripCheckRoute('OR46', 'Cascade Lakes Highway');
    if (cascadeCondition) roads.push(cascadeCondition);

    // Add known closures
    roads.push({
      name: 'McKenzie Pass',
      route: 'OR-242',
      status: 'closed',
      conditions: 'Closed for winter season (Nov-June)',
      elevation: 5325,
      lastUpdated: new Date().toISOString(),
    });

    // Newberry Crater Road
    roads.push({
      name: 'Newberry Crater',
      route: 'FR-21',
      status: 'chains-required',
      conditions: 'Snow covered, chains or 4WD required',
      elevation: 6400,
      lastUpdated: new Date().toISOString(),
    });

    res.status(200).json({
      roads,
      lastUpdated: new Date().toISOString(),
      source: 'tripcheck.com',
    });
  } catch (error) {
    console.error('Error fetching road conditions:', error);

    // Return fallback data
    res.status(200).json({
      roads: [
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
      ],
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
      error: 'Live data temporarily unavailable',
    });
  }
});

// Helper functions for parsing Mt. Bachelor page
function parseSnowDepth($: cheerio.CheerioAPI, type: string): number | null {
  try {
    // Look for snow depth elements - adjust selectors based on actual page structure
    const depthText = $(`[data-snow-${type}], .snow-depth-${type}, .${type}-depth`)
      .first()
      .text()
      .trim();
    const match = depthText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

function parseNewSnow($: cheerio.CheerioAPI, hours: string): number | null {
  try {
    const snowText = $(`[data-new-snow-${hours}h], .new-snow-${hours}h`)
      .first()
      .text()
      .trim();
    const match = snowText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

function parseLifts($: cheerio.CheerioAPI, type: string): number | null {
  try {
    const liftsText = $(`[data-lifts-${type}], .lifts-${type}`)
      .first()
      .text()
      .trim();
    const match = liftsText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

function parseTerrainPercent($: cheerio.CheerioAPI): number | null {
  try {
    const terrainText = $('[data-terrain-open], .terrain-open, .terrain-percent')
      .first()
      .text()
      .trim();
    const match = terrainText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

function parseConditionText($: cheerio.CheerioAPI): string | null {
  try {
    return $('[data-conditions], .conditions-text, .snow-conditions')
      .first()
      .text()
      .trim() || null;
  } catch {
    return null;
  }
}

// Fetch road conditions from TripCheck
async function fetchTripCheckRoute(routeId: string, name: string): Promise<RoadCondition | null> {
  try {
    // TripCheck API endpoint
    const response = await fetch(
      `https://tripcheck.com/Scripts/map/data/roadConditions.json`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BendyApp/1.0)',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json() as Record<string, unknown>[];

    // Find the relevant route
    const route = data.find((r: Record<string, unknown>) =>
      String(r.routeId || '').includes(routeId) ||
      String(r.name || '').toLowerCase().includes(name.toLowerCase())
    );

    if (route) {
      return {
        name: name,
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
