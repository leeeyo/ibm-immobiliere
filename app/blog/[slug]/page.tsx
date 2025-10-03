import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import Image from 'next/image';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = {
    slug: params.slug,
    title: 'Aménagez votre bureau médical en toute simplicité à la Résidence Amira',
    content: `
      <p>L'aménagement d'un bureau médical nécessite une réflexion approfondie pour créer un espace à la fois fonctionnel et accueillant. À la Résidence Amira de Boumhel, nous avons conçu des espaces parfaitement adaptés aux professionnels de santé.</p>

      <h2>Un emplacement stratégique</h2>
      <p>Située à Boumhel, la Résidence Amira bénéficie d'un emplacement privilégié avec un accès facile et un parking spacieux pour vos patients. La proximité des axes routiers principaux facilite les déplacements de vos patients venant de différents quartiers.</p>

      <h2>Des espaces modulables</h2>
      <p>Nos locaux commerciaux offrent une flexibilité d'aménagement vous permettant de créer :</p>
      <ul>
        <li>Une salle d'attente confortable et lumineuse</li>
        <li>Un ou plusieurs cabinets de consultation</li>
        <li>Un espace secrétariat et accueil</li>
        <li>Des sanitaires aux normes d'accessibilité</li>
      </ul>

      <h2>Les avantages de la Résidence Amira</h2>
      <p>En choisissant d'installer votre cabinet médical à la Résidence Amira, vous bénéficiez de :</p>
      <ul>
        <li>Finitions haut de gamme et matériaux de qualité</li>
        <li>Climatisation et ventilation optimales</li>
        <li>Sécurité 24/7</li>
        <li>Charges de copropriété raisonnables</li>
        <li>Un environnement professionnel calme</li>
      </ul>

      <h2>Nos conseils d'aménagement</h2>
      <p>Pour créer un cabinet médical accueillant :</p>
      <ul>
        <li>Privilégiez des couleurs apaisantes (blanc, beige, bleu clair)</li>
        <li>Assurez un éclairage suffisant, naturel et artificiel</li>
        <li>Choisissez du mobilier ergonomique et fonctionnel</li>
        <li>Prévoyez une signalétique claire pour guider vos patients</li>
        <li>Installez une salle d'attente confortable avec magazines et eau</li>
      </ul>

      <h2>Contactez-nous</h2>
      <p>Notre équipe est à votre disposition pour vous accompagner dans votre projet d'installation. Nous pouvons organiser une visite des locaux disponibles et discuter de vos besoins spécifiques.</p>
    `,
    excerpt: 'Découvrez nos conseils pour créer un espace médical à la fois pratique et accueillant pour vos patients.',
    author: 'IBM Immobilière',
    featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
    category: 'Conseils',
    createdAt: new Date('2025-02-18'),
    readTime: 5,
  };

  const relatedPosts = [
    {
      slug: 'investir-immobilier-2025',
      title: 'Pourquoi investir dans l\'immobilier en 2025 ?',
      excerpt: 'L\'immobilier reste l\'un des investissements les plus sûrs. Découvrez les opportunités du marché tunisien.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
      category: 'Investissement',
      createdAt: new Date('2024-12-15'),
    },
    {
      slug: 'choisir-quartier-tunis',
      title: 'Comment choisir le bon quartier à Tunis ?',
      excerpt: 'Guide complet pour choisir votre futur quartier : écoles, transports, commerces, sécurité.',
      author: 'IBM Immobilière',
      featuredImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
      category: 'Conseils',
      createdAt: new Date('2024-11-20'),
    },
  ];

  const formattedDate = post.createdAt.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <article>
          <div className="relative h-[500px] bg-slate-900">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white max-w-4xl">
                <span className="inline-block bg-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {post.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-white/90">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {post.author}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formattedDate}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime} min de lecture
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div 
                  className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-12 pt-8 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">Partager cet article :</p>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      <button className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} {...relatedPost} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
