import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Compass,
  CheckCircle2,
  Building2,
  Download,
  CalendarCheck,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyLeadForm from "@/components/PropertyLeadForm";
import MetaViewContentTracker from "@/components/MetaViewContentTracker";
import JsonLd from "@/components/JsonLd";

import {
  getPropertyBySlug,
  getPropertyById,
  getSimilarProperties,
} from "@/lib/actions/properties";
import { CONTACT, SITE } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  available: { label: "Disponible", cls: "chip-success" },
  reserved: { label: "Réservé", cls: "chip-gold" },
  sold: { label: "Vendu", cls: "chip-danger" },
};

async function resolveProperty(slugOrId: string) {
  const bySlug = await getPropertyBySlug(slugOrId);
  if (bySlug) return bySlug;
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    const byId = await getPropertyById(slugOrId);
    if (byId?.slug) {
      // legacy URL: redirect to the slug
      redirect(`/proprietes/${byId.slug}`);
    }
    return byId;
  }
  return null;
}

export async function generateMetadata(props: any) {
  const params = await props.params;
  const property = await resolveProperty(params.slug);
  if (!property) return {};
  const title = `${property.title} — ${property.location}`;
  const canonical = `/proprietes/${property.slug}`;
  const description = property.description?.replace(/[#*_`]/g, "").slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: "fr_TN",
      images: property.images?.slice(0, 1) || [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property.images?.slice(0, 1) || [],
    },
  };
}

export default async function PropertyDetailPage(props: any) {
  const params = await props.params;
  const property = await resolveProperty(params.slug);
  if (!property) return notFound();

  const [similar, settings] = await Promise.all([
    getSimilarProperties(property.slug || property.id, property.type, 3),
    getWebsiteSettings(),
  ]);
  const status = STATUS_META[property.status] || STATUS_META.available;
  const canonicalUrl = `${SITE.url}/proprietes/${property.slug}`;
  const propertyImage = property.images?.[0]
    ? new URL(property.images[0], SITE.url).toString()
    : `${SITE.url}/IBM_logo_black_transparent.png`;

  return (
    <>
      <Header />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": property.type === "residential" ? "Apartment" : "Place",
            name: property.title,
            description: property.description,
            url: canonicalUrl,
            image: propertyImage,
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.area,
              unitCode: "MTK",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: property.location,
              addressCountry: "TN",
            },
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "TND",
              url: canonicalUrl,
              availability:
                property.status === "available"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Acheter", item: `${SITE.url}/proprietes` },
              { "@type": "ListItem", position: 3, name: property.title, item: canonicalUrl },
            ],
          },
        ]}
      />
      <MetaViewContentTracker
        contentId={property.id}
        contentName={property.title}
        contentCategory="property"
        value={Number(property.price)}
      />

      <main className="pt-20 bg-white">
        {/* Crumb */}
        <nav className="container-page pt-6 text-xs text-[var(--color-stone-500)] flex items-center gap-1.5">
          <Link href="/" className="hover:text-[var(--color-navy-900)]">Accueil</Link>
          <span>/</span>
          <Link href="/proprietes" className="hover:text-[var(--color-navy-900)]">Acheter</Link>
          <span>/</span>
          <span className="text-[var(--color-navy-900)] truncate max-w-[60vw]">{property.title}</span>
        </nav>

        {/* Title block */}
        <header className="container-page pt-6 pb-8 lg:pt-10 lg:pb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={"chip " + status.cls}>{status.label}</span>
            <span className="chip chip-navy">
              {property.type === "residential" ? "Résidentiel" : "Commercial"}
            </span>
            {property.reference ? <span className="chip">Réf. {property.reference}</span> : null}
          </div>
          <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-navy-900)] text-balance">
            {property.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-[var(--color-stone-600)]">
            <MapPin className="h-4 w-4" /> {property.location}
          </p>
        </header>

        {/* Gallery */}
        <section className="container-page pb-8 lg:pb-12">
          <PropertyGallery
            images={property.images || []}
            videos={property.videos || []}
            alt={property.title}
          />
        </section>

        {/* Content + Sidebar */}
        <section className="container-page pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14">
            {/* Main */}
            <div>
              {/* Specs row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                <Spec icon={<Maximize className="h-4 w-4" />} label="Surface" value={`${property.area} m²`} />
                {property.rooms ? (
                  <Spec icon={<BedDouble className="h-4 w-4" />} label="Pièces" value={`${property.rooms}`} />
                ) : null}
                {property.bathrooms ? (
                  <Spec icon={<Bath className="h-4 w-4" />} label="Salles de bain" value={`${property.bathrooms}`} />
                ) : null}
                {property.floor ? (
                  <Spec icon={<Building2 className="h-4 w-4" />} label="Étage" value={property.floor as string} />
                ) : null}
                {property.orientation ? (
                  <Spec icon={<Compass className="h-4 w-4" />} label="Orientation" value={property.orientation as string} />
                ) : null}
                {property.projectId ? (
                  <Spec icon={<Building2 className="h-4 w-4" />} label="Projet" value="Voir détail" />
                ) : null}
              </div>

              {/* Description */}
              <article className="prose-block">
                <h2 className="font-display text-2xl text-[var(--color-navy-900)] mb-3">À propos de ce bien</h2>
                <p className="text-[var(--color-stone-700)] leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </article>

              {/* Features */}
              {property.features && property.features.length > 0 ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl text-[var(--color-navy-900)] mb-4">Commodités</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 rounded-lg bg-[var(--color-ivory-50)] border border-[var(--color-stone-100)] px-4 py-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-gold-600)] shrink-0" />
                        <span className="text-sm text-[var(--color-navy-900)]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Plan */}
              {property.planUrl ? (
                <section className="mt-10">
                  <h2 className="font-display text-2xl text-[var(--color-navy-900)] mb-4">Plan du bien</h2>
                  <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                      <PlanSpec label="Référence" value={property.reference || "—"} />
                      <PlanSpec label="Étage" value={(property.floor as string) || "—"} />
                      <PlanSpec label="Pièces" value={property.rooms != null ? `${property.rooms}` : "—"} />
                      <PlanSpec label="Surface" value={`${property.area} m²`} />
                    </dl>
                    <a
                      href={property.planUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--color-navy-900)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)]"
                    >
                      <Download className="h-4 w-4" />
                      Voir le plan (PDF)
                    </a>
                  </div>
                </section>
              ) : null}

              {/* Brochure */}
              {property.brochureUrl ? (
                <a
                  href={property.brochureUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-10 inline-flex btn btn-outline"
                >
                  <Download className="h-4 w-4" />
                  Télécharger la brochure (PDF)
                </a>
              ) : null}
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-2xl bg-[var(--color-navy-950)] text-white p-7 shadow-[0_24px_60px_-15px_rgba(11,23,51,0.45)]">
                <p className="text-xs uppercase tracking-widest text-[var(--color-gold-400)]">Prix</p>
                <p className="mt-1 font-display text-4xl text-white leading-none">
                  {Number(property.price).toLocaleString("fr-TN")}
                  <span className="ml-1.5 text-base font-sans font-semibold text-white/70">DT</span>
                </p>

                <hr className="my-5 border-white/10" />

                <PropertyLeadForm
                  propertyId={property.id}
                  propertyRef={property.reference || property.title}
                />

                <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
                  <a href={`tel:${settings.phoneRaw || CONTACT.phoneRaw}`} className="flex items-center gap-2 text-white/80 hover:text-[var(--color-gold-400)]">
                    <CalendarCheck className="h-4 w-4 text-[var(--color-gold-400)]" />
                    {settings.phone || CONTACT.phone} · Prendre RDV
                  </a>
                  <a href={settings.whatsapp || CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/80 hover:text-[var(--color-gold-400)]">
                    <span className="h-4 w-4 inline-flex items-center justify-center text-[10px] rounded-full bg-[var(--color-gold-400)] text-[var(--color-navy-900)] font-bold">W</span>
                    WhatsApp commercial
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Similar */}
        {similar.length > 0 ? (
          <section className="bg-[var(--color-ivory-50)] py-20">
            <div className="container-page">
              <div className="flex items-end justify-between gap-6 mb-10">
                <div>
                  <span className="eyebrow">Continuer la recherche</span>
                  <h2 className="heading-display mt-2 text-2xl sm:text-3xl">Biens similaires</h2>
                </div>
                <Link href="/proprietes" className="link-underline">Tout le catalogue</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p: any) => (
                  <PropertyCard key={p.id || p.slug} {...p} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}

function PlanSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-[var(--color-stone-500)]">{label}</dt>
      <dd className="mt-0.5 font-display text-base text-[var(--color-navy-900)]">{value}</dd>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-stone-200)] bg-white px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-stone-500)] uppercase tracking-wider">
        <span className="text-[var(--color-gold-600)]">{icon}</span>
        {label}
      </div>
      <p className="mt-1 font-display text-lg text-[var(--color-navy-900)] leading-none">{value}</p>
    </div>
  );
}
