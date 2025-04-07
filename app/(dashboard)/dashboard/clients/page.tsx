import type { Metadata } from "next"
import { ClientsList } from "@/components/dashboard/clients/clients-list"

export const metadata: Metadata = {
  title: "Clients | SkinPlus Medical Spa",
  description: "Manage your clients",
}

export default function ClientsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <ClientsList />
    </div>
  )
}

