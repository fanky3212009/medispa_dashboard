import type { Metadata } from "next"
import { NewServiceForm } from "@/components/dashboard/services/new-service-form"

export const metadata: Metadata = {
  title: "New Service | SkinPlus Medical Spa",
  description: "Add a new service to your medical spa",
}

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Service</h1>
        <p className="text-muted-foreground">Add a new service to your medical spa</p>
      </div>

      <NewServiceForm />
    </div>
  )
}

