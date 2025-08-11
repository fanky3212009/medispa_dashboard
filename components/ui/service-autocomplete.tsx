"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

interface ServiceOption {
  value: string
  label: string
  price: number
  duration: number
  serviceId: string
  serviceName: string
}

interface ServiceAutocompleteProps {
  value?: string
  onSelect: (option: ServiceOption | null) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function ServiceAutocomplete({
  value,
  onSelect,
  placeholder = "Select a service...",
  emptyText = "No services found.",
  className,
  disabled = false,
}: ServiceAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Create service options from services and variants
  const serviceOptions: ServiceOption[] = React.useMemo(() => {
    const options: ServiceOption[] = []
    services.forEach(service => {
      if (service.isActive) {
        service.variants.forEach(variant => {
          options.push({
            value: variant.id,
            label: `${service.name} - ${variant.name}`,
            price: Number(variant.price),
            duration: variant.duration,
            serviceId: service.id,
            serviceName: service.name,
          })
        })
      }
    })
    return options
  }, [services])

  // Find the selected option
  const selectedOption = serviceOptions.find(option => option.value === value)

  // Debounced search function
  const debouncedSearch = useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout
      return (query: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          fetchServices(query)
        }, 300)
      }
    }, []),
    []
  )

  // Fetch services from API
  const fetchServices = async (search?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      params.append('active', 'true')

      const response = await fetch(`/api/services?${params}`)
      if (!response.ok) throw new Error('Failed to fetch services')

      const data: Service[] = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load initial services when component mounts
  React.useEffect(() => {
    fetchServices()
  }, [])

  // Handle search input change
  React.useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const handleSelect = (optionValue: string) => {
    const option = serviceOptions.find(opt => opt.value === optionValue)
    onSelect(option || null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? (
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{selectedOption.label}</span>
              <span className="text-muted-foreground ml-2">
                ${selectedOption.price.toFixed(2)}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search services..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="p-2">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : serviceOptions.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              <CommandGroup>
                {serviceOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">{option.serviceName}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.label.split(' - ')[1]} • {option.duration}min
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ${option.price.toFixed(2)}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
