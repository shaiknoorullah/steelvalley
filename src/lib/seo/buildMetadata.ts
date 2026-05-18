import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, seoDefaults } from "./defaults";

interface Args {
  locale: "ar" | "en";
  title?: string;
  description?: string;
  /** Page path WITHOUT a leading locale, e.g. "/products/workstation" */
  path: string;
  /** Override OG image URL (otherwise built via /og?title=…&locale=…) */
  ogImage?: string;
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  ogImage,
}: Args): Metadata {
  const d = seoDefaults[locale];
  const fullTitle = title ? `${title} — ${SITE_NAME}` : d.title;
  const desc = description ?? d.description;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE_URL}${locale === "ar" ? "" : "/en"}${cleanPath === "/" ? "" : cleanPath}`;
  const arAlt = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}` || SITE_URL;
  const enAlt = `${SITE_URL}/en${cleanPath === "/" ? "" : cleanPath}`;
  const ogUrl =
    ogImage ??
    `${SITE_URL}/og?title=${encodeURIComponent(title ?? d.title)}&locale=${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical,
      languages: {
        ar: arAlt,
        en: enAlt,
        "x-default": arAlt,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogUrl],
    },
  };
}
