const FBC_MAX = 512;
const FBP_MAX = 256;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  for (const part of document.cookie.split(";")) {
    const segment = part.trim();
    if (!segment) continue;
    const eq = segment.indexOf("=");
    if (eq < 0) continue;
    if (segment.slice(0, eq).trim() !== name) continue;

    const raw = segment.slice(eq + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return undefined;
}

function fbclidFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return new URL(window.location.href).searchParams.get("fbclid") || undefined;
  } catch {
    return undefined;
  }
}

export function getMetaFbpFbcFromDocument(): {
  fbp: string | undefined;
  fbc: string | undefined;
} {
  if (typeof document === "undefined") return { fbp: undefined, fbc: undefined };

  let fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (fbp) fbp = fbp.slice(0, FBP_MAX);
  if (fbc) fbc = fbc.slice(0, FBC_MAX);

  if (!fbc) {
    const fbclid = fbclidFromUrl();
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`.slice(0, FBC_MAX);
    }
  }

  return { fbp: fbp || undefined, fbc: fbc || undefined };
}
