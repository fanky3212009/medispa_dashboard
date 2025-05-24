import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const data = await request.json()

    const patientIntake = await prisma.patientIntake.upsert({
      where: { clientId },
      update: {
        skinType: data.skinType,
        wrinkleType: data.wrinkleType,
        skinTone: data.skinTone,
        bloodCirculation: data.bloodCirculation,
        skinThickness: data.skinThickness,
        poreSize: data.poreSize,
        skinElasticity: data.skinElasticity,
        laser: data.laser,
        ipl: data.ipl,
        radiofrequency: data.radiofrequency,
        electricalCurrent: data.electricalCurrent,
        peel: data.peel,
        hydrafacial: data.hydrafacial,
        aestheticTreatmentDate: data.aestheticTreatmentDate,
        hyaluronicAcid: data.hyaluronicAcid,
        botulinumToxin: data.botulinumToxin,
        growthFactors: data.growthFactors,
        lacticAcid: data.lacticAcid,
        microInvasiveOther: data.microInvasiveOther,
        microInvasiveDate: data.microInvasiveDate,
        satisfactionLevel: data.satisfactionLevel,
        facelift: data.facelift,
        prosthesis: data.prosthesis,
        doubleEyelid: data.doubleEyelid,
        boneShaving: data.boneShaving,
        breastImplants: data.breastImplants,
        liposuction: data.liposuction,
        plasticSurgeryOther: data.plasticSurgeryOther,
        plasticSurgeryDate: data.plasticSurgeryDate,
        heartDisease: data.heartDisease,
        highBloodPressure: data.highBloodPressure,
        diabetes: data.diabetes,
        pacemaker: data.pacemaker,
        cancer: data.cancer,
        cancerName: data.cancerName,
        cancerDate: data.cancerDate,
        orthodontics: data.orthodontics,
        orthodonticsName: data.orthodonticsName,
        orthodonticsDate: data.orthodonticsDate,
        immuneSystemCondition: data.immuneSystemCondition,
        immuneSystemDetails: data.immuneSystemDetails,
        surgery: data.surgery,
        surgeryName: data.surgeryName,
        surgeryDate: data.surgeryDate,
        currentlyPregnant: data.currentlyPregnant,
        sensitiveToLight: data.sensitiveToLight,
        lightSensitivityDetails: data.lightSensitivityDetails,
        substanceAllergies: data.substanceAllergies,
        allergyDetails: data.allergyDetails,
        longTermMedication: data.longTermMedication,
        medicationDetails: data.medicationDetails,
        implants: data.implants,
        metalStent: data.metalStent,
        threadLifting: data.threadLifting,
        hypertrophicScar: data.hypertrophicScar
      },
      create: {
        clientId,
        ...data
      }
    })

    return NextResponse.json(patientIntake)
  } catch (error) {
    console.error("Error saving patient intake:", error)
    return NextResponse.json(
      { error: "Failed to save patient intake" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    
    const patientIntake = await prisma.patientIntake.findUnique({
      where: { clientId }
    })

    return NextResponse.json(patientIntake)
  } catch (error) {
    console.error("Error fetching patient intake:", error)
    return NextResponse.json(
      { error: "Failed to fetch patient intake" },
      { status: 500 }
    )
  }
}
