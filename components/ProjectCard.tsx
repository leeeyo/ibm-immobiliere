'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  slug: string;
  name: string;
  description: string;
  location: string;
  yearCompleted: number;
  status: 'ongoing' | 'completed';
  image: string;
  propertiesCount: number;
  type: 'residential' | 'commercial';
}

export default function ProjectCard({
  slug,
  name,
  description,
  location,
  yearCompleted,
  status,
  image,
  propertiesCount,
  type,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-80 overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className={`${status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {status === 'completed' ? 'Terminé' : 'En cours'}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {type === 'residential' ? 'Résidentiel' : 'Commercial'}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-white/90 text-sm flex items-center mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
          <p className="text-white/80 text-sm">Année: {yearCompleted}</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-slate-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-slate-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-semibold">{propertiesCount}</span>
            <span className="ml-1">propriétés</span>
          </div>

          <Link
            href={`/projets/${slug}`}
            className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Voir
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
