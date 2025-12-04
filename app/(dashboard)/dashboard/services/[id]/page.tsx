import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Edit, Trash } from "lucide-react"
import prisma from "@/lib/db"

export const metadata: Metadata = {
  title: "Service Details | SkinPlus Medical Spa",
  description: "View service details",
}

interface ServicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { price: 'asc' }
      }
    }
  })

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
          <p className="text-muted-foreground">View and manage service details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/services/${service.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Basic information about the service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="capitalize">{service.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{service.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Variants</CardTitle>
            <CardDescription>Different options available for this service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {service.variants.map((variant) => (
                <div key={variant.id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{variant.name}</h3>
                    <Badge variant="outline">${variant.price}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {variant.duration} minutes
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Booking and revenue statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">42</div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    +12%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">$8,640</div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    +8%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">4.8/5</div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    +0.2
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Based on 28 reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
