export const SITE_NAME = "Steel Valley";
export const SITE_URL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://steelvalley.example";

export const seoDefaults = {
  ar: {
    title: "ستيل فالي — تصنيع الفولاذ المقاوم للصدأ في جدة",
    description:
      "أكثر من 20 عاماً في تصنيع المطابخ التجارية والديكورات الفولاذية للمطاعم والفنادق والمستشفيات في جدة والمملكة العربية السعودية.",
  },
  en: {
    title: "Steel Valley — Stainless Steel Fabrication, Jeddah",
    description:
      "20+ years building commercial kitchens, hand railings, column cladding, and decorative steel for restaurants, hotels, and hospitals across Saudi Arabia.",
  },
} as const;
