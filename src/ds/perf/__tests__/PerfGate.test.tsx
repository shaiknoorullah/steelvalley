import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PerfGate } from "../PerfGate";

afterEach(() => {
  vi.restoreAllMocks();
});

function withNavigator(props: {
  deviceMemory?: number;
  effectiveType?: string;
  saveData?: boolean;
  reduced?: boolean;
}) {
  Object.defineProperty(window, "navigator", {
    value: {
      ...window.navigator,
      deviceMemory: props.deviceMemory,
      connection: {
        effectiveType: props.effectiveType ?? "4g",
        saveData: props.saveData ?? false,
      },
    },
    configurable: true,
  });
  Object.defineProperty(window, "matchMedia", {
    value: (q: string) => ({
      matches: q.includes("reduce") ? (props.reduced ?? false) : false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    configurable: true,
  });
}

describe("PerfGate", () => {
  it("renders children on a capable device", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g" });
    render(
      <PerfGate fallback={<span>poster</span>}>
        <span>heavy</span>
      </PerfGate>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("heavy")).toBeTruthy();
  });

  it("renders fallback when deviceMemory below threshold", async () => {
    withNavigator({ deviceMemory: 2, effectiveType: "4g" });
    render(
      <PerfGate fallback={<span>poster</span>}>
        <span>heavy</span>
      </PerfGate>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("heavy")).toBeNull();
    expect(screen.queryByText("poster")).toBeTruthy();
  });

  it("renders fallback on slow connection", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "3g" });
    render(
      <PerfGate fallback={<span>poster</span>}>
        <span>heavy</span>
      </PerfGate>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("heavy")).toBeNull();
  });

  it("renders fallback when prefers-reduced-motion is set", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g", reduced: true });
    render(
      <PerfGate fallback={<span>poster</span>}>
        <span>heavy</span>
      </PerfGate>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("heavy")).toBeNull();
  });

  it("renders fallback when Save-Data is on", async () => {
    withNavigator({ deviceMemory: 8, effectiveType: "4g", saveData: true });
    render(
      <PerfGate fallback={<span>poster</span>}>
        <span>heavy</span>
      </PerfGate>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByText("heavy")).toBeNull();
  });
});
