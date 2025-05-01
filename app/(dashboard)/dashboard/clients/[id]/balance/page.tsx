import type { SerializedTreatmentRecord, SerializedTreatment } from "@/types/treatment"
import type { Prisma } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getClientById } from "@/lib/services/clients"
import prisma from "@/lib/db"

async function getClientBalanceHistory(id: string): Promise<SerializedTreatmentRecord[]> {
  const treatments = await prisma.treatmentRecord.findMany({
    where: { clientId: id },
    include: {
      treatments: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  type TreatmentRecordWithTreatments = Prisma.TreatmentRecordGetPayload<{
    include: { treatments: true }
  }>

  return (treatments as TreatmentRecordWithTreatments[]).map(treatment => ({
    ...treatment,
    date: treatment.date.toISOString(), // Convert Date to string
    totalAmount: treatment.totalAmount.toString(),
    balanceAfter: treatment.balanceAfter.toString(),
    treatments: treatment.treatments.map(t => ({
      ...t,
      price: t.price.toString()
    }))
  }));
}

export default async function BalanceHistoryPage({ params }: { params: { id: string } }) {
  // Get client and treatment records
  const [client, records] = await Promise.all([
    getClientById(params.id),
    getClientBalanceHistory(params.id)
  ])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="mb-2" asChild>
            <Link href={`/dashboard/clients/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold">{client.name}'s Balance History</h2>
        </div>
      </div>
      <div className="space-y-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">CA$ {client.balance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          {record.type === "FUND_ADDITION" ? (
                            "Added Funds"
                          ) : (
                            <div className="space-y-1">
                              {record.treatments.map((t: SerializedTreatment) => (
                                <div key={t.id}>{t.name} - ${Number(t.price).toFixed(2)}</div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className={record.type === "FUND_ADDITION" ? "text-green-600" : "text-red-600"}>
                          {record.type === "FUND_ADDITION" ? "+" : "-"}${Number(record.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell>{record.staffName}</TableCell>
                        <TableCell>
                          ${Number(record.balanceAfter).toFixed(2)}
                        </TableCell>
                        <TableCell>{record.notes || ''}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
