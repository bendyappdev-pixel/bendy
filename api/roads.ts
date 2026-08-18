import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RoadCondition {
  name: string;
  route: string;
  status: 'open' | 'chains-required' | 'closed';
  conditions: string;
  elevation: number;
  lastUpdated: string;
}

/**
 * Mountain pass status, derived from published seasonal schedules.
 *
 * TripCheck's undocumented JSON endpoint this used to call is gone, and
 * ODOT's official API requires a registered key. Until one is wired up, the
 * statuses below come from each road's published seasonal closure schedule —
 * which is real information (McKenzie Pass genuinely closes every winter) but
 * is NOT live incident data, and every entry says so. `source` is
 * 'seasonal-schedule' so the client can label it honestly.
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const VERIFY = 'Seasonal schedule — verify current status at tripcheck.com.';

function seasonalRoads(now: Date): RoadCondition[] {
  const month = now.getMonth(); // 0-indexed
  const iso = now.toISOString();

  // Published closure windows: McKenzie Pass ~Nov–late Jun; Cascade Lakes
  // Highway ~Nov–May; Newberry's FR-21 snowbound ~Nov–May; Santiam year-round.
  const mckenzieOpen = month >= 6 && month <= 9; // Jul–Oct
  const cascadeLakesOpen = month >= 5 && month <= 10; // Jun–Nov
  const newberryOpen = month >= 5 && month <= 9; // Jun–Oct

  return [
    {
      name: 'Santiam Pass',
      route: 'US-20',
      status: 'open',
      conditions: `Open year-round; winter storms can require chains. ${VERIFY}`,
      elevation: 4817,
      lastUpdated: iso,
    },
    {
      name: 'McKenzie Pass',
      route: 'OR-242',
      status: mckenzieOpen ? 'open' : 'closed',
      conditions: mckenzieOpen
        ? `Open for the season (typically July through October). ${VERIFY}`
        : `Closed for the winter season (typically November through late June). ${VERIFY}`,
      elevation: 5325,
      lastUpdated: iso,
    },
    {
      name: 'Cascade Lakes Highway',
      route: 'OR-46',
      status: cascadeLakesOpen ? 'open' : 'closed',
      conditions: cascadeLakesOpen
        ? `Open for the season (typically June through November). ${VERIFY}`
        : `Gated past Mt. Bachelor for winter (typically November through May). ${VERIFY}`,
      elevation: 6300,
      lastUpdated: iso,
    },
    {
      name: 'Newberry Crater',
      route: 'FR-21',
      status: newberryOpen ? 'open' : 'closed',
      conditions: newberryOpen
        ? `Open for the season (typically June through October). ${VERIFY}`
        : `Snowbound at upper elevations (typically November through May). ${VERIFY}`,
      elevation: 6400,
      lastUpdated: iso,
    },
  ];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  const now = new Date();
  return res.status(200).json({
    roads: seasonalRoads(now),
    lastUpdated: now.toISOString(),
    source: 'seasonal-schedule',
  });
}
