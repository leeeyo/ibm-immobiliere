import mongoose, { Schema, model, models } from "mongoose";

export type LeadStatus = "new" | "contacted" | "closed";

export interface ILead {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  propertyRef?: string;
  source?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property" },
    propertyRef: { type: String },
    source: { type: String, default: "contact-form" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });

export const Lead = models.Lead || model<ILead>("Lead", LeadSchema);
