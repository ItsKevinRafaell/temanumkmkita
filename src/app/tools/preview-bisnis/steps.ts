import type { ComponentType } from "react";
import type { StepProps, OnboardingState } from "./types";
import Step1Hook from "./steps/Step1Hook";
import Step2Input from "./steps/Step2Input";
import Step3Gbp from "./steps/Step3Gbp";
import Step4Kompetitor from "./steps/Step4Kompetitor";
import Step5Web from "./steps/Step5Web";
import Step6Hasil from "./steps/Step6Hasil";
import Step7Cta from "./steps/Step7Cta";

export interface StepDef {
  id: number;
  title: string; // short label for progress bar
  Component: ComponentType<StepProps>;
  // Validation gate: returns true when the user may proceed.
  isValid: (s: OnboardingState) => boolean;
}

// 7-step narrative selling flow (locked by Kevin in PLAN.md).
// Only Step 2 (input) & Step 7 (CTA) gate on data; narrative scenes pass through.
export const STEPS: StepDef[] = [
  { id: 1, title: "Hook", Component: Step1Hook, isValid: () => true },
  {
    id: 2,
    title: "Kenalan",
    Component: Step2Input,
    isValid: (s) =>
      s.namaUsaha.trim().length > 0 &&
      s.kota.trim().length > 0 &&
      s.industrySlug.trim().length > 0,
  },
  { id: 3, title: "Realita GBP", Component: Step3Gbp, isValid: () => true },
  { id: 4, title: "Kompetitor", Component: Step4Kompetitor, isValid: () => true },
  { id: 5, title: "Bikin Web", Component: Step5Web, isValid: () => true },
  { id: 6, title: "Hasil", Component: Step6Hasil, isValid: () => true },
  {
    id: 7,
    title: "Mulai",
    Component: Step7Cta,
    isValid: (s) => s.nama.trim().length > 0 && s.wa.trim().length > 0,
  },
];

export const TOTAL_STEPS = STEPS.length;
