"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import UnitsEditor from "@/components/admin/UnitsEditor";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { ProjectType, ProjectUnitType } from "@/lib/types";

type Mode = { kind: "create" } | { kind: "edit"; project: ProjectType };

export default function ProjectForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const initial = mode.kind === "edit" ? mode.project : null;

  const onSubmit = async (formData: FormData) => {
    setError(null);
    const featuresRaw = String(formData.get("features") || "").trim();
    const imagesRaw = String(formData.get("images") || "[]");
    let images: string[] = [];
    try {
      images = JSON.parse(imagesRaw);
    } catch {}
    const unitsRaw = String(formData.get("units") || "[]");
    let units: ProjectUnitType[] = [];
    try {
      units = JSON.parse(unitsRaw);
    } catch {}

    const input = {
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      yearCompleted: Number(formData.get("yearCompleted")) || new Date().getFullYear(),
      status: String(formData.get("status") || "ongoing") as "planned" | "ongoing" | "completed",
      type: String(formData.get("type") || "residential") as "residential" | "commercial",
      images,
      features: featuresRaw ? featuresRaw.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : [],
      videoUrl: String(formData.get("videoUrl") || "").trim() || undefined,
      featured: formData.get("featured") === "on",
      units,
    };

    if (!input.name || !input.description || !input.location) {
      setError("Merci de renseigner les champs obligatoires.");
      return;
    }

    start(async () => {
      const res =
        mode.kind === "create"
          ? await createProject(input)
          : await updateProject(mode.project.id, {
              ...input,
              regenerateSlug: formData.get("regenerateSlug") === "on",
            });
      if (!res.success) {
        setError(res.error || "Erreur inconnue.");
        return;
      }
      router.push("/admin/projects");
      router.refresh();
    });
  };

  const folder = mode.kind === "edit" ? mode.project.id : `tmp-${Date.now().toString(36)}`;

  return (
    <form action={onSubmit} className="space-y-8">
      <Card title="Identité du projet">
        <Grid>
          <Field span={2} label="Nom *" required>
            <input type="text" name="name" required defaultValue={initial?.name} className={inputCls} />
          </Field>
          <Field label="Type *">
            <select name="type" defaultValue={initial?.type || "residential"} className={inputCls}>
              <option value="residential">Résidentiel</option>
              <option value="commercial">Commercial</option>
            </select>
          </Field>
          <Field span={3} label="Description *" required>
            <textarea name="description" rows={5} required defaultValue={initial?.description} className={inputCls} />
          </Field>
        </Grid>
      </Card>

      <Card title="Localisation & statut">
        <Grid>
          <Field label="Localisation *" required>
            <input type="text" name="location" required defaultValue={initial?.location} className={inputCls} />
          </Field>
          <Field label="Année de livraison">
            <input
              type="number"
              name="yearCompleted"
              defaultValue={initial?.yearCompleted || new Date().getFullYear()}
              className={inputCls}
            />
          </Field>
          <Field label="Statut *">
            <select name="status" defaultValue={initial?.status || "ongoing"} className={inputCls}>
              <option value="planned">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Livré</option>
            </select>
          </Field>
          <Field span={3} label="Commodités (une par ligne)">
            <textarea
              name="features"
              rows={3}
              defaultValue={initial?.features?.join("\n")}
              placeholder={"Climatisation centrale\nDomotique\nMarbre"}
              className={inputCls}
            />
          </Field>
          <Field span={3} label="Vidéo (URL)">
            <input
              type="url"
              name="videoUrl"
              defaultValue={(initial as any)?.videoUrl}
              placeholder="https://www.youtube.com/embed/..."
              className={inputCls}
            />
          </Field>
          <Field span={3}>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial?.featured}
                className="h-4 w-4 rounded border-[var(--color-stone-300)]"
              />
              Mettre en avant sur la page d&apos;accueil
            </label>
          </Field>
          {mode.kind === "edit" ? (
            <Field span={3}>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="regenerateSlug" className="h-4 w-4 rounded border-[var(--color-stone-300)]" />
                Régénérer l&apos;URL — slug actuel : <code className="text-xs">/{mode.project.slug}</code>
              </label>
            </Field>
          ) : null}
        </Grid>
      </Card>

      <Card title="Galerie">
        <ImageUploader name="images" entity="projects" folder={folder} defaultValue={initial?.images || []} max={20} />
      </Card>

      <Card title="Lots & plans">
        <p className="mb-4 text-sm text-[var(--color-stone-500)]">
          Renseignez les lots de la résidence. Ils s&apos;affichent dans un tableau
          (Numéro · Étage · Type · Pièces · Surface · Plan) avec demande d&apos;infos et
          comparaison sur la page du projet.
        </p>
        <UnitsEditor name="units" entity="projects" folder={folder} defaultValue={initial?.units || []} />
      </Card>

      {error ? (
        <p className="rounded-md bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">Annuler</button>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode.kind === "create" ? "Créer le projet" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-stone-200)] bg-white">
      <header className="px-5 py-4 border-b border-[var(--color-stone-100)]">
        <h2 className="font-display text-lg text-[var(--color-navy-900)]">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5">{children}</div>;
}

function Field({
  label,
  required,
  span,
  children,
}: {
  label?: string;
  required?: boolean;
  span?: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const cls = span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "";
  return (
    <div className={cls}>
      {label ? <label className="block text-sm font-medium text-[var(--color-navy-900)] mb-1.5">{label}</label> : null}
      {children}
    </div>
  );
}
