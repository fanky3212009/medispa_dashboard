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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { updateClient } from "@/lib/services/clients"
import { Client, ClientProfileProps, SerializedClient } from "@/types/client"
import { toast } from "sonner"

export function ClientProfile({ client }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingFunds, setIsAddingFunds] = useState(false)
  const [isEditingIntake, setIsEditingIntake] = useState(false)
  const [editedClient, setEditedClient] = useState<SerializedClient>(client)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [patientIntake, setPatientIntake] = useState<any>(client.patientIntake || {
    skinType: '',
    wrinkleType: '',
    bloodCirculation: '',
    skinElasticity: '',
    skinTone: '',
    skinThickness: '',
    poreSize: '',
    laser: false,
    ipl: false,
    radiofrequency: false,
    electricalCurrent: false,
    peel: false,
    hydrafacial: false,
    aestheticTreatmentDate: '',
    hyaluronicAcid: false,
    botulinumToxin: false,
    growthFactors: false,
    lacticAcid: false,
    microInvasiveOther: '',
    microInvasiveDate: '',
    satisfactionLevel: '',
    facelift: false,
    prosthesis: false,
    doubleEyelid: false,
    boneShaving: false,
    breastImplants: false,
    liposuction: false,
    plasticSurgeryOther: '',
    plasticSurgeryDate: '',
    heartDisease: false,
    highBloodPressure: false,
    diabetes: false,
    pacemaker: false,
    cancer: false,
    cancerName: '',
    cancerDate: '',
    orthodontics: false,
    orthodonticsName: '',
    orthodonticsDate: '',
    immuneSystemCondition: false,
    immuneSystemDetails: '',
    surgery: false,
    surgeryName: '',
    surgeryDate: '',
    currentlyPregnant: false,
    sensitiveToLight: false,
    lightSensitivityDetails: '',
    substanceAllergies: false,
    allergyDetails: '',
    longTermMedication: false,
    medicationDetails: '',
    implants: false,
    metalStent: false,
    threadLifting: false,
    hypertrophicScar: false
  })

  const handleSave = async () => {
    try {
      const updateData = {
        name: editedClient.name,
        email: editedClient.email ?? undefined,
        phone: editedClient.phone || undefined,
        occupation: editedClient.occupation || undefined,
        maritalStatus: editedClient.maritalStatus || undefined,
        dob: editedClient.dob ? new Date(editedClient.dob).toISOString() : undefined,
        gender: editedClient.gender || undefined,
        referredBy: editedClient.referredBy || undefined,
        consultant: editedClient.consultant || undefined,
        ohipNumber: editedClient.ohipNumber || undefined,
        insuranceCompany: editedClient.insuranceCompany || undefined,
        balance: editedClient.balance ? parseFloat(editedClient.balance) : undefined,
        notes: editedClient.notes || undefined
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

      // Create a treatment record for the fund addition
      const response = await fetch(`/api/clients/${client.id}/treatment-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          staffName: 'System', // Or could be the logged-in user's name
          notes: 'Added funds to balance',
          type: 'FUND_ADDITION',
          treatments: [{ name: 'Fund Addition', price: Number(amount) }],
          totalAmount: Number(amount),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add funds')
      }

      const data = await response.json()
      toast.success(`Successfully added CA$ ${Number(amount).toFixed(2)} to balance`)
      setIsAddingFunds(false)
      setAmount("")

      // Refresh page to show updated balance
      window.location.reload()
    } catch (error) {
      console.error('Error adding funds:', error)
      toast.error('Failed to add funds to balance')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveIntake = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/clients/${client.id}/patient-intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientIntake),
      })

      if (!response.ok) {
        throw new Error('Failed to save patient intake')
      }

      toast.success('Patient intake information saved successfully')
      setIsEditingIntake(false)
      window.location.reload()
    } catch (error) {
      console.error('Error saving patient intake:', error)
      toast.error('Failed to save patient intake information')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  return (
    <>

      <div>
        <div className="space-y-6">
          {/* Client Information Section */}
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
                        value={editedClient.phone ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editedClient.email ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={editedClient.occupation ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, occupation: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={editedClient.maritalStatus ?? undefined}
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
                        value={editedClient.consultant ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, consultant: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ohipNumber">OHIP Number</Label>
                      <Input
                        id="ohipNumber"
                        value={editedClient.ohipNumber ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, ohipNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="insuranceCompany">Insurance Company</Label>
                      <Input
                        id="insuranceCompany"
                        value={editedClient.insuranceCompany ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, insuranceCompany: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editedClient.notes ?? ''}
                        onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                        className="resize-none"
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
                  <p>{formatDate(client.dob)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p>{client.gender ?? 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                  <p>{client.occupation ?? 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                  <p>{client.maritalStatus ?? 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Referred By</p>
                  <p>{client.referredBy ?? 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consultant</p>
                  <p>{client.consultant ?? 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">OHIP Number</p>
                  <p>{client.ohipNumber ?? 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Insurance Company</p>
                  <p>{client.insuranceCompany ?? 'Not set'}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{client.notes ?? 'No notes'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>

        {/* Medical & Aesthetic History Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Medical & Aesthetic History</CardTitle>
            <Dialog open={isEditingIntake} onOpenChange={setIsEditingIntake}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  {client.patientIntake ? 'Edit' : 'Add'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Patient Intake Information</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">

                  {/* Skin Condition Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Skin Condition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Skin Type</Label>
                        <Select value={patientIntake.skinType} onValueChange={(value) => setPatientIntake({ ...patientIntake, skinType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skin type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dry">Dry</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem>
                            <SelectItem value="Oily">Oily</SelectItem>
                            <SelectItem value="Sensitive">Sensitive</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Wrinkle Type</Label>
                        <Select value={patientIntake.wrinkleType} onValueChange={(value) => setPatientIntake({ ...patientIntake, wrinkleType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select wrinkle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fine">Fine</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Thick">Thick</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Skin Tone</Label>
                        <Select value={patientIntake.skinTone} onValueChange={(value) => setPatientIntake({ ...patientIntake, skinTone: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skin tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Dark">Dark</SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Tan">Tan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Blood Circulation</Label>
                        <Select value={patientIntake.bloodCirculation} onValueChange={(value) => setPatientIntake({ ...patientIntake, bloodCirculation: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select circulation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Skin Thickness</Label>
                        <Select value={patientIntake.skinThickness} onValueChange={(value) => setPatientIntake({ ...patientIntake, skinThickness: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select thickness" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Thin">Thin</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Thick">Thick</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Pore Size</Label>
                        <Select value={patientIntake.poreSize} onValueChange={(value) => setPatientIntake({ ...patientIntake, poreSize: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pore size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Small">Small</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Skin Elasticity</Label>
                        <Select value={patientIntake.skinElasticity} onValueChange={(value) => setPatientIntake({ ...patientIntake, skinElasticity: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select elasticity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Poor">Poor</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Previous Aesthetic Treatments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Previous Aesthetic Treatments Received</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: 'laser', label: 'Laser' },
                        { key: 'ipl', label: 'IPL (Intense Pulsed Light)' },
                        { key: 'radiofrequency', label: 'Radiofrequency' },
                        { key: 'electricalCurrent', label: 'Electrical Current' },
                        { key: 'peel', label: 'Peel' },
                        { key: 'hydrafacial', label: 'Hydrafacial' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={patientIntake[key] || false}
                            onCheckedChange={(checked) => setPatientIntake({ ...patientIntake, [key]: checked })}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label>Treatment Date</Label>
                      <Input
                        value={patientIntake.aestheticTreatmentDate || ''}
                        onChange={(e) => setPatientIntake({ ...patientIntake, aestheticTreatmentDate: e.target.value })}
                        placeholder="Enter date"
                      />
                    </div>
                  </div>

                  {/* Previous Micro-Invasive Treatments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Previous Micro-Invasive Treatments Received (Treatment Area)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'hyaluronicAcid', label: 'Hyaluronic Acid' },
                        { key: 'botulinumToxin', label: 'Botulinum toxin' },
                        { key: 'growthFactors', label: 'Growth Factors' },
                        { key: 'lacticAcid', label: 'Lactic Acid' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={patientIntake[key] || false}
                            onCheckedChange={(checked) => setPatientIntake({ ...patientIntake, [key]: checked })}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Other</Label>
                        <Input
                          value={patientIntake.microInvasiveOther || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, microInvasiveOther: e.target.value })}
                          placeholder="Specify other treatment"
                        />
                      </div>
                      <div>
                        <Label>Treatment Date</Label>
                        <Input
                          value={patientIntake.microInvasiveDate || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, microInvasiveDate: e.target.value })}
                          placeholder="Enter date"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Satisfaction Level</Label>
                      <Select value={patientIntake.satisfactionLevel} onValueChange={(value) => setPatientIntake({ ...patientIntake, satisfactionLevel: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select satisfaction level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Previous Plastic Surgery Treatments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Previous Plastic Surgery Treatments (Treatment Area)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: 'facelift', label: 'Facelift' },
                        { key: 'prosthesis', label: 'Prosthesis' },
                        { key: 'doubleEyelid', label: 'Double eye-lid' },
                        { key: 'boneShaving', label: 'Bone shaving' },
                        { key: 'breastImplants', label: 'Breast Implants' },
                        { key: 'liposuction', label: 'Liposuction' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={patientIntake[key] || false}
                            onCheckedChange={(checked) => setPatientIntake({ ...patientIntake, [key]: checked })}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Other</Label>
                        <Input
                          value={patientIntake.plasticSurgeryOther || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, plasticSurgeryOther: e.target.value })}
                          placeholder="Specify other treatment"
                        />
                      </div>
                      <div>
                        <Label>Treatment Date</Label>
                        <Input
                          value={patientIntake.plasticSurgeryDate || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, plasticSurgeryDate: e.target.value })}
                          placeholder="Enter date"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Health Conditions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Health Condition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'heartDisease', label: 'Heart disease' },
                        { key: 'highBloodPressure', label: 'High blood pressure' },
                        { key: 'diabetes', label: 'Diabetes' },
                        { key: 'pacemaker', label: 'Pacemaker' },
                        { key: 'cancer', label: 'Cancer (Within 5 years)' },
                        { key: 'orthodontics', label: 'Orthodontics' },
                        { key: 'immuneSystemCondition', label: 'Immune System & Skin condition' },
                        { key: 'surgery', label: 'Surgery' },
                        { key: 'currentlyPregnant', label: 'Currently Pregnant' },
                        { key: 'sensitiveToLight', label: 'Sensitive to light' },
                        { key: 'substanceAllergies', label: 'Substance or medication allergies' },
                        { key: 'longTermMedication', label: 'Long term medication' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={patientIntake[key] || false}
                            onCheckedChange={(checked) => setPatientIntake({ ...patientIntake, [key]: checked })}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>

                    {/* Conditional Detail Fields */}
                    {patientIntake.cancer && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cancer Name</Label>
                          <Input
                            value={patientIntake.cancerName || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, cancerName: e.target.value })}
                            placeholder="Specify cancer type"
                          />
                        </div>
                        <div>
                          <Label>Cancer Date</Label>
                          <Input
                            value={patientIntake.cancerDate || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, cancerDate: e.target.value })}
                            placeholder="Enter date"
                          />
                        </div>
                      </div>
                    )}

                    {patientIntake.orthodontics && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Orthodontics Name</Label>
                          <Input
                            value={patientIntake.orthodonticsName || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, orthodonticsName: e.target.value })}
                            placeholder="Specify orthodontics type"
                          />
                        </div>
                        <div>
                          <Label>Orthodontics Date</Label>
                          <Input
                            value={patientIntake.orthodonticsDate || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, orthodonticsDate: e.target.value })}
                            placeholder="Enter date"
                          />
                        </div>
                      </div>
                    )}

                    {patientIntake.immuneSystemCondition && (
                      <div>
                        <Label>Immune System Details</Label>
                        <Textarea
                          value={patientIntake.immuneSystemDetails || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, immuneSystemDetails: e.target.value })}
                          placeholder="Skin inflammation, Lupus erythematosus, Rosacea, etc"
                        />
                      </div>
                    )}

                    {patientIntake.surgery && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Surgery Name</Label>
                          <Input
                            value={patientIntake.surgeryName || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, surgeryName: e.target.value })}
                            placeholder="Specify surgery type"
                          />
                        </div>
                        <div>
                          <Label>Surgery Date</Label>
                          <Input
                            value={patientIntake.surgeryDate || ''}
                            onChange={(e) => setPatientIntake({ ...patientIntake, surgeryDate: e.target.value })}
                            placeholder="Enter date"
                          />
                        </div>
                      </div>
                    )}

                    {patientIntake.sensitiveToLight && (
                      <div>
                        <Label>Light Sensitivity Details</Label>
                        <Textarea
                          value={patientIntake.lightSensitivityDetails || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, lightSensitivityDetails: e.target.value })}
                          placeholder="Please specify light sensitivity details..."
                        />
                      </div>
                    )}

                    {patientIntake.substanceAllergies && (
                      <div>
                        <Label>Allergy Details</Label>
                        <Textarea
                          value={patientIntake.allergyDetails || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, allergyDetails: e.target.value })}
                          placeholder="Please specify allergies..."
                        />
                      </div>
                    )}

                    {patientIntake.longTermMedication && (
                      <div>
                        <Label>Medication Details</Label>
                        <Textarea
                          value={patientIntake.medicationDetails || ''}
                          onChange={(e) => setPatientIntake({ ...patientIntake, medicationDetails: e.target.value })}
                          placeholder="Please specify medications..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Treatment Area Conditions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Treatment Area has:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'implants', label: 'Implants' },
                        { key: 'metalStent', label: 'Metal stent' },
                        { key: 'threadLifting', label: 'Thread lifting' },
                        { key: 'hypertrophicScar', label: 'Hypertrophic scar' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={patientIntake[key] || false}
                            onCheckedChange={(checked) => setPatientIntake({ ...patientIntake, [key]: checked })}
                          />
                          <Label>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveIntake} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Patient Intake"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {client.patientIntake || Object.keys(patientIntake).some(key => patientIntake[key] && patientIntake[key] !== '') ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Skin Condition</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>Skin Type: {client.patientIntake?.skinType || patientIntake.skinType || 'Not specified'}</span>
                    <span>Wrinkle Type: {client.patientIntake?.wrinkleType || patientIntake.wrinkleType || 'Not specified'}</span>
                    <span>Skin Tone: {client.patientIntake?.skinTone || patientIntake.skinTone || 'Not specified'}</span>
                    <span>Blood Circulation: {client.patientIntake?.bloodCirculation || patientIntake.bloodCirculation || 'Not specified'}</span>
                    <span>Skin Thickness: {client.patientIntake?.skinThickness || patientIntake.skinThickness || 'Not specified'}</span>
                    <span>Pore Size: {client.patientIntake?.poreSize || patientIntake.poreSize || 'Not specified'}</span>
                    <span>Skin Elasticity: {client.patientIntake?.skinElasticity || patientIntake.skinElasticity || 'Not specified'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Previous Aesthetic Treatments</h4>
                  <div className="flex flex-wrap gap-2">
                    {(client.patientIntake?.laser || patientIntake.laser) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Laser</span>}
                    {(client.patientIntake?.ipl || patientIntake.ipl) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">IPL</span>}
                    {(client.patientIntake?.radiofrequency || patientIntake.radiofrequency) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Radiofrequency</span>}
                    {(client.patientIntake?.electricalCurrent || patientIntake.electricalCurrent) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Electrical Current</span>}
                    {(client.patientIntake?.peel || patientIntake.peel) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Peel</span>}
                    {(client.patientIntake?.hydrafacial || patientIntake.hydrafacial) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Hydrafacial</span>}
                    {(client.patientIntake?.aestheticTreatmentDate || patientIntake.aestheticTreatmentDate) &&
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Date: {client.patientIntake?.aestheticTreatmentDate || patientIntake.aestheticTreatmentDate}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Previous Micro-Invasive Treatments</h4>
                  <div className="flex flex-wrap gap-2">
                    {(client.patientIntake?.hyaluronicAcid || patientIntake.hyaluronicAcid) && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Hyaluronic Acid</span>}
                    {(client.patientIntake?.botulinumToxin || patientIntake.botulinumToxin) && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Botulinum Toxin</span>}
                    {(client.patientIntake?.growthFactors || patientIntake.growthFactors) && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Growth Factors</span>}
                    {(client.patientIntake?.lacticAcid || patientIntake.lacticAcid) && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Lactic Acid</span>}
                    {(client.patientIntake?.microInvasiveOther || patientIntake.microInvasiveOther) && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Other: {client.patientIntake?.microInvasiveOther || patientIntake.microInvasiveOther}</span>}
                    {(client.patientIntake?.microInvasiveDate || patientIntake.microInvasiveDate) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Date: {client.patientIntake?.microInvasiveDate || patientIntake.microInvasiveDate}</span>}
                    {(client.patientIntake?.satisfactionLevel || patientIntake.satisfactionLevel) &&
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Satisfaction: {client.patientIntake?.satisfactionLevel || patientIntake.satisfactionLevel}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Previous Plastic Surgery Treatments</h4>
                  <div className="flex flex-wrap gap-2">
                    {(client.patientIntake?.facelift || patientIntake.facelift) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Facelift</span>}
                    {(client.patientIntake?.prosthesis || patientIntake.prosthesis) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Prosthesis</span>}
                    {(client.patientIntake?.doubleEyelid || patientIntake.doubleEyelid) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Double Eyelid</span>}
                    {(client.patientIntake?.boneShaving || patientIntake.boneShaving) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Bone Shaving</span>}
                    {(client.patientIntake?.breastImplants || patientIntake.breastImplants) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Breast Implants</span>}
                    {(client.patientIntake?.liposuction || patientIntake.liposuction) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Liposuction</span>}
                    {(client.patientIntake?.plasticSurgeryOther || patientIntake.plasticSurgeryOther) && <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Other: {client.patientIntake?.plasticSurgeryOther || patientIntake.plasticSurgeryOther}</span>}
                    {(client.patientIntake?.plasticSurgeryDate || patientIntake.plasticSurgeryDate) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Date: {client.patientIntake?.plasticSurgeryDate || patientIntake.plasticSurgeryDate}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Health Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(client.patientIntake?.heartDisease || patientIntake.heartDisease) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Heart Disease</span>}
                    {(client.patientIntake?.highBloodPressure || patientIntake.highBloodPressure) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High Blood Pressure</span>}
                    {(client.patientIntake?.diabetes || patientIntake.diabetes) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Diabetes</span>}
                    {(client.patientIntake?.pacemaker || patientIntake.pacemaker) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Pacemaker</span>}
                    {(client.patientIntake?.cancer || patientIntake.cancer) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Cancer</span>}
                    {(client.patientIntake?.cancerName || patientIntake.cancerName) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Cancer: {client.patientIntake?.cancerName || patientIntake.cancerName}</span>}
                    {(client.patientIntake?.cancerDate || patientIntake.cancerDate) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Cancer Date: {client.patientIntake?.cancerDate || patientIntake.cancerDate}</span>}
                    {(client.patientIntake?.orthodontics || patientIntake.orthodontics) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Orthodontics</span>}
                    {(client.patientIntake?.orthodonticsName || patientIntake.orthodonticsName) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Orthodontics: {client.patientIntake?.orthodonticsName || patientIntake.orthodonticsName}</span>}
                    {(client.patientIntake?.orthodonticsDate || patientIntake.orthodonticsDate) && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Orthodontics Date: {client.patientIntake?.orthodonticsDate || patientIntake.orthodonticsDate}</span>}
                    {(client.patientIntake?.immuneSystemCondition || patientIntake.immuneSystemCondition) && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Immune System Condition</span>}
                    {(client.patientIntake?.immuneSystemDetails || patientIntake.immuneSystemDetails) && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Immune Details: {client.patientIntake?.immuneSystemDetails || patientIntake.immuneSystemDetails}</span>}
                    {(client.patientIntake?.surgery || patientIntake.surgery) && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Surgery</span>}
                    {(client.patientIntake?.surgeryName || patientIntake.surgeryName) && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Surgery: {client.patientIntake?.surgeryName || patientIntake.surgeryName}</span>}
                    {(client.patientIntake?.surgeryDate || patientIntake.surgeryDate) && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Surgery Date: {client.patientIntake?.surgeryDate || patientIntake.surgeryDate}</span>}
                    {(client.patientIntake?.currentlyPregnant || patientIntake.currentlyPregnant) && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pregnant</span>}
                    {(client.patientIntake?.sensitiveToLight || patientIntake.sensitiveToLight) && <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Light Sensitive</span>}
                    {(client.patientIntake?.lightSensitivityDetails || patientIntake.lightSensitivityDetails) && <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Light Details: {client.patientIntake?.lightSensitivityDetails || patientIntake.lightSensitivityDetails}</span>}
                    {(client.patientIntake?.substanceAllergies || patientIntake.substanceAllergies) && <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">Allergies</span>}
                    {(client.patientIntake?.allergyDetails || patientIntake.allergyDetails) && <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">Allergy Details: {client.patientIntake?.allergyDetails || patientIntake.allergyDetails}</span>}
                    {(client.patientIntake?.longTermMedication || patientIntake.longTermMedication) && <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">Long Term Medication</span>}
                    {(client.patientIntake?.medicationDetails || patientIntake.medicationDetails) && <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">Medication: {client.patientIntake?.medicationDetails || patientIntake.medicationDetails}</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Treatment Area Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {(client.patientIntake?.implants || patientIntake.implants) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Implants</span>}
                    {(client.patientIntake?.metalStent || patientIntake.metalStent) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Metal Stent</span>}
                    {(client.patientIntake?.threadLifting || patientIntake.threadLifting) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Thread Lifting</span>}
                    {(client.patientIntake?.hypertrophicScar || patientIntake.hypertrophicScar) && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Hypertrophic Scar</span>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No patient intake information recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>

        {/* Balance & Payments Section */}
        <Card>
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
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/clients/${client.id}/balance`}>
                  View History
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-8">
                <div>
                  <h3 className="text-lg font-medium">Balance</h3>
                  <p className="text-2xl font-bold">CA$ {Number(editedClient.balance).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">Total Expense</h3>
                  <p className="text-2xl font-bold text-muted-foreground">CA$ {Number(client.totalSpent || 0).toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground">Total Added</h3>
                  <p className="text-2xl font-bold text-muted-foreground">CA$ {Number(client.totalDeposited || 0).toFixed(2)}</p>
                </div>
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


    </>
  )
}
