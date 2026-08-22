// Shared types for the /mulai onboarding EXPERIENCE (skeleton phase).
// 7-step narrative selling flow (locked by Kevin in PLAN.md):
// 1 Hook -> 2 Input ringan -> 3 Realita GBP -> 4 Ancaman kompetitor ->
// 5 Bikin web (reuse WebPreview) -> 6 Hasil kalau dioptimasi -> 7 CTA lead.

// All onboarding answers live in one object so navigation is stateless-simple
// and every step just reads/writes the slice it cares about.
export interface OnboardingState {
  // Step 2 — input ringan (dipakai step 3/5/6 dan lead di step 7)
  namaUsaha: string;
  kota: string;
  jenisUsaha: string; // label industri (untuk tampilan/copy)
  industrySlug: string; // slug industri terpilih dari dropdown searchable (22 opsi)

  // Step 5 — template web yang dipilih user (slug industri template yang dipilih)
  templateSlug: string;

  // Step 7 — CTA lead (belum di-wire ke ERP; next phase)
  nama: string;
  wa: string;
  email: string;
  pesan: string;
}

export const INITIAL_STATE: OnboardingState = {
  namaUsaha: "",
  kota: "",
  jenisUsaha: "",
  industrySlug: "",
  templateSlug: "",
  nama: "",
  wa: "",
  email: "",
  pesan: "",
};

export interface StepProps {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}
