"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics/openpanel";

/**
 * Listens for the sv:* CustomEvents fired by the marketing / form
 * components and forwards them to the typed `track()` helper. Keeps
 * those components free of any analytics-vendor knowledge.
 */
export function EventBridge() {
  useEffect(() => {
    const onLead = (e: Event) => {
      const reason =
        ((e as CustomEvent).detail?.reason as
          | "dwell-90s"
          | "scroll-60"
          | "exit-intent"
          | undefined) ?? "scroll-60";
      track({ name: "lead_magnet_shown", props: { reason } });
    };
    const onLeadCapture = (e: Event) => {
      const source = (e as CustomEvent).detail?.source ?? "lead-magnet-popup";
      track({ name: "lead_magnet_captured", props: { source } });
    };
    const onWa = (e: Event) => {
      const path = (e as CustomEvent).detail?.path ?? "/";
      track({ name: "whatsapp_clicked", props: { path } });
    };
    const onProductEnquired = (e: Event) => {
      const product = (e as CustomEvent).detail?.product ?? "";
      track({ name: "product_enquired", props: { product } });
    };
    const onEnquirySubmitted = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { reference: string; projectType: string; budgetBand: string }
        | undefined;
      if (!detail) return;
      track({
        name: "enquiry_submitted",
        props: {
          reference: detail.reference,
          projectType: detail.projectType,
          budgetBand: detail.budgetBand,
        },
      });
    };

    window.addEventListener("sv:lead-magnet-shown", onLead);
    window.addEventListener("sv:lead-magnet-captured", onLeadCapture);
    window.addEventListener("sv:whatsapp-click", onWa);
    window.addEventListener("sv:product-enquired", onProductEnquired);
    window.addEventListener("sv:enquiry-submitted", onEnquirySubmitted);
    return () => {
      window.removeEventListener("sv:lead-magnet-shown", onLead);
      window.removeEventListener("sv:lead-magnet-captured", onLeadCapture);
      window.removeEventListener("sv:whatsapp-click", onWa);
      window.removeEventListener("sv:product-enquired", onProductEnquired);
      window.removeEventListener("sv:enquiry-submitted", onEnquirySubmitted);
    };
  }, []);
  return null;
}
