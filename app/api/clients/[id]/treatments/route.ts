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

    // Now fetch treatment records separately
    const treatments = await prisma.$queryRaw`
      SELECT tr.*, t.name as treatment_name, t.price as treatment_price
      FROM "TreatmentRecord" tr
      LEFT JOIN "Treatment" t ON t."treatmentRecordId" = tr.id
      WHERE tr."clientId" = ${id}
      ORDER BY tr.date DESC
    `
    
    return NextResponse.json(treatments)
  } catch (error) {
    console.error('Error fetching treatment records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatment records' },
      { status: 500 }
    )
  }
} 