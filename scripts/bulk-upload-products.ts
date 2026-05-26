/**
 * Bulk-upload staged products from SV-Assets-processed/ into Payload.
 *
 *   npm run bulk:products                # dry-run, prints plan
 *   npm run bulk:products -- --apply     # actually upload
 *   npm run bulk:products -- --apply --limit=3
 *
 * Idempotent: skips any product whose slug already exists. Uses Payload's
 * Local API; image uploads go through the s3Storage plugin straight to
 * Supabase Storage.
 *
 * Picks ONE primary image per product (preference: detail-hero > detail-
 * gallery > catalog-tile > hero-16x9 > process-3x4, largest width, AVIF).
 * Payload's Media collection regenerates thumbnail/card/hero sizes from
 * that single upload.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";

const APPLY = process.argv.includes("--apply");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const STAGING_ROOT =
  process.env.SV_STAGING_ROOT ??
  path.resolve(process.cwd(), "..", "SV-Assets-processed");
const MANIFEST = path.join(STAGING_ROOT, "upload-manifest.json");

type ManifestFile = {
  use: string;
  width: number;
  avif: string;
  webp: string;
};
type ManifestEntry = {
  slug: string;
  category: string;
  files: ManifestFile[];
};

function nameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

const USE_PREFERENCE = [
  "detail-hero-4x3",
  "detail-gallery-4x3",
  "catalog-tile-4x3",
  "hero-16x9",
  "process-3x4",
];

function pickPrimaryFile(
  entry: ManifestEntry,
): { absPath: string; mimetype: string } | null {
  for (const use of USE_PREFERENCE) {
    const candidates = entry.files
      .filter((f) => f.use === use)
      .sort((a, b) => b.width - a.width);
    if (candidates.length === 0) continue;
    return {
      absPath: path.join(STAGING_ROOT, candidates[0].avif),
      mimetype: "image/avif",
    };
  }
  return null;
}

async function main() {
  const manifest: ManifestEntry[] = JSON.parse(
    await fs.readFile(MANIFEST, "utf-8"),
  );

  console.log(`Manifest:  ${MANIFEST}`);
  console.log(`Entries:   ${manifest.length}`);
  console.log(`Mode:      ${APPLY ? "APPLY (will write)" : "DRY-RUN"}`);
  console.log(`Limit:     ${LIMIT === Infinity ? "all" : LIMIT}`);
  console.log("─".repeat(80));

  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  const categoryIds = new Map<string, string | number>();
  for (const slug of ["storage", "cooking", "workstations", "washing", "hoods"]) {
    const res = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (res.totalDocs === 0) {
      console.error(`✗ Category not found: ${slug}. Run \`npm run seed\` first.`);
      process.exit(1);
    }
    categoryIds.set(slug, res.docs[0].id);
  }

  let created = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails: { slug: string; error: string }[] = [];

  for (const entry of manifest.slice(0, LIMIT)) {
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: entry.slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`=  ${entry.slug.padEnd(50)} skipped (already exists)`);
      skipped++;
      continue;
    }

    const primary = pickPrimaryFile(entry);
    if (!primary) {
      console.error(`✗  ${entry.slug.padEnd(50)} no usable file`);
      errors++;
      errorDetails.push({ slug: entry.slug, error: "no usable file" });
      continue;
    }

    const name = nameFromSlug(entry.slug);
    const categoryId = categoryIds.get(entry.category);
    if (!categoryId) {
      console.error(`✗  ${entry.slug.padEnd(50)} unknown category: ${entry.category}`);
      errors++;
      errorDetails.push({ slug: entry.slug, error: `unknown category: ${entry.category}` });
      continue;
    }

    if (!APPLY) {
      const rel = path.relative(STAGING_ROOT, primary.absPath);
      console.log(`+  ${entry.slug.padEnd(50)} ${entry.category.padEnd(13)} ← ${rel}`);
      continue;
    }

    try {
      const buffer = await fs.readFile(primary.absPath);
      const filename = path.basename(primary.absPath);

      const media = await payload.create({
        collection: "media",
        data: { alt: name },
        file: {
          data: buffer,
          mimetype: primary.mimetype,
          name: filename,
          size: buffer.length,
        },
        locale: "en",
      });

      await payload.create({
        collection: "products",
        data: {
          name,
          slug: entry.slug,
          category: categoryId,
          gallery: [{ image: media.id, view: "front" }],
        },
        locale: "en",
      });

      console.log(`+  ${entry.slug.padEnd(50)} created (media #${media.id})`);
      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗  ${entry.slug.padEnd(50)} ${msg}`);
      errors++;
      errorDetails.push({ slug: entry.slug, error: msg });
    }
  }

  console.log("─".repeat(80));
  console.log(`Done. created=${created} skipped=${skipped} errors=${errors}`);
  if (errorDetails.length > 0) {
    console.log("\nErrors:");
    for (const e of errorDetails) console.log(`  ${e.slug}: ${e.error}`);
  }
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
