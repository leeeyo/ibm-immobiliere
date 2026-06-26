"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaPageView } from "@/lib/meta-pixel";
import { usePrivacyConsent } from "@/lib/privacy-consent";

export default function ThirdPartyAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = usePrivacyConsent();

  useEffect(() => {
    if (consent !== "accepted") return;
    if (!pathname || pathname.startsWith("/admin")) return;
    if (!isMetaPixelEnabled()) return;

    const eventId = createMetaEventId("page_view");
    trackMetaPageView({ eventId });
    sendMetaCapiClientEvent({
      eventName: "PageView",
      eventId,
      source: "page-view",
    });
  }, [consent, pathname, searchParams]);

  return null;
}
