export interface SkinCondition {
  skinType: "Dry" | "Neutral" | "Oily" | "Sensitive" | "Hybrid";
  wrinkleType: "Fine" | "Normal" | "Thick";
  skinTone: "Fair" | "Dark" | "Average" | "Tan";
  bloodCirculation: "Poor" | "Normal" | "Good";
  skinThickness: "Thin" | "Normal" | "Thick";
  poreSize: "Small" | "Normal" | "Large";
  skinElasticity: "Poor" | "Normal" | "Good";
}

export interface AestheticTreatment {
  laser: boolean;
  ipl: boolean; // Intense Pulsed Light
  radiofrequency: boolean;
  electricalCurrent: boolean;
  peel: boolean;
  hydrafacial: boolean;
  date?: string;
}

export interface MicroInvasiveTreatment {
  hyaluronicAcid: boolean;
  botulinumToxin: boolean;
  growthFactors: boolean;
  lacticAcid: boolean;
  other?: string;
  date?: string;
  satisfactionLevel?: "High" | "Moderate" | "Low";
}

export interface PlasticSurgeryTreatment {
  facelift: boolean;
  prosthesis: boolean;
  doubleEyelid: boolean;
  boneShaving: boolean;
  breastImplants: boolean;
  liposuction: boolean;
  other?: string;
  date?: string;
}

export interface HealthCondition {
  heartDisease: boolean;
  highBloodPressure: boolean;
  diabetes: boolean;
  pacemaker: boolean;
  cancer: boolean;
  cancerDetails?: {
    name: string;
    date: string;
  };
  orthodontics: boolean;
  orthodonticsDetails?: {
    name: string;
    date: string;
  };
  immuneSystemSkinCondition: boolean;
  immuneSystemDetails?: string; // Skin inflammation, Lupus erythematosus, Rosacea, etc
  surgery: boolean;
  surgeryDetails?: {
    name: string;
    date: string;
  };
  currentlyPregnant: boolean;
  sensitiveToLight: boolean;
  lightSensitivityDetails?: string;
  substanceAllergies: boolean;
  allergyDetails?: string;
  longTermMedication: boolean;
  medicationDetails?: string;
}

export interface TreatmentAreaConditions {
  implants: boolean;
  metalStent: boolean;
  threadLifting: boolean;
  hypertrophicScar: boolean;
}

export interface PatientIntakeForm {
  skinCondition: SkinCondition;
  previousAestheticTreatments: AestheticTreatment;
  previousMicroInvasiveTreatments: MicroInvasiveTreatment;
  previousPlasticSurgery: PlasticSurgeryTreatment;
  healthCondition: HealthCondition;
  treatmentAreaConditions: TreatmentAreaConditions;
}

// Helper type for form validation
export interface FormValidationErrors {
  skinCondition?: Partial<Record<keyof SkinCondition, string>>;
  healthCondition?: Partial<Record<keyof HealthCondition, string>>;
  general?: string[];
}
