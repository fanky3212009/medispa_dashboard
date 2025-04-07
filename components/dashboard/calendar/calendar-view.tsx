"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Smile, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { format, addDays, isSameDay, startOfDay } from "date-fns"

// Mock data for appointments
const appointments = [
  {
    id: "1",
    clientName: "Olivia Martin",
    startTime: "9:00",
    endTime: "10:00",
    service: "Botox Treatment",
    color: "bg-blue-200 text-blue-800",
    date: new Date(2025, 3, 15), // April 15, 2025
  },
  {
    id: "2",
    clientName: "Jackson Lee",
    startTime: "11:00",
    endTime: "12:00",
    service: "Facial Rejuvenation",
    color: "bg-green-200 text-green-800",
    date: new Date(2025, 3, 15), // April 15, 2025
  },
  {
    id: "3",
    clientName: "Isabella Nguyen",
    startTime: "13:30",
    endTime: "14:30",
    service: "Laser Hair Removal",
    color: "bg-purple-200 text-purple-800",
    date: new Date(2025, 3, 16), // April 16, 2025
  },
  {
    id: "4",
    clientName: "William Kim",
    startTime: "15:00",
    endTime: "16:00",
    service: "Chemical Peel",
    color: "bg-yellow-200 text-yellow-800",
  },
  {
    id: "5",
    clientName: "Sophia Rodriguez",
    startTime: "16:30",
    endTime: "17:30",
    service: "Microdermabrasion",
    color: "bg-pink-200 text-pink-800",
  },
]

// Time slots from 8am to 8pm
const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8
  return hour > 12 ? `${hour - 12}:00\npm` : `${hour}:00\nam`
})

interface CalendarViewProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function CalendarView({ selectedDate, onDateChange }: CalendarViewProps) {
  const router = useRouter()

  const handleCreateAppointment = () => {
    router.push("/dashboard/appointments/new")
  }

  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")

  // Filter appointments for the selected date
  const appointmentsForDate = appointments.filter(appointment =>
    appointment.date && isSameDay(appointment.date, selectedDate)
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-4 border-b">
        <h2 className="text-xl font-semibold">{formattedDate}</h2>
        <div className="flex gap-2 mt-2">
          {[-2, -1, 0, 1, 2].map((dayOffset) => {
            const date = addDays(selectedDate, dayOffset)
            const isToday = isSameDay(date, selectedDate)
            return (
              <Button
                key={dayOffset}
                variant={isToday ? "default" : "outline"}
                className="min-w-[40px]"
                onClick={() => onDateChange(date)}
              >
                {format(date, "d")}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {timeSlots.map((timeSlot, index) => {
          const [time, period] = timeSlot.split("\n")
          const hour = Number.parseInt(time.split(":")[0])
          const hourIn24 = period === "pm" && hour !== 12 ? hour + 12 : hour

          const appointmentsAtTime = appointmentsForDate.filter((app) => {
            const appHour = Number.parseInt(app.startTime.split(":")[0])
            return appHour === hourIn24
          })

          return (
            <div key={index} className="flex border-b min-h-[100px]">
              <div className="w-20 flex-shrink-0 p-2 flex flex-col items-center justify-center border-r">
                <div className="text-lg font-semibold">{time}</div>
                <div className="text-sm text-muted-foreground">{period}</div>
              </div>
              <div className="flex-1 p-2 relative">
                {appointmentsAtTime.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={cn("p-3 rounded-md mb-2 cursor-pointer hover:opacity-90", appointment.color)}
                    onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                  >
                    <div className="font-medium">
                      {appointment.startTime} - {appointment.endTime} {appointment.clientName}
                    </div>
                    {appointment.service && <div className="text-sm">{appointment.service}</div>}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-around p-4 border-t bg-white">
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Calendar</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <Tag className="h-6 w-6" />
          <span className="text-xs">Tags</span>
        </Button>
        <Button
          onClick={handleCreateAppointment}
          className="flex flex-col items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground -mt-10"
        >
          <Plus className="h-8 w-8" />
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <Smile className="h-6 w-6" />
          <span className="text-xs">Clients</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
          </div>
          <span className="text-xs">More</span>
        </Button>
      </div>
    </div>
  )
}

