"use client";

import { useEffect } from "react";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { trackGaEvent } from "@/lib/google-analytics";
import { isMetaPixelEnabled, trackMetaContact } from "@/lib/meta-pixel";
import { usePrivacyConsent } from "@/lib/privacy-consent";

const CONTACT_INTENT_VALUES = {
  whatsapp: 25,
  phone: 20,
  email: 15,
} as const;

type ContactChannel = keyof typeof CONTACT_INTENT_VALUES;

function getContactChannel(href: string): ContactChannel | null {
  const value = href.toLowerCase();
  if (value.startsWith("tel:")) return "phone";
  if (value.startsWith("mailto:")) return "email";
  if (
    value.startsWith("whatsapp:") ||
    value.includes("wa.me/") ||
    value.includes("api.whatsapp.com/") ||
    value.includes("web.whatsapp.com/")
  ) {
    return "whatsapp";
  }
  return null;
}

function compactText(value: string | null | undefined): string | undefined {
  const text = value?.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 120) : undefined;
}

export default function AnalyticsInteractionTracker() {
  const consent = usePrivacyConsent();
  useEffect(() => {
    if (consent !== "accepted") return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const channel = getContactChannel(link.href);
      if (!channel) return;

      const eventId = createMetaEventId(`${channel}_contact`);
      const linkText = compactText(link.textContent || link.getAttribute("aria-label"));
      const value = CONTACT_INTENT_VALUES[channel];
      const label =
        channel === "whatsapp"
          ? "WhatsApp"
          : channel === "phone"
          ? "Telephone"
          : "Email";

      trackGaEvent(`${channel}_click`, {
        contact_channel: channel,
        link_url: link.href,
        link_text: linkText,
        value,
        currency: "TND",
      });

      if (!isMetaPixelEnabled()) return;

      const payload = {
        eventId,
        contentName: label,
        contentCategory: "contact_intent",
        value,
        customData: {
          contact_channel: channel,
          link_url: link.href,
          link_text: linkText,
        },
      };

      trackMetaContact(payload);
      sendMetaCapiClientEvent({
        eventName: "Contact",
        source: channel,
        ...payload,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  return null;
}
