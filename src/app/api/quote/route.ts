import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/schemas/quote";
import { generateReference } from "@/lib/quote/reference";
import { sendEmail, FROM_EMAIL, SALES_EMAIL } from "@/lib/email/resend";
import { EnquiryReceipt } from "@/lib/email/templates/enquiry-receipt";
import { SalesNotification } from "@/lib/email/templates/sales-notification";

export const runtime = "nodejs";

const MAX_REF_ATTEMPTS = 5;

// Logger fallback when Payload is unreachable (DB cannot connect, etc.)
const consoleLogger = {
  info: (obj: Record<string, unknown>, msg?: string) =>
    console.info(JSON.stringify({ msg, ...obj })),
  warn: (obj: Record<string, unknown>, msg?: string) =>
    console.warn(JSON.stringify({ msg, ...obj })),
  error: (obj: Record<string, unknown>, msg?: string) =>
    console.error(JSON.stringify({ msg, ...obj })),
};

function isDbConnectivityError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /ECONNREFUSED|ENOTFOUND|connect ETIMEDOUT|connection|DATABASE_URL|empty database url|getaddrinfo|invalid url|password authentication|cannot connect to postgres|sasl|scram|client password must be a string/i.test(
    message,
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const quote = parsed.data;

  // Late-import Payload + config so a missing DATABASE_URL doesn't crash module load.
  let payload: Awaited<ReturnType<typeof import("payload").getPayload>>;
  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");
    payload = await getPayload({ config });
  } catch (err) {
    if (isDbConnectivityError(err)) {
      consoleLogger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "Quote: Payload init failed (DB unavailable) — returning 503",
      );
      return NextResponse.json(
        { error: "service_unavailable" },
        { status: 503 },
      );
    }
    consoleLogger.error(
      { err: err instanceof Error ? err.message : String(err) },
      "Quote: unexpected error initialising Payload",
    );
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const logger = (payload as { logger?: typeof consoleLogger }).logger ?? consoleLogger;

  // Resolve source product (if slug was provided) — best-effort
  let sourceProductId: string | undefined;
  if (quote.sourceProductSlug) {
    try {
      const found = await payload.find({
        collection: "products",
        where: { slug: { equals: quote.sourceProductSlug } },
        limit: 1,
      });
      sourceProductId = found.docs[0]?.id as string | undefined;
    } catch (err) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "Quote: source product lookup failed (continuing)",
      );
    }
  }

  // Generate a unique reference, retry on collision
  let reference = generateReference();
  let created = false;
  for (let attempt = 0; attempt < MAX_REF_ATTEMPTS && !created; attempt++) {
    try {
      await payload.create({
        collection: "enquiries",
        data: {
          reference,
          status: "new",
          projectType: quote.projectType,
          scope: quote.scope,
          scopeNotes: quote.scopeNotes,
          dimensions: quote.dimensions,
          budgetBand: quote.budgetBand,
          timeline: quote.timeline,
          name: quote.name,
          company: quote.company,
          phone: quote.phone,
          email: quote.email,
          whatsappOptIn: quote.whatsappOptIn,
          locale: quote.locale,
          sourcePage: quote.sourcePage,
          sourceProduct: sourceProductId,
        },
      });
      created = true;
      break;
    } catch (err) {
      // Postgres unique violation → 23505. Pragma differs by adapter; use string match.
      const message = err instanceof Error ? err.message : String(err);
      if (
        /unique|23505|reference/i.test(message) &&
        attempt < MAX_REF_ATTEMPTS - 1
      ) {
        reference = generateReference();
        continue;
      }
      if (isDbConnectivityError(err)) {
        logger.warn(
          { err: message },
          "Quote: DB unavailable on create — returning 503",
        );
        return NextResponse.json(
          { error: "service_unavailable" },
          { status: 503 },
        );
      }
      logger.error({ err: message }, "Failed to create enquiry");
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
  }

  if (!created) {
    logger.error(
      { attempts: MAX_REF_ATTEMPTS },
      "Quote: exhausted reference retries",
    );
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  // Fire-and-log emails — failure does NOT roll back the enquiry.
  await sendEmail(
    {
      from: FROM_EMAIL(),
      to: quote.email,
      subject: `Steel Valley — Enquiry ${reference}`,
      react: EnquiryReceipt({ reference, quote }),
      kind: "enquiry_receipt",
    },
    logger,
  );

  await sendEmail(
    {
      from: FROM_EMAIL(),
      to: SALES_EMAIL(),
      subject: `[Enquiry] ${reference} — ${quote.projectType}`,
      react: SalesNotification({ reference, quote }),
      replyTo: quote.email,
      kind: "sales_notification",
    },
    logger,
  );

  return NextResponse.json({ reference }, { status: 201 });
}
