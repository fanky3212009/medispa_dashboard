import type React from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-16 border-b"></div>}>
        <DashboardHeader />
      </Suspense>
      <div className="flex flex-1">
        <Suspense fallback={<div className="hidden w-64 md:block"></div>}>
          <DashboardNav />
        </Suspense>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

