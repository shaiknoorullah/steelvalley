import { Resend } from "resend";

let cached: Resend | null = null;

/**
 * Lazy Resend client.
 * Returns null when RESEND_API_KEY is missing — callers must use
 * `sendEmail()` which handles the no-key fallback (logs + returns success).
 */
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const FROM_EMAIL = () =>
  process.env.RESEND_FROM_EMAIL?.trim() || "no-reply@steelvalley.example";
export const SALES_EMAIL = () =>
  process.env.RESEND_SALES_EMAIL?.trim() || "sales@steelvalley.example";

type Logger = {
  info: (obj: Record<string, unknown>, msg?: string) => void;
  warn: (obj: Record<string, unknown>, msg?: string) => void;
  error: (obj: Record<string, unknown>, msg?: string) => void;
};

export interface SendArgs {
  from: string;
  to: string;
  subject: string;
  react?: React.ReactNode;
  html?: string;
  text?: string;
  replyTo?: string;
  /** Discriminator for logging when sends are stubbed (no API key). */
  kind: string;
}

export interface SendResult {
  ok: boolean;
  stubbed: boolean;
  error?: string;
}

/**
 * Wrapped Resend send. If RESEND_API_KEY is unset OR empty, this is a no-op
 * that logs the attempt and returns `{ ok: true, stubbed: true }`. Otherwise
 * it forwards to the real Resend SDK and returns the outcome.
 *
 * Callers should never throw on email failure — the user's enquiry is
 * already persisted, the email is just a notification.
 */
export async function sendEmail(
  args: SendArgs,
  logger?: Logger,
): Promise<SendResult> {
  const client = getClient();
  if (!client) {
    logger?.info(
      { subject: args.subject, to: args.to, kind: args.kind },
      "Resend SKIPPED (no key)",
    );
    return { ok: true, stubbed: true };
  }

  try {
    const payload: Parameters<typeof client.emails.send>[0] = {
      from: args.from,
      to: args.to,
      subject: args.subject,
    } as Parameters<typeof client.emails.send>[0];

    // Resend supports either react, html, or text — pass through whichever is set.
    if (args.react) (payload as Record<string, unknown>).react = args.react;
    if (args.html) (payload as Record<string, unknown>).html = args.html;
    if (args.text) (payload as Record<string, unknown>).text = args.text;
    if (args.replyTo) (payload as Record<string, unknown>).replyTo = args.replyTo;

    const { error } = await client.emails.send(payload);
    if (error) {
      logger?.warn(
        { err: error, subject: args.subject, to: args.to, kind: args.kind },
        "Resend send returned error",
      );
      return { ok: false, stubbed: false, error: String(error) };
    }
    return { ok: true, stubbed: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger?.warn(
      { err: message, subject: args.subject, to: args.to, kind: args.kind },
      "Resend send threw",
    );
    return { ok: false, stubbed: false, error: message };
  }
}
