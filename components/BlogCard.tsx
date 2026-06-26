import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  author: string
  featuredImage: string
  featuredImageAlt?: string
  category: string
  audienceLabel?: string
  createdAt?: string
  /** Niveau de titre pour l’accessibilité (hiérarchie sur la page) */
  titleHeading?: "h2" | "h3"
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  author,
  featuredImage,
  featuredImageAlt,
  category,
  audienceLabel,
  createdAt,
  titleHeading = "h3",
}: BlogCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("fr-TN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
  const isoDate = createdAt ? new Date(createdAt).toISOString() : undefined
  const imgAlt = featuredImageAlt || title
  const HeadingTag = titleHeading

  return (
    <article className="group border-b border-neutral-200 pb-12 last:border-b-0 last:pb-0 lg:flex lg:h-full lg:flex-col lg:rounded-xl lg:border lg:border-neutral-200 lg:bg-white lg:pb-0 lg:shadow-sm lg:transition-shadow lg:last:border-b lg:hover:shadow-md">
      <Link
        href={`/blog/${slug}`}
        className="flex h-full min-h-0 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] lg:rounded-xl"
      >
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 lg:rounded-none lg:border-0 lg:border-b lg:border-neutral-200">
          <Image
            src={featuredImage || "/IBM_logo_black_transparent.png"}
            alt={imgAlt}
            width={880}
            height={495}
            className="aspect-[16/9] h-auto w-full object-cover transition-opacity duration-200 group-hover:opacity-95"
            sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 45vw, 34rem"
          />
        </div>

        <div className="mt-5 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            {category}
            {audienceLabel ? (
              <>
                <span className="mx-2 font-normal text-neutral-300" aria-hidden="true">
                  ·
                </span>
                <span className="normal-case tracking-normal">{audienceLabel}</span>
              </>
            ) : null}
          </p>

          <HeadingTag className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug tracking-tight text-[var(--color-foreground)] text-balance group-hover:text-[var(--color-primary)] transition-colors sm:text-2xl lg:text-[1.375rem] lg:leading-snug">
            {title}
          </HeadingTag>

          <p className="mt-3 text-base leading-relaxed text-[var(--color-muted)] lg:line-clamp-5 lg:flex-1">
            {excerpt}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-muted)]">
            {isoDate ? (
              <time dateTime={isoDate} className="tabular-nums">
                {formattedDate}
              </time>
            ) : null}
            {isoDate ? <span aria-hidden="true">·</span> : null}
            <span>{author}</span>
          </div>

          <span className="mt-4 inline-flex text-sm font-medium text-[var(--color-primary)] underline-offset-4 group-hover:underline">
            Lire l&apos;article
          </span>
        </div>
      </Link>
    </article>
  )
}
