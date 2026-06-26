"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongodb";
import { WebsiteSettings } from "@/lib/models/WebsiteSettings";
import {
  DEFAULT_WEBSITE_SETTINGS,
  getWebsiteSettings,
  type WebsiteSettingsType,
} from "@/lib/website-settings";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "");

const settingsSchema = z.object({
  siteName: z.string().trim().min(2, "Le nom du site est requis."),
  legalName: z.string().trim().min(2, "Le nom légal est requis."),
  tagline: z.string().trim().min(3, "La signature est requise."),
  description: z.string().trim().min(20, "La description doit être plus complète."),
  phone: z.string().trim().min(6, "Le téléphone est requis."),
  phoneRaw: z.string().trim().min(6, "Le téléphone cliquable est requis."),
  whatsapp: optionalUrl,
  email: z.string().trim().email("Email invalide."),
  address: z.string().trim().min(3, "L'adresse est requise."),
  hours: z.string().trim().min(3, "Les horaires sont requis."),
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,
  yearsOfExperience: z.coerce.number().int().min(0).max(100),
  residencesDelivered: z.coerce.number().int().min(0).max(1000),
});

export type SettingsFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

function normalizePhoneRaw(value: string) {
  const compact = value.replace(/[^\d+]/g, "");
  return compact.startsWith("+") ? compact : `+${compact}`;
}

function normalizeWhatsapp(value: string, phoneRaw: string) {
  if (value) return value;
  return `https://wa.me/${phoneRaw.replace(/[^\d]/g, "")}`;
}

export async function loadWebsiteSettingsForAdmin(): Promise<WebsiteSettingsType> {
  await requireAdmin();
  return getWebsiteSettings();
}

export async function updateWebsiteSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    siteName: formData.get("siteName"),
    legalName: formData.get("legalName"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    phone: formData.get("phone"),
    phoneRaw: formData.get("phoneRaw"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    address: formData.get("address"),
    hours: formData.get("hours"),
    facebook: formData.get("facebook"),
    instagram: formData.get("instagram"),
    linkedin: formData.get("linkedin"),
    yearsOfExperience: formData.get("yearsOfExperience"),
    residencesDelivered: formData.get("residencesDelivered"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Veuillez corriger les champs indiqués.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectDB();

  const phoneRaw = normalizePhoneRaw(parsed.data.phoneRaw);
  await WebsiteSettings.findOneAndUpdate(
    { singletonKey: "website" },
    {
      ...parsed.data,
      singletonKey: "website",
      phoneRaw,
      whatsapp: normalizeWhatsapp(parsed.data.whatsapp, phoneRaw),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).exec();

  [
    "/",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite",
    "/proprietes",
    "/projets",
    "/admin/settings",
  ].forEach((path) => revalidatePath(path));
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Paramètres du site mis à jour.",
  };
}

export async function resetWebsiteSettings(): Promise<SettingsFormState> {
  await requireAdmin();
  await connectDB();
  await WebsiteSettings.findOneAndUpdate(
    { singletonKey: "website" },
    { ...DEFAULT_WEBSITE_SETTINGS, singletonKey: "website" },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).exec();
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true, message: "Paramètres restaurés." };
}
