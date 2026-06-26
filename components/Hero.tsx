import { MapPin } from "lucide-react";

import HeroBackdrop from "@/components/HeroBackdrop";
import HeroSearch from "@/components/HeroSearch";
import Marquee from "@/components/Marquee";
import { SITE, CONTACT } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

const LOCATIONS = [
  "Ariana",
  "Tunis",
  "Sousse",
  "Boumhal",
  "Borj Cedria",
  "Riadh El Andalous",
];

/**
 * Cinematic hero: full-bleed image (with lazy-loaded video on capable clients)
 * behind editorial typography + search card.
 * Mobile (< lg): natural height stack.
 * Desktop (lg+): full-viewport centered column.
 */
export default async function Hero() {
  const settings = await getWebsiteSettings();
  const yearsOfExperience = settings.yearsOfExperience || SITE.yearsOfExperience;
  const residencesDelivered = settings.residencesDelivered || SITE.residencesDelivered;
  const hours = settings.hours || CONTACT.hours;

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full min-w-0 flex-col overflow-hidden bg-[var(--color-navy-950)] text-white supports-[height:100dvh]:min-h-[100dvh] lg:h-[100svh] lg:max-h-[100svh] lg:min-h-0 supports-[height:100dvh]:lg:h-[100dvh] supports-[height:100dvh]:lg:max-h-[100dvh]"
      aria-label="Présentation IBM Immobilière"
    >
      <HeroBackdrop />

      {/* ─── Mobile (< lg) — tight: promise → action → trust ─── */}
      <div className="relative z-10 flex min-h-0 min-w-0 w-full flex-1 flex-col justify-center pt-[calc(5rem+env(safe-area-inset-top,0px))] lg:hidden">
        <div
          className="w-full pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] py-6"
        >
          <h1 className="font-display text-[clamp(2.25rem,9vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white text-balance">
            Votre prochaine adresse,
            <span className="mt-1 block bg-gradient-to-r from-[var(--color-gold-300)] via-[var(--color-gold-400)] to-[var(--color-gold-200)] bg-clip-text font-normal italic text-transparent">
              sans surprise.
            </span>
          </h1>

          <p className="mt-7 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[var(--color-gold-400)]" aria-hidden />
              {yearsOfExperience} ans
            </span>
            <span className="h-2.5 w-px bg-white/25" aria-hidden />
            <span>{residencesDelivered}+ résidences livrées</span>
            <span className="h-2.5 w-px bg-white/25" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-[var(--color-gold-300)]" aria-hidden />
              Ariana
            </span>
          </p>
        </div>

        <div className="ml-[max(1rem,env(safe-area-inset-left,0px))] mr-[max(1rem,env(safe-area-inset-right,0px))] mt-6 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/60 to-transparent" />
      </div>

      {/* ─── Desktop (lg+) — utility strip ─── */}
      <div className="container-page relative z-10 hidden min-w-0 shrink-0 lg:block lg:pt-[calc(2.5rem+5rem+0.25rem+env(safe-area-inset-top,0px))]">
        <div className="flex flex-wrap items-center justify-between gap-y-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
          <span className="inline-flex min-w-0 items-center gap-2">
            <span className="relative inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--color-gold-400)] pulse-dot" />
            <span className="truncate">Bureau ouvert · {hours}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-300)]" />
            Ariana — Tunisie
          </span>
        </div>
      </div>

      {/* ─── Desktop (lg+) — main column ─── */}
      <div className="container-page relative z-10 hidden min-h-0 min-w-0 flex-1 flex-col justify-start pt-3 pb-2 sm:pt-6 sm:pb-4 lg:flex lg:flex-col lg:justify-center lg:pt-8 lg:pb-10">
        <div className="min-w-0 w-full max-w-none text-left text-balance lg:mx-auto lg:max-w-3xl lg:text-center">
          <span className="caption line-rise block !text-[var(--color-gold-300)] lg:inline-block">
            Promoteur · Architecte · Tunis
          </span>

          <h1 className="editorial-hero line-rise delay-1 mt-2 max-w-none text-[clamp(1.85rem,6.5vw,3.75rem)] leading-[1.05] text-white sm:mt-3 sm:text-[clamp(2rem,6vw,3.75rem)] xl:mt-4 xl:text-[clamp(2.75rem,5.5vw,5rem)]">
            <span className="block lg:inline">Votre prochaine adresse,</span>{" "}
            <span className="block lg:inline">
              <em className="!text-[var(--color-gold-300)]">sans surprise.</em>
            </span>
          </h1>

          <p className="line-rise delay-2 mt-3 max-w-none text-[15px] leading-snug text-white/80 sm:mt-4 sm:text-base lg:mx-auto lg:max-w-md">
            Promoteur immobilier en Tunisie depuis {yearsOfExperience} ans.
            Visitez avant de signer.
          </p>

          <div className="line-rise delay-3 mt-5 min-w-0 w-full max-w-none sm:mt-6 xl:mt-7">
            <HeroSearch compact />
          </div>

          <ul className="line-rise delay-4 mt-5 flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-[0.16em] text-white/70 sm:mt-6 sm:text-[11px] sm:tracking-[0.18em]">
            <li className="inline-flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold-400)]" aria-hidden />
              {yearsOfExperience} ans d&apos;expertise
            </li>
            <li className="hidden h-3 w-px shrink-0 bg-white/25 sm:block" aria-hidden />
            <li className="inline-flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold-400)]" aria-hidden />
              {residencesDelivered}+ résidences livrées
            </li>
            <li className="hidden h-3 w-px shrink-0 bg-white/25 sm:block" aria-hidden />
            <li className="inline-flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold-400)]" aria-hidden />
              Bureau d&apos;Ariana
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Locations marquee — ground strip ─── */}
      <div className="relative z-10 mt-6 shrink-0 border-t border-white/10 bg-[var(--color-navy-950)]/85 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:mt-auto">
        <Marquee className="py-2 sm:py-2.5" slow>
          {LOCATIONS.flatMap((l, i) => [
            <span
              key={`loc-${l}-${i}`}
              className="font-display text-lg tracking-tight text-white sm:text-xl"
            >
              {l}
            </span>,
            <span
              key={`dot-${l}-${i}`}
              className="h-2 w-2 rounded-full bg-[var(--color-gold-400)]"
              aria-hidden
            />,
          ])}
        </Marquee>
      </div>
    </section>
  );
}

