"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";

import {
  resetWebsiteSettings,
  updateWebsiteSettings,
  type SettingsFormState,
} from "@/lib/actions/settings";
import type { WebsiteSettingsType } from "@/lib/website-settings";

type FieldProps = {
  label: string;
  name: keyof WebsiteSettingsType;
  defaultValue: string | number;
  help?: string;
  type?: "text" | "email" | "number" | "url";
  textarea?: boolean;
  error?: string[];
};

const initialState: SettingsFormState = {};

export default function SettingsForm({ settings }: { settings: WebsiteSettingsType }) {
  const [state, action, pending] = useActionState(updateWebsiteSettings, initialState);
  const [resetState, resetAction, resetPending] = useActionState(resetWebsiteSettings, initialState);
  const [phone, setPhone] = useState(settings.phone);
  const [phoneRaw, setPhoneRaw] = useState(settings.phoneRaw);

  useEffect(() => {
    if (!phoneRaw || phoneRaw === settings.phoneRaw) {
      const compact = phone.replace(/[^\d+]/g, "");
      setPhoneRaw(compact.startsWith("+") ? compact : compact ? `+${compact}` : "");
    }
  }, [phone, phoneRaw, settings.phoneRaw]);

  const message = state.message || resetState.message;
  const success = state.success || resetState.success;

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={
            "rounded-xl border px-4 py-3 text-sm " +
            (success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700")
          }
        >
          {message}
        </div>
      ) : null}

      <form action={action} className="space-y-6">
        <Panel title="Identité du site" detail="Ce qui apparaît dans les pages, le SEO et les zones institutionnelles.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom du site" name="siteName" defaultValue={settings.siteName} error={state.errors?.siteName} />
            <Field label="Nom légal" name="legalName" defaultValue={settings.legalName} error={state.errors?.legalName} />
            <Field label="Signature" name="tagline" defaultValue={settings.tagline} error={state.errors?.tagline} />
            <Field
              label="Années d'expérience"
              name="yearsOfExperience"
              type="number"
              defaultValue={settings.yearsOfExperience}
              error={state.errors?.yearsOfExperience}
            />
            <Field
              label="Résidences livrées"
              name="residencesDelivered"
              type="number"
              defaultValue={settings.residencesDelivered}
              error={state.errors?.residencesDelivered}
            />
            <div className="md:col-span-2">
              <Field
                label="Description générale"
                name="description"
                defaultValue={settings.description}
                textarea
                error={state.errors?.description}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Coordonnées" detail="Téléphone, WhatsApp, email, adresse et horaires visibles sur le site.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Téléphone affiché"
              name="phone"
              defaultValue={phone}
              error={state.errors?.phone}
              help="Exemple : +216 98 451 300"
            />
            <Field
              label="Téléphone cliquable"
              name="phoneRaw"
              defaultValue={phoneRaw}
              error={state.errors?.phoneRaw}
              help="Format recommandé : +21698451300"
            />
            <Field label="Email" name="email" type="email" defaultValue={settings.email} error={state.errors?.email} />
            <Field
              label="Lien WhatsApp"
              name="whatsapp"
              type="url"
              defaultValue={settings.whatsapp}
              error={state.errors?.whatsapp}
              help="Laissez vide pour le générer depuis le téléphone cliquable."
            />
            <Field label="Adresse" name="address" defaultValue={settings.address} error={state.errors?.address} />
            <Field label="Horaires" name="hours" defaultValue={settings.hours} error={state.errors?.hours} />
          </div>
        </Panel>

        <Panel title="Réseaux sociaux" detail="Liens utilisés dans le header, le footer et les données structurées.">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Facebook" name="facebook" type="url" defaultValue={settings.facebook} error={state.errors?.facebook} />
            <Field label="Instagram" name="instagram" type="url" defaultValue={settings.instagram} error={state.errors?.instagram} />
            <Field label="LinkedIn" name="linkedin" type="url" defaultValue={settings.linkedin} error={state.errors?.linkedin} />
          </div>
        </Panel>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-stone-500)]">
            Les changements sont appliqués sur les pages publiques après sauvegarde.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-navy-900)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-gold-600)] hover:text-[var(--color-navy-900)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <CheckCircle2 className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </button>
        </div>
      </form>

      <form action={resetAction}>
        <button
          type="submit"
          disabled={resetPending}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-stone-500)] transition-colors hover:text-red-700 disabled:opacity-60"
        >
          <RotateCcw className="h-4 w-4" />
          Restaurer les valeurs par défaut
        </button>
      </form>
    </div>
  );

  function Field({
    label,
    name,
    defaultValue,
    help,
    type = "text",
    textarea,
    error,
  }: FieldProps) {
    const common =
      "mt-1.5 w-full rounded-lg border border-[var(--color-stone-200)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] outline-none transition-colors focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[var(--color-gold-500)]/15";

    return (
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-stone-500)]">
          {label}
        </span>
        {textarea ? (
          <textarea
            name={name}
            defaultValue={String(defaultValue)}
            rows={4}
            className={common}
          />
        ) : (
          <input
            name={name}
            type={type}
            defaultValue={String(defaultValue)}
            onChange={
              name === "phone"
                ? (event) => setPhone(event.currentTarget.value)
                : name === "phoneRaw"
                  ? (event) => setPhoneRaw(event.currentTarget.value)
                  : undefined
            }
            className={common}
          />
        )}
        {help ? <span className="mt-1 block text-xs text-[var(--color-stone-500)]">{help}</span> : null}
        {error?.[0] ? <span className="mt-1 block text-xs text-red-600">{error[0]}</span> : null}
      </label>
    );
  }
}

function Panel({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-stone-200)] bg-white p-5">
      <div className="mb-5">
        <h2 className="font-display text-lg text-[var(--color-navy-900)]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-stone-500)]">{detail}</p>
      </div>
      {children}
    </section>
  );
}
