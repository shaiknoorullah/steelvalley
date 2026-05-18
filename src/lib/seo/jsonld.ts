import { SITE_NAME, SITE_URL } from "./defaults";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [] as string[],
  };
}

export function localBusinessJsonLd(args: {
  phone?: string;
  email?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: args.phone,
    email: args.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: args.addressLocality ?? "Jeddah",
      addressRegion: args.addressRegion ?? "Makkah",
      addressCountry: args.addressCountry ?? "SA",
    },
    geo:
      args.latitude !== undefined && args.longitude !== undefined
        ? {
            "@type": "GeoCoordinates",
            latitude: args.latitude,
            longitude: args.longitude,
          }
        : undefined,
    areaServed: "SA",
  };
}

export function productJsonLd(args: {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  locale: "ar" | "en";
}) {
  const url = `${SITE_URL}${args.locale === "ar" ? "" : "/en"}/products/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
  };
}

export function blogPostingJsonLd(args: {
  title: string;
  excerpt?: string;
  image?: string;
  slug: string;
  locale: "ar" | "en";
  authorName?: string;
  publishedAt?: string;
}) {
  const url = `${SITE_URL}${args.locale === "ar" ? "" : "/en"}/blog/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.excerpt,
    image: args.image,
    mainEntityOfPage: url,
    author: args.authorName
      ? { "@type": "Person", name: args.authorName }
      : undefined,
    datePublished: args.publishedAt,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
