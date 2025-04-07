"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      animate
      captionLayout="dropdown"
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
