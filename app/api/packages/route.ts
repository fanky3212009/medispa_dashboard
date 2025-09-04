import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        service: true,
        _count: {
          select: {
            clientPackages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const serializedPackages = packages.map(pkg => ({
      ...pkg,
      price: pkg.price.toString(),
      service: {
        ...pkg.service
      }
    }))

    return NextResponse.json(serializedPackages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, serviceId, totalSessions, price, description } = body

    // Validate required fields
    if (!name || !serviceId || !totalSessions || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, serviceId, totalSessions, price' },
        { status: 400 }
      )
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        serviceId,
        totalSessions: parseInt(totalSessions),
        price: parseFloat(price),
        description: description || null
      },
      include: {
        service: true
      }
    })

    const serializedPackage = {
      ...pkg,
      price: pkg.price.toString()
    }

    return NextResponse.json(serializedPackage)
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    )
  }
}
