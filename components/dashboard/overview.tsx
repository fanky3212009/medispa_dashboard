"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    appointments: 45,
    revenue: 4000,
  },
  {
    name: "Feb",
    appointments: 52,
    revenue: 4500,
  },
  {
    name: "Mar",
    appointments: 48,
    revenue: 5000,
  },
  {
    name: "Apr",
    appointments: 61,
    revenue: 5500,
  },
  {
    name: "May",
    appointments: 55,
    revenue: 5700,
  },
  {
    name: "Jun",
    appointments: 67,
    revenue: 6000,
  },
  {
    name: "Jul",
    appointments: 70,
    revenue: 6200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

