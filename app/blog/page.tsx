import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BlogCard from "@/components/BlogCard"
import { getBlogPosts } from "@/lib/actions/blog"
import { SITE } from "@/lib/constants/site"

export const revalidate = 600

const description =
  "Articles sur l’achat, l’investissement et le logement en Tunisie : Tunis, Ariana, littoral et programmes neufs. Rédaction IBM Immobilière."

export const metadata: Metadata = {
  title: "Blog immobilier en Tunisie — conseils et actualités",
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog · ${SITE.name}`,
    description:
      "Conseils immobiliers pour la Tunisie : primo-accédants, investisseurs, diaspora et professionnels.",
    url: `${SITE.url}/blog`,
    locale: "fr_TN",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog · ${SITE.name}`,
    description,
  },
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts()
  const sorted = [...posts].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return tb - ta
  })

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Blog — ${SITE.name}`,
    description,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.url}/blog/${post.slug}`,
      name: post.title,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJson),
        }}
      />
      <Header />

      <main
        id="contenu-principal"
        className="pt-24 pb-20 lg:pb-24 lg:pt-[var(--ibm-blog-header-pad)]"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl lg:px-10 xl:px-12">
          <header className="mb-14 border-b border-neutral-200 pb-10 lg:mb-16 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:pb-12">
            <div className="min-w-0 lg:max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Actualités &amp; conseils
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
                Blog immobilier
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)] lg:text-xl lg:leading-relaxed">
                {description}
              </p>
            </div>
            <nav
              aria-label="Fil d&apos;Ariane"
              className="mt-6 text-sm text-[var(--color-muted)] lg:mt-0 lg:shrink-0"
            >
              <ol className="flex flex-wrap items-center gap-2 lg:justify-end">
                <li>
                  <Link href="/" className="text-[var(--color-primary)] underline-offset-4 hover:underline">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[var(--color-foreground)]">Blog</li>
              </ol>
            </nav>
          </header>

          {sorted.length === 0 ? (
            <p className="text-[var(--color-muted)]">
              Aucun article pour le moment. Revenez bientôt ou{" "}
              <Link className="text-[var(--color-primary)] underline-offset-4 hover:underline" href="/contact">
                contactez-nous
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12 xl:gap-x-12">
              {sorted.map((post) => (
                <BlogCard key={post.slug} {...post} titleHeading="h2" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
