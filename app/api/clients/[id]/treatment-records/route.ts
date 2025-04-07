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

    const treatmentRecord = await prisma.treatmentRecord.create({
      data: {
        date: new Date(date),
        staffName,
        notes,
        totalAmount: treatments.reduce((sum: number, t: { price: number }) => sum + t.price, 0),
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

    return NextResponse.json(treatmentRecord)
  } catch (error) {
    console.error('Error creating treatment record:', error)
    return NextResponse.json(
      { error: 'Failed to create treatment record' },
      { status: 500 }
    )
  }
} 