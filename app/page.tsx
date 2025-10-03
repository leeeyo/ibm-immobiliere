import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import StatsCounter from '@/components/StatsCounter';
import TestimonialCarousel from '@/components/TestimonialCarousel';

export default function HomePage() {
  const sampleProperties = [
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
  ];

  const sampleProjects = [
    {
      slug: 'residence-ennakhil',
      name: 'Résidence Ennakhil',
      description: 'Réalisée en 2013, la Résidence Ennakhil offre un cadre de vie exceptionnel avec une architecture moderne.',
      location: 'Jardins de L\'Aouina',
      yearCompleted: 2013,
      status: 'completed' as const,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      propertiesCount: 12,
      type: 'residential' as const,
    },
    {
      slug: 'residence-amira',
      name: 'Résidence Amira',
      description: 'Un projet immobilier moderne qui allie confort, praticité et élégance dans un quartier prisé.',
      location: 'Boumhel',
      yearCompleted: 2024,
      status: 'ongoing' as const,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      propertiesCount: 8,
      type: 'residential' as const,
    },
  ];

  const sampleBlogs = [
    {
      slug: 'amenager-bureau-medical',
      title: 'Aménagez votre bureau médical en toute simplicité',
      excerpt: 'Découvrez nos conseils pour créer un espace médical à la fois pratique et accueillant pour vos patients.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      category: 'Conseils',
      createdAt: new Date('2025-02-18'),
    },
    {
      slug: '15-annees-parcours',
      title: '15 années d\'un parcours exceptionnel',
      excerpt: 'Retour sur 15 ans d\'excellence dans l\'immobilier tunisien et les projets qui ont marqué notre histoire.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      category: 'Actualités',
      createdAt: new Date('2025-01-09'),
    },
  ];

  const sampleTestimonials = [
    {
      id: '1',
      clientName: 'Ahmed Ben Ali',
      content: 'Une expérience exceptionnelle du début à la fin. L\'équipe IBM Immobilière a été à l\'écoute de nos besoins et nous a trouvé la maison de nos rêves.',
      rating: 5,
      projectReference: 'Résidence Ennakhil',
    },
    {
      id: '2',
      clientName: 'Salma Jaziri',
      content: 'Professionnalisme et qualité au rendez-vous. Je recommande vivement IBM Immobilière pour tout projet immobilier.',
      rating: 5,
      projectReference: 'Résidence Amira',
    },
    {
      id: '3',
      clientName: 'Mohamed Trabelsi',
      content: 'Un accompagnement personnalisé et des conseils précieux. Merci à toute l\'équipe pour leur dévouement.',
      rating: 5,
      projectReference: 'Résidence El ONS',
    },
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Découvrez le mélange<br />harmonieux du luxe
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90">
              L&apos;immobilier en toute confiance
            </p>
            
            <div className="flex justify-center gap-4 mb-16">
              <a
                href="#properties"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Résidentiel
              </a>
              <a
                href="#properties"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Commercial
              </a>
            </div>

            <div className="max-w-5xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Immobilière Ben Mokhtar
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Chez IBM, nous plaçons la satisfaction de nos futurs propriétaires au centre de nos préoccupations. 
                C&apos;est pourquoi toutes nos réalisations associent des emplacements étudiés à une architecture moderne 
                pour faire de votre logement un espace où il fait bon vivre.
              </p>
            </div>
          </div>
        </section>

        <section id="properties" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold mb-2">Annonces en vedette</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Trouvez la maison de vos rêves aujourd&apos;hui
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>

        <StatsCounter />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold mb-2">Projets</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Nos derniers projets
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {sampleProjects.map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
            </div>
          </div>
        </section>

        <TestimonialCarousel testimonials={sampleTestimonials} />

        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold mb-2">Actualités et blogs</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Lisez nos idées
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Les architectes et les ingénieurs collaborent pour créer une conception détaillée
                des plans qui traduisent les concepts en structures réalisables.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sampleBlogs.map((blog) => (
                <BlogCard key={blog.slug} {...blog} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
