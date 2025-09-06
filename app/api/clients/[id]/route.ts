import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        appointments: true
      }
    })
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    const serializedClient = {
      ...client,
      balance: client.balance.toString()
    }
    return NextResponse.json(serializedClient)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const body = await request.json()
    
    // Only include fields that are actually being updated
    const updateData = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.dob !== undefined && { dob: body.dob }),
      ...(body.gender !== undefined && { gender: body.gender }),
      ...(body.occupation !== undefined && { occupation: body.occupation }),
      ...(body.maritalStatus !== undefined && { maritalStatus: body.maritalStatus }),
      ...(body.referredBy !== undefined && { referredBy: body.referredBy }),
      ...(body.consultant !== undefined && { consultant: body.consultant }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.ohipNumber !== undefined && { ohipNumber: body.ohipNumber }),
      ...(body.insuranceCompany !== undefined && { insuranceCompany: body.insuranceCompany }),
      ...(body.balance !== undefined && { balance: body.balance })
    }

    const client = await prisma.client.update({
      where: { id },
      data: updateData
    })
    const serializedClient = {
      ...client,
      balance: client.balance.toString()
    }
    return NextResponse.json(serializedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
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
    await prisma.client.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
