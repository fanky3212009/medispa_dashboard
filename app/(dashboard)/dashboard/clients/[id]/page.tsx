import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/db"
import { ClientProfile } from "@/components/dashboard/clients/client-profile"
import { ClientTreatmentRecords } from "@/components/dashboard/clients/client-treatment-records"
import { ClientForms } from "@/components/dashboard/clients/client-forms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Client, SerializedClient } from "@/types/client"
import type { SerializedTreatmentRecord, Treatment, TreatmentRecord } from "@/types/treatment"
import type { Decimal } from "@prisma/client/runtime/library"

export const metadata: Metadata = {
  title: "Client Profile | SkinPlus Medical Spa",
  description: "View client profile and treatment history",
}

interface ClientPageProps {
  params: {
    id: string
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await Promise.resolve(params)

  type ClientWithRecords = Client & {
    treatmentRecords: (TreatmentRecord & {
      treatments: Treatment[]
      balanceAfter: Decimal
    })[]
  }

  const client = (await prisma.client.findUnique({
    where: { id },
    include: {
      treatmentRecords: {
        include: {
          treatments: true
        }
      },
      skinAssessment: true,
      patientIntake: true
    }
  })) as ClientWithRecords | null

  if (!client) {
    notFound()
  }

  const serializedClient: SerializedClient = {
    ...client,
    balance: client.balance.toString(),
    treatmentRecords: client.treatmentRecords?.map(record => ({
      ...record,
      totalAmount: record.totalAmount.toString(),
      balanceAfter: record.balanceAfter.toString(),
      treatments: record.treatments.map(treatment => ({
        ...treatment,
        price: treatment.price.toString()
      }))
    })) as SerializedTreatmentRecord[]
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{client.name}</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="treatments">Treatment Records</TabsTrigger>
          <TabsTrigger value="forms">Consent Forms</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ClientProfile client={serializedClient} />
        </TabsContent>
        <TabsContent value="treatments" className="mt-4">
          <ClientTreatmentRecords clientId={serializedClient.id} />
        </TabsContent>
        <TabsContent value="forms" className="mt-4">
          <ClientForms clientId={serializedClient.id} clientName={client.name} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
