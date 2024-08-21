"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Icons } from "../ui/icons"
import { HamburgerMenu } from "./hamburger-menu"

type Props = {
  profileName: string
}

export function SiteHeader({ profileName }: Props) {
  const pathname = usePathname()

  if (pathname === "/signup") {
    return null
  }

  return (
    <header className="fixed top-0 z-40 w-full max-w-3xl bg-white">
      <div className="flex h-[54px] items-center justify-between space-x-4 px-4 py-3">
        <Link href="/">
          <div className="flex items-center gap-0.5 text-[#a4a4a4]">
            <Icons.fillUser />
            <div>{profileName}</div>
          </div>
        </Link>
        <HamburgerMenu
          trigger={<Icons.hamburger className="size-[34px] text-[#a4a4a4]" />}
          profileName={profileName}
        />
      </div>
    </header>
  )
}
