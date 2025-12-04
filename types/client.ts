import type { TreatmentRecord, SerializedTreatmentRecord } from "./treatment"
import type { Decimal } from "@prisma/client/runtime/library"

export interface SerializedClient extends Omit<Client, 'balance' | 'treatmentRecords'> {
  balance: string
  totalSpent?: string
  totalDeposited?: string
  treatmentRecords?: SerializedTreatmentRecord[]
  patientIntake?: PatientIntake | null
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  dob?: Date | null
  gender?: string | null
  occupation?: string | null
  maritalStatus?: string | null
  referredBy?: string | null
  consultant?: string | null
  ohipNumber?: string | null
  insuranceCompany?: string | null
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
  skinType: string | null
  wrinkleType: string | null
  skinTone: string | null
  bloodCirculation: string | null
  skinThickness: string | null
  poreSize: string | null
  skinElasticity: string | null

  // Previous Aesthetic Treatments
  laser: boolean
  ipl: boolean
  radiofrequency: boolean
  electricalCurrent: boolean
  peel: boolean
  hydrafacial: boolean
  aestheticTreatmentDate: string | null

  // Previous Micro-Invasive Treatments
  hyaluronicAcid: boolean
  botulinumToxin: boolean
  growthFactors: boolean
  lacticAcid: boolean
  microInvasiveOther: string | null
  microInvasiveDate: string | null
  satisfactionLevel: string | null

  // Previous Plastic Surgery
  facelift: boolean
  prosthesis: boolean
  doubleEyelid: boolean
  boneShaving: boolean
  breastImplants: boolean
  liposuction: boolean
  plasticSurgeryOther: string | null
  plasticSurgeryDate: string | null

  // Health Conditions
  heartDisease: boolean
  highBloodPressure: boolean
  diabetes: boolean
  pacemaker: boolean
  cancer: boolean
  cancerName: string | null
  cancerDate: string | null
  orthodontics: boolean
  orthodonticsName: string | null
  orthodonticsDate: string | null
  immuneSystemCondition: boolean
  immuneSystemDetails: string | null
  surgery: boolean
  surgeryName: string | null
  surgeryDate: string | null
  currentlyPregnant: boolean
  sensitiveToLight: boolean
  lightSensitivityDetails: string | null
  substanceAllergies: boolean
  allergyDetails: string | null
  longTermMedication: boolean
  medicationDetails: string | null

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
