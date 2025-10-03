import mongoose, { Schema, model, models } from 'mongoose';

export interface ITestimonial {
  clientName: string;
  content: string;
  rating: number;
  projectReference?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    projectReference: { type: String },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({ featured: 1, createdAt: -1 });

export const Testimonial = models.Testimonial || model<ITestimonial>('Testimonial', TestimonialSchema);
