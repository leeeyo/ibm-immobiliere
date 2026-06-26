export type PropertyType = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'residential' | 'commercial';
  rooms?: number;
  bathrooms?: number;
  area: number;
  floor?: string;
  planUrl?: string;
  images: string[];
  videos?: string[];
  status: 'available' | 'sold' | 'reserved';
  featured?: boolean;
  projectId?: string;
  slug: string;
  reference?: string;
  orientation?: string;
  features?: string[];
  brochureUrl?: string;
  virtualTourUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectUnitType = {
  numero: string;
  etage?: string;
  type?: string;
  pieces?: number;
  surface?: number;
  planUrl?: string;
  status?: 'available' | 'sold' | 'reserved';
};

export type ProjectType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  yearCompleted: number;
  status: 'planned' | 'ongoing' | 'completed';
  images: string[];
  propertiesCount?: number;
  type: 'residential' | 'commercial';
  featured?: boolean;
  features?: string[];
  specifications?: Record<string, string>;
  videoUrl?: string;
  units?: ProjectUnitType[];
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostType = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: string;
  audienceLabel?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TestimonialType = {
  id: string;
  clientName: string;
  content: string;
  rating: number;
  projectReference?: string;
  featured?: boolean;
  createdAt?: string;
};

export type SearchFilters = {
  type?: 'all' | 'residential' | 'commercial';
  query?: string;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyId?: string;
  propertyRef?: string;
};

export type LeadType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyId?: string;
  propertyRef?: string;
  source?: string;
  status: "new" | "contacted" | "closed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};
