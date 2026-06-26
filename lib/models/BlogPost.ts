import { Schema, model, models } from 'mongoose';

export interface IBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  /** Alt decrivant l'image (SEO et accessibilite) */
  featuredImageAlt?: string;
  category: string;
  /** Audience cible affichee et mentionnee dans les metadonnees */
  audienceLabel?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
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
    featuredImageAlt: { type: String },
    category: { type: String, required: true },
    audienceLabel: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BlogPostSchema.index({ published: 1, createdAt: -1 });

export const BlogPost = models.BlogPost || model<IBlogPost>('BlogPost', BlogPostSchema);
