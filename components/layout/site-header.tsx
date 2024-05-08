import { Session } from "@supabase/supabase-js"

import { siteConfig } from "@/config/site"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MainNav } from "@/components/layout/main-nav"

type Props = {
  session: Session | null
}

export function SiteHeader({ session }: Props) {
  if (!session) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
