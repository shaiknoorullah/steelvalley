"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/ds/components";
import {
  setAnalyticsConsent,
  getStoredConsent,
} from "@/lib/analytics/openpanel";

export function CookieBanner() {
  const locale = useLocale() as "ar" | "en";
  const [decision, setDecision] = useState<boolean | null | "pending">(
    "pending",
  );

  useEffect(() => {
    setDecision(getStoredConsent());
  }, []);

  if (decision !== null) return null;

  const accept = () => {
    setAnalyticsConsent(true);
    setDecision(true);
  };
  const reject = () => {
    setAnalyticsConsent(false);
    setDecision(false);
  };

  return (
    <div
      role="region"
      aria-label={
        locale === "ar" ? "تفضيلات الكوكيز" : "Cookie preferences"
      }
      data-component="cookie-banner"
    >
      <p>
        {locale === "ar"
          ? "نستخدم مجموعة محدودة من ملفات تتبع التحليلات (OpenPanel) لفهم حركة الزوار، بدون أي شبكات إعلانية خارجية."
          : "We use a small set of analytics cookies (OpenPanel) to understand traffic. No third-party ad networks."}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button variant="ghost" onClick={reject}>
          {locale === "ar" ? "رفض" : "Reject"}
        </Button>
        <Button onClick={accept}>
          {locale === "ar" ? "موافق" : "Accept"}
        </Button>
      </div>
    </div>
  );
}
