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
    const serializedClient = {
      ...client,
      balance: client.balance.toString()
    }
    return serializedClient
  } catch (error) {
    console.error('Error fetching client:', error)
    throw new Error('Failed to fetch client')
  }
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  dob?: Date
  gender?: string
  occupation?: string
  maritalStatus?: string
  referredBy?: string
  consultant?: string
  notes?: string
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
