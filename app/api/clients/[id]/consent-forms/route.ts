import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { ConsentFormType, ConsentForm, CreateConsentFormInput } from "@/types/consent-form"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const consentForms = await prisma.consentForm.findMany({
      where: {
        clientId: params.id
      },
      orderBy: {
        signedAt: 'desc'
      }
    })
    return NextResponse.json(consentForms)
  } catch (error) {
    console.error('Error fetching consent forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consent forms' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as CreateConsentFormInput
    const { type, signature, formData } = body

    const consentForm = await prisma.consentForm.create({
      data: {
        type,
        signature,
        formData,
        clientId: params.id
      }
    })

    return NextResponse.json(consentForm)
  } catch (error) {
    console.error('Error creating consent form:', error)
    return NextResponse.json(
      { error: 'Failed to create consent form' },
      { status: 500 }
    )
  }
}
