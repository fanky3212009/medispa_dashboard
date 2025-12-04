import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { ServiceForm } from "@/components/dashboard/services/new-service-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: PageProps) {
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

  const initialData = {
    name: service.name,
    category: service.category,
    description: service.description || "",
    isActive: service.isActive,
    variants: service.variants.map(v => ({
      name: v.name,
      duration: v.duration,
      // Convert Prisma Decimal to number for the form
      price: Number(v.price)
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground">Update service details and variants</p>
      </div>

      <ServiceForm initialData={initialData} serviceId={service.id} />
    </div>
  )
}