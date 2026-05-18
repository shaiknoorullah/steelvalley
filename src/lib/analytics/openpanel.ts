"use client";
import type { SvEvent } from "./events";

let consentGiven = false;

const STORAGE_KEY = "sv-analytics-consent";

export function setAnalyticsConsent(value: boolean) {
  consentGiven = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    window.dispatchEvent(
      new CustomEvent("sv:consent-change", { detail: { value } }),
    );
  }
}

export function getStoredConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return null;
}

/**
 * Tracks a typed event. No-ops when consent has not been granted OR when
 * OpenPanel has not mounted (client ID unset). Safe to call from anywhere
 * — the consumer never needs to check.
 */
export function track<E extends SvEvent>(evt: E) {
  if (!consentGiven) return;
  if (typeof window === "undefined") return;
  // OpenPanel attaches a global `op()` once mounted
  const op = (window as unknown as { op?: (...args: unknown[]) => void }).op;
  op?.("track", evt.name, evt.props);
}
