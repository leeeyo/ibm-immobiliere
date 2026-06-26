import HeaderClient from "@/components/HeaderClient";
import { getWebsiteSettings } from "@/lib/website-settings";

export default async function Header() {
  const settings = await getWebsiteSettings();
  return <HeaderClient settings={settings} />;
}
