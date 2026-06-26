import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProjectCard from "@/components/ProjectCard"
import { getProjects } from "@/lib/actions/projects"

export const metadata = {
  title: "Nos Projets - IBM Immobilière",
  description: "Découvrez nos projets immobiliers réalisés et en cours",
  alternates: { canonical: "/projets" },
}

export default async function ProjectsPage({ searchParams }: { searchParams?: any }) {
  // normalize searchParams
  const spRaw = await Promise.resolve(searchParams || {});
  const sp: Record<string, any> = typeof (spRaw as any).get === 'function' ? Object.fromEntries(Array.from((spRaw as any).entries())) : { ...(spRaw as any) };
  // default to 'completed' per request
  const status = (sp.status as any) || 'completed';
  const projects = await getProjects(status);
  const plannedProjects = projects.filter((p: any) => p.status === 'planned');
  const ongoingProjects = projects.filter((p: any) => p.status === 'ongoing');
  const completedProjects = projects.filter((p: any) => p.status === 'completed');

  return (
    <>
      <Header />

      <main className="pt-20">
        <section className="relative bg-gradient-to-br from-neutral-50 to-white py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-foreground)] mb-6 text-balance leading-tight">
                Nos Projets
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto">
                Découvrez nos réalisations immobilières qui allient architecture moderne et qualité de vie
                exceptionnelle
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--color-foreground)] mb-1">Filtrer par statut</h2>
              <p className="text-[var(--color-muted)] text-sm">Affichez les projets par statut</p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { key: 'planned', label: 'À venir' },
                { key: 'ongoing', label: 'En cours' },
                { key: 'completed', label: 'Complété' },
                { key: 'all', label: 'Tous' },
              ].map((b) => (
                <a
                  key={b.key}
                  href={`?status=${b.key}`}
                  className={`px-4 py-2 rounded-full font-medium border ${status === b.key ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-white text-[var(--color-foreground)] border-neutral-200'} transition-colors`}
                >
                  {b.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Render sections depending on selected status */}
        {status === 'all' ? (
          <section className="py-20 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: any) => (
                  <ProjectCard key={project.slug} {...project} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            {status === 'planned' && plannedProjects.length > 0 && (
              <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-extrabold text-[var(--color-foreground)]">Projets à venir</h3>
                    <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-semibold">{plannedProjects.length} projet{plannedProjects.length > 1 ? 's' : ''}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plannedProjects.map((project: any) => (
                      <ProjectCard key={project.slug} {...project} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {status === 'ongoing' && ongoingProjects.length > 0 && (
              <section className="py-20 bg-neutral-50">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-extrabold text-[var(--color-foreground)]">Projets en cours</h3>
                    <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-2 border-[var(--color-primary)] px-4 py-2 rounded-xl font-semibold">{ongoingProjects.length} projet{ongoingProjects.length > 1 ? 's' : ''}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ongoingProjects.map((project: any) => (
                      <ProjectCard key={project.slug} {...project} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {status === 'completed' && (
              <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-extrabold text-[var(--color-foreground)]">Projets réalisés</h3>
                    <div className="bg-neutral-100 text-[var(--color-foreground)] px-4 py-2 rounded-xl font-semibold">{completedProjects.length} projets</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {completedProjects.map((project: any) => (
                      <ProjectCard key={project.slug} {...project} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  )
}
