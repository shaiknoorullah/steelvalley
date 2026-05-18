/**
 * STUB_PRODUCTS — temporary product fixture used until Payload has live data.
 *
 * Schema mirrors src/payload/collections/Products.ts so swapping to live data
 * is a parsing job rather than a refactor. EN + AR strings are authored
 * independently (not translated) per the brand's Arabic-native rule.
 */

export type ProductCategory =
  | "storage"
  | "cooking"
  | "workstations"
  | "washing"
  | "hoods";

export type ProductFinish =
  | "brushed-4"
  | "mirror-8"
  | "bead-blasted"
  | "powder-coat";

export type ProductMaterial = "ss304" | "ss316" | "ss430" | "mild" | "aluminium";

export interface ProductCopy {
  /** Display name. */
  name: string;
  /** Short description — one or two sentences for cards + above-the-fold. */
  short: string;
  /** Long-form description — used on the detail page. */
  long: string;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  /** EN + AR strings — never translated; each authored from the brief. */
  copy: { en: ProductCopy; ar: ProductCopy };
  spec: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
    gaugeMm: number;
    material: ProductMaterial;
    finish: ProductFinish;
  };
  /** Placeholder image URLs — swap once media collection has uploads. */
  heroImage: string;
  gallery: string[];
  related: string[];
}

const placeholder = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='#F2F0EC'/><g fill='none' stroke='#c7cdd6' stroke-width='1'><rect x='40' y='40' width='720' height='520'/><line x1='40' y1='40' x2='760' y2='560'/><line x1='760' y1='40' x2='40' y2='560'/></g><text x='400' y='305' text-anchor='middle' font-family='JetBrains Mono, monospace' font-size='14' fill='#1f2937' letter-spacing='2'>${label}</text></svg>`,
  )}`;

export const STUB_PRODUCTS: Product[] = [
  {
    slug: "banquet-prep-table-2400",
    category: "workstations",
    copy: {
      en: {
        name: "Banquet Prep Table — 2400",
        short:
          "Two and a half metres of seamless 304 prep surface, welded as one piece.",
        long: "A workhorse table for hotel banquet kitchens. Single-piece top, ground welds, no hidden seams to trap water or salt. Built to outlive the lease on the building it stands in.",
      },
      ar: {
        name: "طاولة تجهيز للحفلات — ٢٤٠٠",
        short: "متران ونصف من سطح إستانلس مصبوب كقطعة واحدة، بلا فواصل ولا مكاره.",
        long: "طاولة لمطابخ القاعات الكبيرة. السطح صنعة واحدة، اللحامات مبرودة، ما فيه شقوق تخبئ ملح ولا ماء. مصنوعة عشان تعيش أطول من عمر العقد.",
      },
    },
    spec: {
      widthMm: 2400,
      heightMm: 900,
      depthMm: 700,
      gaugeMm: 1.5,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("BANQUET PREP TABLE 2400"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · 3/4"),
      placeholder("VIEW · DETAIL · WELD"),
      placeholder("VIEW · DETAIL · LEG"),
    ],
    related: ["double-bowl-sink-1600", "wall-shelf-1800", "salamander-shelf"],
  },
  {
    slug: "double-bowl-sink-1600",
    category: "washing",
    copy: {
      en: {
        name: "Double-Bowl Sink — 1600",
        short: "Two deep bowls, single-piece top, radiused corners that drain clean.",
        long: "Standard hotel-banquet sink, made to a higher standard. Coved internal corners hose down in under a minute. Drain grids and standpipes ship with the unit.",
      },
      ar: {
        name: "مغسلة ثنائية الحوض — ١٦٠٠",
        short: "حوضين عميقين، السطح قطعة واحدة، الزوايا مدوّرة تنزل الميّة من غير ما تعلق.",
        long: "مغسلة قاعة فنادق، بس مصنوعة بمستوى أعلى. الزوايا الداخلية مقعّرة تتنظف بخرطوم الميّة في أقل من دقيقة. شبك التصريف والقصبات داخل التجهيز.",
      },
    },
    spec: {
      widthMm: 1600,
      heightMm: 900,
      depthMm: 700,
      gaugeMm: 1.2,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("DOUBLE BOWL SINK 1600"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · BOWL"),
      placeholder("VIEW · CORNER · COVED"),
      placeholder("VIEW · UNDERSIDE"),
    ],
    related: ["banquet-prep-table-2400", "wall-shelf-1800", "single-door-cabinet"],
  },
  {
    slug: "wall-shelf-1800",
    category: "storage",
    copy: {
      en: {
        name: "Wall Shelf — 1800",
        short: "A single shelf that takes the weight of a fully-loaded mise en place.",
        long: "Continuous front lip stops sliding pans. Concealed brackets — clean line above any prep counter. Rated 60kg per metre.",
      },
      ar: {
        name: "رف جداري — ١٨٠٠",
        short: "رف واحد يشيل وزن طاولة تحضير كاملة، من غير ما يهتزّ.",
        long: "شفّة أمامية متواصلة توقف الصواني عن الانزلاق. الحوامل مخفية — خط نظيف فوق أي طاولة تحضير. يتحمل ٦٠ كجم لكل متر.",
      },
    },
    spec: {
      widthMm: 1800,
      heightMm: 350,
      depthMm: 300,
      gaugeMm: 1.2,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("WALL SHELF 1800"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · 3/4"),
      placeholder("VIEW · BRACKET"),
      placeholder("VIEW · INSTALLED"),
    ],
    related: ["banquet-prep-table-2400", "single-door-cabinet", "salamander-shelf"],
  },
  {
    slug: "single-door-cabinet",
    category: "storage",
    copy: {
      en: {
        name: "Single-Door Floor Cabinet",
        short: "A locking cabinet for high-value mise, chemicals, or knives.",
        long: "Adjustable internal shelf. Magnetic catch. Recessed handle so the line cook's apron doesn't snag. Inside finished to the same standard as outside.",
      },
      ar: {
        name: "خزانة أرضية بباب واحد",
        short: "خزانة بقفل للأشياء الغالية والسكاكين، يقفلها الشيف وينام مرتاح.",
        long: "رف داخلي قابل للتعديل. مغناطيس على الباب. المقبض غاطس عشان مريول الطبّاخ ما يعلق. الداخل مشطوب بنفس مستوى الخارج، مو زي غيرنا.",
      },
    },
    spec: {
      widthMm: 600,
      heightMm: 900,
      depthMm: 600,
      gaugeMm: 1.2,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("SINGLE DOOR CABINET"),
    gallery: [
      placeholder("VIEW · FRONT · CLOSED"),
      placeholder("VIEW · FRONT · OPEN"),
      placeholder("VIEW · DETAIL · HANDLE"),
      placeholder("VIEW · INSIDE"),
    ],
    related: ["wall-shelf-1800", "banquet-prep-table-2400", "double-bowl-sink-1600"],
  },
  {
    slug: "salamander-shelf",
    category: "cooking",
    copy: {
      en: {
        name: "Salamander Shelf",
        short: "Heat-rated overhead shelf sized for a salamander or finishing oven.",
        long: "Reinforced spine handles thermal cycling without bowing. Rated for surface temperatures above the typical salamander envelope.",
      },
      ar: {
        name: "رف سلامندر",
        short: "رف علوي يتحمل الحرارة، مقاس على الفرن العلوي.",
        long: "العمود الداخلي مقوّى، ما ينحني مع الحرارة المتكررة. مصنف لدرجات حرارة أعلى من سقف السلامندر الاعتيادي.",
      },
    },
    spec: {
      widthMm: 1200,
      heightMm: 400,
      depthMm: 350,
      gaugeMm: 1.5,
      material: "ss430",
      finish: "brushed-4",
    },
    heroImage: placeholder("SALAMANDER SHELF"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · 3/4"),
      placeholder("VIEW · MOUNT"),
      placeholder("VIEW · INSTALLED"),
    ],
    related: ["wall-shelf-1800", "canopy-hood-2400", "banquet-prep-table-2400"],
  },
  {
    slug: "canopy-hood-2400",
    category: "hoods",
    copy: {
      en: {
        name: "Canopy Extraction Hood — 2400",
        short: "Wall-mounted canopy with baffle filters and a continuous grease trough.",
        long: "Engineered for line-cook safety: full perimeter capture, removable baffles, integrated trough that drops oil into a single collection point. Pre-cut for standard duct flange.",
      },
      ar: {
        name: "مدخنة شفط جداريّة — ٢٤٠٠",
        short: "مدخنة بكامل عرض الخط، بفلاتر صفائحية وحوض دهن متواصل.",
        long: "مصنوعة لسلامة الطبّاخين: شفط من كامل المحيط، فلاتر تنفك بسهولة، وحوض داخلي يجمع الزيت في نقطة واحدة. مفصومة مسبقًا لفلنش المجاري القياسي.",
      },
    },
    spec: {
      widthMm: 2400,
      heightMm: 600,
      depthMm: 1200,
      gaugeMm: 1.2,
      material: "ss430",
      finish: "brushed-4",
    },
    heroImage: placeholder("CANOPY HOOD 2400"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · UNDER · FILTERS"),
      placeholder("VIEW · TROUGH"),
      placeholder("VIEW · INSTALLED · LINE"),
    ],
    related: ["salamander-shelf", "banquet-prep-table-2400", "wall-shelf-1800"],
  },
  {
    slug: "workstation",
    category: "workstations",
    copy: {
      en: {
        name: "Pass-Through Workstation",
        short: "Through-table for the line. Solid build, no rattle even at full speed.",
        long: "Designed for the pass — robust marine-edge top, undershelf for warming, cable management for heat lamps. The piece the head chef leans on twenty thousand times a year.",
      },
      ar: {
        name: "طاولة مرور — خط الإعداد",
        short: "طاولة المرور بين المطبخ والصالة. ثابتة، ما تطقطق ولو الخط مزدحم.",
        long: "مصنوعة للمرور — حافة بحرية صلبة، رف سفلي للتسخين، تمديد كهرباء لمصابيح التدفئة. القطعة اللي يستند عليها الشيف عشرين ألف مرة في السنة.",
      },
    },
    spec: {
      widthMm: 1800,
      heightMm: 900,
      depthMm: 800,
      gaugeMm: 1.5,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("PASS THROUGH WORKSTATION"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · 3/4"),
      placeholder("VIEW · UNDERSHELF"),
      placeholder("VIEW · EDGE · MARINE"),
    ],
    related: ["banquet-prep-table-2400", "salamander-shelf", "wall-shelf-1800"],
  },
  {
    slug: "pot-wash-sink-2200",
    category: "washing",
    copy: {
      en: {
        name: "Pot-Wash Sink — 2200",
        short: "Deep three-bay pot-wash for the back of the line.",
        long: "Three bays sized for the largest stock pot in the kitchen. Splash backs welded — not bolted — so they never lift. Drains plumbed for a single trap.",
      },
      ar: {
        name: "مغسلة حلل — ٢٢٠٠",
        short: "ثلاث أحواض عميقة، مقاس على أكبر قدر في المطبخ.",
        long: "الأحواض الثلاثة مقاسها لأكبر قدر مرق في المطبخ. الظهرية ملحومة — مو مبرغية — ما ترتفع عمرها. التصريف موصول على مصيدة واحدة.",
      },
    },
    spec: {
      widthMm: 2200,
      heightMm: 900,
      depthMm: 700,
      gaugeMm: 1.5,
      material: "ss304",
      finish: "brushed-4",
    },
    heroImage: placeholder("POT WASH SINK 2200"),
    gallery: [
      placeholder("VIEW · FRONT"),
      placeholder("VIEW · BAYS"),
      placeholder("VIEW · SPLASHBACK"),
      placeholder("VIEW · UNDERSIDE"),
    ],
    related: ["double-bowl-sink-1600", "banquet-prep-table-2400", "wall-shelf-1800"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return STUB_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return product.related
    .map((rel) => getProductBySlug(rel))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 3);
}

/** Localised category labels — EN + AR authored as a pair, never translated. */
export const CATEGORY_LABELS: Record<
  ProductCategory,
  { en: string; ar: string }
> = {
  storage: { en: "Storage", ar: "تخزين" },
  cooking: { en: "Cooking", ar: "تجهيزات الطبخ" },
  workstations: { en: "Workstations", ar: "طاولات عمل" },
  washing: { en: "Washing", ar: "تجهيزات الغسيل" },
  hoods: { en: "Hoods", ar: "المداخن" },
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "storage",
  "cooking",
  "workstations",
  "washing",
  "hoods",
];

export const MATERIAL_LABELS: Record<ProductMaterial, { en: string; ar: string }> = {
  ss304: { en: "SS 304", ar: "إستانلس ٣٠٤" },
  ss316: { en: "SS 316", ar: "إستانلس ٣١٦" },
  ss430: { en: "SS 430", ar: "إستانلس ٤٣٠" },
  mild: { en: "Mild Steel", ar: "حديد طري" },
  aluminium: { en: "Aluminium", ar: "ألمنيوم" },
};

export const FINISH_LABELS: Record<ProductFinish, { en: string; ar: string }> = {
  "brushed-4": { en: "#4 Brushed", ar: "مفروش #٤" },
  "mirror-8": { en: "#8 Mirror", ar: "مرآة #٨" },
  "bead-blasted": { en: "Bead Blasted", ar: "خشن بالحبيبات" },
  "powder-coat": { en: "Powder Coated", ar: "بودرة حرارية" },
};
