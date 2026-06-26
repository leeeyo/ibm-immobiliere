import { unstable_noStore as noStore } from "next/cache";

import { connectDB } from "@/lib/db/mongodb";
import { WebsiteSettings } from "@/lib/models/WebsiteSettings";
import { CONTACT, SITE, SOCIAL } from "@/lib/constants/site";

export type WebsiteSettingsType = {
  siteName: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  yearsOfExperience: number;
  residencesDelivered: number;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

type WebsiteSettingsRecord = Partial<
  Omit<WebsiteSettingsType, "shortName" | "url">
> & {
  singletonKey?: string;
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettingsType = {
  siteName: SITE.name,
  shortName: SITE.shortName,
  legalName: SITE.legalName,
  tagline: SITE.tagline,
  description: SITE.description,
  url: SITE.url,
  yearsOfExperience: SITE.yearsOfExperience,
  residencesDelivered: SITE.residencesDelivered,
  phone: CONTACT.phone,
  phoneRaw: CONTACT.phoneRaw,
  whatsapp: CONTACT.whatsapp,
  email: CONTACT.email,
  address: CONTACT.address,
  hours: CONTACT.hours,
  facebook: SOCIAL.facebook,
  instagram: SOCIAL.instagram,
  linkedin: SOCIAL.linkedin,
};

function cleanString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizePhoneRaw(phoneRaw: string, phone: string) {
  const source = phoneRaw.trim() || phone;
  const compact = source.replace(/[^\d+]/g, "");
  return compact.startsWith("+") ? compact : compact ? `+${compact}` : DEFAULT_WEBSITE_SETTINGS.phoneRaw;
}

function normalizeWhatsapp(whatsapp: string, phoneRaw: string) {
  const value = whatsapp.trim();
  if (value) return value;
  return `https://wa.me/${phoneRaw.replace(/[^\d]/g, "")}`;
}

export async function getWebsiteSettings(): Promise<WebsiteSettingsType> {
  noStore();

  try {
    await connectDB();
    const doc = (await WebsiteSettings.findOne({
      singletonKey: "website",
    }).lean()) as WebsiteSettingsRecord | null;
    if (!doc) return DEFAULT_WEBSITE_SETTINGS;

    const phone = cleanString(doc.phone, DEFAULT_WEBSITE_SETTINGS.phone);
    const phoneRaw = normalizePhoneRaw(
      cleanString(doc.phoneRaw, DEFAULT_WEBSITE_SETTINGS.phoneRaw),
      phone,
    );

    return {
      ...DEFAULT_WEBSITE_SETTINGS,
      siteName: cleanString(doc.siteName, DEFAULT_WEBSITE_SETTINGS.siteName),
      legalName: cleanString(doc.legalName, DEFAULT_WEBSITE_SETTINGS.legalName),
      tagline: cleanString(doc.tagline, DEFAULT_WEBSITE_SETTINGS.tagline),
      description: cleanString(doc.description, DEFAULT_WEBSITE_SETTINGS.description),
      yearsOfExperience: cleanNumber(
        doc.yearsOfExperience,
        DEFAULT_WEBSITE_SETTINGS.yearsOfExperience,
      ),
      residencesDelivered: cleanNumber(
        doc.residencesDelivered,
        DEFAULT_WEBSITE_SETTINGS.residencesDelivered,
      ),
      phone,
      phoneRaw,
      whatsapp: normalizeWhatsapp(
        cleanString(doc.whatsapp, DEFAULT_WEBSITE_SETTINGS.whatsapp),
        phoneRaw,
      ),
      email: cleanString(doc.email, DEFAULT_WEBSITE_SETTINGS.email),
      address: cleanString(doc.address, DEFAULT_WEBSITE_SETTINGS.address),
      hours: cleanString(doc.hours, DEFAULT_WEBSITE_SETTINGS.hours),
      facebook: cleanString(doc.facebook, DEFAULT_WEBSITE_SETTINGS.facebook),
      instagram: cleanString(doc.instagram, DEFAULT_WEBSITE_SETTINGS.instagram),
      linkedin: cleanString(doc.linkedin, DEFAULT_WEBSITE_SETTINGS.linkedin),
    };
  } catch (error) {
    console.error("Failed to load website settings", error);
    return DEFAULT_WEBSITE_SETTINGS;
  }
}
