import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ProjectCardProps {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  location?: string;
  yearCompleted?: number;
  status?: "planned" | "ongoing" | "completed";
  images?: string[];
  propertiesCount?: number;
  type?: "residential" | "commercial";
}

const STATUS_META: Record<
  NonNullable<ProjectCardProps["status"]>,
  { label: string; cls: string }
> = {
  planned: { label: "À venir", cls: "chip" },
  ongoing: { label: "En cours", cls: "chip-gold" },
  completed: { label: "Livré", cls: "chip-success" },
};

export default function ProjectCard({
  id,
  slug,
  name,
  description,
  location,
  yearCompleted,
  status = "completed",
  images,
  propertiesCount = 0,
}: ProjectCardProps) {
  const cover = (images && images[0]) || "/placeholder.svg";
  const meta = STATUS_META[status];
  const href = `/projets/${slug || id}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--color-navy-900)] text-white ring-1 ring-[var(--color-navy-900)] transition-all duration-300 hover:ring-[var(--color-gold-500)] hover:shadow-[0_24px_60px_-15px_rgba(11,23,51,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={cover}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)] via-[var(--color-navy-950)]/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={cn("chip", meta.cls)}>{meta.label}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          {location ? (
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--color-gold-400)]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
          ) : null}
          <h3 className="mt-1.5 font-display text-2xl text-white line-clamp-1">
            {name}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[var(--color-navy-900)]">
        <div className="flex items-center gap-4 text-xs text-white/70">
          {yearCompleted ? <span>Année {yearCompleted}</span> : null}
          {propertiesCount ? <span>{propertiesCount} logements</span> : null}
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {description ? (
        <span className="sr-only">{description}</span>
      ) : null}
    </Link>
  );
}
