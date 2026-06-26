import { getSiteOrigin } from "@/lib/site-url";

export function resolveMetaEventSourceUrl(candidate: unknown, fallbackPath = "/"): string {
  const origin = getSiteOrigin();
  const fallback = `${origin}${fallbackPath.startsWith("/") ? fallbackPath : `/${fallbackPath}`}`;
  if (typeof candidate !== "string") return fallback;

  const trimmed = candidate.trim();
  if (!trimmed) return fallback;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
    if (url.origin !== origin) return fallback;
    return url.hash ? url.href.slice(0, url.href.length - url.hash.length) : url.href;
  } catch {
    return fallback;
  }
}
