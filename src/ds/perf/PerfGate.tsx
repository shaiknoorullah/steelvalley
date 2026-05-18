"use client";
import { useEffect, useState, type ReactNode } from "react";

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { effectiveType?: string; saveData?: boolean };
}

interface PerfGateProps {
  children: ReactNode;
  fallback: ReactNode;
  minDeviceMemory?: number; // default 4
  requireFastConnection?: boolean; // default true → must be "4g"
}

export function PerfGate({
  children,
  fallback,
  minDeviceMemory = 4,
  requireFastConnection = true,
}: PerfGateProps) {
  const [decision, setDecision] = useState<"loading" | "allow" | "deny">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honour OS reduced-motion as a hard deny for decorative motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDecision("deny");
      return;
    }

    const nav = window.navigator as NavigatorWithHints;
    const mem = nav.deviceMemory ?? 8; // unknown → assume capable
    const conn = nav.connection;

    const memOk = mem >= minDeviceMemory;
    const connOk = !requireFastConnection || (conn?.effectiveType ?? "4g") === "4g";
    const saveDataOff = !conn?.saveData;

    setDecision(memOk && connOk && saveDataOff ? "allow" : "deny");
  }, [minDeviceMemory, requireFastConnection]);

  if (decision === "loading" || decision === "deny") return <>{fallback}</>;
  return <>{children}</>;
}
