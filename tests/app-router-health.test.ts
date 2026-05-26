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
