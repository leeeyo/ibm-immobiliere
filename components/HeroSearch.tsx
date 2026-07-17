"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronDown, MapPin, Search, X } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { trackGaSearch } from "@/lib/google-analytics";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaSearch } from "@/lib/meta-pixel";
import type { LocationType } from "@/lib/types";

const PROPERTY_TYPES = [
  { value: "", label: "Tous types" },
  { value: "residential", label: "Appartement" },
  { value: "commercial", label: "Bureau / Commerce" },
];

export default function HeroSearch({
  compact = false,
  layout = "default",
  locations = [],
  initialIntent = "sale",
  saleOnly = false,
}: {
  compact?: boolean;
  layout?: "default" | "heroMobile";
  locations?: LocationType[];
  initialIntent?: "sale" | "rent";
  saleOnly?: boolean;
}) {
  const router = useRouter();
  const [intent, setIntent] = useState<"sale" | "rent">(initialIntent);
  const [type, setType] = useState(initialIntent === "rent" ? "commercial" : "");
  const [locationSlugs, setLocationSlugs] = useState<string[]>([]);

  const isHeroMobile = layout === "heroMobile";
  const propertyTypes = intent === "rent"
    ? [{ value: "commercial", label: "Boutique" }]
    : PROPERTY_TYPES;

  const changeIntent = (nextIntent: "sale" | "rent") => {
    setIntent(nextIntent);
    if (nextIntent === "rent") setType("commercial");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("intent", intent);
    if (type) params.set("type", type);
    if (locationSlugs.length === 1) params.set("location", locationSlugs[0]);
    if (locationSlugs.length > 1) params.set("locations", locationSlugs.join(","));

    const locationLabels = locationSlugs
      .map((slug) => locations.find((l) => l.slug === slug)?.name || slug)
      .filter(Boolean);
    const searchString = [
      intent === "rent" ? "location" : "achat",
      type,
      ...locationLabels,
    ].filter(Boolean).join(" ");

    trackGaSearch({
      searchTerm: searchString,
      property_intent: intent,
      property_type: type || "all",
      location: locationLabels.join(", ") || "all",
    });

    if (isMetaPixelEnabled()) {
      const eventId = createMetaEventId("search");
      const payload = {
        eventId,
        searchString,
        contentCategory: "property_search",
        customData: {
          property_intent: intent,
          property_type: type || "all",
          location: locationLabels.join(", ") || "all",
        },
      };
      trackMetaSearch(payload);
      sendMetaCapiClientEvent({
        eventName: "Search",
        source: "search",
        ...payload,
      });
    }

    const qs = params.toString();
    const pathname = intent === "rent" ? "/louer" : "/proprietes";
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  if (isHeroMobile) {
    return (
      <form
        onSubmit={submit}
        className={cn(
          "relative z-50 w-full min-w-0 max-w-none overflow-visible rounded-[1.35rem]",
          "bg-white shadow-[0_28px_64px_-28px_rgba(11,23,51,0.45)] ring-2 ring-[var(--color-navy-900)]/8",
        )}
      >
        <div className="border-b border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] px-3 py-3">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-stone-500)]">
            Rechercher un bien
          </p>
        </div>

        <div className="divide-y divide-[var(--color-stone-200)] bg-[var(--color-stone-50)]">
          <FieldMobileHero label="Transaction" hint="Acheter ou louer" icon={<Search className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />}>
            <select value={intent} onChange={(e) => changeIntent(e.target.value as "sale" | "rent")} className={mobileSelectCls}>
              <option value="sale">Acheter</option>
              {!saleOnly ? <option value="rent">Louer</option> : null}
            </select>
          </FieldMobileHero>

          <FieldMobileHero label="Type" hint="Nature du bien" icon={<Building2 className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />}>
            <select value={type} onChange={(e) => setType(e.target.value)} className={mobileSelectCls}>
              {propertyTypes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </FieldMobileHero>

          <FieldMobileHero label="Lieu" hint="Localisation exacte" icon={<MapPin className="h-4 w-4 shrink-0 text-[var(--color-gold-600)]" />}>
            <LocationCombobox
              locations={locations}
              selectedSlugs={locationSlugs}
              onChange={setLocationSlugs}
              compact={false}
              mobile
            />
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
        "relative z-50 w-full min-w-0 max-w-none overflow-visible bg-white/95 shadow-[0_20px_50px_-12px_rgba(11,23,51,0.35)] ring-1 ring-white/40 backdrop-blur-md",
        compact ? "rounded-xl" : "rounded-2xl",
      )}
    >
      <div className="grid min-w-0 w-full grid-cols-1 md:grid-cols-[0.85fr_1fr_1fr_auto] gap-0 md:gap-px bg-[var(--color-stone-100)]">
        <Field compact={compact} label="Transaction" icon={<Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}>
          <select value={intent} onChange={(e) => changeIntent(e.target.value as "sale" | "rent")} className={selectCls(compact)}>
            <option value="sale">Acheter</option>
            {!saleOnly ? <option value="rent">Louer</option> : null}
          </select>
        </Field>

        <Field compact={compact} label="Type de bien" icon={<Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls(compact)}>
            {propertyTypes.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>

        <Field compact={compact} label="Localisation" icon={<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}>
          <LocationCombobox
            locations={locations}
            selectedSlugs={locationSlugs}
            onChange={setLocationSlugs}
            compact={compact}
          />
        </Field>

        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center gap-1.5 bg-[var(--color-navy-900)] font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)] sm:gap-2",
            compact
              ? "min-h-[44px] px-4 py-2.5 text-sm md:py-3 md:text-sm"
              : "px-5 py-3.5 text-sm md:px-8 md:py-0 md:text-[15px]",
          )}
        >
          <Search className="h-4 w-4" />
          Rechercher
        </button>
      </div>
    </form>
  );
}

const mobileSelectCls =
  "w-full min-h-[48px] cursor-pointer rounded-lg border border-[var(--color-stone-200)] bg-white px-3 py-2.5 text-base font-medium text-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/40";

function selectCls(compact?: boolean) {
  return cn(
    "w-full bg-transparent font-medium text-[var(--color-navy-900)] focus:outline-none",
    compact ? "text-base md:text-[13px]" : "text-sm",
  );
}

function LocationCombobox({
  locations,
  selectedSlugs,
  onChange,
  compact,
  mobile,
  multiple = false,
}: {
  locations: LocationType[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  compact?: boolean;
  mobile?: boolean;
  multiple?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLocations = useMemo(
    () => selectedSlugs
      .map((slug) => locations.find((location) => location.slug === slug))
      .filter(Boolean) as LocationType[],
    [locations, selectedSlugs],
  );

  const filteredLocations = useMemo(() => {
    const normalizedQuery = normalizeLocationSearch(query);
    if (!normalizedQuery) return locations;
    return locations.filter((location) =>
      normalizeLocationSearch(location.name).includes(normalizedQuery),
    );
  }, [locations, query]);

  const label =
    selectedLocations.length === 0
      ? "Tous lieux"
      : selectedLocations.length === 1
        ? selectedLocations[0].name
        : `${selectedLocations.length} lieux`;

  const choose = (slug: string) => {
    if (!slug) {
      onChange([]);
      setOpen(false);
      setQuery("");
      return;
    }

    if (multiple) {
      onChange(
        selectedSlugs.includes(slug)
          ? selectedSlugs.filter((selectedSlug) => selectedSlug !== slug)
          : [...selectedSlugs, slug],
      );
      return;
    }

    onChange([slug]);
    setOpen(false);
    setQuery("");
  };

  const buttonCls = mobile
    ? mobileSelectCls + " flex items-center justify-between gap-2 text-left"
    : cn(
        "flex w-full items-center justify-between gap-2 bg-transparent font-medium text-[var(--color-navy-900)] focus:outline-none",
        compact ? "min-h-[22px] text-base md:text-[13px]" : "min-h-[24px] text-sm",
      );

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
          setQuery("");
        }
      }}
    >
      <button
        type="button"
        className={buttonCls}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="truncate">{label}</span>
        <span className="flex shrink-0 items-center gap-1">
          {selectedSlugs.length > 0 ? (
            <span
              aria-label="Effacer la localisation"
              className="rounded-full p-0.5 text-[var(--color-stone-500)] hover:bg-[var(--color-stone-100)] hover:text-[var(--color-navy-900)]"
              onClick={(event) => {
                event.stopPropagation();
                onChange([]);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-[120] overflow-hidden rounded-xl border border-[var(--color-stone-200)] bg-white shadow-[0_24px_70px_-20px_rgba(11,23,51,0.35)]">
          <div className="border-b border-[var(--color-stone-100)] p-2">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-stone-200)] bg-white px-2.5 py-2">
              <Search className="h-4 w-4 shrink-0 text-[var(--color-stone-400)]" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Rechercher un lieu..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:outline-none"
              />
            </div>
          </div>

          <div role="listbox" className="max-h-72 overflow-y-auto py-1">
            <LocationOption
              label="Tous lieux"
              selected={selectedSlugs.length === 0}
              onClick={() => choose("")}
            />

            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <LocationOption
                  key={location.id}
                  label={location.name}
                  selected={selectedSlugs.includes(location.slug)}
                  onClick={() => choose(location.slug)}
                />
              ))
            ) : (
              <p className="px-3 py-3 text-sm text-[var(--color-stone-500)]">
                Aucun lieu trouvé.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LocationOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
        selected
          ? "bg-[var(--color-navy-900)] text-white"
          : "text-[var(--color-navy-900)] hover:bg-[var(--color-ivory-50)]",
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      {selected ? <Check className="h-4 w-4 shrink-0" /> : null}
    </button>
  );
}

function normalizeLocationSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
    <div
      className={cn(
        "flex min-w-0 w-full cursor-pointer flex-col gap-0 bg-white",
        compact ? "px-3 py-1.5 sm:py-2" : "gap-0.5 px-4 py-2.5 sm:px-5 sm:py-3",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1 font-semibold uppercase tracking-wider text-[var(--color-stone-500)]",
          compact ? "text-[9px] sm:text-[10px]" : "gap-1.5 text-[10px] sm:text-[11px]",
        )}
      >
        <span className="text-[var(--color-gold-600)]">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
