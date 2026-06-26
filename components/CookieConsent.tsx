"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import {
  setPrivacyConsent,
  usePrivacyConsent,
} from "@/lib/privacy-consent";

export default function CookieConsent() {
  const consent = usePrivacyConsent();
  const pathname = usePathname();
  if (consent || pathname?.startsWith("/admin")) return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--color-stone-200)] bg-white/95 shadow-[0_-12px_35px_-25px_rgba(11,23,51,0.4)] backdrop-blur-xl">
      <div className="container-page flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-3xl items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-700)]" aria-hidden />
          <p className="text-sm leading-6 text-[var(--color-stone-700)]">
            Nous utilisons des traceurs de mesure uniquement avec votre accord. Les cookies
            nécessaires à la sécurité restent actifs. Consultez notre{" "}
            <Link href="/politique-confidentialite" className="font-semibold underline underline-offset-4">
              politique de confidentialité
            </Link>.
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPrivacyConsent("refused")}
            className="px-4 py-2 text-sm font-semibold text-[var(--color-stone-600)] hover:text-[var(--color-navy-900)]"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => setPrivacyConsent("accepted")}
            className="rounded-md bg-[var(--color-navy-900)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-navy-800)]"
          >
            Accepter
          </button>
        </div>
      </div>
    </aside>
  );
}
