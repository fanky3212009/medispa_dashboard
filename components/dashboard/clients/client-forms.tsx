import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Download, Eye } from "lucide-react"

interface ClientFormsProps {
  clientId: string
}

export function ClientForms({ clientId }: ClientFormsProps) {
  // In a real app, you would fetch the client's forms from your API
  const forms = clientForms.filter((form) => form.clientId === clientId)

  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">No forms</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">This client hasn't signed any treatment forms yet.</p>
        <Button>Create New Form</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card key={form.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{form.type}</CardTitle>
              <Badge>{form.status}</Badge>
            </div>
            <CardDescription className="flex items-center pt-1">
              <CalendarClock className="mr-1 h-3 w-3" />
              Signed on {form.signedDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{form.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
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
  )
}

const clientForms = [
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

