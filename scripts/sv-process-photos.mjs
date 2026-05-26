/**
 * sv-process-photos.mjs
 * Reads scripts/sv-asset-manifest.json (produced by the triage step) and
 * processes every kept photo to multiple aspect ratios + formats.
 *
 * Routing:
 *   category=hero            -> public/images/hero/
 *   category=services/*      -> public/images/services/<service>/
 *   category=about/process   -> public/images/about/
 *   category=products/*      -> SV-Assets-processed/products/<bucket>/
 *
 * For each kept item, generates per `use` requirements:
 *   catalog-tile-4x3     -> 800x600  + 400x300
 *   detail-hero-4x3      -> 1600x1200 + 800x600
 *   detail-gallery-4x3   -> 800x600  + 400x300
 *   service-photo-4x3    -> 1400x1050 + 700x525
 *   installation-16x9    -> 1600x900  + 800x450
 *   hero-16x9            -> 2400x1350 + 1200x675
 *   process-3x4          -> 800x1067 + 400x533
 *
 * Light retouch: small normalize() + modest sharpen() pass to recover
 * detail lost to WhatsApp's compression. No color shift.
 */
import sharp from 'sharp';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const REPO = path.resolve();
const SRC_DIR = 'C:/Users/moham/OneDrive/Desktop/NoorGithub/SV Assets';
const STAGING_DIR = 'C:/Users/moham/OneDrive/Desktop/NoorGithub/SV-Assets-processed';
const MANIFEST = path.join(REPO, 'scripts', 'sv-asset-manifest.json');

const PUBLIC_IMG = path.join(REPO, 'public', 'images');

const USE_SPECS = {
  'catalog-tile-4x3':   { ratio: [4, 3], widths: [800, 400], dir: null /* per item */ },
  'detail-hero-4x3':    { ratio: [4, 3], widths: [1600, 800], dir: null },
  'detail-gallery-4x3': { ratio: [4, 3], widths: [800, 400], dir: null },
  'service-photo-4x3':  { ratio: [4, 3], widths: [1400, 700], dir: null },
  'installation-16x9':  { ratio: [16, 9], widths: [1600, 800], dir: null },
  'hero-16x9':          { ratio: [16, 9], widths: [2400, 1200], dir: null },
  'process-3x4':        { ratio: [3, 4], widths: [800, 400], dir: null },
};

function destDir(item) {
  const cat = item.category;
  if (cat === 'hero') return path.join(PUBLIC_IMG, 'hero');
  if (cat.startsWith('services/')) return path.join(PUBLIC_IMG, 'services', cat.split('/')[1]);
  if (cat === 'about/process') return path.join(PUBLIC_IMG, 'about');
  if (cat.startsWith('products/')) return path.join(STAGING_DIR, 'products', cat.split('/')[1]);
  throw new Error(`Unknown category: ${cat}`);
}

async function ensureDir(d) { if (!existsSync(d)) await mkdir(d, { recursive: true }); }
async function fileSizeKB(p) { return ((await stat(p)).size / 1024).toFixed(1); }

function cropToRatio(meta, targetRatio) {
  const [rw, rh] = targetRatio;
  const targetAR = rw / rh;
  const srcAR = meta.width / meta.height;
  if (Math.abs(srcAR - targetAR) < 0.01) {
    return { left: 0, top: 0, width: meta.width, height: meta.height };
  }
  if (srcAR > targetAR) {
    const newW = Math.round(meta.height * targetAR);
    const left = Math.round((meta.width - newW) / 2);
    return { left, top: 0, width: newW, height: meta.height };
  } else {
    const newH = Math.round(meta.width / targetAR);
    // For product shots: bias the crop *up* a bit (35% from top) so the product
    // doesn't get its top sliced. For portrait process shots: center.
    const top = Math.round((meta.height - newH) * 0.35);
    return { left: 0, top, width: meta.width, height: newH };
  }
}

async function processOne(item) {
  if (item.category === 'reject') return null;
  const srcPath = path.join(SRC_DIR, item.src);
  const meta = await sharp(srcPath).metadata();
  const outBase = destDir(item);
  await ensureDir(outBase);

  const results = [];
  for (const use of item.use || []) {
    const spec = USE_SPECS[use];
    if (!spec) { console.warn(`  unknown use: ${use} on ${item.slug}`); continue; }
    const crop = cropToRatio(meta, spec.ratio);

    for (const w of spec.widths) {
      const h = Math.round(w * spec.ratio[1] / spec.ratio[0]);
      const sizeTag = `${w}w`;
      const baseName = `${item.slug}__${use}__${sizeTag}`;

      // Light retouch pipeline: extract crop -> resize -> mild normalize -> gentle sharpen
      const pipeline = (fmt) => sharp(srcPath)
        .extract(crop)
        .resize({ width: w, height: h, fit: 'cover' })
        .normalize({ lower: 1, upper: 99 })
        .sharpen({ sigma: 0.6, m1: 0.3, m2: 0.6 });

      const avifPath = path.join(outBase, `${baseName}.avif`);
      const webpPath = path.join(outBase, `${baseName}.webp`);
      await pipeline().avif({ quality: 55, effort: 6 }).toFile(avifPath);
      await pipeline().webp({ quality: 80, effort: 6 }).toFile(webpPath);
      results.push({ use, w, avif: avifPath, webp: webpPath, avifKB: await fileSizeKB(avifPath), webpKB: await fileSizeKB(webpPath) });
    }
  }
  return { slug: item.slug, category: item.category, outputs: results };
}

async function main() {
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest not found: ${MANIFEST}`);
    console.error('Run triage step first (subagent writes this file).');
    process.exit(1);
  }
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  console.log(`Manifest: ${manifest.summary?.total ?? manifest.items.length} items, ${manifest.summary?.kept ?? '?'} kept`);

  const report = { processed: [], rejected: [], errors: [] };
  for (const item of manifest.items) {
    try {
      if (item.category === 'reject') { report.rejected.push({ src: item.src, reason: item.reason }); continue; }
      const r = await processOne(item);
      if (r) {
        report.processed.push(r);
        const totalKB = r.outputs.reduce((s, o) => s + parseFloat(o.avifKB), 0).toFixed(1);
        console.log(`  ${r.slug.padEnd(40)} ${r.outputs.length} files, avif total ${totalKB} KB`);
      }
    } catch (e) {
      console.error(`  ERROR ${item.slug}: ${e.message}`);
      report.errors.push({ slug: item.slug, error: e.message });
    }
  }

  // Upload-manifest for Payload: only product entries with their public-relative paths
  const uploadManifest = report.processed
    .filter(p => p.category.startsWith('products/'))
    .map(p => ({
      slug: p.slug,
      category: p.category.split('/')[1],
      files: p.outputs.map(o => ({
        use: o.use,
        width: o.w,
        avif: path.relative(STAGING_DIR, o.avif).replace(/\\/g, '/'),
        webp: path.relative(STAGING_DIR, o.webp).replace(/\\/g, '/'),
      })),
    }));
  await writeFile(path.join(STAGING_DIR, 'upload-manifest.json'), JSON.stringify(uploadManifest, null, 2));

  await writeFile(path.join(REPO, 'scripts', 'sv-photo-report.json'), JSON.stringify(report, null, 2));
  console.log(`\nDone. processed=${report.processed.length} rejected=${report.rejected.length} errors=${report.errors.length}`);
  console.log(`Upload manifest: ${path.join(STAGING_DIR, 'upload-manifest.json')}`);
  console.log(`Full report: scripts/sv-photo-report.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
