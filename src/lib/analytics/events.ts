/**
 * Typed event taxonomy. All `track()` calls must pass one of these shapes —
 * no free-form strings. New events get a new union arm here, never a stringly
 * call-site.
 */
export type SvEvent =
  | { name: "enquiry_started"; props: { source?: string; product?: string } }
  | { name: "enquiry_step_advanced"; props: { step: number } }
  | {
      name: "enquiry_submitted";
      props: { reference: string; projectType: string; budgetBand: string };
    }
  | {
      name: "lead_magnet_shown";
      props: { reason: "dwell-90s" | "scroll-60" | "exit-intent" };
    }
  | { name: "lead_magnet_captured"; props: { source: string } }
  | { name: "whatsapp_clicked"; props: { path: string } }
  | { name: "product_enquired"; props: { product: string } };

export type SvEventName = SvEvent["name"];
