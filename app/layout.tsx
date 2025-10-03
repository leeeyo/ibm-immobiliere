import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "IBM Immobilière - L'immobilier en toute confiance",
  description:
    "Immobilière Ben Mokhtar - Trouvez la propriété de vos rêves parmi nos projets résidentiels et commerciaux de luxe",
  keywords: [
    "immobilier",
    "tunisie",
    "propriété",
    "résidentiel",
    "commercial",
    "luxe",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
