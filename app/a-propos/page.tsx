import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import StatsCounter from "@/components/StatsCounter"

export const metadata = {
  title: "À Propos - IBM Immobilière",
  description:
    "IBM Immobilière - 15 ans d'expérience dans le secteur immobilier en Tunisie. Notre mission : créer des espaces où il fait bon vivre.",
  alternates: { canonical: "/a-propos" },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-neutral-50 to-white py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-foreground)] mb-6 text-balance leading-tight">
                À Propos d&apos;IBM Immobilière
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto">
                Depuis 2010, nous accompagnons nos clients dans leurs projets immobiliers en Tunisie avec expertise,
                transparence et proximité.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-foreground)] mb-4">
                    Notre histoire
                  </h2>
                  <p className="text-[var(--color-muted)] leading-relaxed text-lg">
                    Fondée en 2010, IBM Immobilière a réalisé de nombreux projets résidentiels et commerciaux à travers
                    la Tunisie. Notre équipe est composée d&apos;architectes, ingénieurs et conseillers expérimentés.
                  </p>
                </div>
                <div className="pt-4">
                  <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">Notre mission</h3>
                  <p className="text-[var(--color-muted)] leading-relaxed text-lg">
                    Offrir des biens de qualité, pensés pour le confort et la durabilité, tout en accompagnant nos
                    clients à chaque étape.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Nos valeurs</h3>
                <ul className="space-y-4">
                  {[
                    { icon: "✓", text: "Intégrité et transparence" },
                    { icon: "✓", text: "Qualité et durabilité" },
                    { icon: "✓", text: "Proximité client" },
                    { icon: "✓", text: "Innovation et design" },
                  ].map((value, index) => (
                    <li key={index} className="flex items-center gap-3 text-[var(--color-muted)] text-lg">
                      <span className="w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {value.icon}
                      </span>
                      {value.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <StatsCounter />

        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-[var(--color-foreground)] mb-4">Pourquoi nous choisir</h2>
              <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
                Une expertise reconnue au service de vos ambitions immobilières
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border-2 border-neutral-100 hover:border-[var(--color-primary)] hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                  <svg
                    className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-3 text-[var(--color-foreground)]">Expertise locale</h4>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  Connaissance approfondie du marché tunisien et des meilleures implantations.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-neutral-100 hover:border-[var(--color-primary)] hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                  <svg
                    className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-3 text-[var(--color-foreground)]">Accompagnement complet</h4>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  De la conception à la remise des clés, nous vous accompagnons à chaque étape.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-neutral-100 hover:border-[var(--color-primary)] hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors">
                  <svg
                    className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-3 text-[var(--color-foreground)]">Design moderne</h4>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  Des réalisations alliant esthétisme et fonctionnalité.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-100 rounded-2xl p-12 shadow-lg">
              <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--color-foreground)] mb-4">
                Rejoignez-nous
              </h3>
              <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
                Contactez notre équipe pour discuter de votre projet immobilier ou planifier une visite.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[var(--color-primary-600)] hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Contactez-nous
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
