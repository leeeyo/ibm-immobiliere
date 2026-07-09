import { Schema, model, models, type InferSchemaType } from "mongoose";

const LocationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

LocationSchema.index({ active: 1, sortOrder: 1, name: 1 });

export type LocationDoc = InferSchemaType<typeof LocationSchema>;

export const Location = models.Location || model("Location", LocationSchema);
