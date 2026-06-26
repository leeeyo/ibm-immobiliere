export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const NAV_PRIMARY: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/proprietes", label: "Acheter" },
  {
    href: "/projets",
    label: "Projets",
    children: [
      { href: "/projets?status=ongoing", label: "Projets en cours" },
      { href: "/projets?status=completed", label: "Projets réalisés" },
    ],
  },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const NAV_FOOTER_QUICK = [
  { href: "/", label: "Accueil" },
  { href: "/proprietes", label: "Acheter" },
  { href: "/projets", label: "Nos Projets" },
  { href: "/blog", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export const NAV_FOOTER_SEO_LOCATIONS = [
  { href: "/proprietes?location=tunis", label: "Appartements à Tunis" },
  { href: "/proprietes?location=sousse", label: "Vente à Sousse" },
  { href: "/proprietes?location=ariana", label: "Projets à l'Ariana" },
];

export const NAV_FOOTER_SEO_TYPES = [
  { href: "/proprietes?rooms=2", label: "Appartements S+1" },
  { href: "/proprietes?rooms=3", label: "Appartements S+2" },
  { href: "/proprietes?type=commercial", label: "Bureaux & Commerces" },
];
