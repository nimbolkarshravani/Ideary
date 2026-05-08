export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getEurekaById } from "@/lib/db/eurekas";
import EurekaPageClient from "@/app/components/eureka/EurekaPageClient";

export default async function EurekaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eureka = await getEurekaById(id);
  if (!eureka) notFound();
  return <EurekaPageClient initial={eureka} />;
}
