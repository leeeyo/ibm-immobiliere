"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

import { createLocation, updateLocation } from "@/lib/actions/locations";
import type { LocationType } from "@/lib/types";

type Mode = { kind: "create" } | { kind: "edit"; location: LocationType };

export default function LocationForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const initial = mode.kind === "edit" ? mode.location : null;

  const onSubmit = async (formData: FormData) => {
    setError(null);
    const input = {
      name: String(formData.get("name") || "").trim(),
      sortOrder: Number(formData.get("sortOrder")) || 0,
      active: formData.get("active") === "on",
    };

    if (!input.name) {
      setError("Le nom de la localisation est requis.");
      return;
    }

    start(async () => {
      const res =
        mode.kind === "create"
          ? await createLocation(input)
          : await updateLocation(mode.location.id, input);
      if (!res.success) {
        setError(res.error || "Erreur inconnue.");
        return;
      }
      router.push("/admin/locations");
      router.refresh();
    });
  };

  return (
    <form action={onSubmit} className="space-y-6">
      <section className="rounded-xl border border-[var(--color-stone-200)] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
          <label className="block">
            <span className="text-sm font-medium text-[var(--color-navy-900)]">Nom *</span>
            <input
              name="name"
              required
              defaultValue={initial?.name}
              placeholder="Boumhel, Ben Arous"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--color-navy-900)]">Ordre</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initial?.sortOrder ?? 0}
              className={inputCls}
            />
          </label>
        </div>

        <label className="mt-5 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial?.active ?? true}
            className="h-4 w-4 rounded border-[var(--color-stone-300)]"
          />
          Active dans les formulaires et la recherche publique
        </label>
      </section>

      {error ? (
        <p className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Annuler
        </button>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30";
