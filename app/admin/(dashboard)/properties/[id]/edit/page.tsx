import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import PropertyForm from "../../PropertyForm";
import { adminGetProperty } from "@/lib/actions/properties";
import { listAllProjectsLite } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage(props: any) {
  const params = await props.params;
  const id = params.id as string;
  const [property, projects] = await Promise.all([
    adminGetProperty(id),
    listAllProjectsLite(),
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
        <PropertyForm mode={{ kind: "edit", property }} projects={projects} />
      </div>
    </>
  );
}
