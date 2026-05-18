"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SUPPRESS_PATHS = ["/admin"];

function isSuppressed(pathname: string | null): boolean {
  if (!pathname) return false;
  const stripped = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  return SUPPRESS_PATHS.some(
    (p) => stripped === p || stripped.startsWith(`${p}/`),
  );
}

export function WhatsAppCTA() {
  const pathname = usePathname();
  const [message, setMessage] = useState("Hi Steel Valley.");

  // Build the prefilled message on the client so we get the current path
  useEffect(() => {
    if (typeof window === "undefined") return;
    setMessage(
      `Hi Steel Valley — I'm on ${window.location.pathname}, would like to talk to a fabricator.`,
    );
  }, [pathname]);

  if (isSuppressed(pathname)) return null;

  // Default placeholder so the CTA renders even before the env var is set.
  const phone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "+9665000000000";
  const cleanPhone = phone.replace(/\D/g, "");

  const href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const onClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("sv:whatsapp-click", {
          detail: { path: window.location.pathname },
        }),
      );
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Steel Valley on WhatsApp"
      onClick={onClick}
      data-component="whatsapp-cta"
    >
      WhatsApp
    </a>
  );
}
