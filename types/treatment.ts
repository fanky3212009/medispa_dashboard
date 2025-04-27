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
  balanceAfter: Decimal
  staffName: string
  notes: string | null
  type: string
  clientId: string
  treatments: Treatment[]
  createdAt: Date
}

export interface SerializedTreatmentRecord extends Omit<TreatmentRecord, 'totalAmount' | 'balanceAfter' | 'treatments'> {
  totalAmount: string
  balanceAfter: string
  treatments: SerializedTreatment[]
  type: string
}

export interface ClientTreatmentRecordsProps {
  clientId: string
}
