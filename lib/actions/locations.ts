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

export type FooterLocationLink = {
  name: string;
  href: string;
  activityCount: number;
  activityLabel: string;
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
    "/louer",
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

/**
 * Keeps the footer intentionally short while favouring locations that have
 * live properties or projects. Legacy records without a locationId are also
 * counted through their location name.
 */
export async function listFooterLocations(limit = 4): Promise<FooterLocationLink[]> {
  try {
    await connectDB();

    const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 6);
    const locations = await Location.find({ active: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean()
      .exec();

    if (locations.length === 0) return [];

    const locationIds = locations.map((location: any) => location._id);
    const locationNames = locations.map((location: any) => location.name);
    const locationQuery = {
      $or: [
        { locationId: { $in: locationIds } },
        { location: { $in: locationNames } },
      ],
    };

    const [properties, projects] = await Promise.all([
      Property.find(
        {
          ...locationQuery,
          status: "available",
          $and: [
            {
              $or: [
                { intent: "sale" },
                { intent: { $exists: false } },
                { intent: null },
              ],
            },
          ],
        },
        { locationId: 1, location: 1 },
      )
        .lean()
        .exec(),
      Project.find(locationQuery, {
        locationId: 1,
        location: 1,
        slug: 1,
        status: 1,
        featured: 1,
      })
        .lean()
        .exec(),
    ]);

    const byId = new Map(locations.map((location: any) => [String(location._id), location.slug]));
    const byName = new Map(locations.map((location: any) => [location.name, location.slug]));
    const activity = new Map<
      string,
      {
        propertyCount: number;
        projectCount: number;
        ongoingProjectCount: number;
        projects: Array<{ slug: string; featured: boolean; status: string }>;
      }
    >();

    const resolveSlug = (document: any) =>
      (document.locationId && byId.get(String(document.locationId))) ||
      byName.get(document.location);

    for (const property of properties as any[]) {
      const slug = resolveSlug(property);
      if (!slug) continue;
      const entry = activity.get(slug) || {
        propertyCount: 0,
        projectCount: 0,
        ongoingProjectCount: 0,
        projects: [],
      };
      entry.propertyCount += 1;
      activity.set(slug, entry);
    }

    for (const project of projects as any[]) {
      const slug = resolveSlug(project);
      if (!slug) continue;
      const entry = activity.get(slug) || {
        propertyCount: 0,
        projectCount: 0,
        ongoingProjectCount: 0,
        projects: [],
      };
      entry.projectCount += 1;
      if (project.status === "ongoing") entry.ongoingProjectCount += 1;
      if (project.slug) {
        entry.projects.push({
          slug: project.slug,
          featured: Boolean(project.featured),
          status: project.status,
        });
      }
      activity.set(slug, entry);
    }

    return locations
      .map((location: any, index: number) => {
        const entry = activity.get(location.slug) || {
          propertyCount: 0,
          projectCount: 0,
          ongoingProjectCount: 0,
          projects: [],
        };
        const activityCount = entry.propertyCount + entry.projectCount;
        const preferredProject = entry.projects.sort((a: any, b: any) => {
          const aScore = Number(a.featured) * 2 + Number(a.status === "ongoing");
          const bScore = Number(b.featured) * 2 + Number(b.status === "ongoing");
          return bScore - aScore;
        })[0];
        const href = entry.propertyCount > 0
          ? `/proprietes?location=${location.slug}`
          : preferredProject
            ? `/projets/${preferredProject.slug}`
            : `/proprietes?location=${location.slug}`;
        const activityLabel = entry.propertyCount > 0
          ? `${entry.propertyCount} bien${entry.propertyCount > 1 ? "s" : ""}`
          : entry.projectCount > 0
            ? `${entry.projectCount} résidence${entry.projectCount > 1 ? "s" : ""}`
            : "Découvrir";

        return {
          name: location.name,
          href,
          activityCount,
          activityLabel,
          score:
            entry.propertyCount * 4 +
            entry.ongoingProjectCount * 3 +
            entry.projectCount,
          index,
        };
      })
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, safeLimit)
      .map(({ name, href, activityCount, activityLabel }) => ({
        name,
        href,
        activityCount,
        activityLabel,
      }));
  } catch (e) {
    console.error("listFooterLocations error", e);
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
