import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  ArrowRight,
  CalendarCheck,
  Phone,
  Compass,
  Pencil,
  KeyRound,
  Hammer,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import HomeTestimonials from "@/components/HomeTestimonials";
import Hero from "@/components/Hero";
import BuildingExplosion from "@/components/BuildingExplosion";

import { getFeaturedProperties } from "@/lib/actions/properties";
import { getFeaturedProjects } from "@/lib/actions/projects";
import { getFeaturedTestimonials } from "@/lib/actions/testimonials";
import { getWebsiteSettings } from "@/lib/website-settings";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PARTNERS = [
  { src: "/partenaires/duravit.png",         alt: "Duravit" },
  { src: "/partenaires/bm-wood-logo.png",    alt: "BM Wood" },
  { src: "/partenaires/comptoir-hammami.png",alt: "Comptoir Hammami" },
  { src: "/partenaires/gayafores.png",       alt: "Gayafores" },
  { src: "/partenaires/vives.png",           alt: "Vives" },
];

const PROCESS = [
  {
    icon: Compass,
    title: "Découverte",
    desc: "Nous écoutons votre projet — usage, surface, quartier — pour cibler les biens qui vous correspondent.",
  },
  {
    icon: Pencil,
    title: "Sélection",
    desc: "Visite guidée, étude des plans, conseils sur les finitions et aide au montage du dossier.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurisation",
    desc: "Vérifications juridiques, négociation et accompagnement notarial jusqu'à la signature.",
  },
  {
    icon: KeyRound,
    title: "Remise des clés",
    desc: "Réception du bien, état des lieux, livret d'entretien et suivi après livraison.",
  },
];

export default async function HomePage() {
  const [properties, projects, testimonials, settings] = await Promise.all([
    getFeaturedProperties(4),
    getFeaturedProjects(3),
    getFeaturedTestimonials(8),
    getWebsiteSettings(),
  ]);

  const featuredProject = projects[0];

  return (
    <>
      <Header />

      <main className="bg-white overflow-x-clip">
        <Hero />

        <BuildingExplosion />

        {/* ──────────────────────────────────────────────────────────────
            FEATURED PROJECT — magazine spread
            ────────────────────────────────────────────────────────────── */}
        {featuredProject ? (
          <section className="relative bg-white overflow-hidden">
            <div className="container-page py-12 lg:py-16">
              <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-center">
                {/* Left: editorial text block */}
                <div className="col-span-12 lg:col-span-5 order-2 lg:order-1">
                  <Reveal>
                    <span className="caption">Projet en vedette</span>
                    <h2 className="mt-4 font-display text-4xl sm:text-5xl text-[var(--color-navy-900)] leading-[1.05]">
                      {featuredProject.name}
                    </h2>
                    {featuredProject.location ? (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-stone-500)] uppercase tracking-widest">
                        <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-600)]" />
                        {featuredProject.location}
                      </p>
                    ) : null}

                    {featuredProject.description ? (
                      <p className="mt-6 text-[var(--color-stone-700)] leading-relaxed max-w-md">
                        {featuredProject.description}
                      </p>
                    ) : (
                      <p className="mt-6 text-[var(--color-stone-700)] leading-relaxed max-w-md">
                        Une réalisation signature : architecture contemporaine,
                        finitions soignées, situation privilégiée.
                      </p>
                    )}

                    <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm">
                      <div className="rounded-xl border border-[var(--color-stone-200)] p-4">
                        <div className="caption">Année</div>
                        <p className="mt-1 font-display text-2xl text-[var(--color-navy-900)]">
                          {featuredProject.yearCompleted || "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--color-stone-200)] p-4">
                        <div className="caption">Logements</div>
                        <p className="mt-1 font-display text-2xl text-[var(--color-navy-900)]">
                          {featuredProject.propertiesCount || "—"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/projets/${featuredProject.slug || featuredProject.id}`}
                      className="mt-10 inline-flex items-center gap-3 group"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-navy-900)] text-white transition-all group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)]">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                      <span className="font-display text-lg italic text-[var(--color-navy-900)]">
                        Découvrir le projet
                      </span>
                    </Link>
                  </Reveal>
                </div>

                {/* Right: image with floating caption */}
                <div className="col-span-12 lg:col-span-7 order-1 lg:order-2">
                  <Reveal delay={120}>
                    <div className="relative">
                      <div className="relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-[5/6] rounded-3xl overflow-hidden bg-[var(--color-ivory-100)] shadow-[0_40px_90px_-40px_rgba(11,23,51,0.4)]">
                        <Image
                          src={featuredProject.images?.[0] || "/hero/aerial-development.jpg"}
                          alt={featuredProject.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                      </div>

                      {/* Floating caption card */}
                      <div className="hidden md:flex absolute -left-6 -bottom-6 lg:-left-10 lg:-bottom-10 max-w-[280px] flex-col gap-1 rounded-2xl bg-white p-5 shadow-[0_20px_50px_-12px_rgba(11,23,51,0.18)] ring-1 ring-[var(--color-stone-200)]">
                        <span className="caption">Caption</span>
                        <p className="font-display text-base text-[var(--color-navy-900)] leading-snug">
                          « Une lecture contemporaine de la cour méditerranéenne. »
                        </p>
                        <span className="text-xs text-[var(--color-stone-500)] mt-2">
                          — Note d&apos;intention, atelier IBM
                        </span>
                      </div>

                      {/* Index pin */}
                      <div className="hidden md:block absolute -right-4 -top-4 lg:-right-8 lg:-top-8">
                        <div className="numeral text-[12rem] lg:text-[16rem] leading-none text-[var(--color-gold-500)]/15">
                          P
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ──────────────────────────────────────────────────────────────
            CATALOGUE — asymmetric gallery wall
            ────────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--color-ivory-50)]">
          <div className="container-page py-12 lg:py-16">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="caption">Catalogue</span>
                <h2 className="mt-4 editorial-hero text-[clamp(2rem,5.5vw,4.5rem)] text-[var(--color-navy-900)]">
                  Quelques pièces<br />
                  <em className="!text-[var(--color-gold-600)]">de notre collection.</em>
                </h2>
              </div>
              <Link href="/proprietes" className="link-underline shrink-0 text-base">
                Tout le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            {properties.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-7">
                {/* Tall feature */}
                {properties[0] ? (
                  <Reveal className="lg:col-span-5 lg:row-span-2">
                    <div className="h-full">
                      <div className="h-full">
                        <PropertyCardFeature {...(properties[0] as any)} />
                      </div>
                    </div>
                  </Reveal>
                ) : null}

                {/* Three regular cards */}
                {properties.slice(1, 4).map((p: any, i: number) => (
                  <Reveal key={p.id || p._id} delay={120 + i * 90} className="lg:col-span-7 sm:col-span-1 lg:row-span-1">
                    <div className="h-full">
                      <PropertyCardWide {...(p as any)} />
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="col-span-full mt-8 rounded-2xl border border-dashed border-[var(--color-stone-300)] py-10 text-center text-[var(--color-stone-500)]">
                Catalogue en cours de mise à jour
              </div>
            )}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            BIG QUOTE / TESTIMONIAL
            ────────────────────────────────────────────────────────────── */}
        {testimonials.length > 0 ? (
          <section className="relative bg-white">
            <div className="container-page py-12 lg:py-16">
              <Reveal>
                <HomeTestimonials testimonials={testimonials} />
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* ──────────────────────────────────────────────────────────────
            PROCESS — vertical zigzag timeline
            ────────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--color-navy-950)] text-white overflow-hidden">
          <div className="blueprint" aria-hidden />
          <div className="container-page relative py-12 lg:py-16">
            <Reveal className="max-w-2xl">
              <span className="caption !text-[var(--color-gold-400)]">Le parcours</span>
              <h2 className="mt-4 editorial-hero text-[clamp(2rem,5.5vw,4.5rem)] text-white">
                De la première visite<br />
                <em>à la remise des clés.</em>
              </h2>
              <p className="mt-6 text-white/70 max-w-xl">
                Quatre étapes calmes, transparentes, où chaque détail est documenté
                et chaque décision vous appartient.
              </p>
            </Reveal>

            <ol className="relative mt-10 grid grid-cols-1 gap-x-10 gap-y-10 md:mt-12 md:grid-cols-2 lg:gap-y-12">
              {/* Vertical thread */}
              <span
                aria-hidden
                className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-gold-500)]/30 to-transparent"
              />

              {PROCESS.map((step, i) => {
                const Icon = step.icon;
                const offset = i % 2 === 1 ? "md:translate-y-12 lg:translate-y-16" : "";
                return (
                  <Reveal as="li" key={step.title} delay={i * 120} className={`relative ${offset}`}>
                    <div className="flex items-start gap-5 md:gap-6">
                      <div className="shrink-0">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-[var(--color-gold-400)]">
                          <Icon className="h-5 w-5" aria-hidden />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-display text-2xl text-white">{step.title}</h3>
                        <p className="mt-3 text-white/70 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            STATS — animated counters, editorial layout
            ────────────────────────────────────────────────────────────── */}
        <section className="relative bg-[var(--color-ivory-50)]">
          <div className="container-page py-10 lg:py-14">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-y-0 divide-y md:divide-y-0 md:divide-x divide-[var(--color-stone-200)]">
              <Reveal className="md:pr-8">
                <span className="caption">En chiffres</span>
                <h3 className="mt-3 font-display text-2xl text-[var(--color-navy-900)] leading-snug">
                  Un savoir-faire<br />
                  qui se compte —<br />
                  <em className="text-[var(--color-gold-600)]">et se raconte.</em>
                </h3>
              </Reveal>

              {[
                { v: settings.yearsOfExperience, suffix: "", label: "Années d'engagement" },
                { v: settings.residencesDelivered, suffix: "", label: "Résidences livrées" },
                { v: 100, suffix: "%", label: "Clients satisfaits" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={(i + 1) * 100} className="md:px-8 md:py-2 pt-10 md:pt-0">
                  <AnimatedCounter
                    value={s.v}
                    suffix={s.suffix}
                    className="font-display text-6xl lg:text-7xl text-[var(--color-navy-900)] leading-none tabular-nums"
                  />
                  <p className="mt-4 caption">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            PARTNERS — quiet trust marquee
            ────────────────────────────────────────────────────────────── */}
        <section className="relative bg-white border-y border-[var(--color-stone-200)]">
          <div className="container-page py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
              <div className="lg:w-56 shrink-0">
                <span className="caption">Partenaires</span>
                <p className="mt-2 font-display text-xl text-[var(--color-navy-900)] leading-snug">
                  Sélectionnés pour<br /> leur exigence.
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <Marquee slow>
                  {PARTNERS.map((p) => (
                    <div
                      key={p.alt}
                      className="relative h-12 w-32 sm:h-14 sm:w-36 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0"
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="160px"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────
            INVITATION CTA — letter / RSVP card
            ────────────────────────────────────────────────────────────── */}
        <section className="relative bg-white overflow-hidden">
          <div className="container-page py-10 lg:py-16">
            <Reveal>
              <div className="relative rounded-3xl sm:rounded-[2rem] bg-[var(--color-navy-950)] text-white overflow-hidden p-6 sm:p-10 lg:p-16 xl:p-20">
                {/* Layered accents */}
                <div className="grain" aria-hidden />
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-[var(--color-gold-500)]/20 blur-3xl"
                />
                <div
                  aria-hidden
                  className="absolute -bottom-24 -left-32 h-[24rem] w-[24rem] rounded-full bg-[var(--color-navy-700)]/60 blur-3xl"
                />

                <div className="relative grid grid-cols-12 gap-y-8 sm:gap-y-10 gap-x-6 sm:gap-x-8 items-stretch lg:items-end">
                  <div className="col-span-12 lg:col-span-8">
                    <span className="caption !text-[var(--color-gold-400)]">Carte d&apos;invitation</span>
                    <h2 className="mt-4 sm:mt-5 editorial-hero text-[clamp(1.85rem,7vw,5.5rem)] sm:text-[clamp(2.25rem,6.5vw,5.5rem)] text-white text-balance">
                      Venez visiter,<br />
                      <em>prendre un café,</em>
                      <br />
                      poser vos questions.
                    </h2>
                    <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
                      Notre bureau d&apos;Ariana vous accueille en semaine.
                      Présentation des résidences en cours, plans, finitions —
                      et des conseils sans engagement.
                    </p>

                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                      <Link href="/contact" className="btn btn-gold w-full sm:w-auto justify-center">
                        <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden />
                        Réserver une visite
                      </Link>
                      <a
                        href={`tel:${settings.phoneRaw}`}
                        className="btn btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-[var(--color-navy-900)] w-full sm:w-auto justify-center"
                      >
                        <Phone className="h-4 w-4 shrink-0" aria-hidden />
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  {/* Right "stamp" card */}
                  <div className="col-span-12 lg:col-span-4 flex flex-col">
                    <div className="relative mt-2 sm:mt-0 pb-16 sm:pb-14 lg:pb-0 lg:min-h-0">
                      <div className="rounded-2xl bg-white/[0.04] backdrop-blur-md ring-1 ring-white/15 p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="caption !text-[var(--color-gold-400)]">RSVP</span>
                          <span className="font-display text-sm sm:text-base text-white/80 italic">
                            IBM Immobilière
                          </span>
                        </div>
                        <hr className="hr-hair my-5 text-white" />
                        <div>
                          <span className="caption !text-white/55">Adresse</span>
                          <p className="mt-1 text-white">{settings.address}</p>
                        </div>
                        <div className="mt-4">
                          <span className="caption !text-white/55">Horaires</span>
                          <p className="mt-1 text-white">{settings.hours}</p>
                        </div>
                        <div className="mt-4">
                          <span className="caption !text-white/55">Email</span>
                          <p className="mt-1 text-white break-all">{settings.email}</p>
                        </div>
                      </div>

                      {/* Wax seal — inline on small screens to avoid overlap */}
                      <div className="mt-4 flex justify-end sm:mt-0 sm:absolute sm:-bottom-3 sm:-right-3 md:-bottom-5 md:-right-5">
                        <div className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20 rounded-full bg-[var(--color-gold-500)] text-[var(--color-navy-900)] flex items-center justify-center shadow-xl ring-4 ring-[var(--color-navy-950)] shrink-0">
                          <div className="text-center leading-none px-1">
                            <div className="font-display italic text-base sm:text-lg md:text-xl">IBM</div>
                            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest mt-0.5">
                              Est.{(new Date().getFullYear() - settings.yearsOfExperience).toString().slice(-2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <div className="relative mt-10 sm:mt-14 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/55">
                  <span className="inline-flex items-center gap-2 shrink-0">
                    <Hammer className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-400)]" aria-hidden />
                    Promoteur · Architecte
                  </span>
                  <span className="sm:text-center">{settings.legalName}</span>
                  <span className="break-all sm:break-normal">www.ibm-immobiliere.tn</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Editorial property card variants used in the asymmetric gallery
   ──────────────────────────────────────────────────────────────────────── */

function PropertyCardFeature(p: any) {
  const cover = (Array.isArray(p.images) && p.images[0]) || "/hero/villa-pool.jpg";
  const href = `/proprietes/${p.slug || p.id}`;
  return (
    <Link
      href={href}
      className="group relative block h-full min-h-[26rem] overflow-hidden rounded-3xl bg-[var(--color-navy-900)] text-white"
    >
      <Image
        src={cover}
        alt={p.title || "Bien"}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)] via-[var(--color-navy-950)]/30 to-transparent" />

      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="caption !text-white/80">Pièce maîtresse</span>
        <span className="chip chip-gold">À découvrir</span>
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            {p.location ? (
              <div className="caption !text-[var(--color-gold-400)] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {p.location}
              </div>
            ) : null}
            <h3 className="mt-2 font-display text-3xl sm:text-4xl text-white text-balance line-clamp-2">
              {p.title}
            </h3>
            <div className="mt-3 flex items-center gap-4 text-sm text-white/75">
              {p.rooms ? <span>{p.rooms} pièces</span> : null}
              {p.area ? <span>{p.area} m²</span> : null}
              {typeof p.price === "number" ? (
                <span className="font-display text-white">
                  {p.price.toLocaleString("fr-TN")} <span className="text-xs">DT</span>
                </span>
              ) : null}
            </div>
          </div>
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:bg-[var(--color-gold-500)] group-hover:text-[var(--color-navy-900)]">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PropertyCardWide(p: any) {
  const cover = (Array.isArray(p.images) && p.images[0]) || "/hero/office-lobby.jpg";
  const href = `/proprietes/${p.slug || p.id}`;
  return (
    <Link
      href={href}
      className="group relative grid h-full min-h-[12rem] grid-cols-1 sm:grid-cols-[1fr_1.2fr] overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--color-stone-200)] transition-all hover:ring-[var(--color-navy-900)]/25 hover:shadow-[0_20px_50px_-15px_rgba(11,23,51,0.18)]"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full overflow-hidden bg-[var(--color-ivory-100)]">
        <Image
          src={cover}
          alt={p.title || "Bien"}
          fill
          sizes="(max-width: 640px) 100vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col justify-between p-5">
        <div>
          {p.location ? (
            <div className="caption !text-[var(--color-stone-500)] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-600)]" /> {p.location}
            </div>
          ) : null}
          <h3 className="mt-2 font-display text-xl text-[var(--color-navy-900)] line-clamp-2">
            {p.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-[var(--color-stone-600)]">
            {p.rooms ? <span>{p.rooms} pièces</span> : null}
            {p.area ? <span>{p.area} m²</span> : null}
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="caption">Prix</span>
            <p className="mt-0.5 font-display text-xl text-[var(--color-navy-900)] leading-none">
              {typeof p.price === "number" ? p.price.toLocaleString("fr-TN") : "—"}{" "}
              <span className="text-xs text-[var(--color-stone-500)]">DT</span>
            </p>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ivory-100)] text-[var(--color-navy-900)] transition-all group-hover:bg-[var(--color-gold-500)]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
