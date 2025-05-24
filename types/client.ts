import type { TreatmentRecord, SerializedTreatmentRecord } from "./treatment"
import type { Decimal } from "@prisma/client/runtime/library"

export interface SerializedClient extends Omit<Client, 'balance' | 'treatmentRecords'> {
  balance: string
  treatmentRecords?: SerializedTreatmentRecord[]
  patientIntake?: PatientIntake | null
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  dob?: Date | null
  gender?: string | null
  occupation?: string | null
  maritalStatus?: string | null
  referredBy?: string | null
  consultant?: string | null
  balance: Decimal
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  skinAssessment?: SkinAssessment | null
  treatmentRecords?: TreatmentRecord[]
}

export interface SkinAssessment {
  id: string
  skinType: string
  skinTexture: string
  skinTone: string
  treatments: string[]
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientIntake {
  id: string
  createdAt: string
  updatedAt: string
  
  // Skin Condition
  skinType?: string
  wrinkleType?: string
  skinTone?: string
  bloodCirculation?: string
  skinThickness?: string
  poreSize?: string
  skinElasticity?: string

  // Previous Aesthetic Treatments
  laser: boolean
  ipl: boolean
  radiofrequency: boolean
  electricalCurrent: boolean
  peel: boolean
  hydrafacial: boolean
  aestheticTreatmentDate?: string

  // Previous Micro-Invasive Treatments
  hyaluronicAcid: boolean
  botulinumToxin: boolean
  growthFactors: boolean
  lacticAcid: boolean
  microInvasiveOther?: string
  microInvasiveDate?: string
  satisfactionLevel?: string

  // Previous Plastic Surgery
  facelift: boolean
  prosthesis: boolean
  doubleEyelid: boolean
  boneShaving: boolean
  breastImplants: boolean
  liposuction: boolean
  plasticSurgeryOther?: string
  plasticSurgeryDate?: string

  // Health Conditions
  heartDisease: boolean
  highBloodPressure: boolean
  diabetes: boolean
  pacemaker: boolean
  cancer: boolean
  cancerName?: string
  cancerDate?: string
  orthodontics: boolean
  orthodonticsName?: string
  orthodonticsDate?: string
  immuneSystemCondition: boolean
  immuneSystemDetails?: string
  surgery: boolean
  surgeryName?: string
  surgeryDate?: string
  currentlyPregnant: boolean
  sensitiveToLight: boolean
  lightSensitivityDetails?: string
  substanceAllergies: boolean
  allergyDetails?: string
  longTermMedication: boolean
  medicationDetails?: string

  // Treatment Area Conditions
  implants: boolean
  metalStent: boolean
  threadLifting: boolean
  hypertrophicScar: boolean

  clientId: string
}

export interface ClientProfileProps {
  client: SerializedClient
}

export interface ClientCardProps {
  client: SerializedClient
}

export interface ClientTreatmentRecordsProps {
  clientId: string
}
