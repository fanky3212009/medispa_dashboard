"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientCardProps } from "@/types/client"

export function ClientCard({ client }: ClientCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/dashboard/clients/${client.id}`)
  }

  return (
    <Card className="cursor-pointer hover:bg-muted/50" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="text-primary text-lg">
            {client.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{client.name}</CardTitle>
          {client.occupation && (
            <p className="text-sm text-muted-foreground">{client.occupation}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Email:</span> {client.email}
          </p>
          {client.phone && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Phone:</span> {client.phone}
            </p>
          )}
          {client.dob && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Age:</span> {calculateAge(client.dob)} years
            </p>
          )}
          {client.gender && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Gender:</span> {client.gender}
            </p>
          )}
          {client.maritalStatus && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Status:</span> {client.maritalStatus}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function calculateAge(dob: Date | string | null): number {
  if (!dob) return 0

  try {
    const birthDate = dob instanceof Date ? dob : new Date(dob)

    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      return 0
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  } catch (error) {
    console.error("Error calculating age:", error)
    return 0
  }
}
