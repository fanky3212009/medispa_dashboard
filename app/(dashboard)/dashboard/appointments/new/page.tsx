import type { Metadata } from "next"
import { NewAppointmentForm } from "@/components/dashboard/appointments/new-appointment-form"

export const metadata: Metadata = {
  title: "New Appointment | SkinPlus Medical Spa",
  description: "Create a new appointment",
}

export default function NewAppointmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Appointment</h1>
        <p className="text-muted-foreground">Create a new appointment for a client</p>
      </div>

      <NewAppointmentForm />
    </div>
  )
}

