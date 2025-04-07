"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"

export function AppointmentsTableFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-9">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Upcoming</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Date (Newest)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Date (Oldest)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Client Name (A-Z)</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

