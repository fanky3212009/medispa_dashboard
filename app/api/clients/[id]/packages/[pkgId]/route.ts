import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; pkgId: string } }
) {
  try {
    const { id: clientId, pkgId } = await Promise.resolve(params)
    const body = await request.json()

    const updateData: any = {}

    if (body.purchaseDate !== undefined) {
      const parsed = new Date(body.purchaseDate)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid purchaseDate" }, { status: 400 })
      }
      const expiry = new Date(parsed.getTime() + 500 * 24 * 60 * 60 * 1000)
      updateData.purchaseDate = parsed
      updateData.expiryDate = expiry
    }

    if (body.sessionsRemaining !== undefined) {
      updateData.sessionsRemaining = body.sessionsRemaining
    }

    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive
    }

    // Only allow updates to the package record fields listed above
    const updated = await (prisma as any).clientPackage.update({
      where: { id: pkgId },
      data: updateData,
      include: {
        package: {
          include: {
            service: true
          }
        }
      }
    })

    const serialized = {
      ...updated,
      package: {
        ...updated.package,
        price: updated.package.price.toString()
      }
    }

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Error updating client package:", error)
    return NextResponse.json({ error: "Failed to update client package" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; pkgId: string } }
) {
  try {
    const { pkgId } = await Promise.resolve(params)

    // Mark package as inactive rather than deleting
    const updated = await (prisma as any).clientPackage.update({
      where: { id: pkgId },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ success: true, id: updated.id })
  } catch (error) {
    console.error("Error cancelling client package:", error)
    return NextResponse.json({ error: "Failed to cancel client package" }, { status: 500 })
  }
}
