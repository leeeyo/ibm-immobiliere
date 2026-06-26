import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "../../ProjectForm";
import { adminGetProject } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage(props: any) {
  const params = await props.params;
  const id = params.id as string;
  const project = await adminGetProject(id);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={`Modifier — ${project.name}`}
        description={`/${project.slug}`}
        back={{ href: "/admin/projects", label: "Retour aux projets" }}
      />
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <ProjectForm mode={{ kind: "edit", project }} />
      </div>
    </>
  );
}
