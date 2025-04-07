import type { TreatmentRecord, SerializedTreatmentRecord } from "./treatment"
import type { Decimal } from "@prisma/client/runtime/library"

export interface SerializedClient extends Omit<Client, 'balance' | 'treatmentRecords'> {
  balance: string
  treatmentRecords?: SerializedTreatmentRecord[]
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

export interface ClientProfileProps {
  client: SerializedClient
}

export interface ClientCardProps {
  client: SerializedClient
}

export interface ClientTreatmentRecordsProps {
  clientId: string
}
