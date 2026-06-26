"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";
import { Lead } from "@/lib/models/Lead";
import { serializeDoc } from "@/lib/utils/serialize";
import { requireAdmin } from "@/lib/auth/session";
import type { LeadType } from "@/lib/types";

export async function listLeads(
  status?: "all" | "new" | "contacted" | "closed"
): Promise<LeadType[]> {
  await requireAdmin();
  await connectDB();
  const query = status && status !== "all" ? { status } : {};
  const docs = await Lead.find(query).sort({ createdAt: -1 }).lean().exec();
  return docs.map((d: any) => serializeDoc(d)) as LeadType[];
}

export async function getLeadCounts(): Promise<{ new: number; contacted: number; closed: number; total: number }> {
  await requireAdmin();
  await connectDB();
  const [n, c, x, t] = await Promise.all([
    Lead.countDocuments({ status: "new" }),
    Lead.countDocuments({ status: "contacted" }),
    Lead.countDocuments({ status: "closed" }),
    Lead.countDocuments({}),
  ]);
  return { new: n, contacted: c, closed: x, total: t };
}

export async function updateLeadStatus(
  id: string,
  status: "new" | "contacted" | "closed"
): Promise<{ success: boolean }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false };
  await Lead.findByIdAndUpdate(id, { status }).exec();
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteLead(id: string): Promise<{ success: boolean }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false };
  await Lead.findByIdAndDelete(id).exec();
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateLeadNotes(
  id: string,
  notes: string
): Promise<{ success: boolean }> {
  await requireAdmin();
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return { success: false };
  await Lead.findByIdAndUpdate(id, { notes }).exec();
  revalidatePath("/admin/leads");
  return { success: true };
}
