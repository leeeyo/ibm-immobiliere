import Link from "next/link";
import {
  Inbox,
  Home,
  Building2,
  ArrowUpRight,
  CalendarClock,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { listLeads, getLeadCounts } from "@/lib/actions/leads";
import { listAllProperties } from "@/lib/actions/properties";
import { listAllProjects } from "@/lib/actions/projects";
import { formatRelative } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [counts, recentLeads, propsList, projsList] = await Promise.all([
    getLeadCounts(),
    listLeads("all"),
    listAllProperties(),
    listAllProjects(),
  ]);

  const lastLeads = recentLeads.slice(0, 5);
  const lastProps = propsList.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité — demandes, biens et projets."
        actions={
          <Link href="/admin/properties/new" className="btn btn-primary">
            + Nouveau bien
          </Link>
        }
      />

      <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
        {/* KPIs */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            label="Demandes nouvelles"
            value={counts.new}
            href="/admin/leads?status=new"
            icon={<Inbox className="h-5 w-5" />}
            highlight
          />
          <Stat
            label="Demandes total"
            value={counts.total}
            href="/admin/leads"
            icon={<Inbox className="h-5 w-5" />}
          />
          <Stat
            label="Biens publiés"
            value={propsList.length}
            href="/admin/properties"
            icon={<Home className="h-5 w-5" />}
          />
          <Stat
            label="Projets"
            value={projsList.length}
            href="/admin/projects"
            icon={<Building2 className="h-5 w-5" />}
          />
        </section>

        {/* Two cols */}
        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <Card
            title="Dernières demandes"
            cta={{ href: "/admin/leads", label: "Voir tout" }}
          >
            {lastLeads.length === 0 ? (
              <Empty label="Aucune demande pour le moment." />
            ) : (
              <ul className="divide-y divide-[var(--color-stone-100)]">
                {lastLeads.map((l) => (
                  <li key={l.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-navy-900)] truncate">
                        {l.name} · {l.email}
                      </p>
                      <p className="text-xs text-[var(--color-stone-500)] flex items-center gap-1 mt-0.5">
                        <CalendarClock className="h-3 w-3" />
                        {formatRelative(l.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-stone-700)] line-clamp-2">
                        {l.message}
                      </p>
                    </div>
                    <span
                      className={
                        "chip " +
                        (l.status === "new"
                          ? "chip-gold"
                          : l.status === "contacted"
                          ? "chip-navy"
                          : "chip")
                      }
                    >
                      {l.status === "new" ? "Nouveau" : l.status === "contacted" ? "Contacté" : "Clôturé"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="Derniers biens"
            cta={{ href: "/admin/properties", label: "Voir tout" }}
          >
            {lastProps.length === 0 ? (
              <Empty label="Aucun bien publié." />
            ) : (
              <ul className="divide-y divide-[var(--color-stone-100)]">
                {lastProps.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-navy-900)] truncate">{p.title}</p>
                      <p className="text-xs text-[var(--color-stone-500)]">
                        {p.location} · {p.area} m²
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-base text-[var(--color-navy-900)]">
                        {Number(p.price).toLocaleString("fr-TN")} DT
                      </p>
                      <span
                        className={
                          "mt-1 inline-block chip " +
                          (p.status === "available"
                            ? "chip-success"
                            : p.status === "reserved"
                            ? "chip-gold"
                            : "chip-danger")
                        }
                      >
                        {p.status === "available" ? "Disponible" : p.status === "reserved" ? "Réservé" : "Vendu"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  href,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "group rounded-xl border bg-white p-5 transition-all hover:shadow-[0_8px_24px_-8px_rgba(11,23,51,0.12)] " +
        (highlight
          ? "border-[var(--color-gold-300)] ring-1 ring-[var(--color-gold-200)]"
          : "border-[var(--color-stone-200)]")
      }
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-ivory-100)] text-[var(--color-navy-900)]">
          {icon}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--color-stone-400)] group-hover:text-[var(--color-navy-900)]" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-[var(--color-stone-500)]">{label}</p>
      <p className="font-display text-3xl text-[var(--color-navy-900)] mt-1">{value}</p>
    </Link>
  );
}

function Card({
  title,
  cta,
  children,
}: {
  title: string;
  cta?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-stone-200)] bg-white">
      <div className="px-5 py-4 border-b border-[var(--color-stone-100)] flex items-center justify-between">
        <h2 className="font-display text-lg text-[var(--color-navy-900)]">{title}</h2>
        {cta ? (
          <Link href={cta.href} className="text-sm font-medium text-[var(--color-navy-900)] hover:text-[var(--color-gold-700)]">
            {cta.label} →
          </Link>
        ) : null}
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="py-10 text-center text-sm text-[var(--color-stone-500)]">{label}</p>;
}
