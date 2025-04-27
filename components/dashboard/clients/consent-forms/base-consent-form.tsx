import { useCallback, useRef, useState } from "react"
import { SignaturePad } from "@/components/ui/signature-pad"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { ConsentFormType } from "@/types/consent-form"
import { formatFormType } from "@/lib/utils/format-form-type"

export interface BaseConsentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  clientName: string
  type: ConsentFormType
  onSubmitted?: () => void
}

export function BaseConsentForm({ open, onOpenChange, clientId, clientName, type, onSubmitted, children }: BaseConsentFormProps & { children: React.ReactNode }) {
  const [signature, setSignature] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signature) {
      toast({
        title: "Signature Required",
        description: "Please sign the form to proceed.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData(formRef.current!)
      const jsonData: Record<string, any> = {}

      formData.forEach((value, key) => {
        if (jsonData[key]) {
          if (!Array.isArray(jsonData[key])) {
            jsonData[key] = [jsonData[key]]
          }
          jsonData[key].push(value)
        } else {
          jsonData[key] = value
        }
      })

      const response = await fetch(`/api/clients/${clientId}/consent-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          signature,
          formData: jsonData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast({
        title: "Form Submitted",
        description: "Your consent form has been saved successfully.",
      })
      onSubmitted?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <form ref={formRef} onSubmit={handleSubmit} className="flex h-full max-h-[90vh] flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{formatFormType(type)} Consent Form</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-6">
              {/* Form Content */}
              {children}

              {/* Signature Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Agreement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label>Signature</label>
                      <SignaturePad
                        value={signature}
                        onChange={setSignature}
                        className="min-h-[200px]"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By signing above, I confirm that I have read and understood all the information provided
                      and consent to the treatment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
          <div className="flex justify-end p-4 border-t bg-background">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Sign and Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
