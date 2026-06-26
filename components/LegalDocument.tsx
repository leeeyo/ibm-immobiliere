import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalDocument({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-white pt-20">
        <header className="bg-[var(--color-navy-950)] text-white">
          <div className="container-page py-16 lg:py-24">
            <span className="caption !text-[var(--color-gold-400)]">{eyebrow}</span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-sm text-white/60">Dernière mise à jour : {updated}</p>
          </div>
        </header>
        <article className="container-page max-w-4xl py-14 lg:py-20 legal-prose">
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--color-stone-200)] py-8 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl text-[var(--color-navy-900)] sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[var(--color-stone-700)] leading-7">{children}</div>
    </section>
  );
}
