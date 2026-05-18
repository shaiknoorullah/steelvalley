import type { QuoteInput } from "@/lib/schemas/quote";

interface Props {
  reference: string;
  quote: QuoteInput;
}

export function SalesNotification({ reference, quote }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#0a0a0b" }}>
      <h2>New enquiry — {reference}</h2>
      <p>
        <strong>Name:</strong> {quote.name}
      </p>
      <p>
        <strong>Company:</strong> {quote.company ?? "—"}
      </p>
      <p>
        <strong>Phone:</strong> {quote.phone}
      </p>
      <p>
        <strong>Email:</strong> {quote.email}
      </p>
      <p>
        <strong>WhatsApp opt-in:</strong> {quote.whatsappOptIn ? "yes" : "no"}
      </p>
      <hr />
      <p>
        <strong>Project type:</strong> {quote.projectType}
      </p>
      <p>
        <strong>Scope:</strong> {quote.scope.join(", ")}
      </p>
      {quote.scopeNotes ? (
        <p>
          <strong>Notes:</strong> {quote.scopeNotes}
        </p>
      ) : null}
      <p>
        <strong>Dimensions:</strong> {quote.dimensions ?? "—"}
      </p>
      <p>
        <strong>Budget:</strong> {quote.budgetBand}
      </p>
      <p>
        <strong>Timeline:</strong> {quote.timeline}
      </p>
      <p>
        <strong>Locale:</strong> {quote.locale}
      </p>
      <p>
        <strong>Source product:</strong> {quote.sourceProductSlug ?? "—"}
      </p>
      <p>
        <strong>Source page:</strong> {quote.sourcePage ?? "—"}
      </p>
    </div>
  );
}
