import type { SiteSettings } from "@/lib/api/blog";

export interface HomepageProof {
  clientsActive: string;
  projectsCompleted: string;
  foundedYear: string;
  primaryServiceAreas: string;
  responseTime: string;
  showTestimonials: boolean;
}

export const DEFAULT_HOMEPAGE_PROOF: HomepageProof = {
  clientsActive: "3",
  projectsCompleted: "10+",
  foundedYear: "2025",
  primaryServiceAreas: "Kalimantan Timur & Jabodetabek",
  responseTime: "Berusaha membalas dalam 24 jam",
  showTestimonials: false,
};

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function buildHomepageProof(settings?: Partial<SiteSettings> | null): HomepageProof {
  return {
    clientsActive: textOrDefault(settings?.clients_active, DEFAULT_HOMEPAGE_PROOF.clientsActive),
    projectsCompleted: textOrDefault(
      settings?.projects_completed,
      DEFAULT_HOMEPAGE_PROOF.projectsCompleted
    ),
    foundedYear: textOrDefault(settings?.founded_year, DEFAULT_HOMEPAGE_PROOF.foundedYear),
    primaryServiceAreas: textOrDefault(
      settings?.primary_service_areas,
      DEFAULT_HOMEPAGE_PROOF.primaryServiceAreas
    ),
    responseTime: textOrDefault(settings?.response_time, DEFAULT_HOMEPAGE_PROOF.responseTime),
    showTestimonials: Boolean(settings?.show_testimonials),
  };
}
