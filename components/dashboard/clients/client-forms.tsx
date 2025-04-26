"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FormTypeDialog } from "./consent-forms/form-type-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Download, Eye } from "lucide-react"
import { TreatmentConsentForm } from "./treatment-consent-form"
import { FormViewer } from "./form-viewer"
import { ConsentForm, ConsentFormType } from "@/types/consent-form"
import { formatFormType, getFormDescription } from "@/lib/utils/format-form-type"

interface ClientFormsProps {
  clientId: string
  clientName: string
}

export function ClientForms({ clientId, clientName }: ClientFormsProps) {
  const [showTypeDialog, setShowTypeDialog] = useState(false)
  const [showConsentForm, setShowConsentForm] = useState(false)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null)
  const [forms, setForms] = useState<ConsentForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<ConsentFormType>("GENERAL_TREATMENT")

  const fetchForms = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/consent-forms`)
      if (!response.ok) throw new Error('Failed to fetch forms')
      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [clientId])

  const handleFormSubmitted = () => {
    setShowConsentForm(false)
    setShowTypeDialog(false)
    fetchForms()
  }

  const handleTypeSelect = (type: ConsentFormType) => {
    setSelectedType(type)
    setShowConsentForm(true)
  }

  const handleNewForm = () => {
    setShowTypeDialog(true)
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="text-sm text-muted-foreground">Loading forms...</div>
        </div>
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h3 className="mt-2 text-lg font-semibold">No forms</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">This client hasn't signed any treatment forms yet.</p>
          <Button onClick={handleNewForm}>Create New Form</Button>
        </div>
        <FormTypeDialog
          open={showTypeDialog}
          onOpenChange={setShowTypeDialog}
          onSelect={handleTypeSelect}
          existingFormTypes={forms.map(form => form.type as ConsentFormType)}
        />
        <TreatmentConsentForm
          open={showConsentForm}
          onOpenChange={setShowConsentForm}
          clientId={clientId}
          clientName={clientName}
          type={selectedType}
          onSubmitted={handleFormSubmitted}
        />
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Consent Forms</h2>
        <Button onClick={handleNewForm}>Add Form</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{formatFormType(form.type as ConsentFormType)}</CardTitle>
                <Badge>Signed</Badge>
              </div>
              <CardDescription className="flex items-center pt-1">
                <CalendarClock className="mr-1 h-3 w-3" />
                {new Date(form.signedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getFormDescription(form.type as ConsentFormType)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedForm(form)
                  setShowViewer(true)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <FormTypeDialog
        open={showTypeDialog}
        onOpenChange={setShowTypeDialog}
        onSelect={handleTypeSelect}
        existingFormTypes={forms.map(form => form.type as ConsentFormType)}
      />
      <TreatmentConsentForm
        open={showConsentForm}
        onOpenChange={setShowConsentForm}
        clientId={clientId}
        clientName={clientName}
        type={selectedType}
        onSubmitted={handleFormSubmitted}
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
