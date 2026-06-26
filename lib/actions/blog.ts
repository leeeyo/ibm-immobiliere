"use server";

import { connectDB } from '@/lib/db/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';
import { serializeDoc } from '@/lib/utils/serialize';

export async function getBlogPosts(category?: string) {
  try {
    await connectDB();
    const query: any = { published: true };
    if (category && category !== 'Tous') query.category = category;
    const docs = await BlogPost.find(query).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error('getBlogPosts error', e);
    return [];
  }
}

export async function getFeaturedBlogPosts(limit = 3) {
  try {
    await connectDB();
    const docs = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).limit(limit).lean().exec();
    return docs.map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error('getFeaturedBlogPosts error', e);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await connectDB();
    const doc = await BlogPost.findOne({ slug, published: true }).lean().exec();
    if (!doc) return null;
    return serializeDoc(doc);
  } catch (e) {
    console.error('getBlogPostBySlug error', e);
    return null;
  }
}

export async function getRelatedBlogPosts(slug: string, category: string, limit = 3) {
  try {
    await connectDB();
    const sameCat = await BlogPost.find({ category, published: true, slug: { $ne: slug } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    if (sameCat.length >= limit) {
      return sameCat.map((d: any) => serializeDoc(d));
    }
    const used = new Set([slug, ...sameCat.map((d: any) => d.slug)]);
    const more = await BlogPost.find({ published: true, slug: { $nin: [...used] } })
      .sort({ createdAt: -1 })
      .limit(limit - sameCat.length)
      .lean()
      .exec();
    return [...sameCat, ...more].map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error('getRelatedBlogPosts error', e);
    return [];
  }
}

/** Entrees publiees pour sitemap (slug + dates) */
export async function getPublishedBlogSitemapEntries() {
  try {
    await connectDB();
    const docs = await BlogPost.find({ published: true }).select('slug updatedAt').sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ slug: d.slug as string, updatedAt: d.updatedAt }));
  } catch (e) {
    console.error('getPublishedBlogSitemapEntries error', e);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    await connectDB();
    const categories = await BlogPost.distinct('category', { published: true });
    return categories;
  } catch (e) {
    console.error('getBlogCategories error', e);
    return [];
  }
}
