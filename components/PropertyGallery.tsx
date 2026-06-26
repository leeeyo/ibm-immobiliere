"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getYoutubeId, getYoutubeThumb, getYoutubeEmbed } from "@/lib/utils/youtube";

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; id: string; thumb: string; embed: string };

export default function PropertyGallery({
  images,
  videos = [],
  alt,
}: {
  images: string[];
  videos?: string[];
  alt: string;
}) {
  const media: MediaItem[] = [
    ...(images?.length ? images : []).map((src) => ({ type: "image" as const, src })),
    ...((videos || [])
      .map((url) => getYoutubeId(url))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({
        type: "video" as const,
        id,
        thumb: getYoutubeThumb(id),
        embed: getYoutubeEmbed(id),
      }))),
  ];

  const safe: MediaItem[] =
    media.length > 0 ? media : [{ type: "image", src: "/placeholder.svg" }];

  const [open, setOpen] = useState<number | null>(null);

  const close = () => setOpen(null);
  const next = () => setOpen((i) => (i === null ? 0 : (i + 1) % safe.length));
  const prev = () => setOpen((i) => (i === null ? 0 : (i - 1 + safe.length) % safe.length));

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, safe.length]);

  const hero = safe[0];
  const sides = safe.slice(1, 4);
  const remaining = safe.length - 4;

  return (
    <>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-3">
        {/* Hero */}
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--color-ivory-100)] lg:col-span-3"
          aria-label="Ouvrir la galerie"
        >
          <Image
            src={hero.type === "image" ? hero.src : hero.thumb}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            unoptimized={hero.type === "video"}
          />
          {hero.type === "video" ? <VideoOverlay large /> : null}
        </button>

        {/* Side stack */}
        {sides.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3">
            {sides.map((item, i) => {
              const idx = i + 1;
              const isLast = idx === 3 && remaining > 0;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setOpen(idx)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-ivory-100)]"
                  aria-label={`Média ${idx + 1}`}
                >
                  <Image
                    src={item.type === "image" ? item.src : item.thumb}
                    alt={`${alt} ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    unoptimized={item.type === "video"}
                  />
                  {item.type === "video" && !isLast ? <VideoOverlay /> : null}
                  {isLast ? (
                    <div className="absolute inset-0 grid place-items-center bg-[var(--color-navy-950)]/60">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                        <ImageIcon className="h-4 w-4" />+{remaining} médias
                      </span>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Lightbox */}
      {open !== null ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[var(--color-navy-950)]/95 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          {safe.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                aria-label="Suivant"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          {/* Stage */}
          <div
            className="flex flex-1 items-center justify-center p-4 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full max-w-6xl">
              {safe[open].type === "image" ? (
                <Image
                  src={(safe[open] as { src: string }).src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="absolute inset-0 m-auto aspect-video max-h-full w-full self-center overflow-hidden rounded-xl bg-black">
                  <iframe
                    key={(safe[open] as { id: string }).id}
                    src={`${(safe[open] as { embed: string }).embed}?autoplay=1&rel=0`}
                    title={`${alt} — vidéo`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          {/* Filmstrip */}
          {safe.length > 1 ? (
            <div
              className="shrink-0 overflow-x-auto px-4 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex w-max gap-2">
                {safe.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpen(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition ${
                      i === open ? "ring-[var(--color-gold-400)]" : "ring-transparent opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`Aller au média ${i + 1}`}
                    aria-current={i === open}
                  >
                    <Image
                      src={item.type === "image" ? item.src : item.thumb}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={item.type === "video"}
                    />
                    {item.type === "video" ? (
                      <span className="absolute inset-0 grid place-items-center bg-black/30">
                        <Play className="h-4 w-4 fill-white text-white" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function VideoOverlay({ large = false }: { large?: boolean }) {
  return (
    <>
      <span className="absolute inset-0 grid place-items-center">
        <span
          className={`grid place-items-center rounded-full bg-black/55 text-white transition-transform group-hover:scale-110 ${
            large ? "h-16 w-16" : "h-11 w-11"
          }`}
        >
          <Play className={large ? "h-7 w-7 fill-white" : "h-5 w-5 fill-white"} />
        </span>
      </span>
      <span className="absolute top-3 left-3 chip chip-gold">Vidéo</span>
    </>
  );
}
