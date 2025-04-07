"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  clientId: z.string({
    required_error: "Please select a client",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  services: z.array(z.string()).min(1, {
    message: "Please select at least one service",
  }),
  notes: z.string().optional(),
})

// Mock data
const clients = [
  { id: "1", name: "Jo" },
  { id: "2", name: "Vanessa" },
  { id: "3", name: "Andrea" },
  { id: "4", name: "Chloe Wong" },
  { id: "5", name: "Betty Chan" },
]

const services = [
  { id: "1", name: "SYNA韓國無創氣墊針", price: 380, duration: 60 },
  { id: "2", name: "DEP無針滲透水光", price: 380, duration: 60 },
  { id: "3", name: "SkinTag Removal", price: 150, duration: 30 },
  { id: "4", name: "Hydra Facial", price: 220, duration: 45 },
  { id: "5", name: "Laser - Face", price: 468, duration: 60 },
  { id: "6", name: "Laser - Eye", price: 160, duration: 30 },
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
]

export function NewAppointmentForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    toast({
      title: "Appointment created",
      description: `Appointment for ${clients.find((c) => c.id === values.clientId)?.name} on ${format(values.date, "PPP")} at ${values.startTime} has been created.`,
    })

    router.push("/dashboard/calendar")
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )

    // Update form value
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId]

    form.setValue("services", updatedServices)
  }

  // Calculate total price and duration
  const totalPrice = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const totalDuration = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    return sum + (service?.duration || 0)
  }, 0)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes here..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Services</FormLabel>
                    <FormDescription>Select the services for this appointment</FormDescription>
                  </div>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card
                        key={service.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedServices.includes(service.id) ? "border-primary" : "",
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() => toggleService(service.id)}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`service-${service.id}`}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    <Clock className="inline-block h-3 w-3 mr-1" />
                                    {service.duration} min
                                  </p>
                                </div>
                                <p className="font-semibold">CA$ {service.price}</p>
                              </label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Appointment Summary</h3>
              <div className="flex justify-between mb-1">
                <span>Total Duration:</span>
                <span>
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Price:</span>
                <span>CA$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Appointment</Button>
        </div>
      </form>
    </Form>
  )
}

