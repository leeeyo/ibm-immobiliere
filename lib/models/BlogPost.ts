import mongoose, { Schema, model, models } from 'mongoose';

export interface IBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  category: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, required: true },
    featuredImage: { type: String, required: true },
    category: { type: String, required: true },
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ published: 1, createdAt: -1 });

export const BlogPost = models.BlogPost || model<IBlogPost>('BlogPost', BlogPostSchema);
