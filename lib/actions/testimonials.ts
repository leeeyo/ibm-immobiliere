"use server";

import { connectDB } from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/models/Testimonial';
import { serializeDoc } from '@/lib/utils/serialize';

export async function getTestimonials(featuredOnly = false) {
  try {
    await connectDB();
    const query: any = {};
    if (featuredOnly) query.featured = true;
    const docs = await Testimonial.find(query).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error('getTestimonials error', e);
    return [];
  }
}

export async function getFeaturedTestimonials(limit = 5) {
  try {
    await connectDB();
    const docs = await Testimonial.find({ featured: true }).sort({ createdAt: -1 }).limit(limit).lean().exec();
    return docs.map((d: any) => serializeDoc(d));
  } catch (e) {
    console.error('getFeaturedTestimonials error', e);
    return [];
  }
}
