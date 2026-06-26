import type { Metadata } from "next";
import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { CONTACT, SITE } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Informations légales relatives au site ${SITE.name}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

const legalForm = process.env.NEXT_PUBLIC_LEGAL_FORM || "À compléter";
const rne = process.env.NEXT_PUBLIC_RNE_NUMBER || "À compléter";
const taxId = process.env.NEXT_PUBLIC_TAX_ID || "À compléter";
const hostName = process.env.NEXT_PUBLIC_HOST_NAME || "À compléter";
const hostAddress = process.env.NEXT_PUBLIC_HOST_ADDRESS || "À compléter";

export default async function LegalNoticePage() {
  const settings = await getWebsiteSettings();

  return (
    <LegalDocument eyebrow="Informations légales" title="Mentions légales" updated="24 juin 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site <strong>{SITE.url}</strong> est édité par {(settings.legalName || SITE.legalName)}, {legalForm},
          établie à {(settings.address || CONTACT.address)}, Tunisie.
        </p>
        <ul>
          <li>Registre national des entreprises : {rne}</li>
          <li>Matricule fiscal : {taxId}</li>
          <li>Téléphone : {(settings.phone || CONTACT.phone)}</li>
          <li>Email : {(settings.email || CONTACT.email)}</li>
        </ul>
      </LegalSection>

      <LegalSection title="Direction de la publication">
        <p>
          La direction de la publication est assurée par la direction de {(settings.legalName || SITE.legalName)}.
          Pour toute demande relative au contenu du site, écrivez à {(settings.email || CONTACT.email)}.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Hébergeur : {hostName}. Adresse : {hostAddress}. Les services de messagerie
          transactionnelle sont configurés séparément auprès d’OVHcloud.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les textes, photographies, plans, éléments graphiques, marques et contenus du site
          sont protégés par la législation tunisienne et les conventions internationales
          applicables. Toute reproduction ou exploitation non autorisée est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Informations immobilières">
        <p>
          Les surfaces, prix, disponibilités, rendus et délais sont communiqués à titre
          informatif et peuvent évoluer. Seuls les documents contractuels signés engagent
          {` ${(settings.legalName || SITE.legalName)}`}.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Le site et les présentes mentions sont soumis au droit tunisien. Les parties
          rechercheront une solution amiable avant toute saisine des juridictions tunisiennes
          territorialement compétentes.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}

