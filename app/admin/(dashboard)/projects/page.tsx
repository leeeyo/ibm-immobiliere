import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import { listAllProjects } from "@/lib/actions/projects";
import DeleteProjectButton from "./DeleteProjectButton";
import { Pencil, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "En cours",
  completed: "Livré",
  planned: "À venir",
};
const STATUS_CHIPS: Record<string, string> = {
  ongoing: "chip-gold",
  completed: "chip-success",
  planned: "chip",
};

export default async function ProjectsAdmin() {
  const items = await listAllProjects();

  return (
    <>
      <PageHeader
        title="Projets"
        description="Gérez les projets en cours et les réalisations."
        actions={
          <Link href="/admin/projects/new" className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Link>
        }
      />

      <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white py-20 text-center">
            <p className="text-[var(--color-stone-500)]">Aucun projet enregistré.</p>
            <Link href="/admin/projects/new" className="btn btn-primary mt-4 inline-flex">
              <Plus className="h-4 w-4" />
              Créer le premier projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => {
              const cover = p.images?.[0] || "/placeholder.svg";
              return (
                <article
                  key={p.id}
                  className="rounded-xl border border-[var(--color-stone-200)] bg-white overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[16/9]">
                    <Image src={cover} alt="" fill className="object-cover" sizes="400px" />
                    <div className="absolute top-3 left-3">
                      <span className={"chip " + STATUS_CHIPS[p.status]}>{STATUS_LABEL[p.status]}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-lg text-[var(--color-navy-900)] line-clamp-1">{p.name}</h3>
                    <p className="mt-1 text-xs text-[var(--color-stone-500)]">
                      {p.location} · {p.yearCompleted} · /{p.slug}
                    </p>
                    <p className="mt-3 text-sm text-[var(--color-stone-700)] line-clamp-2">{p.description}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--color-stone-100)] flex items-center justify-between">
                      <span className="text-xs text-[var(--color-stone-500)]">
                        {p.propertiesCount ?? 0} biens rattachés
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-stone-600)] hover:bg-[var(--color-ivory-100)] hover:text-[var(--color-navy-900)]"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProjectButton id={p.id} name={p.name} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
