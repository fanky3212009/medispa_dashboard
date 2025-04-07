"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (theme as "light" | "dark" | "system") || "system",
    },
  })

  function onSubmit(data: AppearanceFormValues) {
    setIsLoading(true)

    setTheme(data.theme)

    setTimeout(() => {
      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been updated.",
      })
      setIsLoading(false)
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the appearance of the application. Choose between light and dark mode.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent cursor-pointer">
                            <div className="space-y-2">
                              <div className="rounded-md bg-[#ecedef] p-2">
                                <div className="h-2 w-[80px] rounded-lg bg-[#d8d9db]" />
                              </div>
                              <div className="h-2 w-[100px] rounded-lg bg-[#d8d9db]" />
                              <div className="h-2 w-[80px] rounded-lg bg-[#d8d9db]" />
                            </div>
                          </div>
                          <span className="block w-full p-2 text-center font-normal">Light</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted bg-popover p-4 hover:border-accent cursor-pointer">
                            <div className="space-y-2">
                              <div className="rounded-md bg-slate-950 p-2">
                                <div className="h-2 w-[80px] rounded-lg bg-slate-800" />
                              </div>
                              <div className="h-2 w-[100px] rounded-lg bg-slate-800" />
                              <div className="h-2 w-[80px] rounded-lg bg-slate-800" />
                            </div>
                          </div>
                          <span className="block w-full p-2 text-center font-normal">Dark</span>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value="system" className="sr-only" />
                          </FormControl>
                          <div className="items-center rounded-md border-2 border-muted p-4 hover:border-accent cursor-pointer">
                            <div className="space-y-2">
                              <div className="rounded-md bg-gradient-to-r from-[#ecedef] to-slate-950 p-2">
                                <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#d8d9db] to-slate-800" />
                              </div>
                              <div className="h-2 w-[100px] rounded-lg bg-gradient-to-r from-[#d8d9db] to-slate-800" />
                              <div className="h-2 w-[80px] rounded-lg bg-gradient-to-r from-[#d8d9db] to-slate-800" />
                            </div>
                          </div>
                          <span className="block w-full p-2 text-center font-normal">System</span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Select the theme for the dashboard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

