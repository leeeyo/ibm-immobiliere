"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import VideoUrlInput from "@/components/admin/VideoUrlInput";
import PdfUpload from "@/components/admin/PdfUpload";
import { createProperty, updateProperty } from "@/lib/actions/properties";
import type { PropertyType } from "@/lib/types";

type Mode = { kind: "create" } | { kind: "edit"; property: PropertyType };

export default function PropertyForm({
  mode,
  projects,
}: {
  mode: Mode;
  projects: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const initial = mode.kind === "edit" ? mode.property : null;

  const onSubmit = async (formData: FormData) => {
    setError(null);
    const featuresRaw = String(formData.get("features") || "").trim();
    const imagesRaw = String(formData.get("images") || "[]");
    let images: string[] = [];
    try {
      images = JSON.parse(imagesRaw);
    } catch {}
    const videosRaw = String(formData.get("videos") || "[]");
    let videos: string[] = [];
    try {
      videos = JSON.parse(videosRaw);
    } catch {}

    const input = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      reference: String(formData.get("reference") || "").trim() || undefined,
      price: Number(formData.get("price")),
      location: String(formData.get("location") || "").trim(),
      type: String(formData.get("type") || "residential") as "residential" | "commercial",
      rooms: formData.get("rooms") ? Number(formData.get("rooms")) : undefined,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : undefined,
      area: Number(formData.get("area")),
      floor: String(formData.get("floor") || "").trim() || undefined,
      planUrl: String(formData.get("planUrl") || "").trim() || undefined,
      orientation: String(formData.get("orientation") || "").trim() || undefined,
      images,
      videos,
      features: featuresRaw ? featuresRaw.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean) : [],
      status: String(formData.get("status") || "available") as "available" | "sold" | "reserved",
      featured: formData.get("featured") === "on",
      projectId: String(formData.get("projectId") || "") || null,
    };

    if (!input.title || !input.description || !input.location || !input.price || !input.area) {
      setError("Merci de renseigner les champs obligatoires.");
      return;
    }

    start(async () => {
      let res;
      if (mode.kind === "create") {
        res = await createProperty(input);
      } else {
        res = await updateProperty(mode.property.id, {
          ...input,
          regenerateSlug: formData.get("regenerateSlug") === "on",
        });
      }
      if (!res.success) {
        setError(res.error || "Erreur inconnue.");
        return;
      }
      router.push("/admin/properties");
      router.refresh();
    });
  };

  const folder = mode.kind === "edit" ? mode.property.id : `tmp-${Date.now().toString(36)}`;

  return (
    <form action={onSubmit} className="space-y-8">
      {/* Identity */}
      <Card title="Identité du bien">
        <Grid>
          <Field span={2} label="Titre *" required>
            <input
              type="text"
              name="title"
              required
              defaultValue={initial?.title}
              placeholder="Appartement S+2 Vue Mer"
              className={inputCls}
            />
          </Field>
          <Field label="Référence">
            <input
              type="text"
              name="reference"
              defaultValue={initial?.reference}
              placeholder="IBM-2026-A12"
              className={inputCls}
            />
          </Field>
          <Field label="Type *" required>
            <select name="type" defaultValue={initial?.type || "residential"} className={inputCls}>
              <option value="residential">Résidentiel</option>
              <option value="commercial">Commercial</option>
            </select>
          </Field>
          <Field span={3} label="Description *" required>
            <textarea
              name="description"
              rows={5}
              required
              defaultValue={initial?.description}
              placeholder="Descriptif détaillé du bien…"
              className={inputCls}
            />
          </Field>
        </Grid>
      </Card>

      {/* Specs */}
      <Card title="Caractéristiques">
        <Grid>
          <Field label="Localisation *" required>
            <input
              type="text"
              name="location"
              required
              defaultValue={initial?.location}
              placeholder="Riadh el Andalous, Ariana"
              className={inputCls}
            />
          </Field>
          <Field label="Prix (DT) *" required>
            <input
              type="number"
              name="price"
              min={0}
              step="any"
              required
              defaultValue={initial?.price}
              className={inputCls}
            />
          </Field>
          <Field label="Surface (m²) *" required>
            <input
              type="number"
              name="area"
              min={0}
              step="any"
              required
              defaultValue={initial?.area}
              className={inputCls}
            />
          </Field>
          <Field label="Pièces (S+x → x+1)">
            <input
              type="number"
              name="rooms"
              min={0}
              defaultValue={initial?.rooms}
              className={inputCls}
            />
          </Field>
          <Field label="Salles de bain">
            <input
              type="number"
              name="bathrooms"
              min={0}
              defaultValue={initial?.bathrooms}
              className={inputCls}
            />
          </Field>
          <Field label="Étage">
            <input
              type="text"
              name="floor"
              defaultValue={(initial as any)?.floor}
              placeholder="RDC, 2, 3…"
              className={inputCls}
            />
          </Field>
          <Field label="Orientation">
            <select name="orientation" defaultValue={initial?.orientation || ""} className={inputCls}>
              <option value="">—</option>
              {["Nord", "Sud", "Est", "Ouest", "Nord-Est", "Nord-Ouest", "Sud-Est", "Sud-Ouest"].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field span={3} label="Commodités (une par ligne ou séparées par des virgules)">
            <textarea
              name="features"
              rows={3}
              defaultValue={initial?.features?.join("\n")}
              placeholder={"Climatisation centrale\nDomotique\nMarbre\nParking sous-sol"}
              className={inputCls}
            />
          </Field>
        </Grid>
      </Card>

      {/* Linkage */}
      <Card title="Rattachement & visibilité">
        <Grid>
          <Field span={2} label="Projet associé">
            <select name="projectId" defaultValue={(initial as any)?.projectId || ""} className={inputCls}>
              <option value="">— Bien standalone (hors projet) —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Statut *" required>
            <select name="status" defaultValue={initial?.status || "available"} className={inputCls}>
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </Field>
          <Field span={3}>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initial?.featured}
                className="h-4 w-4 rounded border-[var(--color-stone-300)] text-[var(--color-navy-900)] focus:ring-[var(--color-gold-500)]"
              />
              Mettre en avant sur la page d&apos;accueil
            </label>
          </Field>
          {mode.kind === "edit" ? (
            <Field span={3}>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="regenerateSlug"
                  className="h-4 w-4 rounded border-[var(--color-stone-300)]"
                />
                Régénérer l&apos;URL (slug) à partir du titre — slug actuel : <code className="text-xs">/{mode.property.slug}</code>
              </label>
            </Field>
          ) : null}
        </Grid>
      </Card>

      {/* Images */}
      <Card title="Photos">
        <ImageUploader
          name="images"
          entity="properties"
          folder={folder}
          defaultValue={initial?.images || []}
          max={20}
        />
      </Card>

      {/* Videos */}
      <Card title="Vidéos (YouTube)">
        <VideoUrlInput name="videos" defaultValue={initial?.videos || []} max={12} />
      </Card>

      {/* Plan */}
      <Card title="Plan du bien (PDF)">
        <PdfUpload
          name="planUrl"
          entity="properties"
          folder={folder}
          value={(initial as any)?.planUrl}
        />
      </Card>

      {error ? (
        <p className="rounded-md bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          Annuler
        </button>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode.kind === "create" ? "Créer le bien" : "Enregistrer"}
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
      {label ? (
        <label className="block text-sm font-medium text-[var(--color-navy-900)] mb-1.5">
          {label}
        </label>
      ) : null}
      {children}
    </div>
  );
}
