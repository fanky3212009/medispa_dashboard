import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentAppointments() {
  const appointments = [
    {
      id: "1",
      client: {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        avatar: "/placeholder-user.jpg",
      },
      service: "Botox Treatment",
      status: "completed",
      date: "Today, 2:00 PM",
    },
    {
      id: "2",
      client: {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        avatar: "/placeholder-user.jpg",
      },
      service: "Facial Rejuvenation",
      status: "upcoming",
      date: "Tomorrow, 10:00 AM",
    },
    {
      id: "3",
      client: {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "/placeholder-user.jpg",
      },
      service: "Laser Hair Removal",
      status: "cancelled",
      date: "Yesterday, 3:30 PM",
    },
    {
      id: "4",
      client: {
        name: "William Kim",
        email: "william.kim@email.com",
        avatar: "/placeholder-user.jpg",
      },
      service: "Chemical Peel",
      status: "upcoming",
      date: "Jul 20, 11:30 AM",
    },
  ]

  return (
    <div className="space-y-8">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={appointment.client.avatar} alt={appointment.client.name} />
            <AvatarFallback>{appointment.client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{appointment.client.name}</p>
            <p className="text-sm text-muted-foreground">{appointment.service}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge
              variant={
                appointment.status === "completed"
                  ? "default"
                  : appointment.status === "upcoming"
                    ? "outline"
                    : "destructive"
              }
              className="mb-1"
            >
              {appointment.status}
            </Badge>
            <p className="text-xs text-muted-foreground">{appointment.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

