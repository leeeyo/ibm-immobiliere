"use server";

import { z } from "zod";
import mongoose from "mongoose";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db/mongodb";
import { Lead } from "@/lib/models/Lead";
import { resolveMetaEventSourceUrl } from "@/lib/meta-event-source";
import { META_CURRENCY } from "@/lib/meta-pixel";
import { sendMetaCapiContact, sendMetaCapiLead } from "@/lib/meta-capi";
import { sendLeadNotification } from "@/lib/email/ovh";
import { consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

const ContactSchema = z.object({
  name: z.string().min(2, "Nom trop court").max(120),
  email: z.string().email("Email invalide"),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(10, "Message trop court").max(4000),
  propertyId: z.string().optional().or(z.literal("")),
  propertyRef: z.string().optional().or(z.literal("")),
  metaEventId: z.string().max(160).optional().or(z.literal("")),
  metaEventSourceUrl: z.string().max(2048).optional().or(z.literal("")),
  metaFbp: z.string().max(256).optional().or(z.literal("")),
  metaFbc: z.string().max(512).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
  analyticsConsent: z.enum(["accepted", "refused", ""]).optional(),
});

export type ContactState = {
  success?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  trackingEvent?: {
    eventName: "Lead" | "Contact";
    eventId: string;
    contentId?: string;
    contentName: string;
    contentCategory: string;
    value: number;
    currency: string;
    leadSource: "property-lead" | "contact-form";
  };
};

function splitFullName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

function getClientIp(headerList: Headers): string | null {
  const xff = headerList.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerList.get("x-real-ip");
}

export async function submitContactForm(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    subject: String(formData.get("subject") || ""),
    message: String(formData.get("message") || ""),
    propertyId: String(formData.get("propertyId") || ""),
    propertyRef: String(formData.get("propertyRef") || ""),
    metaEventId: String(formData.get("metaEventId") || ""),
    metaEventSourceUrl: String(formData.get("metaEventSourceUrl") || ""),
    metaFbp: String(formData.get("metaFbp") || ""),
    metaFbc: String(formData.get("metaFbc") || ""),
    website: String(formData.get("website") || ""),
    analyticsConsent: String(formData.get("analyticsConsent") || ""),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, error: "Veuillez corriger les champs en surbrillance.", fieldErrors };
  }

  try {
    const data = parsed.data;
    const headerList = await headers();
    const rateLimit = await consumeRateLimit({
      scope: "contact-form",
      identifier: getRequestIp(headerList),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "Trop de demandes successives. Veuillez réessayer dans quelques minutes.",
      };
    }

    await connectDB();
    const lead = await Lead.create({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject || undefined,
      message: data.message,
      propertyId:
        data.propertyId && mongoose.Types.ObjectId.isValid(data.propertyId)
          ? new mongoose.Types.ObjectId(data.propertyId)
          : undefined,
      propertyRef: data.propertyRef || undefined,
      source: "contact-form",
      status: "new",
    });

    const isPropertyLead = Boolean(data.propertyId || data.propertyRef);
    const leadId = lead._id.toString();
    const eventId = data.metaEventId?.trim() || leadId;
    const { firstName, lastName } = splitFullName(data.name);
    const eventSourceUrl = resolveMetaEventSourceUrl(
      data.metaEventSourceUrl,
      isPropertyLead ? "/proprietes" : "/contact",
    );
    const value = isPropertyLead ? 100 : 50;
    const contentName = isPropertyLead
      ? data.propertyRef || data.subject || "Demande immobilière"
      : data.subject || "Formulaire de contact";
    const contentCategory = isPropertyLead ? "property_lead" : "contact_form";

    const metaInput = {
      eventId,
      eventTimeSec: Math.floor(Date.now() / 1000),
      eventSourceUrl,
      value,
      currency: META_CURRENCY,
      contentId: isPropertyLead ? data.propertyId || leadId : leadId,
      contentName,
      contentCategory,
      customData: {
        lead_id: leadId,
        lead_source: isPropertyLead ? "property-lead" : "contact-form",
        property_ref: data.propertyRef || undefined,
      },
      email: data.email,
      phone: data.phone,
      firstName,
      lastName,
      country: "tn",
      clientIp: getClientIp(headerList),
      userAgent: headerList.get("user-agent"),
      fbp: data.metaFbp,
      fbc: data.metaFbc,
    };

    const backgroundTasks: Promise<unknown>[] = [
      sendLeadNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        propertyRef: data.propertyRef,
        sourceUrl: eventSourceUrl,
      }),
    ];
    if (data.analyticsConsent === "accepted") {
      backgroundTasks.push(
        isPropertyLead
          ? sendMetaCapiLead(metaInput)
          : sendMetaCapiContact(metaInput, "contact-form")
      );
    }
    await Promise.allSettled(backgroundTasks);
    return {
      success: true,
      trackingEvent: {
        eventName: isPropertyLead ? "Lead" : "Contact",
        eventId,
        contentId: metaInput.contentId,
        contentName,
        contentCategory,
        value,
        currency: META_CURRENCY,
        leadSource: isPropertyLead ? "property-lead" : "contact-form",
      },
      message: "Votre message a bien été envoyé. Nous vous contacterons sous peu.",
    };
  } catch (e) {
    console.error("submitContactForm error", e);
    return {
      success: false,
      error: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
