import { getServiceBySlug } from "@/lib/data/services";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { notFound } from "next/navigation";

export default function WebDevelopmentPage() {
  const service = getServiceBySlug("web-development");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}
