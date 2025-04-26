"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConsentForm } from "@/types/consent-form"

interface FormViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: ConsentForm
}

export function FormViewer({ open, onOpenChange, form }: FormViewerProps) {
  if (!form) {
    return null
  }

  const formData = (form.formData as {
    treatmentType: string
    beforeTreatmentChecks: string[]
    radioFrequencyDetails?: string
  }) || { treatmentType: "", beforeTreatmentChecks: [] }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{form.type} Consent Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          <div className="border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Treatment Type</p>
                <p className="font-medium">{formData.treatmentType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Signed Date</p>
                <p className="font-medium">{new Date(form.signedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Before Treatment Conditions</h3>
            <div className="space-y-2">
              {formData.beforeTreatmentChecks?.map((check, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <p>{check}</p>
                </div>
              ))}
              {formData.radioFrequencyDetails && (
                <div className="ml-6 mt-2">
                  <p className="text-sm text-muted-foreground">Treatment Details:</p>
                  <p>{formData.radioFrequencyDetails}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">During Treatment</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Before receiving treatment, apply soothing cream.</li>
              <li>During the treatment, the skin may become slightly red, which is a normal reaction.</li>
              <li>The skin may develop redness, swelling or blisters, which will subside after a few hours or a few days.</li>
              <li>Please note that during the treatment, you cannot answer the phone or move around, you must follow the instructions of the aesthetician.</li>
              <li>All treatments are designed by professionals according to the age and skin condition of the client, and the effects of the treatments vary from person to person.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">After Treatment Care</h3>
            <p className="mb-2">There is no recovery period after the treatment, but you still need to pay attention to the need for self-repair of the subcutaneous tissue. Therefore:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>It is not recommended to use cosmetics or irritating creams immediately after the treatment.</li>
              <li>Within 48 hours after the treatment, Do not use over-heated water for shower or washing your face, drink alcohol, or do strenuous exercise.</li>
              <li>Do not use exfoliating products within 7 days, and do not use skin care products containing alcohol or fruit acid to avoid skin sensitivity.</li>
              <li>Avoid direct exposure to sunlight within two weeks and use sunscreen with SPF 30 or above; do not go to sauna or have facial massage.</li>
              <li>Optical and radiofrequency treatments should not be performed within four weeks.</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="font-medium mb-2">Agreement:</p>
            <p className="text-sm">
              I clearly understand all the procedures of this treatment and the precautions before and after the treatment,
              possible skin reactions, understand and agree to the instructions to be followed during and after the treatment.
            </p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Electronic Signature</p>
              <p className="font-medium">{form.signature}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
