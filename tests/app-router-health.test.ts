import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

let dev: ChildProcess;

beforeAll(async () => {
  dev = spawn("npm", ["run", "dev"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3001" },
  });

  // Wait for "Ready" on stdout, max 30s
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("dev server timeout")), 30_000);
    dev.stdout!.on("data", (chunk: Buffer) => {
      if (chunk.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  // Belt and braces — give Next a moment after "Ready"
  await wait(500);
}, 60_000);

afterAll(() => {
  dev?.kill("SIGTERM");
});

describe("Next 15 App Router scaffold", () => {
  it("serves /app-router-health with the placeholder body", async () => {
    const res = await fetch("http://localhost:3001/app-router-health");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("App Router is alive.");
  });

  it("still serves the existing Pages Router root", async () => {
    const res = await fetch("http://localhost:3001/");
    expect(res.status).toBe(200);
  }, 60_000);
});
