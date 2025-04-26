"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConsentFormType } from "@/types/consent-form"
import { formatFormType, getFormDescription } from "@/lib/utils/format-form-type"

interface FormTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (type: ConsentFormType) => void
  existingFormTypes?: ConsentFormType[]
}

export function FormTypeDialog({ open, onOpenChange, onSelect, existingFormTypes = [] }: FormTypeDialogProps) {
  const [selectedType, setSelectedType] = useState<ConsentFormType>("GENERAL_TREATMENT")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSelect(selectedType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Consent Form Type</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {selectedType ? getFormDescription(selectedType) : "Choose a consent form type to create."}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as ConsentFormType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select form type" />
            </SelectTrigger>
            <SelectContent>
              {(["GENERAL_TREATMENT", "BOTOX", "FILLER"] as ConsentFormType[]).map((type) => (
                <SelectItem key={type} value={type} disabled={existingFormTypes.includes(type)}>
                  {formatFormType(type)} {existingFormTypes.includes(type) && "(Signed)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {existingFormTypes.length > 0 ? "Forms marked as (Signed) have already been completed." : "No forms have been signed yet."}
          </p>
          <div className="flex justify-end">
            <Button type="submit">Create Form</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
