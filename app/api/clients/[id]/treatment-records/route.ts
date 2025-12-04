import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const treatmentRecords = await prisma.treatmentRecord.findMany({
      where: {
        clientId: id
      },
      include: {
        treatments: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(treatmentRecords)
  } catch (error) {
    console.error('Error fetching treatment records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatment records' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { date, staffName, notes, treatments, type = "TREATMENT", totalAmount, usePackages = true } = body

    if (typeof totalAmount !== "number") {
      return NextResponse.json(
        { error: 'Total amount is required and must be a number' },
        { status: 400 }
      )
    }

    const treatmentRecord = await prisma.$transaction(async (tx) => {
      // Get current client balance
      const client = await tx.client.findUnique({
        where: { id },
        select: { balance: true }
      })

      if (!client) {
        throw new Error("Client not found")
      }

      let actualAmountCharged = totalAmount
      const treatmentsWithPackages: any[] = []

      // For treatment records, check for applicable packages
      if (type === "TREATMENT" && usePackages) {
        for (const treatment of treatments) {
          let clientPackageId = null
          let treatmentPrice = treatment.price

          // Try to find applicable package for this treatment
          if (treatment.serviceVariantId) {
            // Get service info for this variant
            const serviceVariant = await tx.serviceVariant.findUnique({
              where: { id: treatment.serviceVariantId },
              include: { service: true }
            })

            if (serviceVariant) {
              // Find earliest expiring active package for this service
              const applicablePackage = await tx.clientPackage.findFirst({
                where: {
                  clientId: params.id,
                  package: {
                    serviceId: serviceVariant.serviceId
                  },
                  isActive: true,
                  sessionsRemaining: { gt: 0 },
                  expiryDate: { gt: new Date() }
                },
                orderBy: { expiryDate: 'asc' },
                include: { package: true }
              })

              if (applicablePackage) {
                // Use package session - deduct from total amount
                actualAmountCharged -= treatmentPrice
                clientPackageId = applicablePackage.id

                // Decrement package sessions
                await tx.clientPackage.update({
                  where: { id: applicablePackage.id },
                  data: {
                    sessionsRemaining: applicablePackage.sessionsRemaining - 1
                  }
                })
              }
            }
          }

          treatmentsWithPackages.push({
            name: treatment.name,
            price: treatmentPrice,
            clientPackageId
          })
        }
      } else {
        // No package logic, use treatments as-is
        treatmentsWithPackages.push(...treatments.map((t: any) => ({
          name: t.name,
          price: t.price,
          clientPackageId: null
        })))
      }

      // Calculate new balance based on actual amount charged
      const newBalance = type === "FUND_ADDITION"
        ? Number(client.balance) + actualAmountCharged
        : Number(client.balance) - actualAmountCharged

      // Create the treatment record with balanceAfter
      const record = await tx.treatmentRecord.create({
        data: {
          date: new Date(date),
          staffName,
          notes: type === "TREATMENT" && actualAmountCharged !== totalAmount 
            ? `${notes || ''} (${totalAmount - actualAmountCharged} covered by package)`.trim()
            : notes,
          type,
          totalAmount: actualAmountCharged,
          balanceAfter: newBalance,
          clientId: params.id,
          treatments: type === "TREATMENT" ? {
            create: treatmentsWithPackages
          } : undefined
        },
        include: {
          treatments: true
        }
      })

      // Update the client's balance
      await tx.client.update({
        where: { id: params.id },
        data: {
          balance: newBalance
        }
      })

      return record
    })

    return NextResponse.json(treatmentRecord)
  } catch (error) {
    console.error('Error creating treatment record:', error)
    return NextResponse.json(
      { error: 'Failed to create treatment record' },
      { status: 500 }
    )
  }
}
