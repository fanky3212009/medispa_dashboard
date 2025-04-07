import type { Metadata } from "next"
import { NewClientForm } from "@/components/dashboard/clients/new-client-form"

export const metadata: Metadata = {
  title: "New Client | SkinPlus Medical Spa",
  description: "Add a new client to your medical spa",
}

export default function NewClientPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Client</h1>
        <p className="text-muted-foreground">Add a new client to your medical spa</p>
      </div>

      <NewClientForm />
    </div>
  )
}

