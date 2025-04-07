import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsProfile } from "@/components/dashboard/settings/settings-profile"
import { SettingsBusiness } from "@/components/dashboard/settings/settings-business"
import { SettingsAppearance } from "@/components/dashboard/settings/settings-appearance"

export const metadata: Metadata = {
  title: "Settings | SkinPlus Medical Spa",
  description: "Manage your account and business settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business settings</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <SettingsProfile />
        </TabsContent>
        <TabsContent value="business" className="mt-4">
          <SettingsBusiness />
        </TabsContent>
        <TabsContent value="appearance" className="mt-4">
          <SettingsAppearance />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mt-2 text-lg font-semibold">Notification Settings</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Configure how and when you receive notifications</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

