"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NewPackageForm } from "./new-package-form"

interface Package {
  id: string
  name: string
  totalSessions: number
  price: string
  description?: string
  isActive: boolean
  service: {
    id: string
    name: string
    category: string
  }
  _count: {
    clientPackages: number
  }
}

export function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleToggleActive = async (packageId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error updating package:', error)
    }
  }

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return
    }

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPackages()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <NewPackageForm onPackageCreated={fetchPackages} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No packages created yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{pkg.name}</div>
                          {pkg.description && (
                            <div className="text-sm text-muted-foreground">
                              {pkg.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{pkg.service.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {pkg.service.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{pkg.totalSessions}</TableCell>
                      <TableCell>${pkg.price}</TableCell>
                      <TableCell>{pkg._count.clientPackages}</TableCell>
                      <TableCell>
                        <Badge variant={pkg.isActive ? "default" : "secondary"}>
                          {pkg.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(pkg.id, pkg.isActive)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {pkg.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(pkg.id)}
                              className="text-red-600"
                              disabled={pkg._count.clientPackages > 0}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
