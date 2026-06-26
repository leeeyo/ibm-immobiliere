import type { Metadata } from "next";
import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { CONTACT, SITE } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Traitement et protection des données personnelles par ${SITE.name}.`,
  alternates: { canonical: "/politique-confidentialite" },
  robots: { index: true, follow: true },
};

export default async function PrivacyPolicyPage() {
  const settings = await getWebsiteSettings();

  return (
    <LegalDocument eyebrow="Données personnelles" title="Politique de confidentialité" updated="24 juin 2026">
      <LegalSection title="Cadre légal et responsable du traitement">
        <p>
          {(settings.legalName || SITE.legalName)}, établie à {(settings.address || CONTACT.address)}, traite les données personnelles
          conformément à la loi organique tunisienne n° 2004-63 du 27 juillet 2004 relative à
          la protection des données à caractère personnel.
        </p>
        <p>Contact du responsable du traitement : {(settings.email || CONTACT.email)}.</p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>
          Les formulaires peuvent recueillir votre nom, email, téléphone, message, bien ou lot
          concerné. Des données techniques limitées peuvent également être traitées pour la
          sécurité, la prévention des abus et, après votre choix, la mesure d’audience.
        </p>
      </LegalSection>

      <LegalSection title="Finalités">
        <ul>
          <li>Répondre aux demandes, organiser une visite et assurer le suivi commercial ;</li>
          <li>Gérer les disponibilités et demandes relatives aux résidences ;</li>
          <li>Sécuriser le site, limiter les soumissions automatisées et administrer les accès ;</li>
          <li>Mesurer l’audience et les campagnes uniquement lorsque vous l’acceptez.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Destinataires et transferts">
        <p>
          Les données sont accessibles aux personnes habilitées de {(settings.legalName || SITE.legalName)} et à ses
          prestataires techniques strictement nécessaires, notamment l’hébergement et la
          messagerie OVHcloud. Les outils Google ou Meta ne sont chargés qu’après consentement.
        </p>
        <p>
          Tout transfert de données hors de Tunisie est encadré conformément aux articles 50 à
          52 de la loi n° 2004-63 et, lorsque requis, soumis aux formalités de l’Instance
          Nationale de Protection des Données Personnelles.
        </p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <ul>
          <li>Demandes et échanges commerciaux : 24 mois après le dernier contact ;</li>
          <li>Journaux de sécurité et limitations techniques : 12 mois maximum ;</li>
          <li>Choix relatif aux traceurs : 6 mois avant nouvelle sollicitation ;</li>
          <li>Documents contractuels : selon les délais légaux applicables.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous pouvez demander l’accès, la copie, la rectification, la mise à jour ou
          l’effacement de vos données, vous opposer à leur traitement et retirer votre
          consentement. La demande doit permettre de vérifier votre identité et être envoyée à
          {` ${(settings.email || CONTACT.email)}`} ou à l’adresse postale indiquée ci-dessus.
        </p>
        <p>
          Vous pouvez également saisir l’Instance Nationale de Protection des Données
          Personnelles lorsque vous estimez que vos droits ne sont pas respectés.
        </p>
      </LegalSection>

      <LegalSection title="Cookies et mesure d’audience">
        <p>
          Les cookies strictement nécessaires assurent la sécurité et le fonctionnement du
          site. Les traceurs de mesure d’audience ou publicitaires restent désactivés tant que
          vous ne les avez pas acceptés. Votre choix peut être modifié en supprimant les
          données du site dans votre navigateur.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}

