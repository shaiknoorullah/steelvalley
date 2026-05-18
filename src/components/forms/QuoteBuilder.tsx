"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Form } from "@/ds/components/Form";
import {
  Stepper,
  StepperStep,
  StepperProgress,
  useStepper,
} from "@/ds/components/Stepper";
import { Button } from "@/ds/components/Button";
import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote";
import {
  StepType,
  StepScope,
  StepDimensions,
  StepBudget,
  StepTimeline,
  StepContact,
} from "./QuoteBuilder.steps";

interface Props {
  sourceProductSlug?: string;
}

function StepNav({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { current, total, goNext, goPrev } = useStepper();
  const isLast = current === total - 1;
  return (
    <div className="sv-quote-nav">
      <Button
        type="button"
        variant="ghost"
        onClick={goPrev}
        disabled={current === 0}
      >
        Previous
      </Button>
      {isLast ? (
        <Button type="button" onClick={onSubmit} loading={isSubmitting}>
          Submit enquiry
        </Button>
      ) : (
        <Button type="button" onClick={goNext}>
          Next
        </Button>
      )}
    </div>
  );
}

export function QuoteBuilder({ sourceProductSlug }: Props) {
  const locale = useLocale() as QuoteInput["locale"];
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: QuoteInput) => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: QuoteInput = {
        ...values,
        locale,
        sourceProductSlug,
        sourcePage:
          typeof window !== "undefined"
            ? window.location.pathname
            : undefined,
      };
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 503) {
        throw new Error(
          "Submission service temporarily unavailable. Please try again shortly.",
        );
      }
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const { reference } = (await res.json()) as { reference: string };
      const target =
        locale === "ar"
          ? `/contact/thanks?ref=${encodeURIComponent(reference)}`
          : `/en/contact/thanks?ref=${encodeURIComponent(reference)}`;
      // Dispatch analytics event (consumed by EventBridge → OpenPanel when consent given)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sv:enquiry-submitted", {
            detail: {
              reference,
              projectType: payload.projectType,
              budgetBand: payload.budgetBand,
            },
          }),
        );
      }
      router.push(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  };

  return (
    <div className="sv-quote-builder">
      <Form
        schema={quoteSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          locale,
          scope: [],
          whatsappOptIn: false,
        }}
      >
        <Stepper steps={6} syncHash="step">
          <div className="sv-quote-header">
            <StepperProgress />
          </div>

          <StepperStep index={0}>
            <StepType />
          </StepperStep>
          <StepperStep index={1}>
            <StepScope />
          </StepperStep>
          <StepperStep index={2}>
            <StepDimensions />
          </StepperStep>
          <StepperStep index={3}>
            <StepBudget />
          </StepperStep>
          <StepperStep index={4}>
            <StepTimeline />
          </StepperStep>
          <StepperStep index={5}>
            <StepContact />
          </StepperStep>

          <StepNav
            isSubmitting={submitting}
            onSubmit={() => {
              const form = document.querySelector<HTMLFormElement>(
                "form[data-component='form']",
              );
              form?.requestSubmit();
            }}
          />
          {error ? (
            <small role="alert" className="sv-quote-error sv-quote-error--banner">
              {error}
            </small>
          ) : null}
        </Stepper>
      </Form>
    </div>
  );
}
