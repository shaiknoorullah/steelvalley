"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "sv-lead-shown";
const SUPPRESS_PATHS = ["/contact", "/admin"];

export type LeadTrigger = "dwell-90s" | "scroll-60" | "exit-intent";

export interface UseLeadMagnetResult {
  shouldShow: boolean;
  reason: LeadTrigger | null;
}

/**
 * Fires once per session. Suppressed on /contact and /admin (any locale).
 * Triggers in order of first hit: scroll-60%, dwell-90s, or exit-intent.
 */
export function useLeadMagnetTriggers(): UseLeadMagnetResult {
  const [state, setState] = useState<UseLeadMagnetResult>({
    shouldShow: false,
    reason: null,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const normalized = pathname || "/";
    const suppressed = SUPPRESS_PATHS.some((p) =>
      normalized === p ||
      normalized.startsWith(`${p}/`) ||
      // also match locale-prefixed paths like /en/contact, /en/admin
      /^\/[a-z]{2}(\/|$)/.test(normalized) &&
        normalized
          .replace(/^\/[a-z]{2}/, "")
          .replace(/^$/, "/")
          .startsWith(p),
    );
    if (suppressed) return;

    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    let dwellTimer: ReturnType<typeof setTimeout> | undefined;
    let scrollHandler: (() => void) | undefined;
    let exitHandler: ((e: MouseEvent) => void) | undefined;

    const trigger = (reason: LeadTrigger) => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setState({ shouldShow: true, reason });
      cleanup();
      window.dispatchEvent(
        new CustomEvent("sv:lead-magnet-shown", { detail: { reason } }),
      );
    };

    dwellTimer = setTimeout(() => trigger("dwell-90s"), 90_000);

    scrollHandler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.6) trigger("scroll-60");
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    exitHandler = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger("exit-intent");
    };
    document.addEventListener("mouseout", exitHandler);

    function cleanup() {
      if (dwellTimer) clearTimeout(dwellTimer);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      if (exitHandler) document.removeEventListener("mouseout", exitHandler);
    }
    return cleanup;
  }, [pathname]);

  return state;
}
