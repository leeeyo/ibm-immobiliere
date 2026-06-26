import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import LeadRow from "./LeadRow";
import { listLeads } from "@/lib/actions/leads";
import type { LeadType } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTERS: Array<{ key: "all" | "new" | "contacted" | "closed"; label: string }> = [
  { key: "all", label: "Toutes" },
  { key: "new", label: "Nouvelles" },
  { key: "contacted", label: "Contactées" },
  { key: "closed", label: "Clôturées" },
];

export default async function LeadsPage(props: any) {
  const sp = (await props.searchParams) || {};
  const status = ((sp.status as string) || "all") as "all" | "new" | "contacted" | "closed";
  const leads = (await listLeads(status)) as LeadType[];

  return (
    <>
      <PageHeader
        title="Demandes de contact"
        description="Tous les messages reçus depuis le site, votre liste de prospects."
      />

      <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const active = f.key === status;
            return (
              <Link
                key={f.key}
                href={`/admin/leads${f.key === "all" ? "" : `?status=${f.key}`}`}
                className={
                  "px-4 py-2 rounded-full text-sm font-medium border transition-colors " +
                  (active
                    ? "bg-[var(--color-navy-900)] text-white border-[var(--color-navy-900)]"
                    : "bg-white text-[var(--color-stone-700)] border-[var(--color-stone-200)] hover:border-[var(--color-navy-900)]")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-stone-300)] bg-white py-20 text-center text-[var(--color-stone-500)]">
            Aucune demande dans cette catégorie.
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-stone-200)] bg-white overflow-hidden">
            <ul className="divide-y divide-[var(--color-stone-100)]">
              {leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
