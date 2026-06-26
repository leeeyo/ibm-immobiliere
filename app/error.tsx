"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Oups ! Une erreur est survenue</h1>
        <p className="text-slate-700 mb-6">Nous avons rencontré un problème lors du chargement de la page. Vous pouvez réessayer.</p>
        <div className="flex items-center justify-center gap-4">
        <button onClick={() => reset()} className="bg-blue-600 text-white px-6 py-3 rounded">Réessayer</button>
        <Link href="/" className="text-slate-600 underline">Retour à l&apos;accueil</Link>
        </div>
        <details className="mt-6 text-left text-sm text-slate-500">
          <summary>Afficher les détails de l&apos;erreur (développement)</summary>
          <pre className="whitespace-pre-wrap mt-2">{String(error?.message)}</pre>
        </details>
      </div>
    </div>
  );
}
