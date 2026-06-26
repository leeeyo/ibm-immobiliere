"use client";

import { useSyncExternalStore } from "react";

export type PrivacyConsent = "accepted" | "refused" | null;
const STORAGE_KEY = "ibm_privacy_consent_v1";
const EVENT_NAME = "ibm-privacy-consent-change";
const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export function getPrivacyConsent(): PrivacyConsent {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as { value?: unknown; savedAt?: unknown };
    const value = parsed.value;
    const savedAt = parsed.savedAt;
    const validValue = value === "accepted" || value === "refused";
    if (
      validValue &&
      typeof savedAt === "number" &&
      Date.now() - savedAt <= CONSENT_MAX_AGE_MS
    ) {
      return value;
    }
  } catch {
    // Legacy values are intentionally expired so the visitor can choose again.
  }
  window.localStorage.removeItem(STORAGE_KEY);
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getPrivacyConsent() === "accepted";
}

export function setPrivacyConsent(value: Exclude<PrivacyConsent, null>) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value, savedAt: Date.now() })
  );
  window.dispatchEvent(new Event(EVENT_NAME));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

export function usePrivacyConsent(): PrivacyConsent {
  return useSyncExternalStore(subscribe, getPrivacyConsent, () => null);
}
