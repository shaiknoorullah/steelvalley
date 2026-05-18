import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/defaults";

interface DbDoc {
  slug?: string;
}

async function safeLoad<T extends DbDoc>(
  fn: () => Promise<{ docs: T[] }>,
): Promise<T[]> {
  try {
    const res = await fn();
    return res.docs;
  } catch {
    // DB unavailable (no DATABASE_URL, can't connect, etc.) — degrade gracefully.
    return [];
  }
}

function langAlts(path: string): Record<string, string> {
  const ar = `${SITE_URL}${path === "/" ? "" : path}`;
  const en = `${SITE_URL}/en${path === "/" ? "" : path}`;
  return { ar, en, "x-default": ar };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/about",
    "/services",
    "/products",
    "/contact",
    "/blog",
    "/legal/privacy",
    "/legal/terms",
  ];

  let products: DbDoc[] = [];
  let posts: DbDoc[] = [];
  let services: DbDoc[] = [];

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");
    const payload = await getPayload({ config });

    [products, posts, services] = await Promise.all([
      safeLoad(() =>
        payload.find({ collection: "products", limit: 500 }) as unknown as Promise<{
          docs: DbDoc[];
        }>,
      ),
      safeLoad(() =>
        payload.find({
          collection: "posts",
          limit: 500,
          where: { _status: { equals: "published" } },
        }) as unknown as Promise<{ docs: DbDoc[] }>,
      ),
      safeLoad(() =>
        payload.find({ collection: "services", limit: 50 }) as unknown as Promise<{
          docs: DbDoc[];
        }>,
      ),
    ]);
  } catch {
    // Payload failed to init (likely no DB). Ship only static paths.
  }

  const productPaths = products
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => `/products/${slug}`);
  const servicePaths = services
    .map((s) => s.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => `/services#${slug}`);
  const postPaths = posts
    .map((p) => p.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => `/blog/${slug}`);

  const allPaths = [...staticPaths, ...productPaths, ...servicePaths, ...postPaths];

  return allPaths.flatMap((path) => {
    const alternates = { languages: langAlts(path) };
    return [
      {
        url: `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL,
        lastModified: new Date(),
        alternates,
      },
      {
        url: `${SITE_URL}/en${path === "/" ? "" : path}`,
        lastModified: new Date(),
        alternates,
      },
    ];
  });
}
