import mongoose, { Schema, model, models } from 'mongoose';

export interface IProject {
  name: string;
  slug: string;
  description: string;
  location: string;
  yearCompleted: number;
  status: 'ongoing' | 'completed';
  images: string[];
  propertiesCount: number;
  type: 'residential' | 'commercial';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    yearCompleted: { type: Number, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], required: true },
    images: [{ type: String }],
    propertiesCount: { type: Number, default: 0 },
    type: { type: String, enum: ['residential', 'commercial'], required: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ status: 1, featured: 1 });

export const Project = models.Project || model<IProject>('Project', ProjectSchema);
