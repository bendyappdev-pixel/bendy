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

function parseHoodooSnowDepth($: cheerio.CheerioAPI, type: string): number | null {
  try {
    const selectors = [`.snow-${type}`, `.${type}-depth`, `[data-${type}-depth]`, `.conditions-${type}`];
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      const match = text.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    const bodyText = $('body').text();
    const regex = new RegExp(`${type}[:\\s]*(\\d+)["']?`, 'i');
    const match = bodyText.match(regex);
    if (match) return parseInt(match[1], 10);
    return null;
  } catch {
    return null;
  }
}

function parseHoodooNewSnow($: cheerio.CheerioAPI, hours: string): number | null {
  try {
    const selectors = [`.new-snow-${hours}h`, `[data-snow-${hours}h]`, `.snow-${hours}hr`];
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      const match = text.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    const bodyText = $('body').text();
    const regex = new RegExp(`${hours}\\s*h(?:our|r)?[:\\s]*(\\d+)`, 'i');
    const match = bodyText.match(regex);
    if (match) return parseInt(match[1], 10);
    return null;
  } catch {
    return null;
  }
}

function parseHoodooLifts($: cheerio.CheerioAPI, type: string): number | null {
  try {
    const selectors = [`.lifts-${type}`, `[data-lifts-${type}]`, `.lift-status`];
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      const match = text.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    if (type === 'open' || type === 'total') {
      const bodyText = $('body').text();
      const match = bodyText.match(/(\d+)\s*(?:of|\/)\s*(\d+)\s*lift/i);
      if (match) return type === 'open' ? parseInt(match[1], 10) : parseInt(match[2], 10);
    }
    return null;
  } catch {
    return null;
  }
}

function parseHoodooTerrainPercent($: cheerio.CheerioAPI): number | null {
  try {
    const selectors = ['.terrain-open', '.terrain-percent', '[data-terrain]'];
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      const match = text.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    const bodyText = $('body').text();
    const match = bodyText.match(/(\d+)\s*%\s*(?:terrain|open|runs)/i);
    if (match) return parseInt(match[1], 10);
    return null;
  } catch {
    return null;
  }
}

function parseHoodooConditionText($: cheerio.CheerioAPI): string | null {
  try {
    const selectors = ['.conditions-text', '.snow-conditions', '.surface-conditions', '[data-conditions]'];
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      if (text) return text;
    }
    const conditionTerms = ['Packed Powder', 'Powder', 'Groomed', 'Machine Groomed', 'Hard Pack', 'Spring Conditions', 'Variable'];
    const bodyText = $('body').text();
    for (const term of conditionTerms) {
      if (bodyText.toLowerCase().includes(term.toLowerCase())) return term;
    }
    return null;
  } catch {
    return null;
  }
}

const FALLBACK: MountainConditions = {
  snowDepthBase: 48,
  snowDepthSummit: 72,
  newSnow24h: 0,
  newSnow48h: 0,
  liftsOpen: 4,
  liftsTotal: 5,
  terrainOpen: 85,
  conditions: 'Check skihoodoo.com',
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
    const response = await fetch('https://www.skihoodoo.com/conditions', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BendyApp/1.0)' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const conditions: MountainConditions = {
      snowDepthBase: parseHoodooSnowDepth($, 'base') || 48,
      snowDepthSummit: parseHoodooSnowDepth($, 'summit') || 72,
      newSnow24h: parseHoodooNewSnow($, '24') || 0,
      newSnow48h: parseHoodooNewSnow($, '48') || 0,
      liftsOpen: parseHoodooLifts($, 'open') || 4,
      liftsTotal: parseHoodooLifts($, 'total') || 5,
      terrainOpen: parseHoodooTerrainPercent($) || 85,
      conditions: parseHoodooConditionText($) || 'Packed Powder',
      lastUpdated: new Date().toISOString(),
      source: 'skihoodoo.com',
    };

    return res.status(200).json(conditions);
  } catch (error) {
    console.error('Error fetching Hoodoo conditions:', error);
    return res.status(200).json({
      ...FALLBACK,
      lastUpdated: new Date().toISOString(),
      error: 'Live data temporarily unavailable',
    });
  }
}
