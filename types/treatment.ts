import type { Decimal } from "@prisma/client/runtime/library"

export interface Treatment {
  id: string
  name: string
  price: Decimal
  treatmentRecordId: string
}

export interface SerializedTreatment extends Omit<Treatment, 'price'> {
  price: string
}

export interface TreatmentRecord {
  id: string
  date: string
  totalAmount: Decimal
  staffName: string
  notes: string | null
  clientId: string
  treatments: Treatment[]
}

export interface SerializedTreatmentRecord extends Omit<TreatmentRecord, 'totalAmount' | 'treatments'> {
  totalAmount: string
  treatments: SerializedTreatment[]
}

export interface ClientTreatmentRecordsProps {
  clientId: string
}
