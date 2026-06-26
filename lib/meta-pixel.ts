export const META_CURRENCY = "TND";

type MetaFbq = {
  (action: "init", pixelId: string, userData?: Record<string, string | undefined>): void;
  (action: "set", key: string, value: unknown, pixelId?: string): void;
  (
    action: "track" | "trackCustom",
    event: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string },
  ): void;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: MetaFbq;
    _fbq?: unknown;
  }
}

export type MetaContentParams = {
  contentId?: string;
  contentIds?: string[];
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
  searchString?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
};

export function isMetaTrackingDisabled(): boolean {
  const value = process.env.NEXT_PUBLIC_META_TRACKING_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function isMetaPixelEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()) && !isMetaTrackingDisabled();
}

function getFbq(): MetaFbq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.fbq;
}

function compactPayload(input: MetaContentParams): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ...input.customData,
  };

  const contentIds = input.contentIds ?? (input.contentId ? [input.contentId] : undefined);
  if (contentIds?.length) payload.content_ids = contentIds;
  if (input.contentName) payload.content_name = input.contentName;
  if (input.contentCategory) payload.content_category = input.contentCategory;
  if (input.searchString) payload.search_string = input.searchString;
  if (typeof input.value === "number" && Number.isFinite(input.value)) {
    payload.value = input.value;
    payload.currency = input.currency ?? META_CURRENCY;
  }

  return payload;
}

function trackMetaStandardEvent(eventName: string, params: MetaContentParams = {}): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("ibm_privacy_consent_v1") !== "accepted") return;
  const fbq = getFbq();
  if (!fbq) return;

  const payload = compactPayload(params);
  if (params.eventId) {
    fbq("track", eventName, payload, { eventID: params.eventId });
    return;
  }

  fbq("track", eventName, payload);
}

export function trackMetaPageView(params?: { eventId?: string }): void {
  trackMetaStandardEvent("PageView", params);
}

export function trackMetaViewContent(params: MetaContentParams): void {
  trackMetaStandardEvent("ViewContent", params);
}

export function trackMetaSearch(params: MetaContentParams & { eventId: string }): void {
  trackMetaStandardEvent("Search", params);
}

export function trackMetaLead(params: MetaContentParams & { eventId: string }): void {
  trackMetaStandardEvent("Lead", params);
}

export function trackMetaContact(params: MetaContentParams & { eventId: string }): void {
  trackMetaStandardEvent("Contact", params);
}
