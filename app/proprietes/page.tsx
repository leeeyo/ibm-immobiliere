import PropertyCataloguePage from "@/components/PropertyCataloguePage";

export const metadata = {
  title: "Acheter — Catalogue de biens",
  description:
    "Découvrez notre catalogue de biens à la vente : appartements, bureaux, commerces signés IBM Immobilière.",
  alternates: { canonical: "/proprietes" },
};

export default async function PropertiesPage(props: any) {
  const sp: Record<string, any> = (await props.searchParams) || {};
  return <PropertyCataloguePage intent="sale" searchParams={sp} />;
}
