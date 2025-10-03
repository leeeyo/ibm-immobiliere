import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';

export const metadata = {
  title: 'Blog - IBM Immobilière',
  description: 'Actualités, conseils et tendances de l\'immobilier en Tunisie',
};

export default async function BlogPage() {
  const posts = [
    {
      slug: 'amenager-bureau-medical',
      title: 'Aménagez votre bureau médical en toute simplicité à la Résidence Amira',
      excerpt: 'Découvrez nos conseils pour créer un espace médical à la fois pratique et accueillant pour vos patients. De la disposition des salles d\'attente aux équipements nécessaires.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      category: 'Conseils',
      createdAt: new Date('2025-02-18'),
    },
    {
      slug: '15-annees-parcours',
      title: '15 années d\'un parcours exceptionnel',
      excerpt: 'Retour sur 15 ans d\'excellence dans l\'immobilier tunisien et les projets qui ont marqué notre histoire. Une aventure passionnante au service de nos clients.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      category: 'Actualités',
      createdAt: new Date('2025-01-09'),
    },
    {
      slug: 'investir-immobilier-2025',
      title: 'Pourquoi investir dans l\'immobilier en 2025 ?',
      excerpt: 'L\'immobilier reste l\'un des investissements les plus sûrs. Découvrez les opportunités du marché tunisien et comment maximiser votre rendement.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
      category: 'Investissement',
      createdAt: new Date('2024-12-15'),
    },
    {
      slug: 'choisir-quartier-tunis',
      title: 'Comment choisir le bon quartier à Tunis ?',
      excerpt: 'Guide complet pour choisir votre futur quartier : écoles, transports, commerces, sécurité. Tous nos conseils pour faire le bon choix.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
      category: 'Conseils',
      createdAt: new Date('2024-11-20'),
    },
  ];

  const categories = ['Tous', 'Actualités', 'Conseils', 'Investissement', 'Tendances'];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Notre Blog
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Actualités, conseils et tendances de l&apos;immobilier en Tunisie
            </p>
          </div>
        </section>

        <section className="py-4 bg-white border-b border-slate-200 sticky top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    category === 'Tous'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
