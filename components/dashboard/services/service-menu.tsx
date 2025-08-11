"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Filter, MoreVertical, Plus, Search, Smile, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type ServiceVariant = {
  id: string
  name: string
  duration: number
  price: number
}

type Service = {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
  variants: ServiceVariant[]
}

type Category = {
  id: string
  name: string
  count: number
}

export function ServiceMenu() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const response = await fetch('/api/services')
        if (!response.ok) throw new Error('Failed to fetch services')
        const data: Service[] = await response.json()
        setServices(data)

        // Calculate categories with counts
        const categoryMap = new Map<string, number>()
        let totalCount = 0

        data.forEach(service => {
          if (service.isActive) {
            totalCount++
            const count = categoryMap.get(service.category) || 0
            categoryMap.set(service.category, count + 1)
          }
        })

        const calculatedCategories: Category[] = [
          { id: "all", name: "All categories", count: totalCount },
          { id: "facial", name: "Facial", count: categoryMap.get("facial") || 0 },
          { id: "laser", name: "Laser", count: categoryMap.get("laser") || 0 },
          { id: "injection", name: "Injection", count: categoryMap.get("injection") || 0 },
          { id: "skincare", name: "Skincare", count: categoryMap.get("skincare") || 0 },
          { id: "other", name: "Other", count: categoryMap.get("other") || 0 },
        ]

        setCategories(calculatedCategories)
      } catch (error) {
        console.error('Error fetching services:', error)
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleAddService = () => {
    router.push("/dashboard/services/new")
  }

  const handleBack = () => {
    router.back()
  }

  const filteredServices = services.filter(
    (service) =>
      service.isActive &&
      (selectedCategory === "all" || service.category === selectedCategory) &&
      service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
            <Button onClick={handleAddService} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Service menu</h1>
          <p className="text-muted-foreground">
            View and manage the services offered by your business.
            <Button variant="link" className="p-0 text-primary">
              Learn more
            </Button>
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search service name"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn("rounded-full", selectedCategory === category.id ? "bg-black text-white" : "")}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} <Badge className="ml-1 bg-white text-black">{category.count}</Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border-b">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first service."}
            </p>
            <Button onClick={handleAddService}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{service.name}</h3>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {service.variants.map((variant) => (
                <div key={variant.id} className="mb-2 pl-2 border-l-4 border-teal-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>
                        {variant.name} • {variant.duration}min
                      </p>
                    </div>
                    <p className="font-semibold">CA$ {Number(variant.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {service.variants.length === 0 && (
                <p className="text-muted-foreground text-sm">No variants configured</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-around p-4 border-t bg-white">
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="h-6 w-6 flex items-center justify-center">
            <span className="text-xs">31</span>
          </div>
          <span className="text-xs">Calendar</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <Tag className="h-6 w-6" />
          <span className="text-xs">Tags</span>
        </Button>
        <Button className="flex flex-col items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground -mt-10">
          <Plus className="h-8 w-8" />
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <Smile className="h-6 w-6" />
          <span className="text-xs">Clients</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
          </div>
          <span className="text-xs">More</span>
        </Button>
      </div>
    </div>
  )
}
