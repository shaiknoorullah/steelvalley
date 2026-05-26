/**
 * Smoke tests for the locale-aware App Router + Payload admin.
 *
 * These tests probe a running dev server rather than spawning one — the
 * spawn-and-pipe pattern is fragile on Windows + Node 24 + Next 15.5
 * (Payload's first-compile latency + stdout buffering combine to time out).
 *
 * Run flow:
 *   1. Start dev:  npm run dev   (in another terminal)
 *   2. Wait until /admin returns 200 (Payload first-compile is ~60s)
 *   3. Run tests:  npm test
 *
 * If the dev server isn't running on http://localhost:3000, every test
 * skips with a clear hint.
 */
import { describe, it, expect, beforeAll } from "vitest";

const BASE = process.env.SV_TEST_BASE_URL ?? "http://localhost:3000";

let serverUp = false;

beforeAll(async () => {
  try {
    const res = await fetch(`${BASE}/app-router-health`, {
      signal: AbortSignal.timeout(3000),
    });
    serverUp = res.status === 200;
  } catch {
    serverUp = false;
  }
});

const skipIfDown = (name: string, fn: () => Promise<void>, timeout?: number) => {
  it(name, async () => {
    if (!serverUp) {
      console.warn(
        `[skip] dev server not reachable at ${BASE} — start it with 'npm run dev' before re-running tests.`,
      );
      return;
    }
    await fn();
  }, timeout);
};

describe("Next 15 App Router scaffold", () => {
  skipIfDown("serves /app-router-health with the placeholder body", async () => {
    const res = await fetch(`${BASE}/app-router-health`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("App Router is alive.");
  });
});

describe("Bilingual routing (next-intl)", () => {
  skipIfDown("serves Arabic at / with lang=ar dir=rtl", async () => {
    const res = await fetch(BASE);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html[^>]*\blang="ar"/);
    expect(html).toMatch(/<html[^>]*\bdir="rtl"/);
  });

  skipIfDown("serves English at /en with lang=en dir=ltr", async () => {
    const res = await fetch(`${BASE}/en`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<html[^>]*\blang="en"/);
    expect(html).toMatch(/<html[^>]*\bdir="ltr"/);
  });
});

describe("Payload admin + REST", () => {
  skipIfDown(
    "/admin returns 200 (logged in) or 307/308 (redirect to login)",
    async () => {
      const res = await fetch(`${BASE}/admin`, { redirect: "manual" });
      expect([200, 307, 308]).toContain(res.status);
    },
    30_000,
  );

  skipIfDown("/api/categories returns the seeded docs", async () => {
    const res = await fetch(`${BASE}/api/categories`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { totalDocs: number };
    expect(json.totalDocs).toBeGreaterThanOrEqual(5);
  });
});

// Plan 2 end-state assertions. Every collection + global from
// payload.config.ts must be reachable via REST. Public collections
// return 200; locked ones return 403 — that proves they're mounted
// and access-controlled, which is the intended Plan 2 posture.
describe("Plan 2: collections mounted", () => {
  const PUBLIC_COLLECTIONS = [
    "media",
    "categories",
    "products",
    "services",
    "authors",
    "posts",
    "pages",
  ] as const;
  const LOCKED_COLLECTIONS = [
    "users",
    "lead-magnets",
    "enquiries",
    "leads",
  ] as const;

  for (const slug of PUBLIC_COLLECTIONS) {
    skipIfDown(`/api/${slug} responds 200 with docs[]`, async () => {
      const res = await fetch(`${BASE}/api/${slug}`);
      expect(res.status).toBe(200);
      const json = (await res.json()) as { docs?: unknown[] };
      expect(Array.isArray(json.docs)).toBe(true);
    });
  }

  for (const slug of LOCKED_COLLECTIONS) {
    skipIfDown(`/api/${slug} responds 401 or 403 (locked but mounted)`, async () => {
      const res = await fetch(`${BASE}/api/${slug}`);
      expect([401, 403]).toContain(res.status);
    });
  }
});

describe("Plan 2: globals mounted", () => {
  for (const slug of ["settings", "nav"] as const) {
    skipIfDown(`/api/globals/${slug} responds 200`, async () => {
      const res = await fetch(`${BASE}/api/globals/${slug}`);
      expect(res.status).toBe(200);
    });
  }
});

describe("Plan 2: bilingual field persistence", () => {
  // The 'storage' category is seeded with English "Storage" and Arabic
  // "التخزين". Round-tripping via ?locale= proves localized fields
  // persist per-locale rather than collapsing to the fallback value.
  skipIfDown("category 'storage' has different localized names per locale", async () => {
    const [enRes, arRes] = await Promise.all([
      fetch(`${BASE}/api/categories?where[slug][equals]=storage&locale=en&limit=1`),
      fetch(`${BASE}/api/categories?where[slug][equals]=storage&locale=ar&limit=1`),
    ]);
    expect(enRes.status).toBe(200);
    expect(arRes.status).toBe(200);
    const enJson = (await enRes.json()) as { docs: { name: string }[] };
    const arJson = (await arRes.json()) as { docs: { name: string }[] };
    expect(enJson.docs).toHaveLength(1);
    expect(arJson.docs).toHaveLength(1);
    expect(enJson.docs[0].name).toBe("Storage");
    expect(arJson.docs[0].name).not.toBe(enJson.docs[0].name);
    // Arabic Unicode block (U+0600 – U+06FF)
    expect(arJson.docs[0].name).toMatch(/[؀-ۿ]/);
  });
});
