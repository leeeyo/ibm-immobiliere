import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import HeroSearch from "@/components/HeroSearch";
import SortSelect from "@/components/SortSelect";
import { searchProperties } from "@/lib/actions/properties";

export const metadata = {
  title: "Acheter — Catalogue de biens",
  description:
    "Découvrez notre catalogue de biens à la vente : appartements, bureaux, commerces signés IBM Immobilière.",
  alternates: { canonical: "/proprietes" },
};

export default async function PropertiesPage(props: any) {
  const sp: Record<string, any> = (await props.searchParams) || {};

  const filters = {
    query: sp.query || undefined,
    type: sp.type || undefined,
    rooms: sp.rooms ? parseInt(sp.rooms, 10) : undefined,
    minPrice: sp.minPrice ? parseInt(sp.minPrice, 10) : undefined,
    maxPrice: sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined,
    sort: sp.sort || undefined,
    page: sp.page ? parseInt(sp.page, 10) : 1,
    limit: sp.limit ? parseInt(sp.limit, 10) : 12,
  };

  const { results, total } = await searchProperties(filters as any);

  return (
    <>
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[var(--color-navy-950)] text-white">
          {/* Decorative gold glow — purely cosmetic, no layout impact */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--color-gold-500)]/20 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/40 to-transparent"
          />
          <div className="container-page relative py-16 lg:py-24">
            <span className="eyebrow !text-[var(--color-gold-400)] before:!bg-[var(--color-gold-400)]">
              Catalogue
            </span>
            <h1 className="heading-display mt-4 max-w-3xl text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
              Trouvez le bien qui vous correspond.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Explorez tous les appartements et locaux signés IBM Immobilière,
              disponibles à la vente. Filtres précis par type, surface et
              localisation.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-400)]" />
              <span className="font-semibold text-white">{total}</span>
              bien{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
            </p>
            <div className="mt-10 max-w-4xl">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="bg-[var(--color-ivory-50)]">
          <div className="container-page py-12 lg:py-16">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-[var(--color-stone-600)]">
                <span className="font-semibold text-[var(--color-navy-900)]">{total}</span>{" "}
                bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
              </p>
              <SortSelect />
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white py-20 text-center text-[var(--color-stone-500)]">
                Aucun bien ne correspond à votre recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((property: any) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
