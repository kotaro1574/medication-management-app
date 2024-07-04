"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icons } from "@/components/ui/icons"

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
        <div className="mx-auto w-full">
          <DrawerHeader>
            <div className="bg-slate-400 px-4 pb-[14px] pt-[183px]">
              <DrawerTitle className="mb-2 text-[20px] font-medium">
                <Link href="/" passHref onClick={handleLinkClick}>
                  メディネオ太郎
                </Link>
              </DrawerTitle>
              <div className="flex items-center">
                <Icons.logout className="size-6" />
                <Link
                  href="/api/auth/logout"
                  passHref
                  onClick={() => toast({ description: "ログアウトしました" })}
                  className="text-[14px]"
                >
                  ログアウト
                </Link>
              </div>
              {/* <div>
              <form action="/api/auth/logout" method="post">
                <Button
                  type="submit"
                  onClick={() => toast({ description: "ログアウトしました" })}
                >
                  ログアウト
                </Button>
              </form> */}
            </div>

            <div className="grid gap-2 px-4 py-[22px] text-[20px] font-medium">
              <div className="flex items-center">
                <Icons.users className="mr-8 size-5" />
                <Link href="/patients" passHref onClick={handleLinkClick}>
                  利用者一覧
                </Link>
              </div>
              <div className="flex items-center">
                <Icons.userHeader className="mr-8 size-5" />
                <Link
                  href="/patients/create"
                  passHref
                  onClick={handleLinkClick}
                >
                  利用者登録
                </Link>
              </div>
              <div className="flex items-center">
                <Icons.groups className="mr-8 size-5" />
                <Link href="/groups" passHref onClick={handleLinkClick}>
                  グループ一覧
                </Link>
              </div>
            </div>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
