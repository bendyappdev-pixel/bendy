#!/usr/bin/env node
/**
 * Image optimizer for public/images.
 *
 * The redesign puts photography on nearly every surface, so page weight is
 * now a first-order concern. For each JPEG/PNG under public/images this:
 *
 *   1. caps the long edge at MAX_EDGE (nothing is displayed larger),
 *   2. re-encodes the original at a sane quality if that makes it smaller,
 *   3. writes a WebP sibling at the same path with a .webp extension.
 *
 * The WebP sibling is what <Reel> and <HeroCarousel> offer via
 * <source type="image/webp">, falling back to the original everywhere WebP
 * isn't supported. Every raster the app references MUST have one: a <picture>
 * whose matching <source> 404s does not fall back to the <img>, it just
 * fails to render.
 *
 * Idempotent — safe to re-run. Usage:  node scripts/optimize-images.mjs
 */

import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_DIR = join(ROOT, 'public', 'images');

const MAX_EDGE = 2400; // widest any image is ever displayed, with headroom
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 78;

const RASTER = /\.(jpe?g|png)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.test(entry.name)) out.push(full);
  }
  return out;
}

function fmt(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

const files = await walk(IMAGE_DIR);
let beforeTotal = 0;
let afterTotal = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  beforeTotal += before;

  const ext = extname(file).toLowerCase();
  const isPng = ext === '.png';
  const meta = await sharp(file).metadata();
  const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;

  // 1 + 2 — resize / re-encode the original in place, but only keep the
  // result if it actually saved bytes.
  const tmp = `${file}.tmp`;
  // withMetadata() keeps EXIF/XMP — sharp strips it by default, which would
  // destroy the copyright and creator fields that src/data/photoCredits.ts is
  // built from and that establish who shot what. Attribution data survives
  // optimisation.
  let pipeline = sharp(file).rotate().withMetadata();
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });

  await pipeline.toFile(tmp);
  const optimized = (await stat(tmp)).size;

  if (optimized < before) {
    await rename(tmp, file);
  } else {
    await unlink(tmp);
  }

  // 3 — WebP sibling
  const webpPath = file.replace(RASTER, '.webp');
  let webpPipeline = sharp(file).rotate().withMetadata();
  if (needsResize) {
    webpPipeline = webpPipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  await webpPipeline.webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(webpPath);

  const after = (await stat(file)).size;
  const webpSize = (await stat(webpPath)).size;
  afterTotal += webpSize;

  const rel = file.replace(`${ROOT}/`, '');
  if (before !== after || webpSize < before) {
    console.log(
      `${rel}\n  original ${fmt(before)} → ${fmt(after)}   webp ${fmt(webpSize)}`
    );
  }
}

console.log(
  `\n${files.length} images. Originals ${fmt(beforeTotal)} → WebP ${fmt(afterTotal)} ` +
    `(${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller on WebP-capable browsers).`
);
