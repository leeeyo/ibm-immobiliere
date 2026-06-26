import Header from "@/components/Header"
import Footer from "@/components/Footer"
import JsonLd from "@/components/JsonLd"
import MetaViewContentTracker from "@/components/MetaViewContentTracker"
import PropertyCard from "@/components/PropertyCard"
import UnitsTable from "@/components/UnitsTable"
import Image from "next/image"
import { getProjectBySlug, getProjectProperties } from "@/lib/actions/projects"
import { notFound } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { SITE } from "@/lib/constants/site"

export async function generateMetadata(props: any) {
  const paramsRaw = await Promise.resolve(props?.params ?? {});
  let params: Record<string, any>;
  if (paramsRaw && typeof (paramsRaw as any).get === 'function') {
    params = {};
    for (const entry of (paramsRaw as any).entries() as Iterable<readonly [string, any]>) {
      const [k, v] = entry;
      params[k] = v;
    }
  } else {
    params = { ...(paramsRaw as any) };
  }
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  const canonical = `/projets/${project.slug}`
  const description = project.description?.replace(/[#*_`]/g, "").slice(0, 160) || undefined
  return {
    title: project.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: project.name,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: "fr_TN",
      images: project.images && project.images.length ? [project.images[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description,
      images: project.images && project.images.length ? [project.images[0]] : [],
    },
  } as any
}

export default async function ProjectDetailPage(props: any) {
  const paramsRaw = await Promise.resolve(props?.params ?? {});
  let params: Record<string, any>;
  if (paramsRaw && typeof (paramsRaw as any).get === 'function') {
    params = {};
    for (const entry of (paramsRaw as any).entries() as Iterable<readonly [string, any]>) {
      const [k, v] = entry;
      params[k] = v;
    }
  } else {
    params = { ...(paramsRaw as any) };
  }
  const project = await getProjectBySlug(params.slug)
  if (!project) return notFound()

  const availableProperties = await getProjectProperties(project.id)
  const canonicalUrl = `${SITE.url}/projets/${project.slug}`
  const projectImage = project.images?.[0]
    ? new URL(project.images[0], SITE.url).toString()
    : `${SITE.url}/IBM_logo_black_transparent.png`

  return (
    <>
      <Header />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ApartmentComplex",
            name: project.name,
            description: project.description,
            url: canonicalUrl,
            image: projectImage,
            address: {
              "@type": "PostalAddress",
              addressLocality: project.location,
              addressCountry: "TN",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Projets", item: `${SITE.url}/projets` },
              { "@type": "ListItem", position: 3, name: project.name, item: canonicalUrl },
            ],
          },
        ]}
      />
      <MetaViewContentTracker
        contentId={project.id}
        contentName={project.name}
        contentCategory="project"
      />

      <main className="pt-20">
        <section className="relative h-[500px] bg-[var(--color-foreground)]">
          <Image
            src={project.images && project.images.length ? project.images[0] : "/generated-icon.png"}
            alt={project.name}
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-foreground)] to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto pb-12">
              <div
                className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold mb-4 ${project.status === "completed" ? "bg-green-500 text-white" : "bg-[var(--color-primary)] text-white"}`}
              >
                {project.status === "completed" ? "Projet Terminé" : "En cours"}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 text-balance">{project.name}</h1>
              <p className="text-white/90 text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {project.location}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-extrabold text-[var(--color-foreground)] mb-6">À propos du projet</h2>
                <article className="prose lg:prose-lg max-w-none mb-12">
                  {/* normalize description:
                      - convert literal "\\n" sequences (from some DB editors) into real newlines
                      - normalize CRLF to LF
                      - convert single newlines into double newlines so ReactMarkdown treats them as paragraph breaks
                  */}
                  {(() => {
                    const raw = (project.description as string) || ''
                    const unescaped = raw.replace(/\\n/g, '\n')
                    const lf = unescaped.replace(/\r\n/g, '\n')
                    const asParagraphs = lf.replace(/\n(?!\n)/g, '\n\n')
                    return (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {asParagraphs}
                      </ReactMarkdown>
                    )
                  })()}
                </article>

                {/* Expanded Gallery (main image + thumbnails) */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Galerie photos</h2>
                  {(project.images || []).length === 0 ? (
                    <div className="h-64 bg-neutral-100 rounded-2xl flex items-center justify-center">Aucune image disponible</div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* large main image */}
                      <div className="lg:col-span-2 relative h-80 rounded-2xl overflow-hidden border-2 border-neutral-100">
                        <Image src={project.images[0] || '/placeholder.svg'} alt={project.name} fill className="object-cover" />
                      </div>

                      {/* thumbnails */}
                      <div className="grid grid-cols-3 gap-4">
                        {project.images.map((img: string, idx: number) => (
                          <div key={idx} className="relative h-24 rounded-xl overflow-hidden border-2 border-neutral-100 hover:border-[var(--color-primary)] transition-all">
                            <Image src={img || '/placeholder.svg'} alt={`${project.name} - Image ${idx + 1}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border-2 border-neutral-100 sticky top-24">
                  <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Spécifications</h3>
                  <div className="space-y-4 mb-8">
                    {Object.entries(project.specifications || {}).map(([key, value]) => (
                      <div key={key} className="pb-4 border-b border-neutral-200 last:border-0">
                        <p className="text-sm text-[var(--color-muted)] mb-1 font-medium">{key}</p>
                        <p className="font-bold text-[var(--color-foreground)] text-lg">{value}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold hover:bg-[var(--color-primary-600)] hover:shadow-xl transition-all">
                    Contactez-nous
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {(project.units || []).length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto">
              <UnitsTable units={project.units || []} projectName={project.name} />
            </div>
          </section>
        )}

        {(availableProperties || []).length > 0 && (
          <section className="py-20 bg-neutral-50">
            <div className="container mx-auto">
              <h2 className="text-3xl font-extrabold text-[var(--color-foreground)] mb-2">Propriétés disponibles</h2>
              <p className="text-[var(--color-muted)] text-lg mb-12">Découvrez les biens disponibles dans ce projet</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableProperties.map((property: any) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
