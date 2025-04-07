import Link from "next/link"
import { Calendar, Grid, Plus, Smile, Tag } from "lucide-react"

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-4">
      <Link href="/dashboard/calendar" className="flex flex-col items-center">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Calendar</span>
      </Link>
      <Link href="/dashboard/services" className="flex flex-col items-center">
        <Tag className="h-6 w-6 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Services</span>
      </Link>
      <Link href="/dashboard/appointments/new" className="flex flex-col items-center">
        <div className="bg-primary rounded-full p-3 -mt-8">
          <Plus className="h-6 w-6 text-primary-foreground" />
        </div>
      </Link>
      <Link href="/dashboard/clients" className="flex flex-col items-center">
        <Smile className="h-6 w-6 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Clients</span>
      </Link>
      <Link href="/dashboard/settings" className="flex flex-col items-center">
        <Grid className="h-6 w-6 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Menu</span>
      </Link>
    </div>
  )
} 