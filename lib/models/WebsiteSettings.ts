import { Schema, model, models, type InferSchemaType } from "mongoose";

const WebsiteSettingsSchema = new Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "website",
      immutable: true,
    },
    siteName: { type: String, trim: true },
    legalName: { type: String, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String, trim: true },
    phone: { type: String, trim: true },
    phoneRaw: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    hours: { type: String, trim: true },
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0 },
    residencesDelivered: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export type WebsiteSettingsDoc = InferSchemaType<typeof WebsiteSettingsSchema>;

export const WebsiteSettings =
  models.WebsiteSettings || model("WebsiteSettings", WebsiteSettingsSchema);
