"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClient } from "@/lib/services/clients"
import { Client, ClientProfileProps } from "@/types/client"
import { toast } from "sonner"

export function ClientProfile({ client }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingFunds, setIsAddingFunds] = useState(false)
  const [editedClient, setEditedClient] = useState<Client>(client)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    try {
      const updateData = {
        name: editedClient.name,
        email: editedClient.email,
        phone: editedClient.phone,
        occupation: editedClient.occupation || undefined,
        maritalStatus: editedClient.maritalStatus || undefined,
        dob: editedClient.dob ? new Date(editedClient.dob).toISOString() : undefined,
        gender: editedClient.gender || undefined,
        referredBy: editedClient.referredBy || undefined,
        consultant: editedClient.consultant || undefined
      }
      await updateClient(client.id, updateData)
      setIsEditing(false)
      toast.success('Client information updated successfully')
      // Refresh the client data without full page reload
      window.location.reload()
    } catch (error) {
      console.error('Error updating client:', error)
      toast.error('Failed to update client information')
    }
  }

  const handleAddFunds = async () => {
    try {
      setIsLoading(true)
      // Convert amount to a fixed decimal string to ensure proper decimal handling
      const newBalance = (Number(client.balance) + Number(amount)).toFixed(2)
      await updateClient(client.id, { balance: Number(newBalance) })
      setEditedClient(prev => ({
        ...prev,
        balance: Number(newBalance)
      }))
      toast.success(`Successfully added CA$ ${Number(amount).toFixed(2)} to balance`)
      setIsAddingFunds(false)
      setAmount("")
    } catch (error) {
      console.error('Error adding funds:', error)
      toast.error('Failed to add funds to balance')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Client Information</CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Client Information</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedClient.name}
                    onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedClient.phone}
                    onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editedClient.email}
                    onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={editedClient.occupation || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, occupation: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={editedClient.maritalStatus}
                    onValueChange={(value) => setEditedClient({ ...editedClient, maritalStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consultant">Consultant</Label>
                  <Input
                    id="consultant"
                    value={editedClient.consultant || ''}
                    onChange={(e) => setEditedClient({ ...editedClient, consultant: e.target.value })}
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 bg-purple-100">
              <AvatarFallback className="text-primary text-2xl">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-muted-foreground">{client.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p>{new Date(client.dob).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p>{client.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Occupation</p>
              <p>{client.occupation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
              <p>{client.maritalStatus}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Referred By</p>
              <p>{client.referredBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Consultant</p>
              <p>{client.consultant}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skin Assessment</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Skin Assessment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="skinType">Skin Type</Label>
                  <Select
                    value={client.skinAssessment?.skinType}
                    onValueChange={(value) => {
                      // Handle skin type change
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Oily">Oily</SelectItem>
                      <SelectItem value="Sensitive">Sensitive</SelectItem>
                      <SelectItem value="Combination">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Add more skin assessment fields */}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Skin Type</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Dry", "Normal", "Oily", "Sensitive", "Combination"].map((type) => (
                  <div
                    key={type}
                    className={`border rounded-md p-2 text-center ${client.skinAssessment?.skinType === type ? "bg-muted" : ""
                      }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Skin Texture</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Fine", "Normal", "Coarse"].map((texture) => (
                  <div
                    key={texture}
                    className={`border rounded-md p-2 text-center ${client.skinAssessment?.skinTexture === texture ? "bg-muted" : ""
                      }`}
                  >
                    {texture}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Skin Tone</h3>
              <div className="grid grid-cols-3 gap-2">
                {["Light", "Medium", "Dark"].map((tone) => (
                  <div
                    key={tone}
                    className={`border rounded-md p-2 text-center ${client.skinAssessment?.skinTone === tone ? "bg-muted" : ""
                      }`}
                  >
                    {tone}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Previous Treatments</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Laser", "Chemical Peel", "Microdermabrasion", "Botox"].map((treatment) => (
                  <div
                    key={treatment}
                    className={`border rounded-md p-2 text-center ${client.skinAssessment?.treatments.includes(treatment) ? "bg-muted" : ""
                      }`}
                  >
                    {treatment}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Balance & Payments</CardTitle>
          <div className="flex gap-2">
            <Dialog open={isAddingFunds} onOpenChange={setIsAddingFunds}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Funds</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (CA$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddFunds}
                    disabled={!amount || Number(amount) <= 0 || isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Funds"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              View History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Balance</h3>
              <p className="text-2xl font-bold">CA$ {Number(editedClient.balance).toFixed(2)}</p>
            </div>
            <div>
              <Button asChild>
                <Link href={`/dashboard/appointments/new?client=${client.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

