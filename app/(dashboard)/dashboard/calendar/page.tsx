import type { Metadata } from "next"
import { CalendarContent } from "@/components/dashboard/calendar/calendar-content"

export const metadata: Metadata = {
  title: "Calendar | SkinPlus Medical Spa",
  description: "Appointment Calendar",
}

export default function CalendarPage() {
  return <CalendarContent />
}

