import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  STUB_PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/stub-products";
import { ProductDetail } from "@/components/products/ProductDetail";

export const dynamic = "force-static";
export const dynamicParams = false;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    STUB_PRODUCTS.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  const c = product.copy[safe];
  return { title: `${c.name} — Steel Valley`, description: c.short };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";

  return <ProductDetail locale={safe} product={product} related={related} />;
}
