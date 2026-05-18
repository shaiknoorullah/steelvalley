"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Dialog, DialogContent } from "@/ds/components/Dialog";
import { Field, Input, Button } from "@/ds/components";
import { useLeadMagnetTriggers } from "@/lib/hooks/useLeadMagnetTriggers";
import { z } from "zod";

const emailSchema = z.string().email();

type SubmitState = "idle" | "submitting" | "done" | "error";

export function LeadMagnetPopup() {
  const { shouldShow, reason } = useLeadMagnetTriggers();
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Open exactly once when the hook flips
  useEffect(() => {
    if (shouldShow) setOpen(true);
  }, [shouldShow]);

  const submit = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(locale === "ar" ? "أدخل بريداً صحيحاً." : "Enter a valid email.");
      return;
    }
    setState("submitting");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "lead-magnet-popup",
          locale,
          sourcePage:
            typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
      if (res.status === 503) {
        throw new Error(
          locale === "ar"
            ? "الخدمة غير متاحة مؤقتاً."
            : "Service temporarily unavailable.",
        );
      }
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setState("done");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sv:lead-magnet-captured", {
            detail: { source: "lead-magnet-popup" },
          }),
        );
      }
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Submission failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title={
          locale === "ar"
            ? "دليل المطابخ التجارية"
            : "The Commercial Kitchen Buyer's Guide"
        }
        description={
          locale === "ar"
            ? "خلاصة عشرين سنة مع أفضل مطاعم جدة. PDF ثنائي اللغة."
            : "20 years of lessons from Jeddah's top restaurants. Bilingual PDF."
        }
        data-trigger={reason ?? undefined}
      >
        {state === "done" ? (
          <p className="sv-lead-popup-success">
            {locale === "ar"
              ? "تمّ — تفقّد بريدك."
              : "Sent. Check your inbox."}
          </p>
        ) : (
          <div className="sv-lead-popup-body">
            <Field label="Email" required error={error ?? undefined}>
              {({ inputId, describedBy }) => (
                <Input
                  id={inputId}
                  aria-describedby={describedBy}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>
            <Button onClick={submit} loading={state === "submitting"}>
              {locale === "ar" ? "أرسل لي الدليل" : "Send me the guide"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
