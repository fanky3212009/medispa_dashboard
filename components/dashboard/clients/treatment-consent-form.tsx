"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BaseConsentForm, BaseConsentFormProps } from "./consent-forms/base-consent-form"
import { ConsentFormType } from "@/types/consent-form"

interface TreatmentConsentFormProps extends Omit<BaseConsentFormProps, 'type'> {
  type: ConsentFormType
  onSubmitted?: () => void
}

export function TreatmentConsentForm({ type, onSubmitted, ...props }: TreatmentConsentFormProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [radioFrequencyDetails, setRadioFrequencyDetails] = useState("")
  const [treatmentType, setTreatmentType] = useState("")

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
    <BaseConsentForm {...props} type={type} onSubmitted={onSubmitted}>
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
                name="beforeTreatmentChecks"
                value={item}
                checked={checkedItems.includes(item)}
                onCheckedChange={(checked) => {
                  setCheckedItems(prev => checked
                    ? [...prev, item]
                    : prev.filter(i => i !== item)
                  )
                }}
              />
              <Label htmlFor={`check-${index}`}>{item}</Label>
            </div>
          ))}
          {/* Special input for radiofrequency details */}
          {checkedItems.includes(beforeTreatmentItems[0]) && (
            <div className="ml-6">
              <Label htmlFor="radioFrequencyDetails">Please specify treatment details:</Label>
              <Input
                id="radioFrequencyDetails"
                name="radioFrequencyDetails"
                value={radioFrequencyDetails}
                onChange={(e) => setRadioFrequencyDetails(e.target.value)}
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

      {/* Treatment Type */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="treatmentType">Treatment Type</Label>
            <Input
              id="treatmentType"
              name="treatmentType"
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>
    </BaseConsentForm>
  )
}
