import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';

export const metadata = {
  title: 'Nos Projets - IBM Immobilière',
  description: 'Découvrez nos projets immobiliers réalisés et en cours',
};

export default async function ProjectsPage() {
  const projects = [
    {
      slug: 'residence-ennakhil',
      name: 'Résidence Ennakhil',
      description: 'Réalisée en 2013, la Résidence Ennakhil offre un cadre de vie exceptionnel avec une architecture moderne et des finitions de qualité supérieure.',
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
      description: 'Un projet immobilier moderne qui allie confort, praticité et élégance dans un quartier prisé de Boumhel.',
      location: 'Boumhel',
      yearCompleted: 2024,
      status: 'ongoing' as const,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      propertiesCount: 8,
      type: 'residential' as const,
    },
    {
      slug: 'residence-la-tulipe',
      name: 'Résidence La Tulipe',
      description: 'Réalisée en 2021, la Résidence La Tulipe (R+2) se situe dans un quartier résidentiel calme avec tous les services à proximité.',
      location: 'Borj Cedria',
      yearCompleted: 2021,
      status: 'completed' as const,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      propertiesCount: 10,
      type: 'residential' as const,
    },
    {
      slug: 'residence-el-ons',
      name: 'Résidence El ONS',
      description: 'Réalisée en 2015 par IBM, la Résidence El ONS se distingue par son architecture élégante et ses espaces généreux.',
      location: 'Tunis',
      yearCompleted: 2015,
      status: 'completed' as const,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      propertiesCount: 15,
      type: 'residential' as const,
    },
    {
      slug: 'residence-el-khalil',
      name: 'Résidence El Khalil',
      description: 'En 2011, IBM a concrétisé ce projet immobilier remarquable situé au cœur d\'un quartier dynamique.',
      location: 'Tunis Centre',
      yearCompleted: 2011,
      status: 'completed' as const,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      propertiesCount: 14,
      type: 'residential' as const,
    },
  ];

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nos Projets
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez nos réalisations immobilières qui allient architecture moderne et qualité de vie exceptionnelle
            </p>
          </div>
        </section>

        {ongoingProjects.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Projets en cours</h2>
                  <p className="text-slate-600">Nos développements actuels</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  {ongoingProjects.length} projet{ongoingProjects.length > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ongoingProjects.map((project) => (
                  <ProjectCard key={project.slug} {...project} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Projets réalisés</h2>
                <p className="text-slate-600">Notre expertise démontrée</p>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                {completedProjects.length} projets
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedProjects.map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
