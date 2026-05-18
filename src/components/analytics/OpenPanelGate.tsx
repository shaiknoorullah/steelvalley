"use client";
import { useEffect, useState } from "react";
import { OpenPanelComponent } from "@openpanel/nextjs";
import {
  getStoredConsent,
  setAnalyticsConsent,
} from "@/lib/analytics/openpanel";

interface Props {
  clientId: string;
}

/**
 * Mounts the OpenPanel SDK only after the user has granted analytics
 * consent AND the client ID is configured. Without consent OR without
 * a client ID, this renders null — `track()` then becomes a no-op,
 * the build still succeeds, and PDPL compliance is preserved.
 */
export function OpenPanelGate({ clientId }: Props) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === true) {
      setAnalyticsConsent(true);
      setAllowed(true);
    }
    const onStorage = () => {
      const v = getStoredConsent();
      setAllowed(v === true);
      if (v === true) setAnalyticsConsent(true);
    };
    const onConsent = () => {
      const v = getStoredConsent();
      setAllowed(v === true);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("sv:consent-change", onConsent);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("sv:consent-change", onConsent);
    };
  }, []);

  if (!allowed || !clientId) return null;
  return <OpenPanelComponent clientId={clientId} trackScreenViews />;
}
