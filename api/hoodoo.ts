import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Hoodoo conditions.
 *
 * Same situation as Mt. Bachelor: no machine-readable public feed exists, and
 * the old scraper's CSS selectors never matched skihoodoo.com's markup. This
 * endpoint reports honestly that no live data is available instead of serving
 * invented numbers. The client hides the section when `available` is false.
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  // Hoodoo's season is roughly December through March.
  const month = new Date().getMonth(); // 0-indexed
  const winter = month <= 2 || month === 11;

  return res.status(200).json({
    available: false,
    season: winter ? 'winter' : 'summer',
    message: winter
      ? 'No live snow report feed is available — see skihoodoo.com for current conditions.'
      : 'Hoodoo is closed for the season. The snow report returns with winter — see skihoodoo.com.',
    source: 'skihoodoo.com',
    lastUpdated: new Date().toISOString(),
  });
}
