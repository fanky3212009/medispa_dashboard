import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const treatmentRecords = await prisma.treatmentRecord.findMany({
      where: {
        clientId: params.id
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { date, staffName, notes, treatments, type = "TREATMENT", totalAmount } = body

    if (typeof totalAmount !== "number") {
      return NextResponse.json(
        { error: 'Total amount is required and must be a number' },
        { status: 400 }
      )
    }

    const treatmentRecord = await prisma.$transaction(async (tx) => {
      // Get current client balance
      const client = await tx.client.findUnique({
        where: { id: params.id },
        select: { balance: true }
      })

      if (!client) {
        throw new Error("Client not found")
      }

      // Calculate new balance
      const newBalance = type === "FUND_ADDITION"
        ? Number(client.balance) + totalAmount
        : Number(client.balance) - totalAmount

      // First, create the treatment record with balanceAfter
      const record = await tx.treatmentRecord.create({
        data: {
          date: new Date(date),
          staffName,
          notes,
          type,
          totalAmount,
          balanceAfter: newBalance,
          clientId: params.id,
          treatments: type === "TREATMENT" ? {
            create: treatments.map((t: { name: string; price: number }) => ({
              name: t.name,
              price: t.price
            }))
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
