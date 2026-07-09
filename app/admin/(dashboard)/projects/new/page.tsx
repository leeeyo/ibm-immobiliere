import PageHeader from "@/components/admin/PageHeader";
import { listActiveLocations } from "@/lib/actions/locations";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const locations = await listActiveLocations();
  return (
    <>
      <PageHeader
        title="Nouveau projet"
        description="Décrivez la résidence ou le programme commercial."
        back={{ href: "/admin/projects", label: "Retour aux projets" }}
      />
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <ProjectForm mode={{ kind: "create" }} locations={locations} />
      </div>
    </>
  );
}
