import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const client = await prisma.client.findUnique({
      where: { id }
    })
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const treatments = await prisma.treatmentRecord.findMany({
      where: { clientId: id },
      include: {
        treatments: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(treatments)
  } catch (error) {
    console.error('Error fetching treatment records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatment records' },
      { status: 500 }
    )
  }
}
