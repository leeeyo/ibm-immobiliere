import { SITE } from "@/lib/constants/site";

export function getSiteOrigin(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.AUTH_URL?.trim();

  const raw =
    explicit ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : SITE.url);

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return SITE.url.replace(/\/$/, "");
  }
}
