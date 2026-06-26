"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongodb";
import { Property } from "@/lib/models/Property";
import { serializeDoc } from "@/lib/utils/serialize";
import { uniqueSlug } from "@/lib/utils/slug";
import { requireAdmin } from "@/lib/auth/session";
import type { PropertyType, SearchFilters } from "@/lib/types";
import mongoose from "mongoose";

/* ─── PUBLIC READS ───────────────────────────────────────────────────── */

export async function getProperties(filters?: SearchFilters): Promise<PropertyType[]> {
  try {
    await connectDB();
    const query: any = {};
    if (filters) {
      if (filters.type && filters.type !== "all") query.type = filters.type;
      if (filters.minPrice) query.price = { ...(query.price || {}), $gte: filters.minPrice };
      if (filters.maxPrice) query.price = { ...(query.price || {}), $lte: filters.maxPrice };
      if (filters.rooms) query.rooms = { $gte: filters.rooms };
      if (filters.minArea) query.area = { ...(query.area || {}), $gte: filters.minArea };
      if (filters.maxArea) query.area = { ...(query.area || {}), $lte: filters.maxArea };
      if (filters.query) {
        const regex = new RegExp(filters.query, "i");
        query.$or = [{ title: regex }, { location: regex }, { description: regex }];
      }
    }
    const docs = await Property.find(query).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => serializeDoc(d)) as any;
  } catch (e) {
    console.error("getProperties error", e);
    return [];
  }
}

export async function getFeaturedProperties(limit = 6): Promise<PropertyType[]> {
  try {
    await connectDB();
    const docs = await Property.find({ featured: true, status: "available" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return docs.map((d: any) => serializeDoc(d)) as any;
  } catch (e) {
    console.error("getFeaturedProperties error", e);
    return [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<PropertyType | null> {
  try {
    await connectDB();
    const doc = await Property.findOne({ slug }).lean().exec();
    if (!doc) return null;
    return serializeDoc(doc) as any;
  } catch (e) {
    console.error("getPropertyBySlug error", e);
    return null;
  }
}

export async function getPropertySitemapEntries(): Promise<
  { slug: string; updatedAt?: string | Date }[]
> {
  try {
    await connectDB();
    const docs = await Property.find({}, { slug: 1, updatedAt: 1 }).lean().exec();
    return docs
      .filter((doc: any) => Boolean(doc.slug))
      .map((doc: any) => ({ slug: doc.slug, updatedAt: doc.updatedAt }));
  } catch (e) {
    console.error("getPropertySitemapEntries error", e);
    return [];
  }
}

export async function getPropertyById(id: string): Promise<PropertyType | null> {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Property.findById(id).lean().exec();
    if (!doc) return null;
    return serializeDoc(doc) as any;
  } catch (e) {
    console.error("getPropertyById error", e);
    return null;
  }
}

export async function getSimilarProperties(
  excludeSlugOrId: string,
  type: string,
  limit = 3
): Promise<PropertyType[]> {
  try {
    await connectDB();
    const query: any = { type, status: "available" };
    if (mongoose.Types.ObjectId.isValid(excludeSlugOrId)) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeSlugOrId) };
    } else {
      query.slug = { $ne: excludeSlugOrId };
    }
    const docs = await Property.find(query).sort({ createdAt: -1 }).limit(limit).lean().exec();
    return docs.map((d: any) => serializeDoc(d)) as any;
  } catch (e) {
    console.error("getSimilarProperties error", e);
    return [];
  }
}

export async function searchProperties(
  filters: SearchFilters
): Promise<{ results: PropertyType[]; total: number }> {
  try {
    await connectDB();
    const query: any = { status: "available" };
    if (filters.type && filters.type !== "all") query.type = filters.type;
    if (filters.minPrice) query.price = { ...(query.price || {}), $gte: filters.minPrice };
    if (filters.maxPrice) query.price = { ...(query.price || {}), $lte: filters.maxPrice };
    if (filters.rooms) query.rooms = { $gte: filters.rooms };
    if (filters.minArea) query.area = { ...(query.area || {}), $gte: filters.minArea };
    if (filters.maxArea) query.area = { ...(query.area || {}), $lte: filters.maxArea };
    if (filters.query) {
      const regex = new RegExp(filters.query, "i");
      query.$or = [{ title: regex }, { location: regex }, { description: regex }];
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 12;
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> =
      filters.sort === "price_asc"
        ? { price: 1 }
        : filters.sort === "price_desc"
        ? { price: -1 }
        : { createdAt: -1 };

    const [total, docs] = await Promise.all([
      Property.countDocuments(query),
      Property.find(query).sort(sort as any).skip(skip).limit(limit).lean().exec(),
    ]);

    return { results: docs.map((d: any) => serializeDoc(d)), total } as any;
  } catch (e) {
    console.error("searchProperties error", e);
    return { results: [], total: 0 };
  }
}

/* ─── ADMIN MUTATIONS ────────────────────────────────────────────────── */

export type PropertyInput = {
  title: string;
  description: string;
  price: number;
  location: string;
  type: "residential" | "commercial";
  rooms?: number;
  bathrooms?: number;
  area: number;
  floor?: string;
  planUrl?: string;
  orientation?: string;
  reference?: string;
  images: string[];
  videos?: string[];
  features?: string[];
  status: "available" | "sold" | "reserved";
  featured?: boolean;
  projectId?: string | null;
};

export async function listAllProperties(): Promise<PropertyType[]> {
  await requireAdmin();
  await connectDB();
  const docs = await Property.find({}).sort({ createdAt: -1 }).lean().exec();
  return docs.map((d: any) => serializeDoc(d)) as any;
}

export async function adminGetProperty(id: string): Promise<PropertyType | null> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Property.findById(id).lean().exec();
  return doc ? (serializeDoc(doc) as any) : null;
}

export async function createProperty(
  input: PropertyInput
): Promise<{ success: boolean; id?: string; slug?: string; error?: string }> {
  await requireAdmin();
  await connectDB();
  try {
    const slug = await uniqueSlug(input.title, async (s) => Boolean(await Property.exists({ slug: s })));
    const projectId =
      input.projectId && mongoose.Types.ObjectId.isValid(input.projectId)
        ? new mongoose.Types.ObjectId(input.projectId)
        : null;

    const doc = await Property.create({
      ...input,
      slug,
      projectId,
    });
    revalidatePath("/admin/properties");
    revalidatePath("/proprietes");
    return { success: true, id: String(doc._id), slug };
  } catch (e: any) {
    console.error("createProperty error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput> & { regenerateSlug?: boolean }
): Promise<{ success: boolean; error?: string; slug?: string }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false, error: "ID invalide" };
  try {
    const update: any = { ...input };
    delete update.regenerateSlug;
    if (input.regenerateSlug && input.title) {
      update.slug = await uniqueSlug(input.title, async (s) =>
        Boolean(await Property.exists({ slug: s, _id: { $ne: id } }))
      );
    }
    if (input.projectId !== undefined) {
      update.projectId =
        input.projectId && mongoose.Types.ObjectId.isValid(input.projectId)
          ? new mongoose.Types.ObjectId(input.projectId)
          : null;
    }
    const doc = await Property.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    revalidatePath("/admin/properties");
    revalidatePath("/proprietes");
    if ((doc as any)?.slug) revalidatePath(`/proprietes/${(doc as any).slug}`);
    return { success: true, slug: (doc as any)?.slug };
  } catch (e: any) {
    console.error("updateProperty error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false };
  await Property.findByIdAndDelete(id).exec();
  revalidatePath("/admin/properties");
  revalidatePath("/proprietes");
  return { success: true };
}
