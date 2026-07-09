import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import PropertyForm from "../../PropertyForm";
import { adminGetProperty } from "@/lib/actions/properties";
import { listAllProjectsLite } from "@/lib/actions/projects";
import { listActiveLocations } from "@/lib/actions/locations";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage(props: any) {
  const params = await props.params;
  const id = params.id as string;
  const [property, projects, locations] = await Promise.all([
    adminGetProperty(id),
    listAllProjectsLite(),
    listActiveLocations(),
  ]);
  if (!property) notFound();

  return (
    <>
      <PageHeader
        title={`Modifier — ${property.title}`}
        description={`Référence : ${property.reference || "—"} · /${property.slug}`}
        back={{ href: "/admin/properties", label: "Retour aux biens" }}
      />
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <PropertyForm mode={{ kind: "edit", property }} projects={projects} locations={locations} />
      </div>
    </>
  );
}
