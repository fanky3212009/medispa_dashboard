"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  balance: number
}

interface ClientBalanceProps {
  client: Client
}

export function ClientBalance({ client }: ClientBalanceProps) {
  const [amount, setAmount] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleTopUp = () => {
    // In a real app, you would call your API to update the client's balance
    toast({
      title: "Balance updated",
      description: `Added $${amount} to ${client.name}'s balance.`,
    })
    setAmount("")
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
        <CardDescription>Client's current balance and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
          <p className="text-4xl font-bold">${client.balance.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Top Up Balance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Balance</DialogTitle>
              <DialogDescription>Add funds to {client.name}'s account balance.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleTopUp} disabled={!amount || Number.parseFloat(amount) <= 0}>
                Add Funds
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

