/**
 * Hero Carousel Configuration
 *
 * Add your panorama images to /public/images/hero/ and list them here.
 * Images should be wide panoramic format and run through
 * `npm run optimize:images` so a WebP sibling exists.
 *
 * The carousel crossfades every 4 seconds. If `heroFrames` is empty the hero
 * falls back to the dark cinematic placeholder.
 *
 * Each frame carries where it was taken. The coordinates were read out of the
 * files' own GPS metadata, not typed by hand — every one of these panoramas
 * was shot 18–23 miles from town, which is the point the brand is making:
 * BENDY is Central Oregon out to roughly a 30-mile radius, not the city
 * limits. The hero's caption names the frame currently on screen rather than
 * pinning Bend's coordinates under a photograph of somewhere else.
 */

export interface HeroFrame {
  src: string;
  /** Place name as a local would say it. */
  location: string;
  /** Decimal degrees, from the file's GPS metadata. */
  lat: number;
  lng: number;
  /** Straight-line miles from downtown Bend. */
  milesFromBend: number;
  /** Elevation in feet, where the file recorded it. */
  elevationFt?: number;
}

export const heroFrames: HeroFrame[] = [
  {
    src: '/images/hero/panorama1.jpg',
    location: 'Smith Rock',
    lat: 44.3634,
    lng: -121.1464,
    milesFromBend: 23,
    elevationFt: 2970,
  },
  {
    src: '/images/hero/panorama2.jpg',
    location: 'Broken Top',
    lat: 44.0856,
    lng: -121.6887,
    milesFromBend: 19,
    elevationFt: 8493,
  },
  {
    src: '/images/hero/panorama3.jpg',
    location: 'Sparks Lake',
    lat: 44.0178,
    lng: -121.7203,
    milesFromBend: 20,
    elevationFt: 5471,
  },
];

/** Just the paths — what the carousel preloads and crossfades. */
export const heroImages: string[] = heroFrames.map((f) => f.src);

/** "44.3634° N · 121.1464° W" */
export function formatCoordinates(frame: HeroFrame): string {
  const ns = frame.lat >= 0 ? 'N' : 'S';
  const ew = frame.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(frame.lat).toFixed(4)}° ${ns} · ${Math.abs(frame.lng).toFixed(4)}° ${ew}`;
}

// Carousel settings
export const carouselConfig = {
  /** Time between image transitions (milliseconds) */
  interval: 4000,
  /** Duration of crossfade transition (milliseconds) */
  transitionDuration: 1000,
  /** Pause rotation when user hovers over hero */
  pauseOnHover: true,
};
