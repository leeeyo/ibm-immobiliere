import PageHeader from "@/components/admin/PageHeader";
import LocationForm from "../LocationForm";

export const dynamic = "force-dynamic";

export default function NewLocationPage() {
  return (
    <>
      <PageHeader
        title="Nouvelle localisation"
        description="Ajoutez un lieu exact pour les biens, les projets et la recherche."
        back={{ href: "/admin/locations", label: "Retour aux localisations" }}
      />
      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
        <LocationForm mode={{ kind: "create" }} />
      </div>
    </>
  );
}
