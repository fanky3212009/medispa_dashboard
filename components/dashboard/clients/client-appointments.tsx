import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AppointmentActions } from "@/components/dashboard/appointments/appointment-actions"

interface ClientAppointmentsProps {
  clientId: string
}

export function ClientAppointments({ clientId }: ClientAppointmentsProps) {
  // In a real app, you would fetch the client's appointments from your API
  const appointments = clientAppointments.filter((appointment) => appointment.clientId === clientId)

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">No appointments</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">This client doesn't have any appointments yet.</p>
        <Button>Schedule Appointment</Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
  )
}

const clientAppointments = [
  {
    id: "1",
    clientId: "1",
    dateTime: "Jul 15, 2023 - 2:00 PM",
    service: "Botox Treatment",
    provider: "Dr. Sarah Johnson",
    status: "completed",
    amount: 350.0,
    paymentStatus: "paid",
  },
  {
    id: "2",
    clientId: "1",
    dateTime: "Jun 10, 2023 - 10:30 AM",
    service: "Facial Rejuvenation",
    provider: "Dr. Michael Chen",
    status: "completed",
    amount: 250.0,
    paymentStatus: "paid",
  },
  {
    id: "3",
    clientId: "1",
    dateTime: "Aug 5, 2023 - 3:15 PM",
    service: "Laser Hair Removal",
    provider: "Dr. Sarah Johnson",
    status: "upcoming",
    amount: 200.0,
    paymentStatus: "pending",
  },
  {
    id: "4",
    clientId: "2",
    dateTime: "Jun 30, 2023 - 1:00 PM",
    service: "Chemical Peel",
    provider: "Dr. Michael Chen",
    status: "completed",
    amount: 180.0,
    paymentStatus: "paid",
  },
  {
    id: "5",
    clientId: "3",
    dateTime: "Jul 10, 2023 - 11:45 AM",
    service: "Microdermabrasion",
    provider: "Dr. Sarah Johnson",
    status: "completed",
    amount: 150.0,
    paymentStatus: "paid",
  },
]

