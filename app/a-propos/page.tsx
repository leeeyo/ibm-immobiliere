import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Compass,
  Hammer,
  Handshake,
  KeyRound,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AnimatedCounter from "@/components/AnimatedCounter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { getWebsiteSettings } from "@/lib/website-settings";

export const metadata: Metadata = {
  title: "À propos - IBM Immobilière",
  description:
    "Immobilière Ben Mokhtar, promoteur immobilier fondé en 2009 et affilié au Ben Mokhtar Groupe. Résidences modernes, bâtiments commerciaux et réalisations de prestige en Tunisie.",
  alternates: { canonical: "/a-propos" },
};

const FOUNDATION_YEAR = 2009;
const MIN_YEARS = 17;
const MIN_PROJECTS = 12;
const APARTMENTS_DELIVERED = 250;
const CLIENTS_SUPPORTED = 250;

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Rigueur technique",
    desc: "Chaque résidence est pensée autour de la structure, de l'isolation, des finitions et de la pérennité.",
  },
  {
    icon: Sparkles,
    title: "Prestige habitable",
    desc: "Des appartements lumineux, élégants et faciles à vivre, où le confort quotidien reste la vraie mesure du luxe.",
  },
  {
    icon: Handshake,
    title: "Accompagnement clair",
    desc: "Plans, visites, choix, calendrier et remise des clés : nos équipes restent proches à chaque décision.",
  },
];

const TIMELINE = [
  {
    year: "2009",
    title: "Fondation d'IBM",
    meta: "Ben Mokhtar Groupe",
    desc: "Naissance d'Immobilière Ben Mokhtar avec une ambition claire : construire des résidences durables, lisibles et bien situées.",
  },
  {
    year: "2011",
    title: "Résidence El Khalil",
    meta: "L'Aouina · 8 appartements",
    desc: "Première réalisation marquante : une résidence lumineuse au coeur de L'Aouina, pensée autour du confort et des finitions de standing.",
  },
  {
    year: "2013",
    title: "Résidence Ennakhil",
    meta: "Jardins de L'Aouina · 10 appartements",
    desc: "IBM confirme son ancrage résidentiel avec un projet calme et familial, proche des commerces et des espaces verts.",
  },
  {
    year: "2015",
    title: "Résidence El Ons",
    meta: "Boumhel El Bassatine · 32 appartements",
    desc: "Changement d'échelle à Boumhel : un ensemble plus généreux, conçu pour répondre à une demande résidentielle plus large.",
  },
  {
    year: "2021",
    title: "Résidence La Tulipe",
    meta: "Borj Cedria · 32 unités",
    desc: "Un projet mixte en R+2, associant appartements, locaux commerciaux et espaces extérieurs dans un quartier résidentiel chic.",
  },
  {
    year: "2024",
    title: "Résidence Amira",
    meta: "Boumhel, Ben Arous · 33 appartements",
    desc: "La nouvelle génération IBM : accès rapides vers Tunis, commodités proches et appartements pensés pour les familles comme les investisseurs.",
  },
];

const VALUES = [
  "Architecture contemporaine et proportions justes",
  "Matériaux nobles, finitions précises et suivi de chantier",
  "Emplacements choisis pour la vie quotidienne",
  "Transparence commerciale et engagement après livraison",
];

export default async function AboutPage() {
  const settings = await getWebsiteSettings();
  const yearsOfExperience = Math.max(settings.yearsOfExperience, MIN_YEARS);
  const projectsDelivered = Math.max(settings.residencesDelivered, MIN_PROJECTS);

  const stats = [
    { value: yearsOfExperience, suffix: "", label: "Années d'engagement", detail: `Fondée en ${FOUNDATION_YEAR}` },
    { value: projectsDelivered, suffix: "+", label: "Projets livrés", detail: "Résidentiel et commercial" },
    { value: APARTMENTS_DELIVERED, suffix: "+", label: "Appartements conçus", detail: "Espaces de vie de standing" },
    { value: CLIENTS_SUPPORTED, suffix: "+", label: "Clients accompagnés", detail: "De la visite aux clés" },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-clip bg-white">
        <section className="relative overflow-hidden bg-[var(--color-navy-950)] pt-20 text-white sm:pt-24 lg:pt-32">
          <Image
            src="/hero/aerial-development.jpg"
            alt="Développement immobilier signé IBM Immobilière"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.42]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(200,165,96,0.28),transparent_34%),linear-gradient(90deg,rgba(6,14,34,0.96),rgba(6,14,34,0.72)_45%,rgba(6,14,34,0.34))]" />
          <div className="blueprint text-white" aria-hidden />
          <div className="container-page relative grid min-h-[25.5rem] grid-cols-12 items-end gap-x-8 gap-y-6 pb-7 sm:min-h-[30rem] lg:min-h-[36rem] lg:pb-12">
            <Reveal className="col-span-12 max-w-3xl lg:col-span-8">
              <span className="caption !text-[var(--color-gold-400)]">Immobilière Ben Mokhtar</span>
              <h1 className="mt-4 editorial-hero text-[clamp(2.15rem,6.4vw,5.8rem)] text-white text-balance">
                Bâtir des lieux<br />
                <em>où la vie prend forme.</em>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/76 sm:text-base md:text-lg">
                Fondée en {FOUNDATION_YEAR}, IBM est une entreprise spécialisée dans le développement et la promotion
                immobilière, fièrement affiliée au Ben Mokhtar Groupe.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/proprietes" className="btn btn-gold justify-center">
                  Voir nos appartements
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline !border-white/35 !text-white hover:!bg-white hover:!text-[var(--color-navy-900)] justify-center"
                >
                  Planifier une visite
                </Link>
              </div>
            </Reveal>

            <Reveal delay={160} className="hidden lg:col-span-4 lg:block">
              <div className="ml-auto max-w-sm rounded-2xl bg-white/[0.08] p-5 backdrop-blur-md ring-1 ring-white/15">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-500)] text-[var(--color-navy-900)]">
                    <Award className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="caption !text-white/55">Depuis 2009</p>
                    <p className="mt-2 font-display text-2xl leading-snug text-white">
                      Plus de {yearsOfExperience} ans d'expertise au service de réalisations de prestige.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative bg-[var(--color-ivory-50)]">
          <div className="container-page py-5 lg:py-11">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:divide-x md:divide-[var(--color-stone-200)]">
              {stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 90}
                  className="rounded-xl bg-white/70 p-3 ring-1 ring-[var(--color-stone-200)] md:rounded-none md:bg-transparent md:px-8 md:py-0 md:ring-0 first:md:pl-0 last:md:pr-0"
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-2xl leading-none text-[var(--color-navy-900)] tabular-nums sm:text-4xl lg:text-6xl"
                  />
                  <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-stone-500)] sm:text-[0.7rem]">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[0.72rem] leading-snug text-[var(--color-stone-500)] sm:text-sm">{stat.detail}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-white">
          <div className="container-page grid grid-cols-12 gap-x-8 gap-y-10 py-14 lg:py-20">
            <Reveal className="col-span-12 lg:col-span-5">
              <span className="caption">Notre histoire</span>
              <h2 className="mt-4 editorial-hero text-[clamp(2.3rem,5.4vw,5rem)] text-[var(--color-navy-900)]">
                Une maison de promotion,<br />
                <em>une culture du détail.</em>
              </h2>
            </Reveal>
            <Reveal delay={120} className="col-span-12 lg:col-span-7">
              <div className="space-y-5 text-lg leading-relaxed text-[var(--color-stone-700)]">
                <p>
                  Nous avons mené à bien de nombreux projets ambitieux, qu'il s'agisse de résidences modernes ou de
                  bâtiments commerciaux, répondant avec précision aux attentes des particuliers et des professionnels.
                </p>
                <p>
                  Forts de plus de {yearsOfExperience} ans d'expertise, nous mettons notre rigueur technique au service
                  de réalisations de prestige. Chez IBM, nous croyons que votre appartement n'est pas seulement un
                  investissement, mais un espace de vie privilégié où vos rêves prennent vie.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {VALUES.map((value) => (
                  <div key={value} className="flex items-start gap-3 rounded-xl border border-[var(--color-stone-200)] bg-white p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-600)]" aria-hidden />
                    <span className="text-sm font-medium text-[var(--color-navy-900)]">{value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--color-navy-950)] text-white">
          <div className="grain" aria-hidden />
          <div className="container-page grid grid-cols-12 gap-6 py-14 lg:py-20">
            {PRINCIPLES.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={item.title}
                  delay={index * 110}
                  className="col-span-12 rounded-2xl bg-white/[0.045] p-6 ring-1 ring-white/10 md:col-span-4 lg:p-8"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-[var(--color-gold-400)] ring-1 ring-white/12">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-white/68">{item.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="bg-[var(--color-ivory-50)]">
          <div className="container-page grid grid-cols-12 gap-x-8 gap-y-8 py-12 lg:py-18">
            <Reveal className="col-span-12 lg:col-span-5">
              <div className="sticky top-28">
                <span className="caption">Repères</span>
                <h2 className="mt-4 font-display text-3xl leading-tight text-[var(--color-navy-900)] md:text-5xl">
                  La trajectoire IBM, projet par projet.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-stone-600)] sm:text-base">
                  Les données du catalogue racontent une progression nette : L'Aouina, Boumhel, Borj Cedria, puis une
                  nouvelle résidence Amira plus ambitieuse à Ben Arous.
                </p>
              </div>
            </Reveal>
            <div className="col-span-12 lg:col-span-7">
              <ol className="relative space-y-3 before:absolute before:bottom-5 before:left-[2.65rem] before:top-5 before:w-px before:bg-[var(--color-stone-200)] sm:before:left-[3.25rem]">
                {TIMELINE.map((item, index) => (
                  <Reveal as="li" key={item.year} delay={index * 100}>
                    <div className="relative grid grid-cols-[4.75rem_1fr] gap-4 rounded-2xl border border-[var(--color-stone-200)] bg-white p-4 shadow-[0_18px_45px_-30px_rgba(11,23,51,0.28)] sm:grid-cols-[5.75rem_1fr] sm:p-5">
                      <span className="relative z-10 inline-flex h-11 w-16 items-center justify-center rounded-full bg-[var(--color-ivory-50)] font-display text-xl text-[var(--color-gold-600)] ring-1 ring-[var(--color-stone-200)] sm:w-20 sm:text-2xl">
                        {item.year}
                      </span>
                      <div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <h3 className="font-display text-xl text-[var(--color-navy-900)] sm:text-2xl">{item.title}</h3>
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-700)]">
                            {item.meta}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-stone-600)] sm:text-base">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="relative bg-white">
          <div className="container-page py-14 lg:py-20">
            <Reveal>
              <div className="grid grid-cols-12 overflow-hidden rounded-3xl bg-[var(--color-navy-950)] text-white">
                <div className="relative col-span-12 min-h-[22rem] lg:col-span-5">
                  <Image
                    src="/hero/interior-living.jpg"
                    alt="Appartement lumineux et raffiné"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/55 to-transparent lg:bg-gradient-to-r" />
                </div>
                <div className="col-span-12 p-7 sm:p-10 lg:col-span-7 lg:p-14">
                  <span className="caption !text-[var(--color-gold-400)]">Notre promesse</span>
                  <h2 className="mt-4 editorial-hero text-[clamp(2.2rem,5vw,4.6rem)] text-white">
                    Votre appartement,<br />
                    <em>bien plus qu'un investissement.</em>
                  </h2>
                  <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/72">
                    C'est un cadre de vie privilégié : une adresse, une lumière, des matières, une circulation, des
                    détails silencieux qui changent le quotidien. Notre rôle est de donner une forme concrète à cette
                    ambition.
                  </p>
                  <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { icon: Compass, label: "Choisir le bon emplacement" },
                      { icon: Hammer, label: "Construire avec exigence" },
                      { icon: KeyRound, label: "Livrer en confiance" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-xl bg-white/[0.055] p-4 ring-1 ring-white/10">
                          <Icon className="h-5 w-5 text-[var(--color-gold-400)]" aria-hidden />
                          <p className="mt-3 text-sm font-semibold leading-snug text-white/88">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Link href="/projets" className="btn btn-gold justify-center">
                      Découvrir nos projets
                      <Building2 className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href="/contact"
                      className="btn btn-outline !border-white/30 !text-white hover:!bg-white hover:!text-[var(--color-navy-900)] justify-center"
                    >
                      Nous rencontrer
                      <MapPin className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
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
