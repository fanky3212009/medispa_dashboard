export type ConsentFormType = "GENERAL_TREATMENT" | "BOTOX" | "FILLER"

export interface ConsentForm {
  id: string
  type: ConsentFormType
  signature: string
  signedAt: Date
  formData: any
  createdAt: Date
  updatedAt: Date
  clientId: string
}

export interface CreateConsentFormInput {
  type: ConsentFormType
  signature: string
  formData: any
}
