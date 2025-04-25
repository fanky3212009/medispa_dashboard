import type { TreatmentRecord } from "@/types/treatment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBaseUrl } from "@/lib/utils"
import { getClientById } from "@/lib/services/clients"

async function getClientBalanceHistory(id: string): Promise<TreatmentRecord[]> {
  const response = await fetch(`${getBaseUrl()}/api/clients/${id}/treatments`, {
    cache: 'no-store'
  })
  if (!response.ok) throw new Error('Failed to fetch balance history')
  return response.json()
}

export default async function BalanceHistoryPage({ params }: { params: { id: string } }) {
  // Get client and treatment records
  const [client, records] = await Promise.all([
    getClientById(params.id),
    getClientBalanceHistory(params.id)
  ])

  // Calculate running balances from newest to oldest
  const reversedRecords = [...records].reverse()
  let runningBalance = 0 // We'll calculate this from oldest to newest

  // First pass: calculate final balance to use as starting point
  records.forEach(record => {
    if (record.type === "FUND_ADDITION") {
      runningBalance += Number(record.totalAmount)
    } else {
      runningBalance -= Number(record.totalAmount)
    }
  })

  // Reset running balance for display
  let displayBalance = runningBalance

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
            <p className="text-2xl font-bold">CA$ {runningBalance.toFixed(2)}</p>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reversedRecords.map((record) => {
                    // For display, subtract from final balance for older transactions
                    const effect = record.type === "FUND_ADDITION" ? Number(record.totalAmount) : -Number(record.totalAmount)
                    const currentBalance = displayBalance
                    displayBalance -= effect // Move backwards in time

                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.type === "FUND_ADDITION" ? (
                            "Added Funds"
                          ) : (
                            <div className="space-y-1">
                              {record.treatments.map((t) => (
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
                          ${currentBalance.toFixed(2)}
                        </TableCell>
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
