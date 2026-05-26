/**
 * sv-process-logo.mjs
 * Generates web-ready logo variants from the 6575x2062 transparent PNG master.
 * Outputs to public/images/logo/:
 *   - logo-full.{avif,webp,png}      horizontal lockup, full SV + wordmark
 *   - logo-full@2x.{avif,webp,png}   retina
 *   - logo-mark.{avif,webp,png}      monogram only (square crop from left)
 *   - logo-mark@2x.{avif,webp,png}
 *   - favicon.png                    32x32
 *   - apple-touch-icon.png           180x180 (with padding)
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = 'C:/Users/moham/OneDrive/Desktop/NoorGithub/SV Assets/Steel Valley/Steel Valley..png';
const OUT_DIR = path.resolve('public/images/logo');

async function ensureDir(d) { if (!existsSync(d)) await mkdir(d, { recursive: true }); }

function sz(p) { return (statSync(p).size / 1024).toFixed(1) + ' KB'; }

const FULL_WIDTHS = { '1x': 480, '2x': 960 };
const MARK_SIZES = { '1x': 96, '2x': 192 };

async function writeVariants(base, buffer, width) {
  const sizedPng = await sharp(buffer).resize({ width, withoutEnlargement: false }).png({ compressionLevel: 9, palette: false }).toBuffer();
  const sizedAvif = await sharp(buffer).resize({ width, withoutEnlargement: false }).avif({ quality: 60, effort: 6 }).toBuffer();
  const sizedWebp = await sharp(buffer).resize({ width, withoutEnlargement: false }).webp({ quality: 85, effort: 6 }).toBuffer();

  const paths = {
    png: path.join(OUT_DIR, `${base}.png`),
    avif: path.join(OUT_DIR, `${base}.avif`),
    webp: path.join(OUT_DIR, `${base}.webp`),
  };
  await sharp(sizedPng).toFile(paths.png);
  await sharp(sizedAvif).toFile(paths.avif);
  await sharp(sizedWebp).toFile(paths.webp);
  return paths;
}

async function main() {
  await ensureDir(OUT_DIR);
  const src = sharp(SRC);
  const meta = await src.metadata();
  console.log(`Master: ${meta.width}x${meta.height} ${meta.format} alpha=${meta.hasAlpha}`);

  // Trim transparent borders, then we have a tight bbox
  const trimmed = await sharp(SRC).trim().toBuffer();
  const trimMeta = await sharp(trimmed).metadata();
  console.log(`Trimmed: ${trimMeta.width}x${trimMeta.height}`);

  // FULL HORIZONTAL LOCKUP
  for (const [tag, w] of Object.entries(FULL_WIDTHS)) {
    const suffix = tag === '1x' ? '' : '@2x';
    const paths = await writeVariants(`logo-full${suffix}`, trimmed, w);
    console.log(`  full${suffix}: avif=${sz(paths.avif)} webp=${sz(paths.webp)} png=${sz(paths.png)}`);
  }

  // MARK ONLY — crop the left ~32% (the monogram circle)
  const markWidth = Math.round(trimMeta.height * 1.05); // monogram is roughly square with a hair of padding
  const markCrop = await sharp(trimmed)
    .extract({ left: 0, top: 0, width: markWidth, height: trimMeta.height })
    .toBuffer();

  for (const [tag, s] of Object.entries(MARK_SIZES)) {
    const suffix = tag === '1x' ? '' : '@2x';
    const paths = await writeVariants(`logo-mark${suffix}`, markCrop, s);
    console.log(`  mark${suffix}: avif=${sz(paths.avif)} webp=${sz(paths.webp)} png=${sz(paths.png)}`);
  }

  // FAVICON 32x32 (mark only, padded)
  await sharp(markCrop)
    .resize({ width: 32, height: 32, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, 'favicon.png'));

  // Apple touch icon 180x180 (mark + dark backdrop so it has substance on iOS home)
  await sharp(markCrop)
    .resize({ width: 140, height: 140, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 20, bottom: 20, left: 20, right: 20, background: { r: 14, g: 16, b: 20, alpha: 1 } })
    .png()
    .toFile(path.join(OUT_DIR, 'apple-touch-icon.png'));

  console.log('Logo processing complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
