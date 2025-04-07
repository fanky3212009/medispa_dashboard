"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { day: "Tue 1", confirmed: 1, cancelled: 0 },
  { day: "Wed 2", confirmed: 0, cancelled: 0 },
  { day: "Thu 3", confirmed: 0, cancelled: 0 },
  { day: "Fri 4", confirmed: 3, cancelled: 0 },
  { day: "Sat 5", confirmed: 0, cancelled: 0 },
  { day: "Sun 6", confirmed: 0, cancelled: 0 },
  { day: "Mon 7", confirmed: 0, cancelled: 0 },
]

export function UpcomingAppointments() {
  const bookedCount = 4
  const confirmedCount = 4
  const cancelledCount = 0

  return (
    <div>
      <div className="mb-8">
        <div className="text-4xl font-semibold mb-4">{bookedCount} booked</div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Confirmed appointments {confirmedCount}
          </div>
          <div className="text-sm text-muted-foreground">
            Cancelled appointments {cancelledCount}
          </div>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickCount={4}
            />
            <Bar
              dataKey="confirmed"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="cancelled"
              fill="#ff4d4f"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 