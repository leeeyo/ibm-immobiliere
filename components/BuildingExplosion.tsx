"use client";

import Image from "next/image";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const PHASES = [
  {
    index: "01",
    title: "la structure.",
    detail: "Des fondations pensées pour durer.",
    range: [0, 0.25],
  },
  {
    index: "02",
    title: "chaque espace.",
    detail: "Des appartements dessinés autour des usages.",
    range: [0.25, 0.5],
  },
  {
    index: "03",
    title: "jusqu'au détail.",
    detail: "Des finitions qui donnent au lieu son caractère.",
    range: [0.5, 0.75],
  },
  {
    index: "04",
    title: "une seule vision.",
    detail: "Du premier plan au dernier détail.",
    range: [0.75, 1],
  },
] as const;

const VISUALS = [
  {
    src: "/building-explosition/structure.webp",
    alt: "Structure en béton de la résidence",
    range: [0, 0.25],
    scale: 1.02,
  },
  {
    src: "/building-explosition/apartment.webp",
    alt: "Organisation des appartements",
    range: [0.25, 0.5],
    scale: 0.94,
  },
  {
    src: "/building-explosition/interior.webp",
    alt: "Aménagements et finitions intérieures",
    range: [0.5, 0.75],
    scale: 0.9,
  },
  {
    src: "/building-explosition/building.webp",
    alt: "Résidence achevée",
    range: [0.75, 1],
    scale: 0.96,
  },
] as const;

type ScrollProgress = MotionValue<number>;

function Phase({
  phase,
  progress,
  reducedMotion,
  final,
  initial,
}: {
  phase: (typeof PHASES)[number];
  progress: ScrollProgress;
  reducedMotion: boolean;
  final: boolean;
  initial: boolean;
}) {
  const [start, end] = phase.range;
  const fade = 0.055;
  const opacity = useTransform(
    progress,
    initial
      ? [start, end - fade, end]
      : final
        ? [start, start + fade, 1]
        : [start, start + fade, end - fade, end],
    initial ? [1, 1, 0] : final ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], initial ? [0, -12] : [18, -12]);

  return (
    <motion.div
      style={{
        opacity: reducedMotion ? (initial ? 1 : 0) : opacity,
        y: reducedMotion ? 0 : y,
      }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <span className="font-display text-xs text-[var(--color-gold-700)] sm:text-sm">
        {phase.index}
      </span>
      <h3 className="mt-1.5 font-display text-[clamp(2.35rem,11vw,3.3rem)] leading-[0.92] text-[var(--color-navy-900)] lg:mt-2 lg:text-[clamp(3rem,5.5vw,5.8rem)]">
        {phase.title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-5 text-[var(--color-stone-600)] sm:text-base sm:leading-6 lg:mt-5">
        {phase.detail}
      </p>
    </motion.div>
  );
}

function VisualLayer({
  visual,
  progress,
  reducedMotion,
  final,
  initial,
}: {
  visual: (typeof VISUALS)[number];
  progress: ScrollProgress;
  reducedMotion: boolean;
  final: boolean;
  initial: boolean;
}) {
  const [start, end] = visual.range;
  const fade = 0.065;
  const opacity = useTransform(
    progress,
    initial
      ? [start, end - fade, end]
      : final
        ? [start, start + fade, 1]
        : [start, start + fade, end - fade, end],
    initial ? [1, 1, 0] : final ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], initial ? [0, -10] : [16, -10]);
  const scale = useTransform(
    progress,
    [start, end],
    initial ? [visual.scale, visual.scale] : [visual.scale * 0.96, visual.scale]
  );

  return (
    <motion.div
      className="absolute inset-0 drop-shadow-[0_24px_22px_rgba(11,23,51,0.13)]"
      style={{
        opacity: reducedMotion ? (initial ? 1 : 0) : opacity,
        scale: reducedMotion ? visual.scale : scale,
        y: reducedMotion ? 0 : y,
      }}
    >
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        priority={initial}
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-contain"
      />
    </motion.div>
  );
}

function ProgressSegment({
  progress,
  range,
  reducedMotion,
}: {
  progress: ScrollProgress;
  range: readonly [number, number];
  reducedMotion: boolean;
}) {
  const fill = useTransform(progress, [range[0], range[1]], [0, 1]);

  return (
    <span className="h-px flex-1 overflow-hidden bg-[var(--color-stone-300)]">
      <motion.span
        className="block h-full origin-left bg-[var(--color-gold-600)]"
        style={{ scaleX: reducedMotion ? 1 : fill }}
      />
    </span>
  );
}

export default function BuildingExplosion() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className={
        prefersReducedMotion
          ? "relative bg-[var(--color-ivory-50)]"
          : "relative h-[220svh] bg-[var(--color-ivory-50)] lg:h-[225svh]"
      }
      aria-labelledby="building-explosion-title"
    >
      <div className="sticky top-0 min-h-svh overflow-hidden">
        <div className="blueprint !opacity-[0.035]" aria-hidden />

        <div className="container-page relative grid h-svh w-full grid-rows-[44svh_1fr] items-center pb-4 pt-20 lg:min-h-svh lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-1 lg:gap-6 lg:py-20">
          <div className="relative order-2 z-20 flex h-full min-h-0 flex-col justify-center lg:order-1 lg:h-auto lg:pl-4 xl:pl-10">
            <span className="caption text-[var(--color-gold-700)]">
              Une maîtrise intégrée
            </span>
            <h2
              id="building-explosion-title"
              className="mt-2 font-display text-[clamp(2rem,10.5vw,2.75rem)] leading-[0.94] text-[var(--color-navy-900)] lg:mt-4 lg:text-[clamp(2.5rem,4.6vw,4.9rem)]"
            >
              Nous construisons
            </h2>

            <div className="relative h-32 sm:h-36 lg:mt-1 lg:h-60" aria-hidden="true">
              {PHASES.map((phase, index) => (
                <Phase
                  key={phase.index}
                  phase={phase}
                  progress={scrollYProgress}
                  reducedMotion={prefersReducedMotion}
                  final={index === PHASES.length - 1}
                  initial={index === 0}
                />
              ))}
            </div>

            <p className="sr-only">
              De la structure aux appartements et aux finitions, nous réunissons
              chaque savoir-faire dans une vision complète.
            </p>

            <div className="mt-3 flex w-full max-w-xs items-center gap-2 lg:mt-6 lg:max-w-sm">
              {PHASES.map((phase) => (
                <ProgressSegment
                  key={phase.index}
                  progress={scrollYProgress}
                  range={phase.range}
                  reducedMotion={prefersReducedMotion}
                />
              ))}
              <span className="caption ml-2 hidden shrink-0 text-[var(--color-stone-500)] sm:inline">
                Faites défiler
              </span>
            </div>
          </div>

          <div
            className="relative order-1 h-full min-h-0 w-full lg:order-2 lg:h-auto lg:aspect-[1.18/1]"
            aria-hidden="true"
          >
            {VISUALS.map((visual, index) => (
              <VisualLayer
                key={visual.src}
                visual={visual}
                progress={scrollYProgress}
                reducedMotion={prefersReducedMotion}
                final={index === VISUALS.length - 1}
                initial={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
