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

export function ClientsTableFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-9">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Name (A-Z)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Name (Z-A)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Last Visit (Recent)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Last Visit (Oldest)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Balance (High-Low)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Balance (Low-High)</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

