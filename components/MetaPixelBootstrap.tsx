import MetaPixelBootstrapClient from "@/components/MetaPixelBootstrapClient";
import { isMetaTrackingDisabled } from "@/lib/meta-pixel";

function isServerMetaTrackingDisabled() {
  const value = process.env.META_TRACKING_DISABLED?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export default function MetaPixelBootstrap() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (!pixelId || isServerMetaTrackingDisabled() || isMetaTrackingDisabled()) return null;

  return <MetaPixelBootstrapClient pixelId={pixelId} />;
}
