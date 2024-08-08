"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Icons } from "../ui/icons"
import { SiteDrawer } from "./site-drawer"

type Props = {
  profileName: string
}

export function SiteHeader({ profileName }: Props) {
  const pathname = usePathname()

  if (pathname === "/signup") {
    return null
  }

  return (
    <header className="fixed top-0 z-40 w-full max-w-3xl">
      <div className="flex h-11 items-center justify-between space-x-4 px-4  py-3 text-[#a4a4a4]">
        <Link href="/">
          <div className="flex items-center gap-0.5">
            <Icons.fillUser />
            <div>{profileName}</div>
          </div>
        </Link>
        <SiteDrawer trigger={<Icons.hamburger />} profileName={profileName} />
      </div>
    </header>
  )
}
