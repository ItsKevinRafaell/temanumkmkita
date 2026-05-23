import { getServiceBySlug } from "@/lib/data/services";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { notFound } from "next/navigation";

export default function SEOPage() {
  const service = getServiceBySlug("seo-google-maps");
  if (!service) notFound();
  return <ServicePageLayout service={service} />;
}
