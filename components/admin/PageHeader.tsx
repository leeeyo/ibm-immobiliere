import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="px-6 lg:px-10 py-6 lg:py-8 bg-white border-b border-[var(--color-stone-200)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {back ? (
            <Link
              href={back.href}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-stone-500)] hover:text-[var(--color-navy-900)] mb-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {back.label}
            </Link>
          ) : null}
          <h1 className="font-display text-2xl lg:text-3xl text-[var(--color-navy-900)]">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-[var(--color-stone-600)] max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
