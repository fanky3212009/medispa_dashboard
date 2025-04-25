"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TreatmentConsentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TreatmentConsentData) => void
  clientName: string
}

interface TreatmentConsentData {
  name: string
  treatmentType: string
  beforeTreatmentChecks: string[]
  radioFrequencyDetails?: string
}

export function TreatmentConsentForm({ open, onOpenChange, onSubmit, clientName }: TreatmentConsentFormProps) {
  const [formData, setFormData] = useState<TreatmentConsentData>({
    name: clientName,
    treatmentType: "",
    beforeTreatmentChecks: [],
    radioFrequencyDetails: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const beforeTreatmentItems = [
    "Have received radiofrequency or other skin treatments within the past two weeks",
    "Currently have oral/skin diseases and are undergoing treatment",
    "Have been exposed to direct sunlight/tanning within the past month",
    "Have used whitening products or Vitamin A/C derivatives within the past month",
    "Have used medications within the past two weeks"
  ]

  const duringTreatmentInfo = [
    "Before receiving treatment, apply soothing cream.",
    "During the treatment, the skin may become slightly red, which is a normal reaction.",
    "The skin may develop redness, swelling or blisters, which will subside after a few hours or a few days.",
    "Please note that during the treatment, you cannot answer the phone or move around, you must follow the instructions of the aesthetician.",
    "All treatments are designed by professionals according to the age and skin condition of the client, and the effects of the treatments vary from person to person."
  ]

  const afterTreatmentInfo = [
    "It is not recommended to use cosmetics or irritating creams immediately after the treatment.",
    "Within 48 hours after the treatment, Do not use over-heated water for shower or washing your face, drink alcohol, or do strenuous exercise.",
    "Do not use exfoliating products within 7 days, and do not use skin care products containing alcohol or fruit acid to avoid skin sensitivity.",
    "Avoid direct exposure to sunlight within two weeks and use sunscreen with SPF 30 or above; do not go to sauna or have facial massage.",
    "Optical and radiofrequency treatments should not be performed within four weeks."
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <form onSubmit={handleSubmit} className="flex h-full max-h-[90vh] flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Treatment Consent Form</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-6">
              {/* Before Treatment Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Before Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {beforeTreatmentItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`check-${index}`}
                        checked={formData.beforeTreatmentChecks.includes(item)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            beforeTreatmentChecks: checked
                              ? [...prev.beforeTreatmentChecks, item]
                              : prev.beforeTreatmentChecks.filter(i => i !== item)
                          }))
                        }}
                      />
                      <Label htmlFor={`check-${index}`}>{item}</Label>
                    </div>
                  ))}
                  {/* Special input for radiofrequency details */}
                  {formData.beforeTreatmentChecks.includes(beforeTreatmentItems[0]) && (
                    <div className="ml-6">
                      <Label htmlFor="radio-details">Please specify treatment details:</Label>
                      <Input
                        id="radio-details"
                        value={formData.radioFrequencyDetails}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          radioFrequencyDetails: e.target.value
                        }))}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* During Treatment Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Regarding the Treatment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2">
                    {duringTreatmentInfo.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* After Treatment Section */}
              <Card>
                <CardHeader>
                  <CardTitle>After Treatment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">There is no recovery period after the treatment, but you still need to pay attention to the need for self-repair of the subcutaneous tissue. Therefore:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {afterTreatmentInfo.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Agreement Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Agreement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Client Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatment">Treatment Type</Label>
                    <Input
                      id="treatment"
                      value={formData.treatmentType}
                      onChange={(e) => setFormData(prev => ({ ...prev, treatmentType: e.target.value }))}
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I clearly understand all the procedures of this treatment and the precautions before and after the treatment,
                    possible skin reactions, understand and agree to the instructions to be followed during and after the treatment.
                  </p>
                </CardContent>
              </Card>

            </div>
          </ScrollArea>
          <div className="flex justify-end p-4 border-t bg-background">
            <Button type="submit">Sign and Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}
