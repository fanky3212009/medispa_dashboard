import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'

const createServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().default("other"),
  isActive: z.boolean().default(true),
  variants: z.array(z.object({
    name: z.string().min(2, "Variant name must be at least 2 characters"),
    duration: z.number().min(5, "Duration must be at least 5 minutes"),
    price: z.number().min(0, "Price must be a positive number"),
  })).min(1, "At least one service variant is required"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    
    if (activeOnly) {
      where.isActive = true
    }
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        variants: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createServiceSchema.parse(body)

    // Check if service name already exists
    const existingService = await prisma.service.findUnique({
      where: { name: validatedData.name }
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'Service with this name already exists' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        isActive: validatedData.isActive,
        variants: {
          create: validatedData.variants
        }
      },
      include: {
        variants: true
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
