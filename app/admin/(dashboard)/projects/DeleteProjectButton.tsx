"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProject } from "@/lib/actions/projects";

export default function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const onDelete = () => {
    if (
      !confirm(
        `Supprimer le projet "${name}" ?\n\nLes biens rattachés seront détachés (rendus standalone), mais ne seront pas supprimés.`
      )
    )
      return;
    start(() => {
      void deleteProject(id);
    });
  };
  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-700 hover:bg-red-50 disabled:opacity-50"
      title="Supprimer"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
