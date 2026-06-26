"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { getGaMeasurementId, isGoogleAnalyticsEnabled } from "@/lib/google-analytics";
import { usePrivacyConsent } from "@/lib/privacy-consent";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const gaId = getGaMeasurementId();
  const consent = usePrivacyConsent();

  if (consent !== "accepted" || !gaId || !isGoogleAnalyticsEnabled()) return null;
  if (pathname?.startsWith("/admin")) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
