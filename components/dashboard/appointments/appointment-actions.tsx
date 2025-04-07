"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Pencil, FileCheck, CreditCard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  clientId: string
  dateTime: string
  service: string
  provider: string
  status: string
  amount: number
  paymentStatus: string
}

interface AppointmentActionsProps {
  appointment: Appointment
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("balance")
  const { toast } = useToast()

  const handleComplete = () => {
    // In a real app, you would call your API to complete the appointment
    toast({
      title: "Appointment completed",
      description: `Payment processed via ${paymentMethod === "balance" ? "client balance" : "card payment"}.`,
    })
    setIsCompleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/appointments/${appointment.id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          {appointment.status === "upcoming" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCompleteDialogOpen(true)}>
                <FileCheck className="mr-2 h-4 w-4" />
                Complete & Checkout
              </DropdownMenuItem>
              <DropdownMenuItem>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
            <DialogDescription>Mark this appointment as completed and process payment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Payment Method</h4>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balance" id="balance" />
                  <Label htmlFor="balance">Deduct from client balance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Process card payment</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <p className="text-sm font-medium">Amount to charge:</p>
              <p className="text-lg font-bold">${appointment.amount.toFixed(2)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              <CreditCard className="mr-2 h-4 w-4" />
              Complete & Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

