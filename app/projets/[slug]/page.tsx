import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import Image from 'next/image';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = {
    slug: params.slug,
    name: 'Résidence Ennakhil',
    description: 'Réalisée en 2013, la Résidence Ennakhil, située dans le quartier des Jardins de L\'Aouina, offre un cadre de vie exceptionnel. Cette résidence moderne combine architecture contemporaine et confort optimal pour ses résidents. Chaque appartement bénéficie de finitions haut de gamme, d\'espaces lumineux et d\'une vue dégagée.',
    location: 'Jardins de L\'Aouina, Tunis',
    yearCompleted: 2013,
    status: 'completed' as const,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    ],
    propertiesCount: 12,
    type: 'residential' as const,
    features: [
      'Architecture moderne',
      'Finitions haut de gamme',
      'Espaces verts aménagés',
      'Parking sécurisé',
      'Ascenseurs',
      'Gardiennage 24/7',
      'Proximité commodités',
      'Quartier calme',
    ],
    specifications: {
      'Type de projet': 'Résidentiel',
      'Nombre d\'appartements': '12',
      'Année de réalisation': '2013',
      'Statut': 'Terminé',
      'Étages': 'R+4',
      'Superficie du terrain': '1 200 m²',
    },
  };

  const availableProperties = [
    {
      id: '1',
      title: 'Appartement S+3 - Résidence Ennakhil',
      price: 380000,
      location: 'Jardins de L\'Aouina',
      type: 'residential' as const,
      rooms: 4,
      bathrooms: 2,
      area: 125,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      status: 'available' as const,
    },
    {
      id: '2',
      title: 'Appartement S+2 - Résidence Ennakhil',
      price: 320000,
      location: 'Jardins de L\'Aouina',
      type: 'residential' as const,
      rooms: 3,
      bathrooms: 2,
      area: 95,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      status: 'available' as const,
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="relative h-96 bg-slate-900">
          <Image
            src={project.images[0]}
            alt={project.name}
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <div className={`inline-block ${project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} px-4 py-2 rounded-full text-sm font-medium mb-4`}>
                {project.status === 'completed' ? 'Projet Terminé' : 'En cours'}
              </div>
              <h1 className="text-5xl font-bold mb-4">{project.name}</h1>
              <p className="text-xl flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">À propos du projet</h2>
                <p className="text-slate-700 leading-relaxed mb-8 text-lg">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {project.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${project.name} - Image ${idx + 2}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-6">Caractéristiques</h2>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-slate-700">
                      <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-slate-50 rounded-xl p-6 sticky top-24">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Spécifications</h3>
                  <div className="space-y-4">
                    {Object.entries(project.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-slate-200 pb-3">
                        <p className="text-sm text-slate-600 mb-1">{key}</p>
                        <p className="font-semibold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6">
                    Contactez-nous
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {availableProperties.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Propriétés disponibles</h2>
              <p className="text-slate-600 mb-8">Découvrez les biens disponibles dans ce projet</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {availableProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
