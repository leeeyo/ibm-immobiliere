import type { Metadata } from "next";

import PropertyCataloguePage from "@/components/PropertyCataloguePage";

export const metadata: Metadata = {
  title: "Louer une boutique en Tunisie",
  description:
    "Découvrez les boutiques à louer proposées par IBM Immobilière en Tunisie.",
  alternates: { canonical: "/louer" },
};

export default async function RentalsPage(props: any) {
  const searchParams: Record<string, any> = (await props.searchParams) || {};
  return <PropertyCataloguePage intent="rent" searchParams={searchParams} />;
}
