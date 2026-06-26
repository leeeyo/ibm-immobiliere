import mongoose, { Schema, model, models } from "mongoose";

export interface IProperty {
  title: string;
  slug: string;
  reference?: string;
  description: string;
  price: number;
  location: string;
  type: "residential" | "commercial";
  rooms?: number;
  bathrooms?: number;
  area: number;
  floor?: string;
  planUrl?: string;
  orientation?: "Nord" | "Sud" | "Est" | "Ouest" | "Nord-Est" | "Nord-Ouest" | "Sud-Est" | "Sud-Ouest";
  images: string[];
  videos: string[];
  status: "available" | "sold" | "reserved";
  featured: boolean;
  projectId?: mongoose.Types.ObjectId;
  features?: string[];
  brochureUrl?: string;
  virtualTourUrl?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    reference: { type: String, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["residential", "commercial"], required: true },
    rooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number, required: true },
    floor: { type: String },
    planUrl: { type: String },
    orientation: { type: String },
    images: [{ type: String, default: [] }],
    videos: [{ type: String, default: [] }],
    features: [{ type: String }],
    brochureUrl: { type: String },
    virtualTourUrl: { type: String },
    videoUrl: { type: String },
    status: { type: String, enum: ["available", "sold", "reserved"], default: "available" },
    featured: { type: Boolean, default: false },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
  },
  { timestamps: true }
);

PropertySchema.index({ type: 1, status: 1 });
PropertySchema.index({ featured: 1 });
PropertySchema.index({ projectId: 1 });

export const Property = models.Property || model<IProperty>("Property", PropertySchema);
