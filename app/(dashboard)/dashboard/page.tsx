import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { AppointmentsActivity } from "@/components/dashboard/appointments-activity"
import { TopServices } from "@/components/dashboard/top-services"

export const metadata: Metadata = {
  title: "Dashboard | SkinPlus Medical Spa",
  description: "Medical Spa Management Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="px-4 py-2">
        <h1 className="text-2xl font-semibold">Home</h1>
      </div>

      <div className="px-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-1">Recent sales</h2>
          <p className="text-sm text-muted-foreground mb-4">Last 7 days</p>
          <RecentSales />
        </Card>
      </div>

      <div className="px-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-1">Upcoming appointments</h2>
          <p className="text-sm text-muted-foreground mb-4">Next 7 days</p>
          <UpcomingAppointments />
        </Card>
      </div>

      <div className="px-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Appointments activity</h2>
          <AppointmentsActivity />
        </Card>
      </div>

      <div className="px-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top services</h2>
          <TopServices />
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

