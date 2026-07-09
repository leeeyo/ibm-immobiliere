import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import { listAllLocations } from "@/lib/actions/locations";
import DeleteLocationButton from "./DeleteLocationButton";

export const dynamic = "force-dynamic";

export default async function LocationsAdminPage() {
  const locations = await listAllLocations();

  return (
    <>
      <PageHeader
        title="Localisations"
        description="Gérez les lieux exacts utilisés dans les biens, les projets et la recherche."
        actions={
          <Link href="/admin/locations/new" className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Nouvelle localisation
          </Link>
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
        {locations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white py-20 text-center">
            <p className="text-[var(--color-stone-500)]">Aucune localisation enregistrée.</p>
            <Link href="/admin/locations/new" className="btn btn-primary mt-4 inline-flex">
              <Plus className="h-4 w-4" />
              Ajouter la première localisation
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--color-stone-200)] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-ivory-50)] text-left text-xs uppercase tracking-wider text-[var(--color-stone-500)]">
                <tr>
                  <th className="px-5 py-3">Localisation</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-stone-100)]">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-[var(--color-ivory-50)]/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[var(--color-navy-900)]">{location.name}</p>
                      <p className="text-xs text-[var(--color-stone-500)]">Ordre {location.sortOrder}</p>
                    </td>
                    <td className="px-5 py-3 text-[var(--color-stone-700)]">/{location.slug}</td>
                    <td className="px-5 py-3">
                      <span className={"chip " + (location.active ? "chip-success" : "")}>
                        {location.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/locations/${location.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-stone-600)] hover:bg-[var(--color-ivory-100)] hover:text-[var(--color-navy-900)]"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteLocationButton id={location.id} name={location.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
