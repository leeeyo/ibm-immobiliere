import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import { listAllProperties } from "@/lib/actions/properties";
import { listAllProjectsLite } from "@/lib/actions/projects";
import DeletePropertyButton from "./DeletePropertyButton";
import { Pencil, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_CHIPS: Record<string, string> = {
  available: "chip-success",
  reserved: "chip-gold",
  sold: "chip-danger",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export default async function PropertiesAdmin() {
  const [items, projects] = await Promise.all([
    listAllProperties(),
    listAllProjectsLite(),
  ]);
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));

  return (
    <>
      <PageHeader
        title="Biens"
        description="Gérez le catalogue de vente — appartements, bureaux, commerces."
        actions={
          <Link href="/admin/properties/new" className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Nouveau bien
          </Link>
        }
      />

      <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white py-20 text-center">
            <p className="text-[var(--color-stone-500)]">
              Aucun bien dans le catalogue.
            </p>
            <Link href="/admin/properties/new" className="btn btn-primary mt-4 inline-flex">
              <Plus className="h-4 w-4" />
              Ajouter le premier bien
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-stone-200)] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-ivory-50)] text-left text-xs uppercase tracking-wider text-[var(--color-stone-500)]">
                <tr>
                  <th className="px-5 py-3">Bien</th>
                  <th className="px-5 py-3 hidden md:table-cell">Projet</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Surface</th>
                  <th className="px-5 py-3">Prix</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-stone-100)]">
                {items.map((p) => {
                  const cover = p.images?.[0] || "/placeholder.svg";
                  return (
                    <tr key={p.id} className="hover:bg-[var(--color-ivory-50)]/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-16 rounded-md bg-[var(--color-ivory-100)] overflow-hidden shrink-0">
                            <Image src={cover} alt="" fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--color-navy-900)] truncate">{p.title}</p>
                            <p className="text-xs text-[var(--color-stone-500)] truncate">
                              {p.location} · {p.type === "residential" ? "Résidentiel" : "Commercial"}
                              {p.slug ? ` · /${p.slug}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-[var(--color-stone-700)]">
                        {p.projectId ? projectMap[p.projectId as any] || "—" : <span className="text-[var(--color-stone-400)]">Standalone</span>}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-[var(--color-stone-700)]">{p.area} m²</td>
                      <td className="px-5 py-3 font-medium text-[var(--color-navy-900)]">
                        {Number(p.price).toLocaleString("fr-TN")} DT
                      </td>
                      <td className="px-5 py-3">
                        <span className={"chip " + (STATUS_CHIPS[p.status] || "chip")}>
                          {STATUS_LABEL[p.status] || p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/properties/${p.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-stone-600)] hover:bg-[var(--color-ivory-100)] hover:text-[var(--color-navy-900)]"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeletePropertyButton id={p.id} title={p.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
