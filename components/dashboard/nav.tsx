"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, ClipboardList, LayoutDashboard, Settings, Users, Package } from "lucide-react"

interface NavProps {
  className?: string
}

export function DashboardNav({ className }: NavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      title: "Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Services",
      href: "/dashboard/services",
      icon: ClipboardList,
    },
    {
      title: "Packages",
      href: "/dashboard/packages",
      icon: Package,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className={cn("hidden w-64 flex-col border-r bg-muted/40 md:flex", className)}>
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("justify-start", pathname === item.href ? "bg-secondary" : "")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-5 w-5" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
