import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PropertyCardProps {
  id: string;
  slug?: string;
  title: string;
  price: number;
  location: string;
  type: "residential" | "commercial";
  rooms?: number;
  bathrooms?: number;
  area: number;
  images?: string[];
  image?: string[];
  status: "available" | "sold" | "reserved";
}

const STATUS_META: Record<
  PropertyCardProps["status"],
  { label: string; cls: string }
> = {
  available: { label: "Disponible", cls: "chip-success" },
  reserved: { label: "Réservé", cls: "chip-gold" },
  sold: { label: "Vendu", cls: "chip-danger" },
};

export default function PropertyCard({
  id,
  slug,
  title,
  price,
  location,
  type,
  rooms,
  bathrooms,
  area,
  images,
  image,
  status,
}: PropertyCardProps) {
  const imgs = (Array.isArray(images) && images.length ? images : image) ?? [];
  const cover = imgs[0] || "/placeholder.svg";
  const meta = STATUS_META[status];
  const href = `/proprietes/${slug || id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--color-stone-200)] transition-all duration-300 hover:ring-[var(--color-navy-900)]/20 hover:shadow-[0_20px_50px_-12px_rgba(11,23,51,0.18)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-ivory-100)]">
        <Image
          src={cover}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
          <span className={cn("chip", meta.cls)}>{meta.label}</span>
          <span className="chip chip-navy">
            {type === "residential" ? "Résidentiel" : "Commercial"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-stone-500)]">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <h3 className="mt-2 font-display text-xl text-[var(--color-navy-900)] line-clamp-1">
          {title}
        </h3>

        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--color-stone-600)]">
          {rooms ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" /> {rooms} pièces
            </span>
          ) : null}
          {bathrooms ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {bathrooms} SDB
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="h-4 w-4" /> {area} m²
          </span>
        </div>

        <div className="mt-5 pt-5 border-t border-[var(--color-stone-100)] flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-stone-500)]">
              Prix
            </p>
            <p className="font-display text-2xl text-[var(--color-navy-900)] leading-none">
              {typeof price === "number" ? price.toLocaleString("fr-TN") : "—"}{" "}
              <span className="text-sm font-sans font-semibold text-[var(--color-stone-500)]">
                DT
              </span>
            </p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-ivory-100)] text-[var(--color-navy-900)] transition-all group-hover:bg-[var(--color-gold-500)]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
