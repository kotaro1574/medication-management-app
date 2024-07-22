"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth/logout"
import { Icon } from "@radix-ui/react-select"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icons } from "@/components/ui/icons"

import { Separator } from "../ui/separator"
import { useToast } from "../ui/use-toast"

type Props = {
  profileName: string
  trigger: ReactNode
}

export function SiteDrawer({ profileName, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    const response = await logout()
    if (response.success) {
      toast({ title: response.message })
      router.push("/login")
    } else {
      toast({ title: response.error, variant: "destructive" })
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
      <DrawerTrigger asChild className="cursor-pointer">
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      </DrawerTrigger>
      <DrawerContent className="left-auto right-0 top-0 mt-0 h-screen w-3/4 rounded-none">
        <div className="mx-auto w-full space-y-6">
          <div className="bg-[url('/bg-hamburger.png')] bg-cover bg-no-repeat px-4 pb-[14px] pt-[183px]">
            <DrawerTitle className="mb-2 text-[20px] font-semibold">
              <Link href="/" passHref onClick={handleLinkClick}>
                {profileName}
              </Link>
            </DrawerTitle>
            <button onClick={handleLogout} className="flex items-center">
              <Icons.logout className="size-6" />
              <p className="text-[14px]">ログアウト</p>
            </button>
          </div>

          <div className="grid gap-4 px-2 text-[20px] font-medium">
            <Link
              href="/patients"
              passHref
              onClick={handleLinkClick}
              className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
            >
              <Icons.users className="mr-8" />
              <p>利用者一覧</p>
            </Link>
            <Link
              href="/patients/create"
              passHref
              onClick={handleLinkClick}
              className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
            >
              <Icons.userHeader className="mr-8" />
              <p>利用者登録</p>
            </Link>
            <Link
              href="/groups"
              passHref
              onClick={handleLinkClick}
              className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
            >
              <Icons.groups className="mr-8" />
              <p>グループ一覧</p>
            </Link>
          </div>
          <div className="px-4">
            <Separator />
          </div>
          <div className="px-2">
            <Link
              href="/user"
              passHref
              onClick={handleLinkClick}
              className="flex items-center rounded-sm px-2 py-[6px] hover:bg-[#FFCA0E]/15 hover:text-[#FFCA0E]"
            >
              <Icons.settings className="mr-8 size-4" />
              <p className="text-sm">アカウント情報</p>
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
