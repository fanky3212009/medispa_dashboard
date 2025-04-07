import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AppointmentActions } from "@/components/dashboard/appointments/appointment-actions"
import { AppointmentsTableFilter } from "@/components/dashboard/appointments/table-filter"

export const metadata: Metadata = {
  title: "Appointments | SkinPlus Medical Spa",
  description: "Manage your appointments",
}

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage client appointments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search appointments..." className="pl-8" />
        </div>
        <AppointmentsTableFilter />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.client}</TableCell>
                <TableCell>{appointment.dateTime}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.provider}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "default"
                        : appointment.status === "upcoming"
                          ? "outline"
                          : appointment.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>${appointment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <AppointmentActions appointment={appointment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const appointments = [
  {
    id: "1",
    client: "Olivia Martin",
    clientId: "1",
    dateTime: "Today, 2:00 PM",
    service: "Botox Treatment",
    provider: "Dr. Sarah Johnson",
    status: "completed",
    amount: 350.0,
    paymentStatus: "paid",
  },
  {
    id: "2",
    client: "Jackson Lee",
    clientId: "2",
    dateTime: "Tomorrow, 10:00 AM",
    service: "Facial Rejuvenation",
    provider: "Dr. Michael Chen",
    status: "upcoming",
    amount: 250.0,
    paymentStatus: "pending",
  },
  {
    id: "3",
    client: "Isabella Nguyen",
    clientId: "3",
    dateTime: "Yesterday, 3:30 PM",
    service: "Laser Hair Removal",
    provider: "Dr. Sarah Johnson",
    status: "cancelled",
    amount: 200.0,
    paymentStatus: "refunded",
  },
  {
    id: "4",
    client: "William Kim",
    clientId: "4",
    dateTime: "Jul 20, 11:30 AM",
    service: "Chemical Peel",
    provider: "Dr. Michael Chen",
    status: "upcoming",
    amount: 180.0,
    paymentStatus: "pending",
  },
  {
    id: "5",
    client: "Sophia Rodriguez",
    clientId: "5",
    dateTime: "Jul 18, 1:15 PM",
    service: "Microdermabrasion",
    provider: "Dr. Sarah Johnson",
    status: "upcoming",
    amount: 150.0,
    paymentStatus: "pending",
  },
]

