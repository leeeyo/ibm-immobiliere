"use client";

import { useEffect, useRef } from "react";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { trackGaEvent } from "@/lib/google-analytics";
import { isMetaPixelEnabled, trackMetaViewContent } from "@/lib/meta-pixel";

type MetaViewContentTrackerProps = {
  contentId: string;
  contentName: string;
  contentCategory: string;
  value?: number;
};

export default function MetaViewContentTracker({
  contentId,
  contentName,
  contentCategory,
  value,
}: MetaViewContentTrackerProps) {
  const firedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${contentCategory}:${contentId}`;
    if (firedKeyRef.current === key) return;
    firedKeyRef.current = key;

    trackGaEvent("view_item", {
      item_id: contentId,
      item_name: contentName,
      item_category: contentCategory,
      ...(typeof value === "number" && Number.isFinite(value)
        ? { value, currency: "TND" }
        : {}),
    });

    if (!isMetaPixelEnabled()) return;

    const eventId = createMetaEventId("view_content");
    const payload = {
      contentId,
      contentName,
      contentCategory,
      value,
      eventId,
    };

    trackMetaViewContent(payload);
    sendMetaCapiClientEvent({
      eventName: "ViewContent",
      source: "view-content",
      ...payload,
    });
  }, [contentCategory, contentId, contentName, value]);

  return null;
}
