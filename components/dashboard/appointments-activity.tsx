import { ChevronRight } from "lucide-react"

const appointments = [
  {
    id: 1,
    date: "14 Apr",
    time: "1:00pm",
    service: "Revlite laser",
    client: "janice",
    duration: "1h",
    staff: "Kate",
    price: "CA$ 520",
    status: "BOOKED"
  },
  {
    id: 2,
    date: "04 Apr",
    time: "2:00pm",
    service: "SYNA韓國無創氣墊針",
    client: "Kelly Sin",
    duration: "1h",
    staff: "Kate",
    price: "CA$ 380",
    status: "BOOKED",
    note: "DEP"
  },
  {
    id: 3,
    date: "31 Mar",
    time: "5:00pm",
    service: "SkinTag Removal",
    client: "Valerie Tang",
    duration: "1h",
    staff: "Kate",
    price: "From CA$ 200",
    status: "BOOKED"
  }
]

export function AppointmentsActivity() {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="font-semibold">{appointment.date.split(" ")[0]}</div>
              <div className="text-sm text-muted-foreground">{appointment.date.split(" ")[1]}</div>
            </div>
            <div>
              <div className="font-semibold">{appointment.service}</div>
              <div className="text-sm text-muted-foreground">
                {appointment.client}, {appointment.duration} with {appointment.staff}
              </div>
              {appointment.note && (
                <div className="text-sm italic">{appointment.note}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm">{appointment.price}</div>
              <div className="text-xs text-blue-500">{appointment.status}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  )
} 