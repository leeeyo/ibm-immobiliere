import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BlogCard from "@/components/BlogCard"
import MetaViewContentTracker from "@/components/MetaViewContentTracker"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/actions/blog"
import { SITE } from "@/lib/constants/site"
import type { BlogPostType } from "@/lib/types"

export const revalidate = 600

async function resolveParams(props: { params?: unknown }) {
  const paramsRaw = await Promise.resolve(props?.params ?? {})
  let params: Record<string, unknown>
  if (paramsRaw && typeof (paramsRaw as { get?: unknown }).get === "function") {
    params = {}
    for (const entry of (paramsRaw as { entries: () => Iterable<readonly [string, unknown]> }).entries()) {
      const [k, v] = entry
      params[k] = v
    }
  } else {
    params = { ...(paramsRaw as object) }
  }
  const slug = params.slug
  return typeof slug === "string" ? slug : ""
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function readTimeMinutes(content: string) {
  const words = stripHtml(content)
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function buildArticleJsonLd(post: BlogPostType, slug: string) {
  const url = `${SITE.url}/blog/${slug}`
  const image = post.featuredImage
  const published = post.createdAt ? new Date(post.createdAt).toISOString() : undefined
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: image ? [image] : undefined,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/IBM_logo_black_transparent.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: post.category,
    keywords: post.keywords?.length ? post.keywords.join(", ") : undefined,
    inLanguage: "fr-TN",
    isAccessibleForFree: true,
  }
}

function buildBreadcrumbJsonLd(title: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE.url}/blog/${slug}` },
    ],
  }
}

const shareBtnClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"

function ShareArticleSection({
  shareUrl,
  shareText,
  layout,
}: {
  shareUrl: string
  shareText: string
  layout: "inline" | "stacked"
}) {
  const listClass = layout === "stacked" ? "mt-4 flex flex-col gap-2" : "mt-4 flex flex-wrap gap-3"
  const linkClass = layout === "stacked" ? `${shareBtnClass} w-full` : shareBtnClass
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-foreground)]">Partager cet article</p>
      <ul className={listClass}>
        <li>
          <a
            className={linkClass}
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Facebook"
          >
            Facebook
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur X (Twitter)"
          >
            X
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur LinkedIn"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  )
}

export async function generateMetadata(props: { params?: unknown }): Promise<Metadata> {
  const slug = await resolveParams(props)
  if (!slug) return {}
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const desc = post.metaDescription || post.excerpt || stripHtml(post.content).slice(0, 160)
  const canonical = `/blog/${slug}`
  const kw = [
    "immobilier Tunisie",
    "acheter en Tunisie",
    ...(post.keywords || []),
  ]

  return {
    title,
    description: desc,
    keywords: kw,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "fr_TN",
      url: `${SITE.url}${canonical}`,
      title,
      description: desc,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      section: post.category,
      images: post.featuredImage ? [{ url: post.featuredImage, alt: post.featuredImageAlt || post.title }] : undefined,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  }
}

export default async function BlogPostPage(props: { params?: unknown }) {
  const slug = await resolveParams(props)
  if (!slug) notFound()

  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedBlogPosts(slug, post.category, 2)
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("fr-TN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
  const isoDate = post.createdAt ? new Date(post.createdAt).toISOString() : undefined
  const readTime = readTimeMinutes(post.content)
  const imageAlt = post.featuredImageAlt || post.title
  const pageUrl = `${SITE.url}/blog/${slug}`
  const shareText = encodeURIComponent(post.title)
  const shareUrl = encodeURIComponent(pageUrl)

  const articleLd = buildArticleJsonLd(post as BlogPostType, slug)
  const breadcrumbLd = buildBreadcrumbJsonLd(post.title, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Header />
      <MetaViewContentTracker
        contentId={post.id}
        contentName={post.title}
        contentCategory="blog_post"
      />

      <main
        id="contenu-principal"
        className="pt-24 pb-16 lg:pb-20 lg:pt-[var(--ibm-blog-header-pad)]"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl lg:px-10 xl:px-12">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-x-16">
            <article className="min-w-0 lg:max-w-[47rem]">
              <nav aria-label="Fil d'Ariane" className="text-sm text-[var(--color-muted)]">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="text-[var(--color-primary)] underline-offset-4 hover:underline">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/blog" className="text-[var(--color-primary)] underline-offset-4 hover:underline">
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="line-clamp-1 text-[var(--color-foreground)]">{post.title}</li>
                </ol>
              </nav>

              <header className="mt-8 border-b border-neutral-200 pb-10 lg:mt-10 lg:pb-12">
                <p className="text-sm font-medium text-[var(--color-muted)]">
                  <span className="text-[var(--color-foreground)]">{post.category}</span>
                  {post.audienceLabel ? (
                    <>
                      {" "}
                      <span aria-hidden="true">·</span> {post.audienceLabel}
                    </>
                  ) : null}
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl text-balance lg:text-[2.25rem] lg:leading-tight">
                  {post.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)] lg:text-xl lg:leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
                  <span>
                    <span className="sr-only">Auteur : </span>
                    {post.author}
                  </span>
                  {isoDate ? (
                    <time dateTime={isoDate}>
                      Publié le {formattedDate}
                    </time>
                  ) : null}
                  <span>{readTime} min de lecture</span>
                </div>
              </header>

              <figure className="mt-10 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 lg:mt-12">
                <Image
                  src={post.featuredImage}
                  alt={imageAlt}
                  width={1200}
                  height={675}
                  className="aspect-[16/9] h-auto w-full object-cover"
                  priority
                  sizes="(max-width: 1023px) 100vw, 47rem"
                />
                <figcaption className="px-4 py-3 text-center text-sm text-[var(--color-muted)] lg:px-6 lg:text-left">
                  {imageAlt}
                </figcaption>
              </figure>

              <div
                className="blog-prose mt-10 max-w-none lg:mt-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-14 border-t border-neutral-200 pt-10 lg:hidden">
                <ShareArticleSection shareUrl={shareUrl} shareText={shareText} layout="inline" />
              </div>
            </article>

            <aside
              className="mt-12 hidden min-w-0 border-t border-neutral-200 pt-10 lg:mt-0 lg:block lg:border-l lg:border-t-0 lg:pl-8 lg:pt-2"
              aria-label="Partage et navigation"
            >
              <div className="lg:sticky lg:top-[var(--ibm-blog-sticky-top)] lg:space-y-10">
                <ShareArticleSection shareUrl={shareUrl} shareText={shareText} layout="stacked" />
                <div className="border-t border-neutral-200 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                    Navigation
                  </p>
                  <Link
                    href="/blog"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
                  >
                    ← Tous les articles
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 ? (
          <section
            className="mx-auto mt-20 max-w-2xl px-4 sm:px-6 lg:mt-24 lg:max-w-6xl lg:px-10 xl:px-12"
            aria-labelledby="articles-similaires"
          >
            <h2 id="articles-similaires" className="font-[family-name:var(--font-display)] text-xl font-semibold lg:text-2xl">
              À lire aussi
            </h2>
            <div className="mt-8 flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
              {relatedPosts.map((relatedPost: BlogPostType) => (
                <BlogCard key={relatedPost.slug} {...relatedPost} titleHeading="h3" />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  )
}
