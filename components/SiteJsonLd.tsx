import JsonLd from "@/components/JsonLd";
import { CONTACT, SITE, SOCIAL } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

export default async function SiteJsonLd() {
  const settings = await getWebsiteSettings();
  const organizationId = `${SITE.url}/#organization`;
  const sameAs = [settings.facebook, settings.instagram, settings.linkedin].filter(Boolean);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId,
            name: settings.legalName || SITE.legalName,
            alternateName: settings.siteName || SITE.name,
            url: SITE.url,
            logo: `${SITE.url}/IBM_logo_black_transparent.png`,
            email: settings.email || CONTACT.email,
            telephone: settings.phoneRaw || CONTACT.phoneRaw,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address || CONTACT.address,
              addressRegion: "Ariana",
              addressCountry: "TN",
            },
            sameAs: sameAs.length ? sameAs : [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.linkedin],
          },
          {
            "@type": "WebSite",
            "@id": `${SITE.url}/#website`,
            url: SITE.url,
            name: settings.siteName || SITE.name,
            inLanguage: "fr-TN",
            publisher: { "@id": organizationId },
          },
        ],
      }}
    />
  );
}
