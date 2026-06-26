/**
 * YouTube URL helpers.
 * Supports watch?v=, youtu.be/, /embed/, /shorts/ and bare 11-char IDs.
 */

const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/** Extract the 11-character video id from any common YouTube URL form, or null. */
export function getYoutubeId(input: string | undefined | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  // Already a bare id
  if (YT_ID_RE.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return YT_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      // /watch?v=ID
      const v = url.searchParams.get("v");
      if (v && YT_ID_RE.test(v)) return v;
      // /embed/ID or /shorts/ID or /v/ID
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "v");
      if (idx >= 0 && parts[idx + 1] && YT_ID_RE.test(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

/** True when the string parses to a valid YouTube video id. */
export function isYoutubeUrl(input: string | undefined | null): boolean {
  return getYoutubeId(input) !== null;
}

/** Thumbnail URL for a video id (hqdefault is always available). */
export function getYoutubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/** Privacy-friendly embed URL for a video id. */
export function getYoutubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
