import { getMetaFbpFbcFromDocument } from "@/lib/meta-browser";
import { META_CURRENCY, type MetaContentParams } from "@/lib/meta-pixel";

export type MetaCapiClientEventName =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "Contact";

export type MetaClientContext = {
  fbp?: string;
  fbc?: string;
  eventSourceUrl: string;
};

export type MetaCapiClientSource =
  | "page-view"
  | "view-content"
  | "search"
  | "whatsapp"
  | "phone"
  | "email";

export function createMetaEventId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}.${Date.now()}.${random}`;
}

export function getMetaClientContext(): MetaClientContext {
  const { fbp, fbc } = getMetaFbpFbcFromDocument();
  const eventSourceUrl =
    typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  return { fbp, fbc, eventSourceUrl };
}

export function sendMetaCapiClientEvent(input: {
  eventName: MetaCapiClientEventName;
  eventId: string;
  source?: MetaCapiClientSource;
} & MetaContentParams) {
  const meta = getMetaClientContext();

  void fetch("/api/meta/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      ...input,
      currency: input.currency ?? META_CURRENCY,
      meta,
    }),
  }).catch(() => {
    /* Best-effort telemetry must never block user interactions. */
  });
}
