import { notFound } from "next/navigation";

import PageHeader from "@/components/admin/PageHeader";
import { adminGetLocation } from "@/lib/actions/locations";
import LocationForm from "../../LocationForm";

export const dynamic = "force-dynamic";

export default async function EditLocationPage(props: any) {
  const params = await props.params;
  const location = await adminGetLocation(params.id as string);
  if (!location) notFound();

  return (
    <>
      <PageHeader
        title={`Modifier — ${location.name}`}
        description={`/${location.slug}`}
        back={{ href: "/admin/locations", label: "Retour aux localisations" }}
      />
      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
        <LocationForm mode={{ kind: "edit", location }} />
      </div>
    </>
  );
}
