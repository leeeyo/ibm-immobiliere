import mongoose, { Schema, model, models } from 'mongoose';

export interface IProperty {
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'residential' | 'commercial';
  rooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
  projectId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['residential', 'commercial'], required: true },
    rooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
    featured: { type: Boolean, default: false },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  },
  {
    timestamps: true,
  }
);

PropertySchema.index({ type: 1, status: 1 });
PropertySchema.index({ featured: 1 });

export const Property = models.Property || model<IProperty>('Property', PropertySchema);
