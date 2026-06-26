import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gauge,
  MousePointerClick,
  PhoneCall,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import { connectDB } from "@/lib/db/mongodb";
import { Lead } from "@/lib/models/Lead";
import { MetaCapiEvent } from "@/lib/models/MetaCapiEvent";

export const dynamic = "force-dynamic";

type CountBucket = { _id: string | null; count: number };

type RecentLeadRow = {
  _id: unknown;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  propertyRef?: string;
  source?: string;
  status: "new" | "contacted" | "closed";
  createdAt?: Date | string;
};

const dateFormatter = new Intl.DateTimeFormat("fr-TN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const sourceLabels: Record<string, string> = {
  "property-lead": "Fiches biens",
  "contact-form": "Formulaire contact",
  whatsapp: "WhatsApp",
  phone: "Appels",
  email: "Email",
};

const statusLabels: Record<RecentLeadRow["status"], string> = {
  new: "À traiter",
  contacted: "Relancée",
  closed: "Clôturée",
};

const statusClasses: Record<RecentLeadRow["status"], string> = {
  new: "border-amber-200 bg-amber-50 text-amber-700",
  contacted: "border-blue-200 bg-blue-50 text-blue-700",
  closed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function sourceLabel(value?: string | null) {
  if (!value) return "Source non précisée";
  return sourceLabels[value] || value.replace(/-/g, " ");
}

function formatDate(value?: Date | string) {
  if (!value) return "Date inconnue";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "Date inconnue" : dateFormatter.format(date);
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
}

function formatTrend(current: number, previous: number) {
  if (previous <= 0 && current <= 0) return "0%";
  if (previous <= 0) return "+100%";
  const value = ((current - previous) / previous) * 100;
  return `${value >= 0 ? "+" : ""}${Math.round(value)}%`;
}

function getCount(buckets: CountBucket[], key: string) {
  return buckets.find((bucket) => bucket._id === key)?.count || 0;
}

function maxCount(buckets: CountBucket[]) {
  return Math.max(1, ...buckets.map((bucket) => bucket.count));
}


export default async function AdminMarketingTrackingPage() {
  await connectDB();

  const last30 = daysAgo(30);
  const previous60 = daysAgo(60);

  const [
    leadsLast30,
    leadsPrevious30,
    totalLeads,
    sourceBuckets,
    statusBuckets,
    trackedSourceBuckets,
    trackedEventBuckets,
    recentLeads,
  ] = await Promise.all([
    Lead.countDocuments({ createdAt: { $gte: last30 } }),
    Lead.countDocuments({ createdAt: { $gte: previous60, $lt: last30 } }),
    Lead.countDocuments({}),
    Lead.aggregate<CountBucket>([
      { $match: { createdAt: { $gte: last30 } } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Lead.aggregate<CountBucket>([
      { $match: { createdAt: { $gte: last30 } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    MetaCapiEvent.aggregate<CountBucket>([
      { $match: { createdAt: { $gte: last30 }, status: "success" } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    MetaCapiEvent.aggregate<CountBucket>([
      { $match: { createdAt: { $gte: last30 }, status: "success" } },
      { $group: { _id: "$eventName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Lead.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select("name email phone subject propertyRef source status createdAt")
      .lean(),
  ]);

  const rows = recentLeads as unknown as RecentLeadRow[];
  const propertyLeads = getCount(sourceBuckets, "property-lead");
  const directContacts =
    getCount(sourceBuckets, "contact-form") +
    getCount(sourceBuckets, "whatsapp") +
    getCount(sourceBuckets, "phone") +
    getCount(sourceBuckets, "email");
  const newLeads = getCount(statusBuckets, "new");
  const contactedLeads = getCount(statusBuckets, "contacted");
  const closedLeads = getCount(statusBuckets, "closed");
  const handledLeads = contactedLeads + closedLeads;
  const followUpRate = leadsLast30 > 0 ? (handledLeads / leadsLast30) * 100 : 0;
  const signalCount = trackedSourceBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const leadSignals = getCount(trackedEventBuckets, "Lead");
  const contactSignals = getCount(trackedEventBuckets, "Contact");
  const sourceMax = maxCount(sourceBuckets);
  const trackedMax = maxCount(trackedSourceBuckets);

  return (
    <>
      <PageHeader
        title="Acquisition & croissance"
        description="Une lecture marketing des demandes, des intentions fortes et des actions à prioriser pour vendre mieux."
        actions={
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-navy-900)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-gold-600)] hover:text-[var(--color-navy-900)]"
          >
            Voir les prospects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-10">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Prospects 30 jours"
            value={String(leadsLast30)}
            detail={`${formatTrend(leadsLast30, leadsPrevious30)} vs période précédente`}
          />
          <KpiCard
            icon={<Gauge className="h-5 w-5" />}
            label="Suivi commercial"
            value={formatPercent(followUpRate)}
            detail={`${handledLeads} demande${handledLeads > 1 ? "s" : ""} déjà relancée${handledLeads > 1 ? "s" : ""}`}
          />
          <KpiCard
            icon={<Target className="h-5 w-5" />}
            label="Demandes biens"
            value={String(propertyLeads)}
            detail="Intention la plus proche de l'achat."
          />
          <KpiCard
            icon={<PhoneCall className="h-5 w-5" />}
            label="Contacts directs"
            value={String(directContacts)}
            detail="Formulaire, WhatsApp, appel ou email."
          />
          <KpiCard
            icon={<MousePointerClick className="h-5 w-5" />}
            label="Signaux suivis"
            value={String(signalCount)}
            detail={`${leadSignals} Lead · ${contactSignals} Contact`}
          />
          <KpiCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Base prospects"
            value={String(totalLeads)}
            detail="Toutes les demandes enregistrées."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel
            icon={<BarChart3 className="h-5 w-5" />}
            title="Origine des demandes"
            detail="Ce qui génère vraiment des prospects sur les 30 derniers jours."
          >
            <div className="space-y-4">
              {sourceBuckets.length > 0 ? (
                sourceBuckets.map((bucket) => (
                  <BarRow
                    key={bucket._id || "unknown"}
                    label={sourceLabel(bucket._id)}
                    value={bucket.count}
                    width={(bucket.count / sourceMax) * 100}
                  />
                ))
              ) : (
                <EmptyState text="Aucune demande récente. Lancez une campagne vers une fiche bien ou un projet phare." />
              )}
            </div>
          </Panel>

          <Panel
            icon={<Route className="h-5 w-5" />}
            title="Pipeline commercial"
            detail="Le point de friction principal avant de penser à augmenter le budget."
          >
            <div className="grid grid-cols-3 gap-3">
              <StatusTile label="À traiter" value={newLeads} tone="gold" />
              <StatusTile label="Relancées" value={contactedLeads} tone="blue" />
              <StatusTile label="Clôturées" value={closedLeads} tone="green" />
            </div>
            <div className="mt-5 rounded-lg border border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] p-4">
              <p className="text-sm font-medium text-[var(--color-navy-900)]">
                Objectif simple
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-stone-600)]">
                Garder moins de 3 demandes en attente et relancer chaque prospect dans la journée.
              </p>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel
            icon={<Sparkles className="h-5 w-5" />}
            title="Angles à scaler"
            detail="À utiliser pour vos annonces, stories, retargeting et appels."
          >
            <div className="space-y-3">
              <ActionCard
                title="Retargeting fiches biens"
                detail="Montrer les appartements vus aux visiteurs qui n'ont pas encore envoyé de demande."
              />
              <ActionCard
                title="Campagne projet phare"
                detail="Envoyer le trafic vers le projet le plus clair, puis mesurer les demandes par fiche."
              />
              <ActionCard
                title="Relance WhatsApp le jour même"
                detail="Transformer les formulaires récents en rendez-vous avant que l'intention ne refroidisse."
              />
            </div>
          </Panel>

          <Panel
            icon={<TrendingUp className="h-5 w-5" />}
            title="Intentions exploitables"
            detail="Les interactions fortes captées par les formulaires et les événements marketing."
          >
            <div className="space-y-4">
              {trackedSourceBuckets.length > 0 ? (
                trackedSourceBuckets.map((bucket) => (
                  <BarRow
                    key={bucket._id || "unknown"}
                    label={sourceLabel(bucket._id)}
                    value={bucket.count}
                    width={(bucket.count / trackedMax) * 100}
                  />
                ))
              ) : (
                <EmptyState text="Les premiers signaux apparaîtront ici après les prochaines demandes qualifiées." />
              )}
            </div>
          </Panel>
        </section>

        <section className="rounded-xl border border-[var(--color-stone-200)] bg-white">
          <div className="flex flex-col gap-2 border-b border-[var(--color-stone-100)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg text-[var(--color-navy-900)]">
                Dernières opportunités
              </h2>
              <p className="mt-1 text-sm text-[var(--color-stone-500)]">
                Les prospects à transformer en rappel, visite ou réservation.
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-navy-900)] hover:text-[var(--color-gold-700)]"
            >
              Tout voir
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--color-stone-100)] text-sm">
                <thead className="bg-[var(--color-ivory-50)] text-left text-xs uppercase tracking-wider text-[var(--color-stone-500)]">
                  <tr>
                    <th className="px-5 py-3">Prospect</th>
                    <th className="px-5 py-3">Intérêt</th>
                    <th className="px-5 py-3">Source</th>
                    <th className="px-5 py-3">Statut</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-stone-100)]">
                  {rows.map((lead) => (
                    <tr key={String(lead._id)}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-[var(--color-navy-900)]">{lead.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--color-stone-500)]">
                          {lead.phone || lead.email || "Coordonnées disponibles"}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-[var(--color-stone-700)]">
                        {lead.propertyRef || lead.subject || "Demande générale"}
                      </td>
                      <td className="px-5 py-3 text-[var(--color-stone-700)]">
                        {sourceLabel(lead.source)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`chip border ${statusClasses[lead.status]}`}>
                          {statusLabels[lead.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--color-stone-700)]">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState text="Aucun prospect pour le moment. Cette table se remplira dès les premières demandes." />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function KpiCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-stone-200)] bg-white p-5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-ivory-100)] text-[var(--color-navy-900)]">
        {icon}
      </span>
      <p className="mt-4 text-xs uppercase tracking-wider text-[var(--color-stone-500)]">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl text-[var(--color-navy-900)]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--color-stone-500)]">{detail}</p>
    </div>
  );
}

function Panel({
  icon,
  title,
  detail,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-stone-200)] bg-white p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-ivory-100)] text-[var(--color-navy-900)]">
          {icon}
        </span>
        <div>
          <h2 className="font-display text-lg text-[var(--color-navy-900)]">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-[var(--color-stone-500)]">{detail}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function BarRow({ label, value, width }: { label: string; value: number; width: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[var(--color-navy-900)]">{label}</p>
        <p className="text-sm tabular-nums text-[var(--color-stone-500)]">{value}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-ivory-100)]">
        <div
          className="h-full rounded-full bg-[var(--color-gold-600)]"
          style={{ width: `${Math.max(8, Math.min(100, width))}%` }}
        />
      </div>
    </div>
  );
}

function StatusTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "gold" | "blue" | "green";
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700 border-blue-100"
        : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wider opacity-75">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}

function ActionCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-stone-200)] bg-[var(--color-ivory-50)] p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold-700)]" />
        <div>
          <p className="font-medium text-[var(--color-navy-900)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-stone-600)]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-stone-300)] bg-[var(--color-ivory-50)] p-5 text-sm leading-6 text-[var(--color-stone-500)]">
      <Clock3 className="mb-3 h-5 w-5 text-[var(--color-gold-700)]" />
      {text}
    </div>
  );
}
