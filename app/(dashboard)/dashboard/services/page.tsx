import type { Metadata } from "next"
import { ServiceMenu } from "@/components/dashboard/services/service-menu"

export const metadata: Metadata = {
  title: "Services | SkinPlus Medical Spa",
  description: "Manage your services",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <ServiceMenu />
    </div>
  )
}

