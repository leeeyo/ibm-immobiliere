import PageHeader from "@/components/admin/PageHeader";
import { loadWebsiteSettingsForAdmin } from "@/lib/actions/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
  const settings = await loadWebsiteSettingsForAdmin();

  return (
    <>
      <PageHeader
        title="Paramètres du site"
        description="Modifiez les coordonnées, horaires, informations générales et réseaux visibles sur le site."
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
