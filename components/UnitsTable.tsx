"use client";

import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import {
  FileText,
  Info,
  X,
  Loader2,
  Send,
  GitCompareArrows,
  CheckCircle2,
} from "lucide-react";
import { submitContactForm, type ContactState } from "@/lib/actions/contact";
import type { ProjectUnitType } from "@/lib/types";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  available: { label: "Disponible", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  reserved: { label: "Réservé", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  sold: { label: "Vendu", cls: "bg-red-50 text-red-700 ring-red-200" },
};

const keyOf = (u: ProjectUnitType, i: number) => `${u.numero}-${i}`;

export default function UnitsTable({
  units,
  projectName,
}: {
  units: ProjectUnitType[];
  projectName: string;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [infoUnit, setInfoUnit] = useState<ProjectUnitType | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectedUnits = useMemo(
    () => units.filter((u, i) => selected[keyOf(u, i)]),
    [units, selected]
  );

  const toggle = (k: string) =>
    setSelected((prev) => ({ ...prev, [k]: !prev[k] }));

  if (!units || units.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-2 text-2xl font-bold text-[var(--color-foreground)]">
        Lots &amp; disponibilités
      </h2>
      <p className="mb-6 text-[var(--color-muted)]">
        Consultez les lots, téléchargez les plans et comparez avant de demander une offre.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-stone-200)]">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-navy-950)] text-left text-white">
              <Th>Numéro</Th>
              <Th>Étage</Th>
              <Th>Type</Th>
              <Th>Pièce</Th>
              <Th>Surface</Th>
              <Th>Plan</Th>
              <Th>Demande d&apos;infos</Th>
              <Th className="text-center">Comparaison</Th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => {
              const k = keyOf(u, i);
              const st = STATUS_LABEL[u.status || "available"] || STATUS_LABEL.available;
              const sold = u.status === "sold";
              return (
                <tr
                  key={k}
                  className="border-t border-[var(--color-stone-200)] bg-white transition-colors hover:bg-[var(--color-ivory-50)]"
                >
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-navy-900)]">{u.numero}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                  </Td>
                  <Td>{u.etage || "—"}</Td>
                  <Td>{u.type || "—"}</Td>
                  <Td>{u.pieces != null ? u.pieces : "—"}</Td>
                  <Td className="tabular-nums">{u.surface != null ? `${u.surface} m²` : "—"}</Td>
                  <Td>
                    {u.planUrl ? (
                      <a
                        href={u.planUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 font-medium text-[var(--color-navy-900)] hover:text-[var(--color-gold-600)] hover:underline"
                      >
                        <FileText className="h-4 w-4 text-[var(--color-gold-600)]" />
                        Voir le plan
                      </a>
                    ) : (
                      <span className="text-[var(--color-stone-400)]">—</span>
                    )}
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => setInfoUnit(u)}
                      disabled={sold}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-navy-900)]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-navy-900)] transition-colors hover:bg-[var(--color-navy-900)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Info className="h-3.5 w-3.5" />
                      Demande d&apos;infos
                    </button>
                  </Td>
                  <Td className="text-center">
                    <input
                      type="checkbox"
                      checked={!!selected[k]}
                      onChange={() => toggle(k)}
                      aria-label={`Comparer le lot ${u.numero}`}
                      className="h-4 w-4 cursor-pointer rounded border-[var(--color-stone-300)] text-[var(--color-navy-900)] focus:ring-[var(--color-gold-500)]"
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sticky compare bar */}
      {selectedUnits.length > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-[var(--color-navy-950)] px-4 py-2.5 text-white shadow-[0_18px_40px_-12px_rgba(11,23,51,0.6)]">
            <span className="text-sm">
              <span className="font-semibold">{selectedUnits.length}</span> lot
              {selectedUnits.length > 1 ? "s" : ""} sélectionné{selectedUnits.length > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              disabled={selectedUnits.length < 2}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold-500)] px-4 py-1.5 text-sm font-semibold text-[var(--color-navy-950)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <GitCompareArrows className="h-4 w-4" />
              Comparer
            </button>
            <button
              type="button"
              onClick={() => setSelected({})}
              aria-label="Vider la sélection"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {infoUnit ? (
        <InfoModal unit={infoUnit} projectName={projectName} onClose={() => setInfoUnit(null)} />
      ) : null}

      {compareOpen ? (
        <CompareModal units={selectedUnits} onClose={() => setCompareOpen(false)} />
      ) : null}
    </section>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle text-[var(--color-stone-700)] ${className}`}>{children}</td>;
}

/* ─── Modals ──────────────────────────────────────────────────────────── */

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[var(--color-navy-950)]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function InfoModal({
  unit,
  projectName,
  onClose,
}: {
  unit: ProjectUnitType;
  projectName: string;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContactForm,
    {}
  );
  const ref = `${projectName} — Lot ${unit.numero}`;

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between border-b border-[var(--color-stone-100)] px-6 py-4">
        <div>
          <h3 className="font-display text-lg text-[var(--color-navy-900)]">Demande d&apos;informations</h3>
          <p className="text-sm text-[var(--color-stone-500)]">{ref}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-stone-500)] hover:bg-[var(--color-stone-100)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        {state.success ? (
          <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{state.message}</p>
          </div>
        ) : (
          <form action={action} className="space-y-3">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-px w-px opacity-0"
            />
            <input type="hidden" name="propertyRef" value={ref} />
            <input type="hidden" name="subject" value={`Demande d'infos — ${ref}`} />

            <ModalField name="name" placeholder="Nom complet" autoComplete="name" required error={state.fieldErrors?.name} />
            <ModalField name="email" type="email" placeholder="Email" autoComplete="email" required error={state.fieldErrors?.email} />
            <ModalField name="phone" type="tel" placeholder="Téléphone (facultatif)" autoComplete="tel" error={state.fieldErrors?.phone} />
            <textarea
              name="message"
              rows={4}
              required
              defaultValue={`Bonjour, je souhaite des informations sur le lot ${unit.numero} (${[unit.type, unit.surface ? `${unit.surface} m²` : null].filter(Boolean).join(", ")}) de ${projectName}.`}
              className="w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
            />
            {state.fieldErrors?.message ? (
              <p className="text-xs text-red-600">{state.fieldErrors.message}</p>
            ) : null}
            {state.error && !state.fieldErrors ? (
              <p className="text-xs text-red-600">{state.error}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-navy-900)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-navy-800)] disabled:opacity-60"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {pending ? "Envoi…" : "Envoyer la demande"}
            </button>
          </form>
        )}
      </div>
    </Overlay>
  );
}

function ModalField({
  name,
  placeholder,
  type = "text",
  autoComplete,
  required,
  error,
}: {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy-900)] placeholder:text-[var(--color-stone-400)] focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function CompareModal({
  units,
  onClose,
}: {
  units: ProjectUnitType[];
  onClose: () => void;
}) {
  const rows: { label: string; get: (u: ProjectUnitType) => React.ReactNode }[] = [
    { label: "Étage", get: (u) => u.etage || "—" },
    { label: "Type", get: (u) => u.type || "—" },
    { label: "Pièce", get: (u) => (u.pieces != null ? u.pieces : "—") },
    { label: "Surface", get: (u) => (u.surface != null ? `${u.surface} m²` : "—") },
    {
      label: "Statut",
      get: (u) => (STATUS_LABEL[u.status || "available"] || STATUS_LABEL.available).label,
    },
    {
      label: "Plan",
      get: (u) =>
        u.planUrl ? (
          <a
            href={u.planUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-[var(--color-navy-900)] hover:text-[var(--color-gold-600)] hover:underline"
          >
            <FileText className="h-4 w-4" /> PDF
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between border-b border-[var(--color-stone-100)] px-6 py-4">
        <h3 className="font-display text-lg text-[var(--color-navy-900)]">Comparaison des lots</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-stone-500)] hover:bg-[var(--color-stone-100)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto p-2 sm:p-4">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-stone-500)]">
                Caractéristique
              </th>
              {units.map((u, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold text-[var(--color-navy-900)]">
                  {u.numero}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-[var(--color-stone-100)]">
                <td className="px-3 py-2.5 text-[var(--color-stone-500)]">{r.label}</td>
                {units.map((u, i) => (
                  <td key={i} className="px-3 py-2.5 font-medium text-[var(--color-navy-900)]">
                    {r.get(u)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Overlay>
  );
}
