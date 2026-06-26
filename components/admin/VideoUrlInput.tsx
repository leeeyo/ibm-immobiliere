"use client";

import { useState } from "react";
import Image from "next/image";
import { Youtube, Plus, Trash2, GripVertical } from "lucide-react";
import { getYoutubeId, getYoutubeThumb } from "@/lib/utils/youtube";
import { cn } from "@/lib/utils/cn";

interface Props {
  name: string;
  defaultValue?: string[];
  max?: number;
}

/**
 * Multi-video (YouTube) URL editor. Posts a hidden JSON array under `name`.
 * Mirrors ImageUploader's hidden-input pattern so it plugs into the FormData flow.
 */
export default function VideoUrlInput({ name, defaultValue = [], max = 12 }: Props) {
  const [videos, setVideos] = useState<string[]>(defaultValue);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const url = value.trim();
    if (!url) return;
    if (videos.length >= max) {
      setError(`Limite de ${max} vidéos atteinte.`);
      return;
    }
    const id = getYoutubeId(url);
    if (!id) {
      setError("Lien YouTube invalide. Collez une URL de type youtube.com/watch?v=… ou youtu.be/…");
      return;
    }
    if (videos.some((v) => getYoutubeId(v) === id)) {
      setError("Cette vidéo est déjà ajoutée.");
      return;
    }
    setVideos((prev) => [...prev, url]);
    setValue("");
    setError(null);
  };

  const removeAt = (idx: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= videos.length) return;
    setVideos((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(videos)} />

      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Youtube className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-stone-400)]" />
          <input
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-md border border-[var(--color-stone-300)] bg-white py-2.5 pl-9 pr-3 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--color-navy-900)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)]"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-xs text-[var(--color-stone-500)]">
        Collez l&apos;URL d&apos;une vidéo YouTube. {videos.length} / {max}
      </p>

      {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}

      {videos.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((url, idx) => {
            const id = getYoutubeId(url);
            return (
              <li
                key={url}
                className="group relative aspect-video overflow-hidden rounded-lg bg-[var(--color-navy-950)] ring-1 ring-[var(--color-stone-200)]"
              >
                {id ? (
                  <Image
                    src={getYoutubeThumb(id)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                ) : null}
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white">
                    <Youtube className="h-4 w-4" />
                  </span>
                </span>
                <span className="absolute top-2 left-2 chip chip-gold">Vidéo</span>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label="Monter"
                    onClick={() => move(idx, idx - 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-[var(--color-navy-900)] hover:bg-white"
                  >
                    <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    aria-label="Supprimer"
                    onClick={() => removeAt(idx)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
