"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProperty } from "@/lib/actions/properties";

export default function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();
  const onDelete = () => {
    if (!confirm(`Supprimer le bien "${title}" ? Cette action est définitive.`)) return;
    start(() => {
      void deleteProperty(id);
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
