"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PdfUpload from "@/components/admin/PdfUpload";
import type { ProjectUnitType } from "@/lib/types";

interface Props {
  name: string;
  defaultValue?: ProjectUnitType[];
  entity: "projects" | "properties";
  folder: string;
}

type Row = ProjectUnitType & { _k: string };

const newRow = (): Row => ({
  _k: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  numero: "",
  etage: "",
  type: "",
  pieces: undefined,
  surface: undefined,
  planUrl: undefined,
  status: "available",
});

/**
 * Editable list of project units (lots). Serializes a clean ProjectUnitType[]
 * into a hidden JSON input so it posts with the surrounding form.
 */
export default function UnitsEditor({ name, defaultValue = [], entity, folder }: Props) {
  const [rows, setRows] = useState<Row[]>(
    defaultValue.length
      ? defaultValue.map((u, i) => ({ ...u, _k: `init-${i}` }))
      : [newRow()]
  );

  const update = (k: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r._k === k ? { ...r, ...patch } : r)));

  const remove = (k: string) => setRows((prev) => prev.filter((r) => r._k !== k));
  const add = () => setRows((prev) => [...prev, newRow()]);

  // Only persist rows that have at least a unit number.
  const serialized: ProjectUnitType[] = rows
    .filter((r) => r.numero.trim())
    .map(({ _k, ...u }) => ({
      numero: u.numero.trim(),
      etage: u.etage?.trim() || undefined,
      type: u.type?.trim() || undefined,
      pieces: u.pieces != null && !Number.isNaN(u.pieces) ? Number(u.pieces) : undefined,
      surface: u.surface != null && !Number.isNaN(u.surface) ? Number(u.surface) : undefined,
      planUrl: u.planUrl || undefined,
      status: u.status || "available",
    }));

  const num = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(serialized)} />

      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r._k}
            className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] p-3 md:grid-cols-12 md:items-end"
          >
            <Cell className="md:col-span-2" label="Numéro *">
              <input
                value={r.numero}
                onChange={(e) => update(r._k, { numero: e.target.value })}
                placeholder="A1-04"
                className={cell}
              />
            </Cell>
            <Cell className="md:col-span-1" label="Étage">
              <input
                value={r.etage || ""}
                onChange={(e) => update(r._k, { etage: e.target.value })}
                placeholder="RDC"
                className={cell}
              />
            </Cell>
            <Cell className="md:col-span-2" label="Type">
              <input
                value={r.type || ""}
                onChange={(e) => update(r._k, { type: e.target.value })}
                placeholder="S+2"
                className={cell}
              />
            </Cell>
            <Cell className="md:col-span-1" label="Pièces">
              <input
                type="number"
                min={0}
                value={r.pieces ?? ""}
                onChange={(e) => update(r._k, { pieces: num(e.target.value) })}
                className={cell}
              />
            </Cell>
            <Cell className="md:col-span-2" label="Surface (m²)">
              <input
                type="number"
                min={0}
                step="any"
                value={r.surface ?? ""}
                onChange={(e) => update(r._k, { surface: num(e.target.value) })}
                className={cell}
              />
            </Cell>
            <Cell className="md:col-span-1" label="Statut">
              <select
                value={r.status || "available"}
                onChange={(e) =>
                  update(r._k, { status: e.target.value as ProjectUnitType["status"] })
                }
                className={cell}
              >
                <option value="available">Dispo</option>
                <option value="reserved">Réservé</option>
                <option value="sold">Vendu</option>
              </select>
            </Cell>
            <Cell className="md:col-span-2" label="Plan (PDF)">
              <PdfUpload
                entity={entity}
                folder={folder}
                value={r.planUrl}
                onChange={(url) => update(r._k, { planUrl: url })}
                compact
              />
            </Cell>
            <div className="col-span-2 flex justify-end md:col-span-1">
              <button
                type="button"
                onClick={() => remove(r._k)}
                aria-label="Supprimer le lot"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-navy-900)] hover:border-[var(--color-navy-900)]"
      >
        <Plus className="h-4 w-4" />
        Ajouter un lot
      </button>
    </div>
  );
}

const cell =
  "w-full rounded-md border border-[var(--color-stone-300)] bg-white px-2.5 py-2 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30";

function Cell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[var(--color-stone-500)]">
        {label}
      </label>
      {children}
    </div>
  );
}
