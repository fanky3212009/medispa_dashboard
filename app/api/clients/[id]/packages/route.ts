import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    
    const clientPackages = await (prisma as any).clientPackage.findMany({
      where: { clientId: id },
      include: {
        package: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const serializedClientPackages = clientPackages.map(cp => ({
      ...cp,
      package: {
        ...cp.package,
        price: cp.package.price.toString()
      }
    }))

    return NextResponse.json(serializedClientPackages)
  } catch (error) {
    console.error('Error fetching client packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client packages' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: clientId } = await Promise.resolve(params)
    const body = await request.json()
    const { packageId } = body

    // Verify package exists
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: { service: true }
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Load client
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if client already has an active package for this service
    const existingActivePackage = await (prisma as any).clientPackage.findFirst({
      where: {
        clientId,
        package: {
          serviceId: pkg.serviceId
        },
        isActive: true,
        sessionsRemaining: {
          gt: 0
        }
      }
    })

    if (existingActivePackage) {
      return NextResponse.json(
        { error: 'Client already has an active package for this service' },
        { status: 400 }
      )
    }

    // Prevent purchases that would make balance negative
    const clientBalance = parseFloat(client.balance.toString())
    const packagePrice = parseFloat(pkg.price.toString())

    if (clientBalance < packagePrice) {
      return NextResponse.json(
        { error: "Insufficient balance — please add funds to the client's account" },
        { status: 400 }
      )
    }

    // Create client package with expiry date (500 days from purchase)
    const purchaseDate = new Date()
    const expiryDate = new Date(purchaseDate.getTime() + (500 * 24 * 60 * 60 * 1000))
    const newBalance = (clientBalance - packagePrice).toFixed(2)

    // Run transaction: create clientPackage, update client balance, create treatment record
    const [createdClientPackage, updatedClient, createdTreatmentRecord] = await prisma.$transaction([
      (prisma as any).clientPackage.create({
        data: {
          clientId,
          packageId,
          sessionsRemaining: pkg.totalSessions,
          purchaseDate,
          expiryDate
        },
        include: {
          package: {
            include: {
              service: true
            }
          }
        }
      }),
      prisma.client.update({
        where: { id: clientId },
        data: {
          balance: newBalance
        }
      }),
      prisma.treatmentRecord.create({
        data: {
          clientId,
          date: purchaseDate,
          totalAmount: pkg.price,
          balanceAfter: newBalance,
          staffName: 'System',
          type: 'PACKAGE_PURCHASE',
          notes: `Package purchase: ${pkg.name}`
        }
      })
    ])

    const serializedClientPackage = {
      ...createdClientPackage,
      package: {
        ...createdClientPackage.package,
        price: createdClientPackage.package.price.toString()
      }
    }

    const serializedTreatmentRecord = {
      ...createdTreatmentRecord,
      totalAmount: createdTreatmentRecord.totalAmount.toString(),
      balanceAfter: createdTreatmentRecord.balanceAfter.toString()
    }

    return NextResponse.json({
      clientPackage: serializedClientPackage,
      updatedBalance: updatedClient.balance.toString(),
      treatmentRecord: serializedTreatmentRecord
    })
  } catch (error) {
    console.error('Error purchasing package:', error)
    return NextResponse.json(
      { error: 'Failed to purchase package' },
      { status: 500 }
    )
  }
}
