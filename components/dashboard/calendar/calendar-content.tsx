"use client"

import { useState } from "react"
import { CalendarView } from "@/components/dashboard/calendar/calendar-view"
import { CalendarHeader } from "@/components/dashboard/calendar/calendar-header"
import { BottomNav } from "@/components/dashboard/bottom-nav"

export function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <CalendarHeader date={currentDate} onDateChange={setCurrentDate} />
      <CalendarView selectedDate={currentDate} onDateChange={setCurrentDate} />
      <BottomNav />
    </div>
  )
} 