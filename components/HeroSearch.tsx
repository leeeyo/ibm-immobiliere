"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { trackGaSearch } from "@/lib/google-analytics";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaSearch } from "@/lib/meta-pixel";

const PROPERTY_TYPES = [
  { value: "", label: "Tous types" },
  { value: "residential", label: "Appartement" },
  { value: "commercial", label: "Bureau / Commerce" },
];

const LOCATIONS = [
  { value: "", label: "Toutes villes" },
  { value: "Ariana", label: "Ariana" },
  { value: "Tunis", label: "Tunis" },
  { value: "Sousse", label: "Sousse" },
  { value: "Boumhal", label: "Boumhal" },
  { value: "Borj Cedria", label: "Borj Cedria" },
];

export default function HeroSearch({
  compact = false,
  layout = "default",
}: {
  compact?: boolean;
  /** Larger touch targets, segment tabs, stacked fields — hero mobile only (< lg) */
  layout?: "default" | "heroMobile";
}) {
  const router = useRouter();
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const isHeroMobile = layout === "heroMobile";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    const base = "/proprietes";
    const qs = params.toString();
    const searchString = ["achat", type, location].filter(Boolean).join(" ");

    trackGaSearch({
      searchTerm: searchString,
      property_intent: "buy",
      property_type: type || "all",
      location: location || "all",
    });

    if (isMetaPixelEnabled()) {
      const eventId = createMetaEventId("search");
      const payload = {
        eventId,
        searchString,
        contentCategory: "property_search",
        customData: {
          property_intent: "buy",
          property_type: type || "all",
          location: location || "all",
        },
      };
      trackMetaSearch(payload);
      sendMetaCapiClientEvent({
        eventName: "Search",
        source: "search",
        ...payload,
      });
    }

    router.push(qs ? `${base}?${qs}` : base);
  };

  if (isHeroMobile) {
    return (
      <form
        onSubmit={submit}
        className={cn(
          "w-full min-w-0 max-w-none overflow-hidden rounded-[1.35rem]",
          "bg-white shadow-[0_28px_64px_-28px_rgba(11,23,51,0.45)] ring-2 ring-[var(--color-navy-900)]/8"
        )}
      >
        <div className="border-b border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] px-3 py-3">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-stone-500)]">
            Rechercher un bien à acheter
          </p>
        </div>

        <div className="divide-y divide-[var(--color-stone-200)] bg-[var(--color-stone-50)]">
          <FieldMobileHero
            label="Type"
            hint="Nature du bien"
            icon={<Building2 className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />}
          >
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full min-h-[48px] cursor-pointer rounded-lg border border-[var(--color-stone-200)] bg-white px-3 py-2.5 text-base font-medium text-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/40"
            >
              {PROPERTY_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </FieldMobileHero>

          <FieldMobileHero
            label="Lieu"
            hint="Wilaya ou quartier"
            icon={<MapPin className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />}
          >
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full min-h-[48px] cursor-pointer rounded-lg border border-[var(--color-stone-200)] bg-white px-3 py-2.5 text-base font-medium text-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/40"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </FieldMobileHero>
        </div>

        <button
          type="submit"
          className="flex min-h-[52px] w-full items-center justify-center gap-2 bg-[var(--color-navy-900)] px-4 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)] active:bg-[var(--color-navy-950)]"
        >
          <Search className="h-5 w-5 shrink-0" />
          Rechercher
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full min-w-0 max-w-none overflow-hidden bg-white/95 shadow-[0_20px_50px_-12px_rgba(11,23,51,0.35)] ring-1 ring-white/40 backdrop-blur-md",
        compact ? "rounded-xl" : "rounded-2xl"
      )}
    >
      {/* Fields */}
      <div className="grid min-w-0 w-full grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-0 md:gap-px bg-[var(--color-stone-100)]">
        <Field
          compact={compact}
          label="Type de bien"
          icon={<Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={cn(
              "w-full bg-transparent font-medium text-[var(--color-navy-900)] focus:outline-none",
              compact ? "text-base md:text-[13px]" : "text-sm"
            )}
          >
            {PROPERTY_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </Field>

        <Field
          compact={compact}
          label="Localisation"
          icon={<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        >
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={cn(
              "w-full bg-transparent font-medium text-[var(--color-navy-900)] focus:outline-none",
              compact ? "text-base md:text-[13px]" : "text-sm"
            )}
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center gap-1.5 bg-[var(--color-navy-900)] font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)] sm:gap-2",
            compact
              ? "min-h-[44px] px-4 py-2.5 text-sm md:py-3 md:text-sm"
              : "px-5 py-3.5 text-sm md:px-8 md:py-0 md:text-[15px]"
          )}
        >
          <Search className="h-4 w-4" />
          Rechercher
        </button>
      </div>
    </form>
  );
}

function FieldMobileHero({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-navy-900)]">
              {label}
            </span>
          </div>
          <p className="mt-0.5 pl-6 text-xs text-[var(--color-stone-500)]">{hint}</p>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({
  compact,
  label,
  icon,
  children,
}: {
  compact?: boolean;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 w-full cursor-pointer flex-col gap-0 bg-white",
        compact ? "px-3 py-1.5 sm:py-2" : "gap-0.5 px-4 py-2.5 sm:px-5 sm:py-3"
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1 font-semibold uppercase tracking-wider text-[var(--color-stone-500)]",
          compact ? "text-[9px] sm:text-[10px]" : "gap-1.5 text-[10px] sm:text-[11px]"
        )}
      >
        <span className="text-[var(--color-gold-600)]">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}
