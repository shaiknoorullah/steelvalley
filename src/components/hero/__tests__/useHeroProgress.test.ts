import { describe, expect, it, beforeEach } from "vitest";
import { deriveStage, useHeroProgress } from "../useHeroProgress";

describe("useHeroProgress", () => {
  beforeEach(() => {
    useHeroProgress.getState().set(0);
  });

  it("clamps progress to 0..1", () => {
    useHeroProgress.getState().set(-0.5);
    expect(useHeroProgress.getState().progress).toBe(0);
    useHeroProgress.getState().set(1.5);
    expect(useHeroProgress.getState().progress).toBe(1);
  });

  it("derives stage from progress", () => {
    useHeroProgress.getState().set(0);
    expect(useHeroProgress.getState().stage).toBe(0);
    useHeroProgress.getState().set(0.21);
    expect(useHeroProgress.getState().stage).toBe(1);
    useHeroProgress.getState().set(0.41);
    expect(useHeroProgress.getState().stage).toBe(2);
    useHeroProgress.getState().set(0.61);
    expect(useHeroProgress.getState().stage).toBe(3);
    useHeroProgress.getState().set(0.81);
    expect(useHeroProgress.getState().stage).toBe(4);
    useHeroProgress.getState().set(1);
    expect(useHeroProgress.getState().stage).toBe(4);
  });

  it("deriveStage handles stage boundaries", () => {
    expect(deriveStage(0)).toBe(0);
    expect(deriveStage(0.2)).toBe(1);
    expect(deriveStage(0.4)).toBe(2);
    expect(deriveStage(0.6)).toBe(3);
    expect(deriveStage(0.8)).toBe(4);
    expect(deriveStage(0.999)).toBe(4);
  });
});
