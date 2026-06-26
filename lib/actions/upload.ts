"use server";

import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { assertAdmin } from "@/lib/auth/session";

const ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export type UploadResult =
  | { success: true; urls: string[] }
  | { success: false; error: string };

type Entity = "properties" | "projects" | "blog" | "misc";

function safeEntity(value: unknown): Entity {
  return value === "properties" || value === "projects" || value === "blog"
    ? value
    : "misc";
}

export async function uploadImages(formData: FormData): Promise<UploadResult> {
  try {
    await assertAdmin();
  } catch {
    return { success: false, error: "Non autorisé." };
  }

  const entity = safeEntity(formData.get("entity"));
  const folder = String(formData.get("folder") || "shared")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64) || "shared";

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return { success: false, error: "Aucun fichier reçu." };
  }

  const dir = path.join(ROOT, entity, folder);
  await fs.mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    if (file.size > MAX_BYTES) {
      return { success: false, error: `Fichier trop volumineux: ${file.name}` };
    }
    if (!/^image\//.test(file.type)) {
      return { success: false, error: `Format non pris en charge: ${file.name}` };
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const id = `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
    const filename = `${id}.webp`;
    const out = path.join(dir, filename);

    await sharp(buf)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);

    urls.push(`/uploads/${entity}/${folder}/${filename}`);
  }

  return { success: true, urls };
}

export type UploadFileResult =
  | { success: true; url: string; name: string }
  | { success: false; error: string };

/**
 * Single-PDF upload (floor plans). Stored as-is under
 * /uploads/{entity}/{folder}/plan-{id}.pdf and returned as a public URL.
 */
export async function uploadPdf(formData: FormData): Promise<UploadFileResult> {
  try {
    await assertAdmin();
  } catch {
    return { success: false, error: "Non autorisé." };
  }

  const entity = safeEntity(formData.get("entity"));
  const folder = String(formData.get("folder") || "shared")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64) || "shared";

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Aucun fichier reçu." };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: `Fichier trop volumineux: ${file.name}` };
  }
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) {
    return { success: false, error: "Seuls les fichiers PDF sont acceptés." };
  }

  const dir = path.join(ROOT, entity, folder);
  await fs.mkdir(dir, { recursive: true });

  const id = `plan-${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  const filename = `${id}.pdf`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buf);

  return {
    success: true,
    url: `/uploads/${entity}/${folder}/${filename}`,
    name: file.name,
  };
}

export async function deleteUpload(url: string): Promise<{ success: boolean }> {
  try {
    await assertAdmin();
  } catch {
    return { success: false };
  }
  if (!url.startsWith("/uploads/")) return { success: false };
  const fp = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(fp);
    return { success: true };
  } catch {
    return { success: false };
  }
}
