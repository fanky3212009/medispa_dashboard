"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronDown, Filter, Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarHeader({ date, onDateChange }: { 
  date: Date
  onDateChange: (date: Date) => void 
}) {
  const { user } = useAuth()
  const formattedDate = format(date, "MMMM yyyy")

  const handlePreviousMonth = () => {
    onDateChange(subMonths(date, 1))
  }

  const handleNextMonth = () => {
    onDateChange(addMonths(date, 1))
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="text-xl font-semibold">{formattedDate}</span>
              <ChevronDown className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" onClick={handlePreviousMonth}>
                Previous Month
              </Button>
              <Button variant="ghost" onClick={() => onDateChange(new Date())}>
                Current Month
              </Button>
              <Button variant="ghost" onClick={handleNextMonth}>
                Next Month
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative flex-1 max-w-sm mx-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search appointments..." className="pl-9" />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Avatar className="h-10 w-10 bg-primary/10">
          <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "User"} />
          <AvatarFallback className="text-primary">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "JD"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

