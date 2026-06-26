import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "@/lib/auth/session";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-[var(--color-navy-950)] text-white p-12 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:32px_32px]"
        />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[var(--color-gold-500)]/20 blur-3xl" />

        <Link href="/" className="relative inline-flex">
          <Image
            src="/IBM_logo_white_transparent.png"
            alt="IBM Immobilière"
            width={1254}
            height={1254}
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="relative">
          <span className="eyebrow !text-[var(--color-gold-400)] before:!bg-[var(--color-gold-400)]">
            Espace administrateur
          </span>
          <h1 className="heading-display mt-5 text-4xl xl:text-5xl text-white">
            Pilotez votre catalogue, vos projets et vos prospects.
          </h1>
          <p className="mt-5 max-w-md text-white/70">
            Une interface dédiée à l&apos;équipe IBM pour gérer le patrimoine
            immobilier en temps réel.
          </p>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} IBM Immobilière. Accès réservé.
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-stone-500)] hover:text-[var(--color-navy-900)] mb-10"
          >
            ← Retour au site
          </Link>

          <h2 className="heading-display text-3xl text-[var(--color-navy-900)]">
            Connexion
          </h2>
          <p className="mt-2 text-[var(--color-stone-600)]">
            Identifiez-vous pour accéder au back-office.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
