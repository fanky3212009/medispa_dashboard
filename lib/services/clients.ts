import { getBaseUrl } from "@/lib/utils"
import { SerializedClient } from "@/types/client"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function getClients(): Promise<SerializedClient[]> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/clients`)
    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw new Error('Failed to fetch clients')
  }
}

export async function getClientById(id: string): Promise<SerializedClient> {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        appointments: true,
        skinAssessment: true,
        patientIntake: true,
      }
    })
    if (!client) {
      throw new Error('Client not found')
    }

    // Fetch all treatment records to calculate totals manually (for debugging/robustness)
    const allRecords = await prisma.treatmentRecord.findMany({
      where: { clientId: id },
      select: { type: true, totalAmount: true }
    })
    
    console.log(`[Client ${id}] Found ${allRecords.length} records`)
    
    let totalSpent = 0
    let totalDeposited = 0

    allRecords.forEach(record => {
      const amount = Number(record.totalAmount) || 0
      console.log(`Record type: ${record.type}, Amount: ${amount}`)
      
      if (['TREATMENT', 'PACKAGE_PURCHASE'].includes(record.type)) {
        totalSpent += amount
      } else if (record.type === 'FUND_ADDITION') {
        totalDeposited += amount
      }
    })

    console.log(`[Client ${id}] Calculated Total Spent: ${totalSpent}`)
    console.log(`[Client ${id}] Calculated Total Deposited: ${totalDeposited}`)

    const serializedClient = {
      ...client,
      balance: client.balance.toString(),
      totalSpent: totalSpent.toFixed(2),
      totalDeposited: totalDeposited.toFixed(2),
      patientIntake: client.patientIntake ? {
        ...client.patientIntake,
        createdAt: client.patientIntake.createdAt.toISOString(),
        updatedAt: client.patientIntake.updatedAt.toISOString()
      } : null
    }
    return serializedClient
  } catch (error) {
    console.error('Error fetching client:', error)
    throw new Error('Failed to fetch client')
  }
}

export async function createClient(data: {
  name: string
  email?: string
  phone?: string
  dob?: Date
  gender?: string
  occupation?: string
  maritalStatus?: string
  referredBy?: string
  consultant?: string
  notes?: string
  ohipNumber?: string
  insuranceCompany?: string
}) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create client')
    }
    return response.json()
  } catch (error) {
    console.error('Error creating client:', error)
    throw new Error('Failed to create client')
  }
}

export async function updateClient(id: string, data: {
  name?: string
  email?: string
  phone?: string
  dob?: string
  gender?: string
  occupation?: string
  maritalStatus?: string
  referredBy?: string
  consultant?: string
  notes?: string
  ohipNumber?: string
  insuranceCompany?: string
  balance?: number
}) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update client')
    }
    return response.json()
  } catch (error) {
    console.error('Error updating client:', error)
    throw new Error('Failed to update client')
  }
}

export async function deleteClient(id: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/clients/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete client')
    }
  } catch (error) {
    console.error('Error deleting client:', error)
    throw new Error('Failed to delete client')
  }
}
