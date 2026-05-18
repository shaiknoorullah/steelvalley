import { describe, it, expect } from "vitest";
import { generateReference } from "../reference";

describe("generateReference", () => {
  it("matches ENQ-YYYY-NNNN", () => {
    expect(generateReference(2026)).toMatch(/^ENQ-2026-\d{4}$/);
  });

  it("randomizes the suffix", () => {
    const refs = new Set(
      Array.from({ length: 50 }, () => generateReference(2026)),
    );
    expect(refs.size).toBeGreaterThan(40);
  });

  it("defaults to current year when not specified", () => {
    const year = new Date().getUTCFullYear();
    expect(generateReference()).toMatch(new RegExp(`^ENQ-${year}-\\d{4}$`));
  });
});
