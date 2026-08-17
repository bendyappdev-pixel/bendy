/**
 * Photo credits.
 *
 * Built from the embedded EXIF/XMP metadata carried by each original file,
 * read before the images were re-encoded. This is the site's record of who
 * shot what — treat it as the source of truth and keep it up to date when
 * photography is added or replaced.
 *
 * Three groups:
 *
 *  1. `CREDITS` — images with a named rights-holder in their metadata. These
 *     are displayed on the image itself and named in the footer.
 *  2. `UNATTRIBUTED` — images carrying no credit field of any kind. Most were
 *     gathered while the guide was being assembled and their origin is not
 *     recorded. The footer invites the photographers to identify themselves.
 *  3. Source hints noted in comments below, where metadata suggests an origin
 *     but does not name a person. These are deliberately NOT displayed as
 *     credits, because guessing at attribution is worse than admitting we
 *     don't know.
 */

export interface PhotoCredit {
  /** The person who took it, where known. */
  photographer?: string;
  /** The archive, agency or collection it came from. */
  organization?: string;
  /** Rights year as stated in the file. */
  year?: string;
  /** Where to find more of their work. */
  url?: string;
  /** What renders on the image. Keep it short — it sits in a 9px corner slot. */
  label: string;
}

/**
 * Images with a named rights-holder.
 *
 * The seven Benjamin Edwards frames were confirmed by drone serial number
 * (42ULHCR13A00N8) as well as the copyright field — panorama3 carries no
 * copyright tag but came off the same body and the same Lightroom catalogue
 * as the six that do.
 */
export const CREDITS: Record<string, PhotoCredit> = {
  // ── Benjamin Edwards Photography ──────────────────────────────────
  '/images/hero/panorama1.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    year: '2020',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/hero/panorama2.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    year: '2020',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/hero/panorama3.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/golden-hour-tour.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    year: '2022',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/couples-escape.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    year: '2022',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/waterfall-quest.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    year: '2020',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },
  '/images/family-fun-day.jpg': {
    photographer: 'Benjamin Edwards',
    organization: 'Benjamin Edwards Photography',
    url: 'https://www.benjaminedwardsphotography.com',
    label: 'Photo · Benjamin Edwards',
  },

  // ── Oregon State Archives ─────────────────────────────────────────
  '/images/trails/deschutes-river-trail.jpg': {
    photographer: 'Gary Halvorson',
    organization: 'Oregon State Archives',
    label: 'Photo · Gary Halvorson, Oregon State Archives',
  },
  '/images/trails/shevlin-park.jpg': {
    photographer: 'Gary Halvorson',
    organization: 'Oregon State Archives',
    label: 'Photo · Gary Halvorson, Oregon State Archives',
  },

  // ── U.S. Forest Service ───────────────────────────────────────────
  '/images/trails/paulina-peak.jpg': {
    photographer: 'Tom Iraci',
    organization: 'U.S. Forest Service',
    label: 'Photo · Tom Iraci, U.S. Forest Service',
  },
};

/**
 * Images carrying no credit field of any kind.
 *
 * Source hints found but NOT shown as credits, because they name no person
 * and a wrong credit is worse than an honest blank:
 *   - camping/blue-bay.jpg and camping/little-lava-lake.jpg both carry
 *     "Contract: NRSO / Park: 71560" and "Park: 72118" in their description,
 *     which points at the National Recreation Reservation Service (the system
 *     behind Recreation.gov) rather than at a photographer.
 *   - Several camping frames carry only a camera make (Canon, Apple, Sony,
 *     Olympus, Panasonic, Nikon) and old editing software, which identifies a
 *     device but not an author.
 */
export const UNATTRIBUTED: string[] = [
  '/images/camping/allen-springs.jpg',
  '/images/camping/bend-sisters-garden.jpg',
  '/images/camping/blue-bay.jpg',
  '/images/camping/camp-sherman.jpg',
  '/images/camping/camping-hero.jpg',
  '/images/camping/cascade-lakes-forest-roads.jpg',
  '/images/camping/cinder-hill.jpg',
  '/images/camping/coldwater-cove.jpg',
  '/images/camping/cove-palisades-state-park.jpg',
  '/images/camping/crane-prairie-reservoir.jpg',
  '/images/camping/crown-villa.jpg',
  '/images/camping/cultus-lake.jpg',
  '/images/camping/deschutes-river-overlook.jpg',
  '/images/camping/devils-lake.jpg',
  '/images/camping/dutchman-flat-sno-park.jpg',
  '/images/camping/east-lake.jpg',
  '/images/camping/elk-lake.jpg',
  '/images/camping/harrington-loop.jpg',
  '/images/camping/hosmer-lake.jpg',
  '/images/camping/la-pine-state-park.jpg',
  '/images/camping/lava-lake.jpg',
  '/images/camping/little-crater.jpg',
  '/images/camping/little-cultus-lake.jpg',
  '/images/camping/little-lava-lake.jpg',
  '/images/camping/lower-bridge.jpg',
  '/images/camping/meissner-sno-park.jpg',
  '/images/camping/nf-300-whoops.jpg',
  '/images/camping/nf-406.jpg',
  '/images/camping/nf-4610.jpg',
  '/images/camping/north-twin-lake.jpg',
  '/images/camping/oregon-badlands.jpg',
  '/images/camping/paulina-lake.jpg',
  '/images/camping/phils-trailhead.jpg',
  '/images/camping/pioneer-ford.jpg',
  '/images/camping/prairie.jpg',
  '/images/camping/scandia-rv.jpg',
  '/images/camping/skull-hollow.jpg',
  '/images/camping/smiling-river.jpg',
  '/images/camping/smith-rock-state-park.jpg',
  '/images/camping/south-twin-lake.jpg',
  '/images/camping/sparks-lake.jpg',
  '/images/camping/steelhead-falls.jpg',
  '/images/camping/sun-outdoors.jpg',
  '/images/camping/swampy-lakes-sno-park.jpg',
  '/images/camping/the-camp.jpg',
  '/images/camping/three-sisters-trailheads.jpg',
  '/images/camping/todd-lake.jpg',
  '/images/camping/tumalo-state-park.jpg',
  '/images/camping/wanoga-sno-park.jpg',
  '/images/camping/wickiup-reservoir.jpg',
  '/images/trails/benham-falls.jpg',
  '/images/trails/big-obsidian-flow.jpg',
  '/images/trails/broken-top.jpg',
  '/images/trails/green-lakes.jpg',
  '/images/trails/mt-bachelor-summit.jpg',
  '/images/trails/phils-trail.jpg',
  '/images/trails/pilot-butte.jpg',
  '/images/trails/smith-rock.jpg',
  '/images/trails/south-sister.jpg',
  '/images/trails/tam-mcarthur-rim.jpg',
  '/images/trails/todd-lake.jpg',
  '/images/trails/trails-hero.jpg',
  '/images/trails/tumalo-falls.jpg',
];

/** Look up the credit for an image path, if we have one. */
export function creditFor(src?: string): PhotoCredit | undefined {
  if (!src) return undefined;
  // Tolerate cache-busting query strings and leading-slash variance.
  const clean = src.split('?')[0];
  return CREDITS[clean] ?? CREDITS[`/${clean.replace(/^\//, '')}`];
}

/** Everyone named in the credits, de-duplicated, for the footer. */
export function creditedContributors(): { name: string; organization?: string; url?: string }[] {
  const seen = new Map<string, { name: string; organization?: string; url?: string }>();
  Object.values(CREDITS).forEach((c) => {
    const name = c.photographer ?? c.organization;
    if (!name || seen.has(name)) return;
    seen.set(name, { name, organization: c.organization, url: c.url });
  });
  return [...seen.values()];
}

/** How many images we still cannot attribute. Surfaced in the footer notice. */
export const UNATTRIBUTED_COUNT = UNATTRIBUTED.length;
