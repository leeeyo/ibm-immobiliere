"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, ChevronDown, Trash2, CalendarClock } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions/leads";
import { formatDateTime } from "@/lib/utils/format";
import type { LeadType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const STATUS = [
  { v: "new", label: "Nouveau", cls: "chip-gold" },
  { v: "contacted", label: "Contacté", cls: "chip-navy" },
  { v: "closed", label: "Clôturé", cls: "chip" },
] as const;

export default function LeadRow({ lead }: { lead: LeadType }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [pending, startTransition] = useTransition();

  const changeStatus = (next: LeadType["status"]) => {
    setStatus(next);
    startTransition(() => {
      void updateLeadStatus(lead.id, next);
    });
  };

  const remove = () => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    startTransition(() => {
      void deleteLead(lead.id);
    });
  };

  const meta = STATUS.find((s) => s.v === status)!;

  return (
    <li className="px-5 py-4 hover:bg-[var(--color-ivory-50)]/60 transition-colors">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[var(--color-navy-900)]">{lead.name}</span>
            <span className={cn("chip", meta.cls)}>{meta.label}</span>
            {lead.propertyRef ? (
              <span className="chip">Réf. {lead.propertyRef}</span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-[var(--color-stone-500)]">
            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
            {lead.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span> : null}
            <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{formatDateTime(lead.createdAt)}</span>
          </div>
          {!open && (
            <p className="mt-2 text-sm text-[var(--color-stone-700)] line-clamp-1">
              {lead.subject ? <strong className="font-medium">{lead.subject} · </strong> : null}
              {lead.message}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 mt-1 text-[var(--color-stone-400)] transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="mt-4 grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="rounded-lg bg-[var(--color-ivory-50)] p-4">
            {lead.subject ? (
              <p className="text-sm font-semibold text-[var(--color-navy-900)] mb-2">{lead.subject}</p>
            ) : null}
            <p className="text-sm text-[var(--color-stone-700)] whitespace-pre-wrap leading-relaxed">
              {lead.message}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-stone-500)] uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => changeStatus(e.target.value as LeadType["status"])}
                disabled={pending}
                className="w-full rounded-md border border-[var(--color-stone-300)] bg-white px-3 py-2 text-sm focus:border-[var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]/30"
              >
                {STATUS.map((s) => (
                  <option key={s.v} value={s.v}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <a href={`mailto:${lead.email}`} className="btn btn-outline !py-2.5 text-sm">
                <Mail className="h-4 w-4" /> Répondre
              </a>
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="btn btn-ghost !py-2.5 text-sm">
                  <Phone className="h-4 w-4" /> Appeler
                </a>
              ) : null}
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
