/**
 * Hero Carousel Image Configuration
 *
 * Add your panorama images to /public/images/hero/
 * Then list them here. Images should be:
 * - Wide panoramic format (recommended: 1920x1080 or wider)
 * - Optimized for web (compressed JPG or WebP)
 * - Dark enough or will work with the gradient overlay
 *
 * The carousel will crossfade between images every 4 seconds.
 * If this array is empty, the hero falls back to a gradient background.
 */

export const heroImages: string[] = [
  '/images/hero/panorama1.jpg',
  '/images/hero/panorama2.jpg',
  '/images/hero/panorama3.jpg',
];

// Carousel settings
export const carouselConfig = {
  /** Time between image transitions (milliseconds) */
  interval: 4000,
  /** Duration of crossfade transition (milliseconds) */
  transitionDuration: 1000,
  /** Pause rotation when user hovers over hero */
  pauseOnHover: true,
};
