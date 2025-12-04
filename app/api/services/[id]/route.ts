import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'

const updateServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters").optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  variants: z.array(z.object({
    id: z.string().optional(), // for existing variants
    name: z.string().min(2, "Variant name must be at least 2 characters"),
    duration: z.number().min(5, "Duration must be at least 5 minutes"),
    price: z.number().min(0, "Price must be a positive number"),
  })).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateServiceSchema.parse(body)

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: { variants: true }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if it conflicts with another service
    if (validatedData.name && validatedData.name !== existingService.name) {
      const nameConflict = await prisma.service.findUnique({
        where: { name: validatedData.name }
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Service with this name already exists' },
          { status: 400 }
        )
      }
    }

    // Update service and variants
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive

    // Handle variants update if provided
    if (validatedData.variants) {
      // Optimize variant updates: identify create, update, and delete operations
      const incomingVariants = validatedData.variants
      const incomingIds = incomingVariants
        .filter(v => v.id)
        .map(v => v.id as string)
      
      // Get existing variant IDs to determine what to delete
      // We can use existingService.variants since we included them in the fetch above
      const existingVariantIds = existingService.variants.map(v => v.id)
      
      const idsToDelete = existingVariantIds.filter(id => !incomingIds.includes(id))
      const variantsToCreate = incomingVariants.filter(v => !v.id)
      const variantsToUpdate = incomingVariants.filter(v => v.id && existingVariantIds.includes(v.id))

      updateData.variants = {
        deleteMany: {
          id: { in: idsToDelete }
        },
        create: variantsToCreate.map(variant => ({
          name: variant.name,
          duration: variant.duration,
          price: variant.price,
        })),
        update: variantsToUpdate.map(variant => ({
          where: { id: variant.id },
          data: {
            name: variant.name,
            duration: variant.duration,
            price: variant.price,
          }
        }))
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        variants: {
          orderBy: { price: 'asc' }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if service is being used in appointments
    const appointmentCount = await prisma.appointment.count({
      where: { serviceId: id }
    })

    if (appointmentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service that has associated appointments. Consider deactivating instead.' },
        { status: 400 }
      )
    }

    // Delete service (variants will be deleted automatically due to cascade)
    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
