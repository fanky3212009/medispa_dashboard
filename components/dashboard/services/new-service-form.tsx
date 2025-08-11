"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Clock, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "Variant name must be at least 2 characters.",
        }),
        duration: z.number().min(5, {
          message: "Duration must be at least 5 minutes.",
        }),
        price: z.number().min(0, {
          message: "Price must be a positive number.",
        }),
      }),
    )
    .min(1, {
      message: "At least one service variant is required.",
    }),
})

type ServiceVariant = {
  name: string
  duration: number
  price: number
}

export function NewServiceForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [variants, setVariants] = useState<ServiceVariant[]>([{ name: "", duration: 60, price: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      variants: [{ name: "", duration: 60, price: 0 }],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create service')
      }

      const service = await response.json()

      toast({
        title: "Service created",
        description: `${service.name} has been added to your service menu.`,
      })

      // Redirect to the services list
      router.push("/dashboard/services")
    } catch (error) {
      console.error('Error creating service:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create service',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addVariant = () => {
    const newVariants = [...variants, { name: "", duration: 60, price: 0 }]
    setVariants(newVariants)
    form.setValue("variants", newVariants)
  }

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      return
    }

    const newVariants = variants.filter((_, i) => i !== index)
    setVariants(newVariants)
    form.setValue("variants", newVariants)
  }

  const updateVariant = (index: number, field: keyof ServiceVariant, value: string | number) => {
    const newVariants = [...variants]

    // Handle number fields properly to avoid NaN
    if (field === 'duration' || field === 'price') {
      const numValue = typeof value === 'string' ? (field === 'duration' ? parseInt(value, 10) : parseFloat(value)) : value
      newVariants[index] = {
        ...newVariants[index],
        [field]: isNaN(numValue) ? 0 : numValue,
      }
    } else {
      // For string fields like 'name', ensure value is a string
      newVariants[index] = {
        ...newVariants[index],
        [field]: typeof value === 'string' ? value : String(value),
      }
    }

    setVariants(newVariants)
    form.setValue("variants", newVariants)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Facial Treatment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="facial">Facial</SelectItem>
                        <SelectItem value="laser">Laser</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="skincare">Skincare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service, benefits, and what clients can expect..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>Make this service available for booking</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Variants</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="grid gap-4 md:grid-cols-4 items-end border-b pb-4 last:border-0 last:pb-0">
                  <div className="md:col-span-2">
                    <FormLabel htmlFor={`variant-name-${index}`}>Variant Name</FormLabel>
                    <Input
                      id={`variant-name-${index}`}
                      placeholder="e.g., Standard, First Trial"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor={`variant-duration-${index}`}>Duration (min)</FormLabel>
                    <div className="relative">
                      <Input
                        id={`variant-duration-${index}`}
                        type="number"
                        min={5}
                        step={5}
                        value={variant.duration}
                        onChange={(e) => updateVariant(index, "duration", Number.parseInt(e.target.value))}
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormLabel htmlFor={`variant-price-${index}`}>Price</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id={`variant-price-${index}`}
                          type="number"
                          min={0}
                          step={0.01}
                          className="pl-7"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", Number.parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={() => removeVariant(index)}
                      disabled={variants.length === 1}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
