import { sendGAEvent } from "@next/third-parties/google";

export const GA_CURRENCY = "TND";

type GaEventParams = Record<string, string | number | boolean | undefined | null>;

export function isGaTrackingDisabled(): boolean {
  const value = process.env.NEXT_PUBLIC_GA_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined;
}

export function isGoogleAnalyticsEnabled(): boolean {
  return Boolean(getGaMeasurementId()) && !isGaTrackingDisabled();
}

function compactParams(params?: GaEventParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!params) return out;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[key] = value;
  }

  return out;
}

export function trackGaEvent(eventName: string, params?: GaEventParams): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("ibm_privacy_consent_v1") !== "accepted") return;
  if (!isGoogleAnalyticsEnabled()) return;
  sendGAEvent("event", eventName, compactParams(params));
}

export function trackGaGenerateLead(params: {
  value?: number;
  currency?: string;
  leadSource?: string;
} & GaEventParams): void {
  const { value, currency, leadSource, ...rest } = params;
  trackGaEvent("generate_lead", {
    ...rest,
    lead_source: leadSource,
    ...(typeof value === "number" && Number.isFinite(value)
      ? { value, currency: currency ?? GA_CURRENCY }
      : {}),
  });
}

export function trackGaSearch(params: {
  searchTerm: string;
} & GaEventParams): void {
  const { searchTerm, ...rest } = params;
  trackGaEvent("search", {
    ...rest,
    search_term: searchTerm,
  });
}
