"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, GripVertical, Loader2 } from "lucide-react";
import { uploadImages, deleteUpload } from "@/lib/actions/upload";
import { cn } from "@/lib/utils/cn";

interface Props {
  name: string;
  entity: "properties" | "projects" | "blog";
  folder: string;
  defaultValue?: string[];
  max?: number;
}

type UploadItem = {
  id: string;
  name: string;
  status: "queued" | "uploading" | "done" | "error";
};

const UPLOAD_CONCURRENCY = 2;

/**
 * Multi-image uploader. Posts a hidden JSON value under `name` for the form.
 * Images are uploaded immediately on selection (server-side via Action).
 */
export default function ImageUploader({
  name,
  entity,
  folder,
  defaultValue = [],
  max = 12,
}: Props) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateUploadItem = (id: string, patch: Partial<UploadItem>) => {
    setUploadItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleFiles = async (files: FileList | null) => {
    if (pending || !files || files.length === 0) return;
    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`Limite de ${max} images atteinte.`);
      return;
    }

    const slice = Array.from(files).slice(0, remaining);
    const batch = slice.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      name: file.name,
      status: "queued" as const,
    }));

    setError(null);
    setUploadItems(batch);
    setPending(true);

    try {
      const results: string[][] = Array.from({ length: slice.length }, () => []);
      let nextIndex = 0;
      let firstError: string | null = null;

      async function uploadNext() {
        while (nextIndex < slice.length) {
          const index = nextIndex;
          nextIndex += 1;

          const file = slice[index];
          const item = batch[index];
          updateUploadItem(item.id, { status: "uploading" });

          const fd = new FormData();
          fd.set("entity", entity);
          fd.set("folder", folder);
          fd.append("files", file);

          const res = await uploadImages(fd);
          if (!res.success) {
            firstError ||= res.error;
            updateUploadItem(item.id, { status: "error" });
            continue;
          }

          results[index] = res.urls;
          updateUploadItem(item.id, { status: "done" });
        }
      }

      await Promise.all(
        Array.from(
          { length: Math.min(UPLOAD_CONCURRENCY, slice.length) },
          () => uploadNext()
        )
      );

      const uploaded = results.flat();
      if (uploaded.length > 0) {
        setImages((prev) => [...prev, ...uploaded]);
      }
      if (firstError) {
        setError(firstError);
      }
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (idx: number) => {
    const url = images[idx];
    setImages((prev) => prev.filter((_, i) => i !== idx));
    void deleteUpload(url);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <label
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer text-center px-6 py-10 transition-colors",
          pending
            ? "border-[var(--color-navy-300)] bg-white pointer-events-none"
            : "border-[var(--color-stone-300)] bg-[var(--color-ivory-50)] hover:border-[var(--color-navy-900)] hover:bg-white"
        )}
      >
        {pending ? (
          <Loader2 className="h-6 w-6 text-[var(--color-navy-700)] animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-[var(--color-navy-700)]" />
        )}
        <p className="text-sm font-medium text-[var(--color-navy-900)]">
          {pending ? "Téléversement..." : "Cliquer pour téléverser des images"}
        </p>
        <p className="text-xs text-[var(--color-stone-500)]">
          PNG, JPG, WEBP - jusqu&apos;à 10 Mo · {images.length} / {max}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={pending}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploadItems.length > 0 ? (
        <ul className="mt-3 space-y-1.5 rounded-lg border border-[var(--color-stone-200)] bg-white p-3">
          {uploadItems.map((item, idx) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="min-w-0 truncate text-[var(--color-stone-600)]">
                {idx + 1}. {item.name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 font-medium",
                  item.status === "done" && "bg-emerald-50 text-emerald-700",
                  item.status === "error" && "bg-red-50 text-red-700",
                  item.status === "uploading" &&
                    "bg-[var(--color-ivory-100)] text-[var(--color-navy-900)]",
                  item.status === "queued" &&
                    "bg-[var(--color-stone-100)] text-[var(--color-stone-600)]"
                )}
              >
                {item.status === "queued"
                  ? "En attente"
                  : item.status === "uploading"
                    ? "En cours"
                    : item.status === "done"
                      ? "Ajoutée"
                      : "Erreur"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      {images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, idx) => (
            <li
              key={src}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-[var(--color-stone-200)] bg-white"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              {idx === 0 ? (
                <span className="absolute top-2 left-2 chip chip-gold">Couverture</span>
              ) : null}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Monter"
                    onClick={() => move(idx, idx - 1)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-white/90 text-[var(--color-navy-900)] hover:bg-white"
                  >
                    <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Supprimer"
                  onClick={() => removeAt(idx)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
