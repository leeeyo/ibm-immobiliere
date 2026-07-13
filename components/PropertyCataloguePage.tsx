import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import PropertyCard from "@/components/PropertyCard";
import SortSelect from "@/components/SortSelect";
import { listActiveLocations } from "@/lib/actions/locations";
import { searchProperties } from "@/lib/actions/properties";

type CatalogueIntent = "sale" | "rent";

export default async function PropertyCataloguePage({
  intent,
  searchParams,
}: {
  intent: CatalogueIntent;
  searchParams?: Record<string, any>;
}) {
  const sp = searchParams || {};
  const locationsParam =
    typeof sp.locations === "string"
      ? sp.locations.split(",").map((value: string) => value.trim()).filter(Boolean)
      : Array.isArray(sp.locations)
        ? sp.locations
            .flatMap((value: string) => value.split(","))
            .map((value: string) => value.trim())
            .filter(Boolean)
        : undefined;

  const filters = {
    intent,
    location: sp.location || undefined,
    locations: locationsParam,
    query: sp.query || undefined,
    type: sp.type || undefined,
    rooms: sp.rooms ? parseInt(sp.rooms, 10) : undefined,
    minPrice: sp.minPrice ? parseInt(sp.minPrice, 10) : undefined,
    maxPrice: sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined,
    minArea: sp.minArea ? parseInt(sp.minArea, 10) : undefined,
    maxArea: sp.maxArea ? parseInt(sp.maxArea, 10) : undefined,
    sort: sp.sort || undefined,
    page: sp.page ? parseInt(sp.page, 10) : 1,
    limit: sp.limit ? parseInt(sp.limit, 10) : 12,
  };

  const [locations, searchResult] = await Promise.all([
    listActiveLocations(),
    searchProperties(filters),
  ]);
  const { results, total } = searchResult;
  const isRent = intent === "rent";

  return (
    <>
      <Header />

      <main className="pt-20">
        <section className="relative isolate z-20 overflow-visible bg-[var(--color-navy-950)] text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-[var(--color-gold-500)]/20 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/40 to-transparent"
          />
          <div className="container-page relative py-16 lg:py-24">
            <span className="eyebrow !text-[var(--color-gold-400)] before:!bg-[var(--color-gold-400)]">
              {isRent ? "Catalogue à louer" : "Catalogue à la vente"}
            </span>
            <h1 className="heading-display mt-4 max-w-3xl text-balance text-4xl text-white sm:text-5xl lg:text-6xl">
              {isRent
                ? "Trouvez un bien à louer, en toute sérénité."
                : "Trouvez le bien qui vous correspond."}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {isRent
                ? "Explorez nos appartements et locaux disponibles à la location. Affinez votre recherche par type, surface et localisation."
                : "Explorez tous les appartements et locaux signés IBM Immobilière, disponibles à la vente. Affinez votre recherche par type, surface et localisation."}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-400)]" />
              <span className="font-semibold text-white">{total}</span>
              bien{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
              {isRent ? " à la location" : " à la vente"}
            </p>
            <div className="mt-10 max-w-4xl">
              <HeroSearch locations={locations} initialIntent={intent} />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-ivory-50)]">
          <div className="container-page py-12 lg:py-16">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-stone-600)]">
                <span className="font-semibold text-[var(--color-navy-900)]">{total}</span>{" "}
                bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
              </p>
              <SortSelect />
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white px-6 py-20 text-center text-[var(--color-stone-500)]">
                {isRent
                  ? "Aucun bien à louer ne correspond à votre recherche."
                  : "Aucun bien à vendre ne correspond à votre recherche."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((property) => (
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
