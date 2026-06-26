"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Upload, Trash2, Loader2 } from "lucide-react";
import { uploadPdf, deleteUpload } from "@/lib/actions/upload";
import { cn } from "@/lib/utils/cn";

interface Props {
  entity: "properties" | "projects" | "blog";
  folder: string;
  /** Current PDF url (controlled). */
  value?: string;
  onChange?: (url: string | undefined) => void;
  /** When set, also renders a hidden input so the value posts with the form. */
  name?: string;
  compact?: boolean;
}

/**
 * Single-PDF uploader (floor plans). Uploads immediately via the `uploadPdf`
 * server action and reports the resulting URL through `onChange` / a hidden input.
 */
export default function PdfUpload({ entity, folder, value, onChange, name, compact }: Props) {
  const [url, setUrl] = useState<string | undefined>(value);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (next: string | undefined) => {
    setUrl(next);
    onChange?.(next);
  };

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    const fd = new FormData();
    fd.set("entity", entity);
    fd.set("folder", folder);
    fd.set("file", file);
    setError(null);
    start(async () => {
      const res = await uploadPdf(fd);
      if (!res.success) {
        setError(res.error);
        return;
      }
      set(res.url);
    });
  };

  const remove = () => {
    const old = url;
    set(undefined);
    if (old) void deleteUpload(old);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {name ? <input type="hidden" name={name} value={url || ""} /> : null}

      {url ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-stone-200)] bg-white px-3 py-2.5">
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-w-0 items-center gap-2 text-sm text-[var(--color-navy-900)] hover:underline"
          >
            <FileText className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />
            <span className="truncate">Voir le plan (PDF)</span>
          </a>
          <button
            type="button"
            onClick={remove}
            aria-label="Supprimer le plan"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-center transition-colors",
            compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
            pending
              ? "border-[var(--color-navy-300)] bg-white"
              : "border-[var(--color-stone-300)] bg-[var(--color-ivory-50)] hover:border-[var(--color-navy-900)] hover:bg-white"
          )}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin text-[var(--color-navy-700)]" />
          ) : (
            <Upload className="h-4 w-4 text-[var(--color-navy-700)]" />
          )}
          <span className="font-medium text-[var(--color-navy-900)]">
            {pending ? "Téléversement…" : "Téléverser un plan (PDF)"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
