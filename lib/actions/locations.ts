"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

import { requireAdmin } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongodb";
import { Location } from "@/lib/models/Location";
import { Project } from "@/lib/models/Project";
import { Property } from "@/lib/models/Property";
import type { LocationType } from "@/lib/types";
import { serializeDoc } from "@/lib/utils/serialize";
import { makeSlug } from "@/lib/utils/slug";

export type LocationInput = {
  name: string;
  active?: boolean;
  sortOrder?: number;
};

function normalizeLocation(doc: any): LocationType {
  return serializeDoc(doc) as LocationType;
}

async function uniqueLocationSlug(name: string, excludeId?: string) {
  const base = makeSlug(name) || "localisation";
  let slug = base;
  let i = 2;
  while (
    await Location.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

function revalidateLocationPaths() {
  [
    "/",
    "/proprietes",
    "/projets",
    "/admin/locations",
    "/admin/properties",
    "/admin/projects",
  ].forEach((path) => revalidatePath(path));
}

export async function listActiveLocations(): Promise<LocationType[]> {
  try {
    await connectDB();
    const docs = await Location.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean().exec();
    return docs.map(normalizeLocation);
  } catch (e) {
    console.error("listActiveLocations error", e);
    return [];
  }
}

export async function listAllLocations(): Promise<LocationType[]> {
  await requireAdmin();
  await connectDB();
  const docs = await Location.find({}).sort({ sortOrder: 1, name: 1 }).lean().exec();
  return docs.map(normalizeLocation);
}

export async function adminGetLocation(id: string): Promise<LocationType | null> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Location.findById(id).lean().exec();
  return doc ? normalizeLocation(doc) : null;
}

export async function resolveLocationBySlug(slug: string): Promise<LocationType | null> {
  try {
    await connectDB();
    const doc = await Location.findOne({ slug, active: true }).lean().exec();
    return doc ? normalizeLocation(doc) : null;
  } catch (e) {
    console.error("resolveLocationBySlug error", e);
    return null;
  }
}

export async function createLocation(
  input: LocationInput,
): Promise<{ success: boolean; id?: string; error?: string }> {
  await requireAdmin();
  await connectDB();

  const name = input.name.trim();
  if (!name) return { success: false, error: "Le nom est requis." };

  try {
    const doc = await Location.create({
      name,
      slug: await uniqueLocationSlug(name),
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
    });
    revalidateLocationPaths();
    return { success: true, id: String(doc._id) };
  } catch (e: any) {
    console.error("createLocation error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function updateLocation(
  id: string,
  input: LocationInput,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false, error: "ID invalide" };

  const name = input.name.trim();
  if (!name) return { success: false, error: "Le nom est requis." };

  try {
    const doc = await Location.findByIdAndUpdate(
      id,
      {
        name,
        slug: await uniqueLocationSlug(name, id),
        active: input.active ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
      { new: true },
    ).lean();
    if (!doc) return { success: false, error: "Localisation introuvable." };

    await Promise.all([
      Property.updateMany({ locationId: id }, { $set: { location: name } }).exec(),
      Project.updateMany({ locationId: id }, { $set: { location: name } }).exec(),
    ]);

    revalidateLocationPaths();
    return { success: true };
  } catch (e: any) {
    console.error("updateLocation error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function deleteLocation(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false, error: "ID invalide" };

  const [propertyCount, projectCount] = await Promise.all([
    Property.countDocuments({ locationId: id }),
    Project.countDocuments({ locationId: id }),
  ]);

  if (propertyCount + projectCount > 0) {
    return {
      success: false,
      error: "Cette localisation est utilisée. Désactivez-la au lieu de la supprimer.",
    };
  }

  await Location.findByIdAndDelete(id).exec();
  revalidateLocationPaths();
  return { success: true };
}
