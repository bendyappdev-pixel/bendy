/**
 * Resolves a crowd report's `locationId` to map coordinates.
 *
 * `popularSpots` in useCrowdReports carries ids but no geometry, so the
 * coordinates have to come from the datasets that do have them. Order of
 * lookup: trails (matched on slug), then locations (matched on id), then a
 * small table for the handful of spots that appear in neither.
 */

import { trails } from '../data/trails';
import { locations } from '../data/locations';

/** [lng, lat] — Mapbox order. */
export type LngLat = [number, number];

/** Spots reportable in the UI that aren't in trails.ts or locations.ts. */
const EXTRA_SPOTS: Record<string, LngLat> = {
  'elk-lake': [-121.8069, 43.9569],
  'sparks-lake': [-121.7347, 44.0056],
  'downtown-bend': [-121.3153, 44.0582],
};

/** Ids that differ between popularSpots and the datasets. */
const ID_ALIASES: Record<string, string> = {
  'phils-trail': 'phil-trail',
  'mt-bachelor-summit': 'mt-bachelor',
};

const trailBySlug = new Map(trails.map((t) => [t.slug, t]));
const locationById = new Map(locations.map((l) => [l.id, l]));

export function coordinatesForSpot(locationId: string): LngLat | null {
  const trail = trailBySlug.get(locationId);
  if (trail) {
    return [trail.trailhead.coordinates.lng, trail.trailhead.coordinates.lat];
  }

  const direct = locationById.get(locationId);
  if (direct) return direct.coordinates;

  const aliased = ID_ALIASES[locationId];
  if (aliased) {
    const viaAlias = locationById.get(aliased);
    if (viaAlias) return viaAlias.coordinates;
  }

  return EXTRA_SPOTS[locationId] ?? null;
}
