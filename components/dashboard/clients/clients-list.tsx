"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Client } from ".prisma/client"
import { getClients } from "@/lib/services/clients"
import { ClientCard } from "./client-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Plus, Search } from "lucide-react"

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getClients()
        setClients(data)
      } catch (err) {
        setError('Failed to fetch clients')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleAddClient = () => {
    router.push("/dashboard/clients/new")
  }

  const filteredClients = clients.filter(
    (client) => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery))
  )

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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Clients list</h1>
            <p className="text-muted-foreground">View, add, edit and delete your client's details.</p>
            <Button variant="link" className="p-0 text-primary">
              Learn more
            </Button>
          </div>
          <Button onClick={handleAddClient} className="gap-1">
            Add <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or mobile"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
        {filteredClients.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No clients found</p>
          </div>
        )}
      </div>
    </div>
  )
}

