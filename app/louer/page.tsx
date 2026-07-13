import type { Metadata } from "next";

import PropertyCataloguePage from "@/components/PropertyCataloguePage";

export const metadata: Metadata = {
  title: "Louer — Appartements et locaux en Tunisie",
  description:
    "Découvrez les appartements, bureaux et commerces à louer proposés par IBM Immobilière en Tunisie.",
  alternates: { canonical: "/louer" },
};

export default async function RentalsPage(props: any) {
  const searchParams: Record<string, any> = (await props.searchParams) || {};
  return <PropertyCataloguePage intent="rent" searchParams={searchParams} />;
}
