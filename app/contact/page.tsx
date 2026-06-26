import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { CONTACT } from "@/lib/constants/site";
import { getWebsiteSettings } from "@/lib/website-settings";

export const metadata = {
  title: "Contact",
  description:
    "Contactez IBM Immobilière. Nos conseillers vous accompagnent à chaque étape : devis, visite, conseils.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getWebsiteSettings();

  return (
    <>
      <Header />

      <main id="contenu-principal" className="pt-20">
        {/* Hero */}
        <section
          className="bg-[var(--color-navy-950)] text-white"
          aria-labelledby="contact-titre"
        >
          <div className="container-page py-16 lg:py-20">
            <p
              id="contact-surtitle"
              className="eyebrow !text-[var(--color-gold-400)] before:!bg-[var(--color-gold-400)]"
            >
              Nous joindre
            </p>
            <h1
              id="contact-titre"
              className="heading-display mt-4 text-3xl sm:text-4xl lg:text-5xl text-[var(--color-gold-100)]"
            >
              Discutons de votre projet immobilier.
            </h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Une question, un devis, planifier une visite ? Notre équipe vous
              répond sous 24 heures ouvrées.
            </p>
          </div>
        </section>

        <section
          className="bg-[var(--color-ivory-50)]"
          aria-labelledby="contact-formulaire-titre"
        >
          <div className="container-page py-16 lg:py-20">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14">
              <div className="rounded-2xl bg-white border border-[var(--color-stone-200)] p-6 lg:p-10">
                <h2
                  id="contact-formulaire-titre"
                  className="font-display text-2xl text-[var(--color-navy-900)]"
                >
                  Envoyez-nous un message
                </h2>
                <p className="mt-1 text-sm text-[var(--color-stone-600)]">
                  Tous les champs marqués d&apos;une * sont obligatoires.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>

              <aside className="space-y-5" aria-label="Coordonnées et plan">
                <Info icon={<MapPin className="h-4 w-4" />} title="Adresse" value={settings.address || CONTACT.address} />
                <Info icon={<Phone className="h-4 w-4" />} title="Téléphone" value={settings.phone || CONTACT.phone} href={`tel:${settings.phoneRaw || CONTACT.phoneRaw}`} />
                <Info icon={<Mail className="h-4 w-4" />} title="Email" value={settings.email || CONTACT.email} href={`mailto:${settings.email || CONTACT.email}`} />
                <Info icon={<Clock className="h-4 w-4" />} title="Horaires" value={settings.hours || CONTACT.hours} />

                <div className="rounded-2xl overflow-hidden border border-[var(--color-stone-200)]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12774.660368316298!2d10.1781749!3d36.8773527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cbcd8e6edddf%3A0xb3566b1c057ab8b9!2sImmobili%C3%A8re%20Ben%20Mokhtar!5e0!3m2!1sen!2stn!4v1728060180000!5m2!1sen!2stn"
                    width="100%"
                    height="320"
                    loading="lazy"
                    className="w-full h-80 border-0"
                    title="Localisation IBM Immobilière"
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Info({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const Body = (
    <div className="rounded-xl bg-white border border-[var(--color-stone-200)] p-5 flex items-start gap-4">
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-ivory-100)] text-[var(--color-gold-700)]"
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--color-stone-500)]">{title}</p>
        <p className="mt-1 text-[var(--color-navy-900)] font-medium">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block rounded-xl hover:translate-y-[-1px] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-500)]"
        aria-label={`${title} : ${value}`}
      >
        {Body}
      </a>
    );
  }
  return Body;
}

