"use client";

import { useRef, useState, useTransition } from "react";
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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`Limite de ${max} images atteinte.`);
      return;
    }
    const slice = Array.from(files).slice(0, remaining);
    const fd = new FormData();
    fd.set("entity", entity);
    fd.set("folder", folder);
    for (const f of slice) fd.append("files", f);

    setError(null);
    startTransition(async () => {
      const res = await uploadImages(fd);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setImages((prev) => [...prev, ...res.urls]);
    });
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
            ? "border-[var(--color-navy-300)] bg-white"
            : "border-[var(--color-stone-300)] bg-[var(--color-ivory-50)] hover:border-[var(--color-navy-900)] hover:bg-white"
        )}
      >
        {pending ? (
          <Loader2 className="h-6 w-6 text-[var(--color-navy-700)] animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-[var(--color-navy-700)]" />
        )}
        <p className="text-sm font-medium text-[var(--color-navy-900)]">
          {pending ? "Téléversement…" : "Cliquer pour téléverser des images"}
        </p>
        <p className="text-xs text-[var(--color-stone-500)]">
          PNG, JPG, WEBP — jusqu&apos;à 10 Mo · {images.length} / {max}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error ? (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      ) : null}

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
