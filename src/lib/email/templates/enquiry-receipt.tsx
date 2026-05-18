import type { QuoteInput } from "@/lib/schemas/quote";

interface Props {
  reference: string;
  quote: QuoteInput;
}

export function EnquiryReceipt({ reference, quote }: Props) {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#0a0a0b",
        padding: "24px",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Thanks, {quote.name}.</h1>
      <p>
        We&apos;ve received your enquiry. Reference:{" "}
        <strong>{reference}</strong>
      </p>
      <p>Our team typically replies within one business day.</p>
      <hr />
      <p>Summary:</p>
      <ul>
        <li>Project type: {quote.projectType}</li>
        <li>Scope: {quote.scope.join(", ")}</li>
        {quote.dimensions ? (
          <li>Dimensions / quantity: {quote.dimensions}</li>
        ) : null}
        <li>Budget band: {quote.budgetBand}</li>
        <li>Timeline: {quote.timeline}</li>
      </ul>
      <p>— Steel Valley, Jeddah</p>
    </div>
  );
}
