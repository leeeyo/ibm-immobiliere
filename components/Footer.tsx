import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/projets', label: 'Nos Projets' },
    { href: '/blog', label: 'Blog' },
  ];

  const projectLinks = [
    { href: '/projets?status=ongoing', label: 'Projets en cours' },
    { href: '/projets?status=completed', label: 'Projets réalisés' },
    { href: '/projets?type=residential', label: 'Résidentiel' },
    { href: '/projets?type=commercial', label: 'Commercial' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white font-bold text-2xl px-3 py-1 rounded">
                IBM
              </div>
              <span className="text-xl font-semibold text-white">
                Immobilière
              </span>
            </div>
            <p className="text-sm mb-4">
              L&apos;immobilier en toute confiance. Nous créons des espaces où il fait bon vivre.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Nos Projets</h3>
            <ul className="space-y-2">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+216XXXXXXXX" className="hover:text-blue-400 transition-colors">
                  Tél: +216 XX XXX XXX
                </a>
              </li>
              <li>
                <a href="mailto:contact@ibm-immobiliere.tn" className="hover:text-blue-400 transition-colors">
                  contact@ibm-immobiliere.tn
                </a>
              </li>
              <li className="pt-2">
                <p className="text-slate-400">Tunisie</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              © {currentYear} IBM Immobilière. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-sm hover:text-blue-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-sm hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
