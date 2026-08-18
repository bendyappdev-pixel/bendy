import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Mt. Bachelor conditions.
 *
 * There is currently no machine-readable public feed for Mt. Bachelor's snow
 * report: the old conditions page this endpoint used to scrape returns 404
 * (the resort rebuilt their site on Gatsby), and their internal `/dor/` API
 * is not reachable at a public host. Rather than serve invented numbers, this
 * endpoint reports honestly that no live data is available, with a
 * season-appropriate message. The client hides the section when
 * `available` is false.
 *
 * If a real feed is wired up later (their report page's XHR calls will reveal
 * the `/dor/` host once winter widgets go live), restore the data fields
 * alongside `available: true`.
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

  // Ski season at Bachelor runs roughly December through late May.
  const month = new Date().getMonth(); // 0-indexed
  const winter = month <= 4 || month === 11;

  return res.status(200).json({
    available: false,
    season: winter ? 'winter' : 'summer',
    message: winter
      ? 'No live snow report feed is available — see mtbachelor.com for current conditions.'
      : 'Mt. Bachelor is in summer operations (bike park, ZipTour, scenic rides). The snow report returns with winter — see mtbachelor.com.',
    source: 'mtbachelor.com',
    lastUpdated: new Date().toISOString(),
  });
}
