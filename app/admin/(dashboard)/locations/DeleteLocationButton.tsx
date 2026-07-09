"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { deleteLocation } from "@/lib/actions/locations";

export default function DeleteLocationButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          if (!window.confirm(`Supprimer "${name}" ?`)) return;
          start(async () => {
            const res = await deleteLocation(id);
            if (!res.success) {
              setError(res.error || "Suppression impossible.");
              return;
            }
            router.refresh();
          });
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-stone-600)] hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
        title="Supprimer"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
      {error ? (
        <span className="absolute right-0 top-10 z-10 w-64 rounded-md border border-red-100 bg-white p-2 text-xs text-red-700 shadow-lg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
