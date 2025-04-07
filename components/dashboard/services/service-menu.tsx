"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Filter, MoreVertical, Plus, Search, Smile, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Mock data for service categories
const categories = [
  { id: "all", name: "All categories", count: 42 },
  { id: "facial", name: "Facial", count: 7 },
  { id: "eyebrow", name: "紋眉/嘴", count: 0 },
]

// Mock data for services
const services = [
  {
    id: "1",
    name: "SYNA韓國無創氣墊針",
    category: "facial",
    variants: [
      { id: "1-1", name: "SYNA韓國無創氣墊針", duration: "1h", price: "CA$ 380" },
      { id: "1-2", name: "Frist trial", duration: "1h", price: "CA$ 188" },
    ],
  },
  {
    id: "2",
    name: "DEP無針滲透水光",
    category: "facial",
    variants: [
      { id: "2-1", name: "DEP無針滲透水光", duration: "1h", price: "CA$ 380" },
      { id: "2-2", name: "Frist trial", duration: "1h", price: "CA$ 188" },
    ],
  },
  {
    id: "3",
    name: "Visia 皮膚檢測",
    category: "facial",
    variants: [],
  },
]

export function ServiceMenu() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  const handleAddService = () => {
    router.push("/dashboard/services/new")
  }

  const handleBack = () => {
    router.back()
  }

  const filteredServices = services.filter(
    (service) =>
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
        {filteredServices.map((service) => (
          <div key={service.id} className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{service.name}</h3>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {service.variants.map((variant, index) => (
              <div key={variant.id} className="mb-2 pl-2 border-l-4 border-teal-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p>
                      {variant.name} • {variant.duration}
                    </p>
                    {index === 1 && <p>Frist trial • {variant.duration}</p>}
                  </div>
                  <p className="font-semibold">{variant.price}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
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

