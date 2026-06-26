import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center py-24">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-2xl text-slate-700 mb-6">Page non trouvée</p>
          <p className="text-slate-600 mb-6">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
         <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded">Retour à l&apos;accueil</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
