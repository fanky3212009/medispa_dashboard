"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Package } from "lucide-react"

interface ClientPackage {
  id: string
  sessionsRemaining: number
  purchaseDate: string
  expiryDate: string
  isActive: boolean
  package: {
    id: string
    name: string
    totalSessions: number
    price: string
    service: {
      id: string
      name: string
      category: string
    }
  }
}

interface Package {
  id: string
  name: string
  totalSessions: number
  price: string
  isActive: boolean
  service: {
    id: string
    name: string
    category: string
  }
}

interface ClientPackagesProps {
  clientId: string
}

export function ClientPackages({ clientId }: ClientPackagesProps) {
  const [clientPackages, setClientPackages] = useState<ClientPackage[]>([])
  const [availablePackages, setAvailablePackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<string>("")
  const [clientBalance, setClientBalance] = useState<number | null>(null)

  const fetchClientPackages = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}/packages`)
      if (response.ok) {
        const data = await response.json()
        setClientPackages(data)
      }
    } catch (error) {
      console.error('Error fetching client packages:', error)
    }
  }

  const fetchAvailablePackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setAvailablePackages(data.filter((pkg: Package) => pkg.isActive))
      }
    } catch (error) {
      console.error('Error fetching available packages:', error)
    }
  }

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`)
      if (res.ok) {
        const client = await res.json()
        setClientBalance(parseFloat(client.balance ?? "0"))
      }
    } catch (error) {
      console.error('Error fetching client:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchClientPackages(), fetchAvailablePackages(), fetchClient()])
      setLoading(false)
    }
    fetchData()
  }, [clientId])

  const selectedPkg = availablePackages.find(p => p.id === selectedPackageId)
  const selectedPackagePrice = selectedPkg ? parseFloat(selectedPkg.price as unknown as string) : 0
  const insufficientFunds = clientBalance !== null && selectedPackagePrice > clientBalance

  const handlePurchasePackage = async () => {
    if (!selectedPackageId) return

    setPurchasing(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId: selectedPackageId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Server returns updated balance and created records
        if (data?.updatedBalance) {
          setClientBalance(parseFloat(data.updatedBalance))
        } else {
          // Fallback: refetch client balance
          await fetchClient()
        }
        await fetchClientPackages()
        setIsPurchaseDialogOpen(false)
        setSelectedPackageId("")
      } else {
        const error = await response.json().catch(() => ({}))
        const message = error?.error || 'Failed to purchase package'
        if (response.status === 400 && /insufficient/i.test(message)) {
          // Suggest adding funds
          alert(`${message}. Please add funds to the client's account before purchasing this package.`)
        } else {
          alert(message)
        }
      }
    } catch (error) {
      console.error('Error purchasing package:', error)
      alert('Failed to purchase package')
    } finally {
      setPurchasing(false)
    }
  }

  const isPackageExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const getPackageStatus = (pkg: ClientPackage) => {
    if (!pkg.isActive) return "Inactive"
    if (isPackageExpired(pkg.expiryDate)) return "Expired"
    if (pkg.sessionsRemaining <= 0) return "Completed"
    return "Active"
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Completed": return "secondary"
      case "Expired": return "destructive"
      case "Inactive": return "outline"
      default: return "outline"
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
        <h3 className="text-lg font-semibold">Client Packages</h3>
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Purchase Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purchase Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Package</label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        <div className="flex justify-between w-full">
                          <span>{pkg.name} - {pkg.service.name}</span>
                          <span className="text-muted-foreground">
                            ${pkg.price} ({pkg.totalSessions} sessions)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPurchaseDialogOpen(false)}
                  disabled={purchasing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchasePackage}
                  disabled={purchasing || !selectedPackageId || insufficientFunds}
                >
                  {purchasing ? "Purchasing..." : "Purchase"}
                </Button>
                {insufficientFunds && selectedPackageId && (
                  <div className="text-sm text-red-600 mt-2">
                    Insufficient balance to purchase this package. Please add funds to the client's account.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {
        clientPackages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No packages purchased yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {clientPackages.map((clientPackage) => {
              const status = getPackageStatus(clientPackage)
              const used = clientPackage.package.totalSessions - clientPackage.sessionsRemaining
              const total = clientPackage.package.totalSessions

              return (
                <Card key={clientPackage.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{clientPackage.package.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {clientPackage.package.service.name} • ${clientPackage.package.price}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(status)}>
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sessions Used</span>
                          <span>
                            {used} / {total}
                          </span>
                        </div>

                        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                          {Array.from({ length: total }).map((_, i) => (
                            <div key={i} className="flex items-center justify-center">
                              <Checkbox
                                className="h-8 w-8"
                                checked={i < used}
                                disabled
                                aria-label={`Session ${i + 1} of ${total}: ${i < used ? 'used' : 'available'}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Purchased:</span>
                          <div>{new Date(clientPackage.purchaseDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expires:</span>
                          <div className={isPackageExpired(clientPackage.expiryDate) ? "text-red-600" : ""}>
                            {new Date(clientPackage.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      }
    </div >
  )
}
