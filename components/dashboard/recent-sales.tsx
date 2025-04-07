"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { date: "Mon 24", sales: 0, appointments: 700 },
  { date: "Tue 25", sales: 0, appointments: 200 },
  { date: "Wed 26", sales: 0, appointments: 0 },
  { date: "Thu 27", sales: 0, appointments: 300 },
  { date: "Fri 28", sales: 0, appointments: 1100 },
  { date: "Sat 29", sales: 0, appointments: 1500 },
  { date: "Sun 30", sales: 0, appointments: 0 },
  { date: "Mon 31", sales: 0, appointments: 600 },
]

export function RecentSales() {
  const totalAppointments = 21
  const totalValue = "CA$ 4,346.00"

  return (
    <div>
      <div className="mb-8">
        <div className="text-4xl font-semibold mb-4">CA$ 0</div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Appointments {totalAppointments}
          </div>
          <div className="text-sm text-muted-foreground">
            Appointments value {totalValue}
          </div>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="date" 
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
              tickFormatter={(value) => `CA$ ${value}`}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#2ecc71"
              strokeWidth={2}
              dot={{ fill: "#2ecc71", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 