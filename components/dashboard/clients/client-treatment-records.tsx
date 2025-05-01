"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Treatment, TreatmentRecord, ClientTreatmentRecordsProps } from "@/types/treatment"

export function ClientTreatmentRecords({ clientId }: ClientTreatmentRecordsProps) {
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    staffName: '',
    notes: '',
    treatments: [{ name: '', price: 0 }]
  })

  useEffect(() => {
    async function fetchTreatmentRecords() {
      try {
        const response = await fetch(`/api/clients/${clientId}/treatments`)
        if (!response.ok) throw new Error('Failed to fetch treatment records')
        const data = await response.json()
        // Filter to show only TREATMENT type records
        setTreatmentRecords(data.filter((record: TreatmentRecord) => record.type === "TREATMENT"))
      } catch (error) {
        console.error('Error fetching treatment records:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTreatmentRecords()
  }, [clientId])

  const handleAddTreatment = () => {
    setNewRecord({
      ...newRecord,
      treatments: [...newRecord.treatments, { name: '', price: 0 }]
    })
  }

  const handleTreatmentChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTreatments = [...newRecord.treatments]
    updatedTreatments[index] = {
      ...updatedTreatments[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    }
    setNewRecord({ ...newRecord, treatments: updatedTreatments })
  }

  const handleDeleteTreatment = (index: number) => {
    // Prevent deleting the last treatment
    if (newRecord.treatments.length <= 1) return

    const updatedTreatments = newRecord.treatments.filter((_, i) => i !== index)
    setNewRecord({ ...newRecord, treatments: updatedTreatments })
  }

  const handleSubmit = async () => {
    try {
      // Filter out treatments with empty names
      const validTreatments = newRecord.treatments.filter(
        treatment => treatment.name.trim() !== ''
      )

      // Validate that at least one valid treatment exists
      if (validTreatments.length === 0) {
        alert('Please add at least one valid treatment')
        return
      }

      const recordToSubmit = {
        ...newRecord,
        treatments: validTreatments,
        type: "TREATMENT"
      }

      const response = await fetch(`/api/clients/${clientId}/treatment-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordToSubmit),
      })

      if (!response.ok) {
        throw new Error('Failed to add treatment record')
      }

      const data = await response.json()
      setTreatmentRecords([data, ...treatmentRecords])
      setIsAddingRecord(false)
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        staffName: '',
        notes: '',
        treatments: [{ name: '', price: 0 }]
      })

      // Refresh the page to update client's balance
      window.location.reload()
    } catch (error) {
      console.error('Error adding treatment record:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (treatmentRecords.length === 0 && !isAddingRecord) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <h3 className="mt-2 text-lg font-semibold">No treatment records</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">This client doesn't have any treatment records yet.</p>
        <Button onClick={() => setIsAddingRecord(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Treatment Record
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Treatment Records</h2>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Treatment Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staffName">Staff Name</Label>
                  <Input
                    id="staffName"
                    value={newRecord.staffName}
                    onChange={(e) => setNewRecord({ ...newRecord, staffName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Treatments</Label>
                {newRecord.treatments.map((treatment, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-center gap-4">
                    <div className="grid gap-2">
                      <Input
                        placeholder="Treatment name"
                        value={treatment.name}
                        onChange={(e) => handleTreatmentChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Input
                        type="text"
                        placeholder="Price"
                        value={treatment.price}
                        onChange={(e) => handleTreatmentChange(index, 'price', e.target.value)}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTreatment(index)}
                        disabled={newRecord.treatments.length <= 1}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddTreatment}>
                  Add Treatment
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                />
              </div>

              <Button onClick={handleSubmit}>Save Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatmentRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    {record.treatments.map((treatment, index) => (
                      <TableRow key={`${record.id}-${index}`}>
                        {index === 0 && (
                          <TableCell rowSpan={record.treatments.length}>
                            {new Date(record.createdAt).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </TableCell>
                        )}
                        <TableCell>{treatment.name}</TableCell>
                        <TableCell>${Number(treatment.price).toFixed(2)}</TableCell>
                        {index === 0 && <TableCell rowSpan={record.treatments.length}>{record.staffName}</TableCell>}
                        {index === 0 && <TableCell rowSpan={record.treatments.length}>{record.notes}</TableCell>}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold">${Number(record.totalAmount).toFixed(2)}</TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
