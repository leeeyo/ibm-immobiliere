"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Project } from "@/lib/models/Project";
import { Property } from "@/lib/models/Property";
import { serializeDoc } from "@/lib/utils/serialize";
import { uniqueSlug } from "@/lib/utils/slug";
import { requireAdmin } from "@/lib/auth/session";
import type { ProjectType, ProjectUnitType } from "@/lib/types";

/* ─── PUBLIC READS ───────────────────────────────────────────────────── */

export async function getProjects(
  status: "ongoing" | "completed" | "planned" | "all" = "all"
): Promise<ProjectType[]> {
  try {
    await connectDB();
    const query: any = {};
    if (status !== "all") query.status = status;
    const sort: Record<string, 1 | -1> =
      status === "completed" ? { yearCompleted: -1 } : { createdAt: -1 };
    const docs = await Project.find(query).sort(sort as any).lean().exec();
    return docs.map((d: any) => serializeDoc(d)) as any;
  } catch (e) {
    console.error("getProjects error", e);
    return [];
  }
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectType[]> {
  try {
    await connectDB();
    const docs = await Project.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return docs.map((d: any) => serializeDoc(d)) as any;
  } catch (e) {
    console.error("getFeaturedProjects error", e);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectType | null> {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug }).lean().exec();
    if (!doc) return null;
    return serializeDoc(doc) as any;
  } catch (e) {
    console.error("getProjectBySlug error", e);
    return null;
  }
}

export async function getProjectSitemapEntries(): Promise<
  { slug: string; updatedAt?: string | Date }[]
> {
  try {
    await connectDB();
    const docs = await Project.find({}, { slug: 1, updatedAt: 1 }).lean().exec();
    return docs
      .filter((doc: any) => Boolean(doc.slug))
      .map((doc: any) => ({ slug: doc.slug, updatedAt: doc.updatedAt }));
  } catch (e) {
    console.error("getProjectSitemapEntries error", e);
    return [];
  }
}

export async function getProjectProperties(projectId: string) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(projectId)) return [];
    const docs = await Property.find({ projectId }).lean().exec();
    return docs.map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error("getProjectProperties error", e);
    return [];
  }
}

/* ─── ADMIN MUTATIONS ────────────────────────────────────────────────── */

export type ProjectInput = {
  name: string;
  description: string;
  location: string;
  yearCompleted: number;
  status: "planned" | "ongoing" | "completed";
  type: "residential" | "commercial";
  images: string[];
  features?: string[];
  videoUrl?: string;
  featured?: boolean;
  units?: ProjectUnitType[];
};

export async function listAllProjects(): Promise<ProjectType[]> {
  await requireAdmin();
  await connectDB();
  const docs = await Project.find({}).sort({ createdAt: -1 }).lean().exec();
  return docs.map((d: any) => serializeDoc(d)) as any;
}

export async function listAllProjectsLite(): Promise<{ id: string; name: string; slug: string }[]> {
  await requireAdmin();
  await connectDB();
  const docs = await Project.find({}, { name: 1, slug: 1 }).sort({ createdAt: -1 }).lean().exec();
  return docs.map((d: any) => ({
    id: String(d._id),
    name: d.name,
    slug: d.slug,
  }));
}

export async function adminGetProject(id: string): Promise<ProjectType | null> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await Project.findById(id).lean().exec();
  return doc ? (serializeDoc(doc) as any) : null;
}

export async function createProject(
  input: ProjectInput
): Promise<{ success: boolean; id?: string; slug?: string; error?: string }> {
  await requireAdmin();
  await connectDB();
  try {
    const slug = await uniqueSlug(input.name, async (s) => Boolean(await Project.exists({ slug: s })));
    const doc = await Project.create({ ...input, slug });
    revalidatePath("/admin/projects");
    revalidatePath("/projets");
    return { success: true, id: String(doc._id), slug };
  } catch (e: any) {
    console.error("createProject error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput> & { regenerateSlug?: boolean }
): Promise<{ success: boolean; slug?: string; error?: string }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false, error: "ID invalide" };
  try {
    const update: any = { ...input };
    delete update.regenerateSlug;
    if (input.regenerateSlug && input.name) {
      update.slug = await uniqueSlug(input.name, async (s) =>
        Boolean(await Project.exists({ slug: s, _id: { $ne: id } }))
      );
    }
    const doc = await Project.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    revalidatePath("/admin/projects");
    revalidatePath("/projets");
    if ((doc as any)?.slug) revalidatePath(`/projets/${(doc as any).slug}`);
    return { success: true, slug: (doc as any)?.slug };
  } catch (e: any) {
    console.error("updateProject error", e);
    return { success: false, error: e?.message || "Erreur interne" };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false };
  await Project.findByIdAndDelete(id).exec();
  await Property.updateMany({ projectId: id }, { $set: { projectId: null } }).exec();
  revalidatePath("/admin/projects");
  revalidatePath("/projets");
  return { success: true };
}
