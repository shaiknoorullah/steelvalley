"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface StepperContextValue {
  current: number;
  total: number;
  goNext: () => void;
  goPrev: () => void;
  goTo: (i: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used inside a <Stepper>");
  return ctx;
}

interface StepperProps {
  steps: number;
  initial?: number;
  syncHash?: string; // e.g. "step" → reflects as #step-1, #step-2 in the URL
  children: ReactNode;
  onChange?: (index: number) => void;
}

export function Stepper({ steps, initial = 0, syncHash, children, onChange }: StepperProps) {
  const [current, setCurrent] = useState(initial);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(i, 0), steps - 1);
      setCurrent(clamped);
      onChange?.(clamped);
      if (syncHash && typeof window !== "undefined") {
        window.location.hash = `${syncHash}-${clamped + 1}`;
      }
    },
    [steps, syncHash, onChange],
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Initialise from URL hash (back-button support)
  useEffect(() => {
    if (!syncHash || typeof window === "undefined") return;
    const m = window.location.hash.match(new RegExp(`^#${syncHash}-(\\d+)$`));
    if (m && m[1]) {
      const target = parseInt(m[1], 10) - 1;
      if (!Number.isNaN(target)) setCurrent(target);
    }
    const onHash = () => {
      const m2 = window.location.hash.match(new RegExp(`^#${syncHash}-(\\d+)$`));
      if (m2 && m2[1]) {
        const t = parseInt(m2[1], 10) - 1;
        if (!Number.isNaN(t)) setCurrent(t);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [syncHash]);

  return (
    <StepperContext.Provider value={{ current, total: steps, goNext, goPrev, goTo }}>
      <div data-component="stepper" data-current={current + 1} data-total={steps}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

export function StepperStep({ index, children }: { index: number; children: ReactNode }) {
  const { current } = useStepper();
  const active = current === index;
  return (
    <div
      data-component="stepper-step"
      data-active={active || undefined}
      hidden={!active}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

export function StepperProgress() {
  const { current, total } = useStepper();
  return (
    <div
      data-component="stepper-progress"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <span data-component="stepper-progress-label">
        step {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
