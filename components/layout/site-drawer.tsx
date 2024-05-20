"use client"

import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "../ui/button"
import { ThemeToggle } from "../ui/theme-toggle"
import { useToast } from "../ui/use-toast"

export function SiteDrawer({ trigger }: { trigger: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
      <DrawerTrigger asChild className="cursor-pointer">
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-3/4 rounded-none">
        <div className="mx-auto w-full p-5">
          <DrawerHeader>
            <DrawerTitle>
              <Link href="/" passHref onClick={handleLinkClick}>
                メディネオ
              </Link>
            </DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4 p-4 pb-0">
            <div>
              <Link href="/profile" passHref onClick={handleLinkClick}>
                プロフィール
              </Link>
            </div>
            <div>
              <Link href="/patients" passHref onClick={handleLinkClick}>
                利用者一覧
              </Link>
            </div>
            <div>
              <Link href="/patients/create" passHref onClick={handleLinkClick}>
                利用者登録
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <form action="/api/auth/logout" method="post">
                <Button
                  type="submit"
                  onClick={() => toast({ description: "ログアウトしました" })}
                >
                  ログアウト
                </Button>
              </form>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
