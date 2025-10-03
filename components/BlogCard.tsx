'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  category: string;
  createdAt: Date;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  author,
  featuredImage,
  category,
  createdAt,
}: BlogCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
    >
      <Link href={`/blog/${slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-sm text-slate-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={createdAt.toString()}>{formattedDate}</time>
            <span className="mx-2">•</span>
            <span>{author}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          <p className="text-slate-600 mb-4 line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
            Lire l&apos;article
            <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
