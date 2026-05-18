import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { STUB_POSTS, getPostBySlug } from "@/lib/data/stub-posts";
import { BlogPost } from "@/components/blog/BlogPost";

export const dynamic = "force-static";
export const dynamicParams = false;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    STUB_POSTS.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  const c = post.copy[safe];
  return { title: `${c.title} — Steel Valley`, description: c.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const safe: "en" | "ar" = locale === "ar" ? "ar" : "en";
  return <BlogPost locale={safe} post={post} />;
}
