import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';

export const metadata = {
  title: 'Propriétés - IBM Immobilière',
  description: 'Découvrez nos propriétés résidentielles et commerciales disponibles',
};

export default async function PropertiesPage() {
  const properties = [
    {
      id: '1',
      title: 'Appartement moderne S+3',
      price: 350000,
      location: 'L\'Aouina, Tunis',
      type: 'residential' as const,
      rooms: 4,
      bathrooms: 2,
      area: 120,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      status: 'available' as const,
    },
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
      id: '3',
      title: 'Local commercial spacieux',
      price: 450000,
      location: 'Centre Ville',
      type: 'commercial' as const,
      area: 150,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      status: 'reserved' as const,
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
    {
      id: '5',
      title: 'Bureau moderne équipé',
      price: 380000,
      location: 'Les Berges du Lac',
      type: 'commercial' as const,
      area: 135,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      status: 'available' as const,
    },
    {
      id: '6',
      title: 'Villa standing avec jardin',
      price: 920000,
      location: 'Sidi Bou Said',
      type: 'residential' as const,
      rooms: 7,
      bathrooms: 4,
      area: 350,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      status: 'sold' as const,
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-16 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Nos Propriétés
            </h1>
            <p className="text-xl text-center text-white/90 mb-8">
              Trouvez la propriété idéale parmi notre sélection
            </p>
            <div className="max-w-5xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{properties.length}</span> propriétés trouvées
              </p>
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Plus récentes</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Surface croissante</option>
                <option>Surface décroissante</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
