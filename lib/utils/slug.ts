import slugify from "slugify";

export function makeSlug(input: string): string {
  return slugify(input, {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  }).slice(0, 90);
}

/**
 * Returns a slug guaranteed unique against an `exists(slug)` check.
 * Appends -2, -3, … on collision.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const root = makeSlug(base) || "bien";
  let candidate = root;
  let i = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${i++}`;
  }
  return candidate;
}
