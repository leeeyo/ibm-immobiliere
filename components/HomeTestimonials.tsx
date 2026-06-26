"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TestimonialType } from "@/lib/types";

type Props = {
  testimonials: TestimonialType[];
};

const INTERVAL_MS = 6500;

export default function HomeTestimonials({ testimonials }: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = testimonials.length;
  const t = testimonials[i]!;

  useEffect(() => {
    if (n <= 1 || paused) return;
    const id = window.setInterval(() => {
      setI((prev) => (prev + 1) % n);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [n, paused]);

  const go = useCallback(
    (delta: number) => {
      setPaused(true);
      setI((prev) => (prev + delta + n) % n);
      window.setTimeout(() => setPaused(false), 8000);
    },
    [n]
  );

  if (n === 0) return null;

  return (
    <div className="max-w-4xl mx-auto text-center">
      <span className="caption">Paroles de clients</span>

      <div
        className="relative mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className="editorial-hero text-[clamp(1.75rem,3.6vw,3rem)] text-[var(--color-navy-900)]">
              <span className="font-display text-[var(--color-gold-500)] text-6xl leading-none align-top mr-2">
                &ldquo;
              </span>
              {t.content}
              <span className="font-display text-[var(--color-gold-500)] text-6xl leading-none ml-1">
                &rdquo;
              </span>
            </blockquote>
            <div className="mt-10 flex flex-col items-center gap-2">
              <div className="h-px w-16 bg-[var(--color-gold-500)]" aria-hidden />
              <p className="font-display text-lg text-[var(--color-navy-900)]">{t.clientName}</p>
              {t.projectReference ? (
                <p className="text-xs uppercase tracking-widest text-[var(--color-stone-500)]">
                  {t.projectReference}
                </p>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {n > 1 ? (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-stone-200)] text-[var(--color-navy-900)] transition-colors hover:border-[var(--color-gold-500)] hover:bg-[var(--color-ivory-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <div className="flex gap-2 px-2" role="tablist" aria-label="Choisir un témoignage">
                {testimonials.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === i}
                    aria-label={`Témoignage ${idx + 1} sur ${n}`}
                    onClick={() => {
                      setPaused(true);
                      setI(idx);
                      window.setTimeout(() => setPaused(false), 8000);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === i
                        ? "w-10 bg-[var(--color-gold-500)]"
                        : "w-2.5 bg-[var(--color-stone-300)] hover:bg-[var(--color-stone-400)]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-stone-200)] text-[var(--color-navy-900)] transition-colors hover:border-[var(--color-gold-500)] hover:bg-[var(--color-ivory-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
