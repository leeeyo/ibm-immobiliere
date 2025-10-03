'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'residential' | 'commercial';
  rooms?: number;
  bathrooms?: number;
  area: number;
  image: string;
  status: 'available' | 'sold' | 'reserved';
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  type,
  rooms,
  bathrooms,
  area,
  image,
  status,
}: PropertyCardProps) {
  const statusColors = {
    available: 'bg-green-500',
    sold: 'bg-red-500',
    reserved: 'bg-orange-500',
  };

  const statusLabels = {
    available: 'Disponible',
    sold: 'Vendu',
    reserved: 'Réservé',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-4 right-4 ${statusColors[status]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {statusLabels[status]}
        </div>
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
          {type === 'residential' ? 'Résidentiel' : 'Commercial'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-slate-600">
          {rooms && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {rooms} pièces
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {bathrooms} SDB
            </div>
          )}
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {area}m²
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {price.toLocaleString('fr-TN')} DT
            </p>
          </div>
          <Link
            href={`/proprietes/${id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Détails
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
