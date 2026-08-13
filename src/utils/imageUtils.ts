/**
 * Image helpers.
 *
 * Every raster asset under public/images/ is built with a WebP sibling at the
 * same path (see scripts/optimize-images.mjs). `webpFor` derives that sibling
 * so components can offer it via <source type="image/webp"> and fall back to
 * the original JPEG/PNG in browsers that don't take it.
 */

const RASTER = /\.(jpe?g|png)$/i;

/** "/images/hero/panorama1.jpg" → "/images/hero/panorama1.webp" */
export function webpFor(src: string): string {
  return RASTER.test(src) ? src.replace(RASTER, '.webp') : src;
}

/** True when the path is a raster we generate a WebP sibling for. */
export function hasWebp(src: string): boolean {
  return RASTER.test(src);
}
