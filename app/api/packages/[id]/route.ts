import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        service: true,
        clientPackages: {
          include: {
            client: true
          }
        }
      }
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    const serializedPackage = {
      ...pkg,
      price: pkg.price.toString(),
      clientPackages: pkg.clientPackages.map(cp => ({
        ...cp,
        package: {
          ...cp.package,
          price: cp.package?.price?.toString()
        }
      }))
    }

    return NextResponse.json(serializedPackage)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const body = await request.json()
    const { name, totalSessions, price, description, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (totalSessions !== undefined) updateData.totalSessions = parseInt(totalSessions)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (description !== undefined) updateData.description = description
    if (isActive !== undefined) updateData.isActive = isActive

    const pkg = await prisma.package.update({
      where: { id },
      data: updateData,
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
    console.error('Error updating package:', error)
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    
    // Check if package has any active client packages
    const activeClientPackages = await prisma.clientPackage.count({
      where: {
        packageId: id,
        isActive: true
      }
    })

    if (activeClientPackages > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with active client purchases' },
        { status: 400 }
      )
    }

    await prisma.package.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}
