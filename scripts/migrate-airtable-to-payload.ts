/**
 * One-shot Airtable → Payload migration.
 *
 * Default mode: DRY RUN (prints a counts report, writes nothing).
 * Pass `--apply` to actually persist into Payload.
 *
 * Requires:
 *   AIRTABLE_API_KEY     (re-issue after the Plan-1 leak — current key was rotated)
 *   AIRTABLE_BASE_ID     (e.g. appNpL3dO0aG3DBH9)
 *   DATABASE_URL         (Postgres for Payload — same as the dev server)
 *
 * Run:
 *   npm run migrate:airtable             # dry run
 *   npm run migrate:airtable -- --apply  # actually write
 */
import "dotenv/config";
import Airtable from "airtable";
import { getPayload } from "payload";
import config from "../src/payload.config.js";

const DRY_RUN = !process.argv.includes("--apply");

interface MigrationReport {
  succeeded: number;
  skipped: number;
  errored: { id: string; reason: string }[];
}

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  console.error(
    "AIRTABLE_BASE_ID and AIRTABLE_API_KEY must be set in .env.local",
  );
  process.exit(1);
}

const at = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    // remove combining marks (accents)
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function migrateProducts(): Promise<MigrationReport> {
  const report: MigrationReport = { succeeded: 0, skipped: 0, errored: [] };
  const payload = await getPayload({ config });

  // Adjust the table name and field map to match the current Airtable schema.
  const records = await at("Products").select({}).all();

  for (const rec of records) {
    const name = (rec.get("Name") as string) ?? null;
    const slug = (rec.get("Slug") as string) ?? slugify(name ?? rec.id);
    if (!name) {
      report.errored.push({ id: rec.id, reason: "missing Name field" });
      continue;
    }

    // Idempotency — skip if already imported
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      report.skipped++;
      continue;
    }

    // Category resolution
    const categoryName = (rec.get("Category") as string) ?? "Storage";
    const categorySlug = slugify(categoryName);
    let categoryId: string | undefined;
    const cat = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    categoryId = cat.docs[0]?.id as string | undefined;
    if (!categoryId) {
      if (!DRY_RUN) {
        const created = await payload.create({
          collection: "categories",
          data: { name: categoryName, slug: categorySlug },
          locale: "en",
        });
        categoryId = created.id as string;
      } else {
        categoryId = "<would-create>";
      }
    }

    const data = {
      name,
      slug,
      category: categoryId,
      shortDescription: (rec.get("Short") as string) ?? undefined,
    };

    if (DRY_RUN) {
      console.log(`[dry-run] would create product: ${slug}`);
      report.succeeded++;
    } else {
      try {
        await payload.create({
          collection: "products",
          data: data as unknown as Parameters<typeof payload.create>[0]["data"],
          locale: "en",
        });
        report.succeeded++;
      } catch (err) {
        report.errored.push({
          id: rec.id,
          reason: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  return report;
}

async function main() {
  console.log(
    `Migration mode: ${DRY_RUN ? "DRY RUN (pass --apply to write)" : "APPLY"}`,
  );
  const products = await migrateProducts();
  console.log("Products:", products);
  console.log(
    `Errored ids:\n${
      products.errored.map((e) => `  ${e.id}: ${e.reason}`).join("\n") ||
      "  (none)"
    }`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
