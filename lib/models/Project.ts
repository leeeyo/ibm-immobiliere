import { Schema, model, models } from 'mongoose';

export interface IProjectUnit {
  numero: string;
  etage?: string;
  type?: string;
  pieces?: number;
  surface?: number;
  planUrl?: string;
  status?: 'available' | 'sold' | 'reserved';
}

export interface IProject {
  name: string;
  slug: string;
  description: string;
  location: string;
  yearCompleted: number;
  status: 'planned' | 'ongoing' | 'completed';
  images: string[];
  propertiesCount: number;
  type: 'residential' | 'commercial';
  featured: boolean;
  features?: string[];
  specifications?: Record<string, string>;
  videoUrl?: string;
  units?: IProjectUnit[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectUnitSchema = new Schema<IProjectUnit>(
  {
    numero: { type: String, required: true, trim: true },
    etage: { type: String, trim: true },
    type: { type: String, trim: true },
    pieces: { type: Number },
    surface: { type: Number },
    planUrl: { type: String, trim: true },
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    yearCompleted: { type: Number, required: true },
    status: { type: String, enum: ['planned', 'ongoing', 'completed'], required: true },
    images: [{ type: String, default: [] }],
    propertiesCount: { type: Number, default: 0 },
    type: { type: String, enum: ['residential', 'commercial'], required: true },
    featured: { type: Boolean, default: false },
    features: [{ type: String }],
    specifications: { type: Schema.Types.Mixed },
    videoUrl: { type: String },
    units: { type: [ProjectUnitSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ status: 1, featured: 1 });

export const Project = models.Project || model<IProject>('Project', ProjectSchema);
