"use client";

import { useEffect, useRef, useState } from "react";
import { MeasurementStampLoader } from "./MeasurementStampLoader";

interface Props {
  locale: "ar" | "en";
  children: React.ReactNode;
}

const SESSION_KEY = "sv-loader-shown";
// How long after `ready` flips true we keep the loader mounted so the
// section-cut animation can finish before the DOM is removed.
const UNMOUNT_DELAY_MS = 800;

/**
 * LoaderShell — progress driver + lifecycle wrapper specified in
 * docs/superpowers/specs/2026-05-18-loading-and-transitions.md §2.5.
 *
 * Responsibilities:
 *   1. Decide whether to show the loader at all (skips on intra-session
 *      navigations via sessionStorage).
 *   2. Drive `progress` from real signals: `document.fonts.ready` and
 *      `document.readyState`. Lerped so it never snaps.
 *   3. Flip `ready` when both signals are settled.
 *   4. Unmount the loader after the reveal animation completes.
 *
 * Children always render — the loader sits on top via `position: fixed`
 * with `z-index: 9999` so the page beneath is fully painted by the time
 * the section-cut clears.
 */
export function LoaderShell({ locale, children }: Props) {
  // Default true so SSR renders the loader on the first paint. The
  // session-skip check runs in an effect after mount.
  const [shouldShow, setShouldShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(true);
  const rafRef = useRef<number | null>(null);
  const fontsResolvedRef = useRef(false);

  // Session de-dupe: the brand makes its statement once per session.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setShouldShow(false);
        setMounted(false);
      }
    } catch {
      // sessionStorage can throw in some embedded contexts; fall through
      // and show the loader rather than crash.
    }
  }, []);

  // Track when web fonts finish loading. `document.fonts.ready` is a
  // promise that resolves once the initial set is settled.
  useEffect(() => {
    if (!shouldShow) return;
    if (typeof document === "undefined" || !document.fonts) {
      fontsResolvedRef.current = true;
      return;
    }
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) fontsResolvedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, [shouldShow]);

  // Progress loop. Eases the current value toward a target derived from
  // the live readiness signals, so the dimension number never snaps.
  useEffect(() => {
    if (!shouldShow) return;

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const fontsReady = fontsResolvedRef.current ? 1 : 0;
      const docReady =
        document.readyState === "complete"
          ? 1
          : document.readyState === "interactive"
            ? 0.6
            : 0.2;
      const target = Math.min(1, fontsReady * 0.4 + docReady * 0.6);

      setProgress((p) => {
        // Lerp 10% per frame toward target — feels weighty without lagging.
        const next = p + (target - p) * 0.1;
        // Snap to 1 once we're within rounding distance of target=1, so
        // the displayed "1800 MM" actually lands on the integer.
        return target >= 0.999 && next > 0.995 ? 1 : next;
      });

      if (target >= 0.999) {
        setReady(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldShow]);

  // After `ready` flips, the loader runs its reveal animation (200ms
  // hold + 350ms cut + safety). Then unmount + mark session-shown.
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    const t = setTimeout(() => setMounted(false), UNMOUNT_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      {children}
      {shouldShow && mounted ? (
        <MeasurementStampLoader
          progress={progress}
          ready={ready}
          locale={locale}
        />
      ) : null}
    </>
  );
}
