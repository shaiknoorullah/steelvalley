import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, FROM_EMAIL } from "@/lib/email/resend";
import { LeadMagnetDelivery } from "@/lib/email/templates/lead-magnet-delivery";

export const runtime = "nodejs";

const leadSchema = z.object({
  email: z.string().email(),
  source: z.enum(["lead-magnet-popup", "blog-footer", "other"]),
  locale: z.enum(["ar", "en"]),
  sourcePage: z.string().optional(),
});

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
  return /ECONNREFUSED|ENOTFOUND|connect ETIMEDOUT|connection|DATABASE_URL|empty database url|getaddrinfo|invalid url|password authentication/i.test(
    message,
  );
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const lead = parsed.data;

  let payload: Awaited<ReturnType<typeof import("payload").getPayload>>;
  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");
    payload = await getPayload({ config });
  } catch (err) {
    if (isDbConnectivityError(err)) {
      consoleLogger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "Lead: Payload init failed (DB unavailable) — returning 503",
      );
      return NextResponse.json(
        { error: "service_unavailable" },
        { status: 503 },
      );
    }
    consoleLogger.error(
      { err: err instanceof Error ? err.message : String(err) },
      "Lead: unexpected error initialising Payload",
    );
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const logger = (payload as { logger?: typeof consoleLogger }).logger ?? consoleLogger;

  // Idempotent insert — update on existing email
  let id: string;
  try {
    const existing = await payload.find({
      collection: "leads",
      where: { email: { equals: lead.email } },
      limit: 1,
    });
    if (existing.docs[0]) {
      id = existing.docs[0].id as string;
      await payload.update({
        collection: "leads",
        id,
        data: {
          sourcePage: lead.sourcePage,
          source: lead.source,
          locale: lead.locale,
        },
      });
    } else {
      const created = await payload.create({
        collection: "leads",
        data: {
          email: lead.email,
          source: lead.source,
          locale: lead.locale,
          sourcePage: lead.sourcePage,
        },
      });
      id = created.id as string;
    }
  } catch (err) {
    if (isDbConnectivityError(err)) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err) },
        "Lead: DB unavailable on persist — returning 503",
      );
      return NextResponse.json(
        { error: "service_unavailable" },
        { status: 503 },
      );
    }
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      "Lead: persist failed",
    );
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  // Resolve active lead magnet for the locale (best-effort)
  let downloadUrl: string | undefined;
  try {
    const magnet = await payload.find({
      collection: "lead-magnets",
      where: {
        locale: { equals: lead.locale },
        active: { equals: true },
      },
      limit: 1,
    });
    const file = magnet.docs[0] as { url?: string } | undefined;
    downloadUrl = file?.url;
  } catch (err) {
    logger.warn(
      { err: err instanceof Error ? err.message : String(err) },
      "Lead: lead-magnet lookup failed (continuing without file)",
    );
  }

  if (!downloadUrl) {
    logger.warn(
      { id, locale: lead.locale },
      "Lead: no active lead magnet — saved without delivery",
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  const result = await sendEmail(
    {
      from: FROM_EMAIL(),
      to: lead.email,
      subject:
        lead.locale === "ar"
          ? "دليلك من ستيل فالي"
          : "Your Steel Valley guide",
      react: LeadMagnetDelivery({ signedUrl: downloadUrl, locale: lead.locale }),
      kind: "lead_magnet_delivery",
    },
    logger,
  );

  if (result.ok) {
    try {
      await payload.update({
        collection: "leads",
        id,
        data: { delivered: true, deliveredAt: new Date().toISOString() },
      });
    } catch (err) {
      logger.warn(
        { err: err instanceof Error ? err.message : String(err), id },
        "Lead: post-send delivered flag update failed",
      );
    }
  }

  return NextResponse.json({ ok: true, delivered: result.ok });
}
