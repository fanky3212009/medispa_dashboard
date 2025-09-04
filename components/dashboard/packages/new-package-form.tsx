"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface Service {
  id: string
  name: string
  description?: string
}

interface NewPackageFormProps {
  onPackageCreated?: () => void
}

export function NewPackageForm({ onPackageCreated }: NewPackageFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
    totalSessions: '',
    price: '',
    description: ''
  })

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          serviceId: formData.serviceId,
          totalSessions: parseInt(formData.totalSessions),
          price: parseFloat(formData.price),
          description: formData.description || null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create package')
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        serviceId: '',
        totalSessions: '',
        price: '',
        description: ''
      })
      setIsOpen(false)
      onPackageCreated?.()
    } catch (error) {
      console.error('Error creating package:', error)
      alert('Failed to create package')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Package
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Package</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Facial Treatment Package"
              required
            />
          </div>

          <div>
            <Label htmlFor="service">Service</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalSessions">Total Sessions</Label>
              <Input
                id="totalSessions"
                type="number"
                min="1"
                value={formData.totalSessions}
                onChange={(e) => setFormData({ ...formData, totalSessions: e.target.value })}
                placeholder="e.g., 10"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Package Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 1000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Package description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
