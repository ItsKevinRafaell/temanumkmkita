import { getServiceBySlug } from "@/lib/data/services";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { notFound } from "next/navigation";

export default function SosmedPage() {
  const service = getServiceBySlug("kelola-sosial-media");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}
