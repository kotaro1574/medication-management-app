import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/ui/tailwind-indicator"
import { SiteHeader } from "@/components/layout/site-header"
import { ToasterProvider } from "@/components/provider/toaster-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user?.id ?? "")
    .single()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <ToasterProvider>
            <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col bg-white shadow-lg">
              {profile && <SiteHeader profileName={profile?.name ?? ""} />}
              <div className="flex-1">{children}</div>
            </div>
            <TailwindIndicator />
          </ToasterProvider>
        </body>
      </html>
    </>
  )
}
