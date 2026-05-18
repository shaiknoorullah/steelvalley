import { describe, expect, it } from "vitest";
import { HERO_WAYPOINTS, sampleWaypoints } from "../HeroCameraRig";

describe("sampleWaypoints", () => {
  it("returns first waypoint at p=0", () => {
    const r = sampleWaypoints(0);
    expect(r.pos).toEqual([...HERO_WAYPOINTS[0]!.pos]);
    expect(r.fov).toBe(HERO_WAYPOINTS[0]!.fov);
  });

  it("returns last waypoint at p=1", () => {
    const r = sampleWaypoints(1);
    const last = HERO_WAYPOINTS[HERO_WAYPOINTS.length - 1]!;
    expect(r.pos).toEqual([...last.pos]);
    expect(r.fov).toBe(last.fov);
  });

  it("clamps below p=0", () => {
    const r = sampleWaypoints(-0.5);
    expect(r.pos).toEqual([...HERO_WAYPOINTS[0]!.pos]);
  });

  it("clamps above p=1", () => {
    const r = sampleWaypoints(1.5);
    const last = HERO_WAYPOINTS[HERO_WAYPOINTS.length - 1]!;
    expect(r.pos).toEqual([...last.pos]);
  });

  it("interpolates linearly between two waypoints", () => {
    // Midpoint between waypoint 0 (p=0) and waypoint 1 (p=0.2)
    const a = HERO_WAYPOINTS[0]!;
    const b = HERO_WAYPOINTS[1]!;
    const r = sampleWaypoints(0.1);
    expect(r.pos[0]).toBeCloseTo((a.pos[0] + b.pos[0]) / 2, 5);
    expect(r.pos[1]).toBeCloseTo((a.pos[1] + b.pos[1]) / 2, 5);
    expect(r.pos[2]).toBeCloseTo((a.pos[2] + b.pos[2]) / 2, 5);
    expect(r.fov).toBeCloseTo((a.fov + b.fov) / 2, 5);
  });
});
