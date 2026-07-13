import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, CONTACT, SOCIAL } from "@/lib/constants/site";
import {
  NAV_FOOTER_QUICK,
  NAV_FOOTER_SEO_LOCATIONS,
} from "@/lib/constants/nav";
import { listFooterLocations } from "@/lib/actions/locations";
import { getWebsiteSettings } from "@/lib/website-settings";
import { BMGroupFooterBadge } from "@/components/BMGroupFooterBadge";

export default async function Footer() {
  const year = new Date().getFullYear();
  const [settings, dynamicLocations] = await Promise.all([
    getWebsiteSettings(),
    listFooterLocations(4),
  ]);
  const siteName = settings.siteName || SITE.name;
  const yearsOfExperience = settings.yearsOfExperience || SITE.yearsOfExperience;
  const contact = {
    address: settings.address || CONTACT.address,
    phone: settings.phone || CONTACT.phone,
    phoneRaw: settings.phoneRaw || CONTACT.phoneRaw,
    email: settings.email || CONTACT.email,
    hours: settings.hours || CONTACT.hours,
  };
  const social = {
    facebook: settings.facebook || SOCIAL.facebook,
    instagram: settings.instagram || SOCIAL.instagram,
    linkedin: settings.linkedin || SOCIAL.linkedin,
  };
  const footerLocations = dynamicLocations.length > 0
    ? dynamicLocations.map((location) => ({
        href: location.href,
        label: location.name,
        meta: location.activityLabel,
      }))
    : NAV_FOOTER_SEO_LOCATIONS.slice(0, 4).map((location) => ({
        ...location,
        meta: "Découvrir",
      }));

  return (
    <footer className="bg-[var(--color-navy-950)] text-white/80">
      {/* Top gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/60 to-transparent" />

      <div className="container-page py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1 — Identité */}
          <div className="lg:col-span-4">
            <Image
              src="/IBM_logo_white_transparent.png"
              alt={siteName}
              width={1254}
              height={1254}
              className="h-14 w-auto object-contain mb-5"
            />
            <p className="text-sm leading-relaxed text-white/70 max-w-sm">
              <span className="text-[var(--color-gold-400)] font-semibold">{yearsOfExperience} ans d&apos;engagement</span> au service de la qualité.
              Promoteur immobilier expert, nous réalisons des projets d&apos;exception
              pour bâtir votre avenir en toute confiance.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialLink href={social.facebook} label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink href={social.instagram} label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
              <SocialLink href={social.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialLink>
            </div>

            <BMGroupFooterBadge />
          </div>

          {/* Col 2 — Accès rapide */}
          <div className="lg:col-span-2">
            <FooterHeading>Accès rapide</FooterHeading>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_FOOTER_QUICK.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-[var(--color-gold-400)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Dynamic locations */}
          <div className="lg:col-span-3">
            <FooterHeading>Nos localisations</FooterHeading>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/50">
              Une sélection courte, mise à jour selon nos biens et résidences.
            </p>
            <ul className="mt-5 space-y-2">
              {footerLocations.map((location) => (
                <li key={location.href}>
                  <Link
                    href={location.href}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5 transition-all hover:border-[var(--color-gold-500)]/45 hover:bg-white/[0.07]"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm text-white/75 transition-colors group-hover:text-white">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-400)]" />
                      <span className="truncate">{location.label}</span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/35 transition-colors group-hover:text-[var(--color-gold-300)]">
                      {location.meta}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/proprietes"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-gold-400)] transition-colors hover:text-[var(--color-gold-300)]"
            >
              Voir toutes les opportunités
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Col 4 — Contact */}
          <div className="lg:col-span-3">
            <FooterHeading>Coordonnées</FooterHeading>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--color-gold-400)] shrink-0" />
                <span className="text-white/70">{contact.address}</span>
              </li>
              <li>
                <a href={`tel:${contact.phoneRaw}`} className="flex gap-3 text-white/70 hover:text-[var(--color-gold-400)]">
                  <Phone className="h-4 w-4 mt-0.5 text-[var(--color-gold-400)] shrink-0" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex gap-3 text-white/70 hover:text-[var(--color-gold-400)]">
                  <Mail className="h-4 w-4 mt-0.5 text-[var(--color-gold-400)] shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-[var(--color-gold-400)] shrink-0" />
                <span className="text-white/70">{contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} {siteName}. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="hover:text-[var(--color-gold-400)]">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-[var(--color-gold-400)]">
              Politique de confidentialité (RGPD)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-base font-semibold text-white tracking-wide">
      {children}
    </h3>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] hover:border-transparent transition-all"
    >
      {children}
    </a>
  );
}

