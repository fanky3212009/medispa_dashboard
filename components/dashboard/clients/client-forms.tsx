"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Download, Eye } from "lucide-react"
import { TreatmentConsentForm } from "./treatment-consent-form"
import { FormViewer } from "./form-viewer"

interface ClientFormsProps {
  clientId: string
}

export function ClientForms({ clientId }: ClientFormsProps) {
  const [showConsentForm, setShowConsentForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedForm, setSelectedForm] = useState<any>(null)

  // In a real app, you would fetch the client's forms from your API
  const forms = clientForms.filter((form) => form.clientId === clientId)

  const handleNewForm = () => {
    setShowConsentForm(true)
  }

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data)
    // In a real app, you would save this to your API
    setShowConsentForm(false)
  }

  if (forms.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h3 className="mt-2 text-lg font-semibold">No forms</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">This client hasn't signed any treatment forms yet.</p>
          <Button onClick={handleNewForm}>Create New Form</Button>
        </div>
        <TreatmentConsentForm
          open={showConsentForm}
          onOpenChange={setShowConsentForm}
          onSubmit={handleFormSubmit}
          clientName=""
        />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{form.type}</CardTitle>
                <Badge variant={form.status === "signed" ? "default" : "secondary"}>
                  {form.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center pt-1">
                <CalendarClock className="mr-1 h-3 w-3" />
                {form.status === "signed" ? `Signed on ${form.signedDate}` : "Not signed"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{form.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedForm({
                    ...form,
                    name: "John Doe", // In real app, get from form data
                    treatmentType: form.type,
                    beforeTreatmentChecks: ["Have used medications within the past two weeks"],
                  })
                  setShowViewer(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              {form.status === "signed" && (
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <TreatmentConsentForm
        open={showConsentForm}
        onOpenChange={setShowConsentForm}
        onSubmit={handleFormSubmit}
        clientName=""
      />
      {selectedForm && (
        <FormViewer
          open={showViewer}
          onOpenChange={setShowViewer}
          form={selectedForm}
        />
      )}
    </>
  )
}

const clientForms = [
  {
    id: "form_template",
    clientId: "all",
    type: "Treatment Consent Form",
    status: "template",
    signedDate: "-",
    description: "Standard treatment consent form including pre/post treatment requirements and conditions.",
  },
  {
    id: "1",
    clientId: "1",
    type: "Botox Consent Form",
    status: "signed",
    signedDate: "Jul 15, 2023",
    description: "Consent form for Botox treatment including risks, benefits, and aftercare instructions.",
  },
  {
    id: "2",
    clientId: "1",
    type: "Facial Rejuvenation Consent",
    status: "signed",
    signedDate: "Jun 10, 2023",
    description: "Consent form for facial rejuvenation treatment including procedure details and expected outcomes.",
  },
  {
    id: "3",
    clientId: "1",
    type: "Medical History Form",
    status: "signed",
    signedDate: "May 5, 2023",
    description: "Comprehensive medical history including allergies, medications, and previous treatments.",
  },
  {
    id: "4",
    clientId: "2",
    type: "Chemical Peel Consent",
    status: "signed",
    signedDate: "Jun 30, 2023",
    description: "Consent form for chemical peel treatment including potential side effects and recovery process.",
  },
  {
    id: "5",
    clientId: "3",
    type: "Microdermabrasion Consent",
    status: "signed",
    signedDate: "Jul 10, 2023",
    description: "Consent form for microdermabrasion treatment including procedure details and aftercare.",
  },
]
