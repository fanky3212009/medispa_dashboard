import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, Edit, FileCheck, Trash, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Appointment Details | SkinPlus Medical Spa",
  description: "View appointment details",
}

interface AppointmentPageProps {
  params: Promise<{
    id: string
  }>
}

// Mock data for appointments
const appointments = [
  {
    id: "1",
    client: {
      id: "1",
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder-user.jpg",
    },
    date: "2023-07-15",
    time: "14:00",
    endTime: "15:00",
    service: "Botox Treatment",
    provider: "Dr. Sarah Johnson",
    status: "completed",
    amount: 350.0,
    paymentStatus: "paid",
    notes: "Client requested extra attention to forehead area. Follow-up in 2 weeks.",
  },
  {
    id: "2",
    client: {
      id: "2",
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      phone: "+1 (555) 987-6543",
      avatar: "/placeholder-user.jpg",
    },
    date: "2023-07-16",
    time: "10:00",
    endTime: "11:00",
    service: "Facial Rejuvenation",
    provider: "Dr. Michael Chen",
    status: "upcoming",
    amount: 250.0,
    paymentStatus: "pending",
    notes: "First-time client. Mentioned sensitivity to certain products.",
  },
]

export default async function AppointmentPage({ params }: AppointmentPageProps) {
  const { id } = await params
  // In a real app, you would fetch the appointment data from your API
  const appointment = appointments.find((a) => a.id === id)

  if (!appointment) {
    notFound()
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Details</h1>
          <p className="text-muted-foreground">View and manage appointment information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/appointments/${appointment.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {appointment.status === "upcoming" && (
            <Button variant="default">
              <FileCheck className="mr-2 h-4 w-4" />
              Complete
            </Button>
          )}
          {appointment.status === "upcoming" && (
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
            <CardDescription>Details about the appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{formattedDate}</p>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>
                    {appointment.time} - {appointment.endTime}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge
                  variant={
                    appointment.status === "completed"
                      ? "default"
                      : appointment.status === "upcoming"
                        ? "outline"
                        : "destructive"
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Service</p>
              <p>{appointment.service}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider</p>
              <p>{appointment.provider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                <p className="font-semibold">{appointment.amount.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
              <Badge
                variant={
                  appointment.paymentStatus === "paid"
                    ? "default"
                    : appointment.paymentStatus === "pending"
                      ? "outline"
                      : "destructive"
                }
              >
                {appointment.paymentStatus}
              </Badge>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Details about the client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={appointment.client.avatar} alt={appointment.client.name} />
                <AvatarFallback>{appointment.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{appointment.client.name}</h3>
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href={`/dashboard/clients/${appointment.client.id}`}>
                    <User className="mr-1 h-4 w-4" />
                    View Client Profile
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{appointment.client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{appointment.client.phone}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

