import type { MetadataRoute } from "next"
import { SITE } from "@/lib/constants/site"
import { getPublishedBlogSitemapEntries } from "@/lib/actions/blog"
import { getProjectSitemapEntries } from "@/lib/actions/projects"
import { getPropertySitemapEntries } from "@/lib/actions/properties"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "")
  const [blogEntries, projectEntries, propertyEntries] = await Promise.all([
    getPublishedBlogSitemapEntries(),
    getProjectSitemapEntries(),
    getPropertySitemapEntries(),
  ])
  const fallback = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: fallback, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: fallback, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/proprietes`, lastModified: fallback, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/projets`, lastModified: fallback, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: fallback, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/a-propos`, lastModified: fallback, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/mentions-legales`, lastModified: fallback, changeFrequency: "yearly", priority: 0.25 },
    { url: `${base}/politique-confidentialite`, lastModified: fallback, changeFrequency: "yearly", priority: 0.25 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogEntries.map((e) => ({
    url: `${base}/blog/${e.slug}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt as string | Date) : fallback,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projectEntries.map((entry) => ({
    url: `${base}/projets/${entry.slug}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : fallback,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }))

  const propertyRoutes: MetadataRoute.Sitemap = propertyEntries.map((entry) => ({
    url: `${base}/proprietes/${entry.slug}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : fallback,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes, ...propertyRoutes, ...blogRoutes]
}
