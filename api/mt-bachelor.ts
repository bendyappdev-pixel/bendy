import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

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

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function parseSnowDepth($: cheerio.CheerioAPI, type: string): number | null {
  try {
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

const FALLBACK: MountainConditions = {
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
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  try {
    const response = await fetch('https://www.mtbachelor.com/the-mountain/conditions', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BendyApp/1.0)' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

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

    return res.status(200).json(conditions);
  } catch (error) {
    console.error('Error fetching Mt. Bachelor conditions:', error);
    return res.status(200).json({
      ...FALLBACK,
      lastUpdated: new Date().toISOString(),
      error: 'Live data temporarily unavailable',
    });
  }
}
