import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const serializedClients = clients.map(client => ({
      ...client,
      balance: client.balance.toString()
    }))
    return NextResponse.json(serializedClients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle empty email by converting to null
    const processedData = {
      ...body,
      email: body.email && body.email.trim() !== "" ? body.email : null
    }
    
    const client = await prisma.client.create({
      data: processedData
    })
    const serializedClient = {
      ...client,
      balance: client.balance.toString()
    }
    return NextResponse.json(serializedClient)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
