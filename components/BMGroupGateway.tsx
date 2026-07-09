import { ArrowUpRight } from "lucide-react";

const BM_GROUP_URL = "https://bmgroup.tn";

export function BMGroupGateway() {
  return (
    <section className="bg-[var(--color-ivory-50)] text-[var(--color-navy-900)]">
      <div className="container-page py-8 lg:py-10">
        <a
          href={BM_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Decouvrir BM Group"
          className="group relative grid gap-6 overflow-hidden rounded-2xl border border-[var(--color-stone-200)] bg-white p-5 shadow-[0_22px_60px_-42px_rgba(11,23,51,0.35)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold-500)]/70 hover:shadow-[0_28px_70px_-42px_rgba(11,23,51,0.45)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 lg:p-7"
        >
          <span
            aria-hidden
            className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[var(--color-gold-500)]"
          />
          <span
            aria-hidden
            className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[var(--color-gold-500)]/10 blur-3xl transition group-hover:bg-[var(--color-gold-500)]/15"
          />
          <div className="flex flex-col gap-3">
            <p className="caption !text-[var(--color-gold-600)]">
              Une expertise du groupe
            </p>
            <div>
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight !text-[var(--color-navy-900)] sm:text-3xl">
                BM Group rassemble construction, immobilier et agencement.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-stone-600)] sm:text-base">
                Decouvrez la vision commune, les societes du groupe et les projets
                portes par la famille Ben Mokhtar en Tunisie.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-navy-900)] px-5 py-3 text-sm font-semibold text-white transition group-hover:-translate-y-0.5 group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)]">
            Visiter bmgroup.tn
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </a>
      </div>
    </section>
  );
}
