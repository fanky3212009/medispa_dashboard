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
    const { date, staffName, notes, treatments } = body

    const totalAmount = treatments.reduce((sum: number, t: { price: number }) => sum + t.price, 0)

    const treatmentRecord = await prisma.$transaction(async (tx) => {
      // First, create the treatment record
      const record = await tx.treatmentRecord.create({
        data: {
          date: new Date(date),
          staffName,
          notes,
          totalAmount,
          clientId: params.id,
          treatments: {
            create: treatments.map((t: { name: string; price: number }) => ({
              name: t.name,
              price: t.price
            }))
          }
        },
        include: {
          treatments: true
        }
      })

      // Then, update the client's balance
      await tx.client.update({
        where: { id: params.id },
        data: {
          balance: {
            decrement: totalAmount
          }
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
