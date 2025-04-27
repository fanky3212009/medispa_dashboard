import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import PDFDocument from "pdfkit"
import { ConsentFormType, PrismaClient } from "@prisma/client"

type ConsentFormWithClient = {
  id: string
  type: ConsentFormType
  signature: string
  signedAt: Date
  formData: any
  createdAt: Date
  updatedAt: Date
  clientId: string
  client: {
    name: string
  }
}

async function findConsentForm(client: PrismaClient, formId: string, clientId: string) {
  try {
    const results = await client.consentForm.findUnique({
      where: {
        id: formId,
        clientId: clientId
      },
      select: {
        id: true,
        type: true,
        signature: true,
        signedAt: true,
        formData: true,
        createdAt: true,
        updatedAt: true,
        clientId: true,
        client: {
          select: {
            name: true
          }
        }
      }
    })
  
    if (!results) return null
    
    return results as ConsentFormWithClient
  } catch (error) {
    console.error('Error finding consent form:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    // First, find the consent form
    const form = await findConsentForm(prisma, params.formId, params.id)
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      )
    }

    // Create a promise to handle the PDF generation
    return new Promise<Response>((resolve, reject) => {
      try {
        // Set up PDF document
        const doc = new PDFDocument({
          size: "Letter",
          layout: "portrait",
          margin: 40,
          info: {
            Title: `${form.type.replace("_", " ")} Consent Form`,
            Author: "MediSpa Dashboard",
            CreationDate: new Date(),
            Subject: `Consent Form - ${form.client.name}`,
            Keywords: "consent,treatment,medical"
          }
        })

        // Set up response headers for content disposition
        const headers = new Headers()
        headers.set("Content-Type", "application/pdf")
        headers.set(
          "Content-Disposition",
          `attachment; filename="consent-form-${form.id}.pdf"`
        )

        // Create chunks array for streaming
        const chunks: Uint8Array[] = []

        // Handle PDF document events with proper error handling
        doc.on("data", chunk => {
          chunks.push(Buffer.from(chunk))
        })

        doc.on("end", () => {
          const result = Buffer.concat(chunks)
          resolve(new Response(result, { headers }))
        })

        doc.on("error", (err) => {
          console.error("PDF generation error:", err)
          reject(new Error("Failed to generate PDF"))
        })

        try {
          // Generate PDF content
          generatePDF(doc, form)
        } catch (error) {
          console.error("Error in PDF content generation:", error)
          doc.text("Error generating PDF content. Please try again.")
        }

        // Finalize the PDF
        doc.end()
      } catch (error) {
        console.error("Error in PDF stream handling:", error)
        reject(new Error("Failed to generate PDF"))
      }
    }).catch(error => {
      console.error("Error in PDF promise:", error)
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      )
    })
  } catch (error) {
    console.error("Error in main execution:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}

function generatePDF(doc: PDFKit.PDFDocument, form: ConsentFormWithClient) {
  try {
    const formData = form.formData as Record<string, any>

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(`${form.type.replace("_", " ")} Consent Form`, { align: "center" })
      .moveDown()

    // Client Info
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Client Name: ${form.client.name}`)
      .text(`Treatment Type: ${formData.treatmentType || 'N/A'}`)
      .text(`Date: ${new Date(form.signedAt).toLocaleDateString()}`)
      .moveDown()

    // Before Treatment Conditions
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Before Treatment Conditions")
      .moveDown(0.5)
      .fontSize(12)
      .font("Helvetica")

    if (Array.isArray(formData.beforeTreatmentChecks)) {
      formData.beforeTreatmentChecks.forEach((check: string) => {
        doc.text(`• ${check}`).moveDown(0.5)
      })
    }

    if (formData.radioFrequencyDetails) {
      doc
        .text("Treatment Details:", { continued: true })
        .text(` ${formData.radioFrequencyDetails}`)
        .moveDown()
    }

    // During Treatment
    doc
      .moveDown()
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("During Treatment")
      .moveDown(0.5)
      .fontSize(12)
      .font("Helvetica")
      .list([
        "Before receiving treatment, apply soothing cream.",
        "During the treatment, the skin may become slightly red, which is a normal reaction.",
        "The skin may develop redness, swelling or blisters, which will subside after a few hours or a few days.",
        "Please note that during the treatment, you cannot answer the phone or move around, you must follow the instructions of the aesthetician.",
        "All treatments are designed by professionals according to the age and skin condition of the client, and the effects of the treatments vary from person to person."
      ])
      .moveDown()

    // After Treatment Care
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("After Treatment Care")
      .moveDown(0.5)
      .fontSize(12)
      .font("Helvetica")
      .text("There is no recovery period after the treatment, but you still need to pay attention to the need for self-repair of the subcutaneous tissue. Therefore:")
      .moveDown(0.5)
      .list([
        "It is not recommended to use cosmetics or irritating creams immediately after the treatment.",
        "Within 48 hours after the treatment, Do not use over-heated water for shower or washing your face, drink alcohol, or do strenuous exercise.",
        "Do not use exfoliating products within 7 days, and do not use skin care products containing alcohol or fruit acid to avoid skin sensitivity.",
        "Avoid direct exposure to sunlight within two weeks and use sunscreen with SPF 30 or above; do not go to sauna or have facial massage.",
        "Optical and radiofrequency treatments should not be performed within four weeks."
      ])
      .moveDown()

    // Agreement and Signature
    doc
      .moveDown()
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Agreement")
      .moveDown(0.5)
      .fontSize(12)
      .font("Helvetica")
      .text("I clearly understand all the procedures of this treatment and the precautions before and after the treatment, possible skin reactions, understand and agree to the instructions to be followed during and after the treatment.")
      .moveDown()
      .text("Client Signature:")
      .moveDown()

    // Draw signature image
    try {
      if (form.signature && form.signature.startsWith('data:image')) {
        const signatureData = form.signature.split(',')[1]
        const signatureBuffer = Buffer.from(signatureData, 'base64')
        
        doc.image(signatureBuffer, doc.x, doc.y, {
          width: 200
        })
      } else {
        doc.font("Helvetica-Oblique").text("(Signature not available)")
      }
    } catch (error) {
      console.error("Error processing signature:", error)
      doc.font("Helvetica-Oblique").text("(Error displaying signature)")
    }

    doc
      .moveDown(0.5)
      .fontSize(12)
      .font("Helvetica")
      .text(`Signed by ${form.client.name}`, { align: "right" })
      .text(`Date: ${new Date(form.signedAt).toLocaleString("en-CA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}`, { align: "right" })

  } catch (error) {
    console.error("Error in generatePDF:", error)
    doc.text("Error generating PDF content. Please try again.")
  }
}
