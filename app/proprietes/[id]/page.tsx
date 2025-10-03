import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import Image from 'next/image';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = {
    id: params.id,
    title: 'Appartement moderne S+3',
    price: 350000,
    location: 'L\'Aouina, Tunis',
    type: 'residential' as const,
    rooms: 4,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    ],
    status: 'available' as const,
    description: 'Magnifique appartement moderne de standing situé dans un quartier résidentiel calme et sécurisé. Finitions de haute qualité, cuisine équipée, climatisation, et parkings sécurisés. Proche de toutes commodités : écoles, commerces, transports en commun.',
    features: [
      'Cuisine équipée',
      'Climatisation',
      'Parking',
      'Ascenseur',
      'Balcon',
      'Vue dégagée',
      'Quartier calme',
      'Proche commodités',
    ],
  };

  const similarProperties = [
    {
      id: '2',
      title: 'Villa de luxe avec piscine',
      price: 850000,
      location: 'Borj Cedria',
      type: 'residential' as const,
      rooms: 6,
      bathrooms: 3,
      area: 280,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      status: 'available' as const,
    },
    {
      id: '4',
      title: 'Appartement S+2 vue mer',
      price: 420000,
      location: 'La Marsa',
      type: 'residential' as const,
      rooms: 3,
      bathrooms: 2,
      area: 110,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'available' as const,
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="relative h-96 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Disponible
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {property.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${property.title} - Image ${idx + 2}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Résidentiel
                  </span>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-slate-600 flex items-center text-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {property.price.toLocaleString('fr-TN')} DT
                  </p>
                  <p className="text-slate-600">Prix de vente</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <p className="font-semibold text-slate-900">{property.rooms}</p>
                    <p className="text-sm text-slate-600">Pièces</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="font-semibold text-slate-900">{property.bathrooms}</p>
                    <p className="text-sm text-slate-600">Salles de bain</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <p className="font-semibold text-slate-900">{property.area}m²</p>
                    <p className="text-sm text-slate-600">Surface</p>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4">
                  Contacter l&apos;agent
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
                  Planifier une visite
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
                <p className="text-slate-700 leading-relaxed mb-8">
                  {property.description}
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-slate-700">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-slate-50 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Besoin d&apos;aide ?</h3>
                  <p className="text-slate-600 mb-6">
                    Contactez-nous pour plus d&apos;informations sur cette propriété
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+216XXXXXXXX" className="flex items-center text-slate-700 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +216 XX XXX XXX
                    </a>
                    <a href="mailto:contact@ibm-immobiliere.tn" className="flex items-center text-slate-700 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      contact@ibm-immobiliere.tn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Propriétés similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} {...prop} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
