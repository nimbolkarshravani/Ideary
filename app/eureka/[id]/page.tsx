import { notFound } from "next/navigation";
import { getEureka } from "@/lib/data/eurekas";
import EurekaPageClient from "@/app/components/eureka/EurekaPageClient";

export default async function EurekaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eureka = getEureka(id);
  if (!eureka) notFound();
  return <EurekaPageClient initial={eureka} />;
}
