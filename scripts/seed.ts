/**
 * Seed minimal fixtures so the admin is browsable:
 *   - 5 product categories (storage, cooking, workstations, washing, hoods)
 *   - 8 page stubs (home, about, services, products, contact, blog, privacy, terms)
 *   - Settings global populated with English placeholders
 *
 * Idempotent: re-running won't duplicate. Run with: npm run seed
 */
// Load .env.local manually — Payload's bin loader breaks on Node 24 + Next 15.5,
// so we sidestep it by populating process.env before importing the config.
// IMPORTANT: dotenv must run before payload/config import. Static imports
// hoist, so payload & config are loaded dynamically below.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seed() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  // ── Categories ────────────────────────────────────────────────
  const categories = [
    { name: "Storage", slug: "storage", order: 1 },
    { name: "Cooking", slug: "cooking", order: 2 },
    { name: "Workstations", slug: "workstations", order: 3 },
    { name: "Washing", slug: "washing", order: 4 },
    { name: "Hoods", slug: "hoods", order: 5 },
  ];

  for (const cat of categories) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: "categories", data: cat, locale: "en" });
      payload.logger.info(`Seeded category: ${cat.slug}`);
    } else {
      payload.logger.info(`Category exists: ${cat.slug} (skipped)`);
    }
  }

  // ── Settings global (English baseline; Arabic added via admin) ─
  await payload.updateGlobal({
    slug: "settings",
    data: {
      company: {
        name: "Steel Valley",
        tagline: "Stainless steel fabrication — Jeddah",
      },
      contact: {
        phone: "+966 12 XXX XXXX",
        email: "info@steelvalley.example",
      },
      address: {
        line1: "Industrial Area",
        city: "Jeddah",
        region: "Makkah",
        country: "Saudi Arabia",
      },
    },
    locale: "en",
  });
  payload.logger.info("Seeded Settings global (en)");

  // ── Page stubs ────────────────────────────────────────────────
  const pageKeys = [
    "home",
    "about",
    "services",
    "products",
    "contact",
    "blog",
    "privacy",
    "terms",
  ] as const;

  for (const key of pageKeys) {
    const existing = await payload.find({
      collection: "pages",
      where: { key: { equals: key } },
      limit: 1,
    });
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "pages",
        data: { key, title: key.charAt(0).toUpperCase() + key.slice(1) },
        locale: "en",
      });
      payload.logger.info(`Seeded page stub: ${key}`);
    } else {
      payload.logger.info(`Page exists: ${key} (skipped)`);
    }
  }

  payload.logger.info("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
