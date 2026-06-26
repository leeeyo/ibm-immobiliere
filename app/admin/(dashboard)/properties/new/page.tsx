import PageHeader from "@/components/admin/PageHeader";
import PropertyForm from "../PropertyForm";
import { listAllProjectsLite } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const projects = await listAllProjectsLite();
  return (
    <>
      <PageHeader
        title="Nouveau bien"
        description="Ajoutez un appartement, bureau ou commerce au catalogue."
        back={{ href: "/admin/properties", label: "Retour aux biens" }}
      />
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <PropertyForm mode={{ kind: "create" }} projects={projects} />
      </div>
    </>
  );
}
