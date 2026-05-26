/**
 * Apply Arabic translations to the 47 products previously created by
 * scripts/bulk-upload-products.ts. Idempotent: each run overwrites the
 * AR name for every slug in the map.
 *
 *   npm run translate:products
 *
 * Translations are Modern Standard Arabic with Saudi commercial-kitchen
 * vocabulary (e.g. حوض for sink, شاورما for shawarma, بان مري and ووك
 * transliterated where there's no native equivalent in common use).
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const TRANSLATIONS: Record<string, string> = {
  "double-bowl-sink-prep-island": "حوض غسيل مزدوج بجزيرة تحضير",
  "steam-griddle-side-table": "طاولة جانبية لشواية البخار",
  "small-undershelf-table": "طاولة صغيرة برف سفلي",
  "left-bowl-sink-tiled-floor": "حوض غسيل يساري",
  "wok-burner-mobile-prep": "موقد ووك متنقل بمحطة تحضير",
  "open-shelf-cabinet-mobile": "خزانة متنقلة بأرفف مفتوحة",
  "two-door-mobile-cabinet": "خزانة متنقلة ببابين",
  "long-trough-drainboard-workshop": "حوض تصريف طويل للورشة",
  "two-door-mobile-cabinet-side": "خزانة متنقلة ببابين — منظر جانبي",
  "perforated-drainboard-detail": "لوح تصريف مثقّب",
  "pizza-tray-rack-mobile": "حامل صواني بيتزا متنقل",
  "pizza-prep-shelf-stack-hero": "رفوف تحضير البيتزا",
  "double-bowl-sink-with-dishwasher": "حوض غسيل مزدوج مع غسالة صحون",
  "dishwasher-extraction-hood": "شفاط فوق غسالة الصحون",
  "perforated-undershelf-bain-marie-table": "طاولة بان مري برف سفلي مثقّب",
  "shawarma-grill-canopy-detail": "ظلة شواية شاورما",
  "round-handwash-square-prep-sink": "حوض غسيل يدين دائري وحوض تحضير مربع",
  "wall-mounted-sliding-cabinet": "خزانة جدارية بأبواب منزلقة",
  "charcoal-grill-canopy-cabinet": "شواية فحم بظلة وخزانة",
  "prep-table-with-overhead-cabinet": "طاولة تحضير بخزانة علوية",
  "wall-mounted-sliding-cabinet-low-angle": "خزانة جدارية بأبواب منزلقة — منظر منخفض",
  "wall-cabinet-over-cold-table": "خزانة جدارية فوق طاولة تبريد",
  "container-shelving-pair": "زوج أرفف للحاويات",
  "prep-container-shelf-stack": "رفوف حاويات التحضير",
  "twelve-door-staff-locker": "خزانة موظفين باثني عشر بابًا",
  "wall-cabinet-with-shelf": "خزانة جدارية مع رف",
  "corner-shelving-pair-install": "زوج أرفف ركنية مثبّتة",
  "four-shelf-standalone-rack": "حامل بأربعة أرفف",
  "triple-bowl-sink-spray-tap": "حوض غسيل ثلاثي بصنبور رش",
  "wall-mounted-double-cabinet": "خزانة جدارية مزدوجة",
  "double-shelf-prep-table-install": "طاولة تحضير برفّين مثبّتة",
  "corner-shelving-three-shelf": "أرفف ركنية بثلاثة طوابق",
  "single-bowl-sink-with-handwash": "حوض غسيل أحادي مع حوض يدين",
  "drainboard-tap-station-prep-line": "محطة صنابير وتصريف لخط التحضير",
  "perforated-prep-cart-wok-pan": "عربة تحضير مثقّبة لمقلاة الووك",
  "range-griddle-fryer-line": "خط موقد وصاج ومقلاة",
  "island-extraction-hood-detail": "شفاط جزيري",
  "wall-canopy-hood-baffle-detail": "ظلة شفط جدارية بحواجز",
  "ceiling-extract-vent-system": "نظام تهوية وشفط من السقف",
  "twin-overhead-cabinet-pair": "زوج خزائن علوية توأم",
  "two-door-mobile-cart-workshop": "عربة متنقلة ببابين للورشة",
  "two-door-mobile-cart-workshop-front": "عربة متنقلة ببابين — واجهة أمامية",
  "small-corner-prep-table-workshop": "طاولة تحضير ركنية صغيرة للورشة",
  "double-bowl-sink-undershelf-workshop": "حوض غسيل مزدوج برف سفلي — ورشة",
  "glass-door-tall-display-cabinet": "خزانة عرض طويلة بباب زجاجي",
  "triple-bowl-sink-standalone": "حوض غسيل ثلاثي قائم",
  "double-bowl-sink-undershelf-clean": "حوض غسيل مزدوج برف سفلي",
};

async function main() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  let updated = 0;
  let missing = 0;
  const missingSlugs: string[] = [];

  for (const [slug, nameAr] of Object.entries(TRANSLATIONS)) {
    const found = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (found.totalDocs === 0) {
      console.warn(`✗  ${slug.padEnd(50)} not found in DB`);
      missing++;
      missingSlugs.push(slug);
      continue;
    }
    await payload.update({
      collection: "products",
      id: found.docs[0].id,
      data: { name: nameAr },
      locale: "ar",
    });
    console.log(`+  ${slug.padEnd(50)} ${nameAr}`);
    updated++;
  }

  console.log("─".repeat(80));
  console.log(`Done. updated=${updated} missing=${missing}`);
  if (missingSlugs.length > 0) {
    console.log("\nMissing slugs (run bulk:products first?):");
    for (const s of missingSlugs) console.log(`  ${s}`);
  }
  process.exit(missing > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
