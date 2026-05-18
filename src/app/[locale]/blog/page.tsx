import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { STUB_POSTS } from "@/lib/data/stub-posts";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: string }>;
};

const META = {
  en: {
    title: "Journal — Steel Valley",
    description: "Notes from the shop floor — craft, kitchens, field notes, studio.",
  },
  ar: {
    title: "المدوّنة — ستيل فالي",
    description: "ملاحظات من أرض الورشة — صنعة، مطابخ، ميدان، مرسم.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  return META[safe];
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";

  const sorted = [...STUB_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return <BlogIndex locale={safe} posts={sorted} />;
}
