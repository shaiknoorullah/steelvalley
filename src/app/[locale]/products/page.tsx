import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  STUB_PRODUCTS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "@/lib/data/stub-products";
import { ProductsCatalog } from "@/components/products/ProductsCatalog";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
};

const META = {
  en: {
    title: "Products — Steel Valley",
    description:
      "Stainless steel fabrication for Saudi kitchens. Storage, cooking, workstations, washing, hoods.",
  },
  ar: {
    title: "المنتجات — ستيل فالي",
    description:
      "صنعة الإستانلس للمطابخ السعودية. تخزين، تجهيزات طبخ، طاولات عمل، تجهيزات غسيل، مداخن.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  return META[safe];
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const sp = await searchParams;
  const safeLocale: "en" | "ar" = locale === "ar" ? "ar" : "en";
  const activeCategory =
    sp.cat && CATEGORY_ORDER.includes(sp.cat as never)
      ? (sp.cat as (typeof CATEGORY_ORDER)[number])
      : null;

  return (
    <ProductsCatalog
      locale={safeLocale}
      products={STUB_PRODUCTS}
      categories={CATEGORY_ORDER}
      categoryLabels={CATEGORY_LABELS}
      activeCategory={activeCategory}
    />
  );
}
